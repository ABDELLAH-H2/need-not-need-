'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './planner.module.css';
import type { Database } from '@/lib/database.types';

type Role = Database['public']['Tables']['roles']['Row'];
type BigRock = Database['public']['Tables']['big_rocks']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

export default function PlannerPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [bigRocks, setBigRocks] = useState<BigRock[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [weeklyPlanId, setWeeklyPlanId] = useState<string | null>(null);

    // Form State
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemRole, setNewItemRole] = useState('');
    const [newItemQuadrant, setNewItemQuadrant] = useState<'q1' | 'q2' | 'q3' | 'q4'>('q2');
    const [showAddItem, setShowAddItem] = useState(false);

    // Date Logic
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday start
    weekStart.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return {
            date: d,
            dayIndex: i,
            label: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
            isoDate: d.toISOString().split('T')[0]
        };
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            // 1. Fetch Roles
            const { data: rolesData } = await supabase
                .from('roles')
                .select('*')
                .order('sort_order', { ascending: true });
            if (rolesData) setRoles(rolesData);

            // 2. Fetch or Create Weekly Plan
            const weekStartStr = weekStart.toISOString().split('T')[0];
            let { data: plan } = await supabase
                .from('weekly_plans')
                .select('id')
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .single();

            if (!plan) {
                const { data: newPlan, error } = await supabase
                    .from('weekly_plans')
                    .insert({
                        user_id: user.id,
                        week_start: weekStartStr
                    })
                    .select('id')
                    .single();
                
                if (error) throw error;
                plan = newPlan;
            }

            if (plan) {
                setWeeklyPlanId(plan.id);

                // 3. Fetch Big Rocks
                const { data: rocksData } = await supabase
                    .from('big_rocks')
                    .select('*')
                    .eq('weekly_plan_id', plan.id)
                    .order('created_at', { ascending: true });
                if (rocksData) setBigRocks(rocksData);
            }

            // 4. Fetch Tasks (Q1, Q3, Q4)
            // Note: Tasks are currently not strictly linked to a weekly plan in schema,
            // but we filter by date range or just show all active/incomplete ones?
            // For now, let's fetch incomplete tasks or tasks scheduled this week.
            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .or(`is_complete.eq.false,scheduled_date.gte.${weekStartStr}`)
                .order('created_at', { ascending: true });
            
            if (tasksData) setTasks(tasksData);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [router, supabase, weekStart]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getRoleById = (roleId: string | null) => roles.find(r => r.id === roleId);

    const toggleRockComplete = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setBigRocks(prev => prev.map(r => r.id === id ? { ...r, isComplete: !currentStatus } : r));
        await supabase.from('big_rocks').update({ is_complete: !currentStatus }).eq('id', id);
    };

    const toggleTaskComplete = async (id: string, currentStatus: boolean) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isComplete: !currentStatus } : t));
        await supabase.from('tasks').update({ is_complete: !currentStatus }).eq('id', id);
    };

    const addItem = async () => {
        if (!newItemTitle.trim() || !weeklyPlanId) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            if (newItemQuadrant === 'q2') {
                // Add Big Rock
                const { data: newRock, error } = await supabase
                    .from('big_rocks')
                    .insert({
                        weekly_plan_id: weeklyPlanId,
                        role_id: newItemRole || null,
                        title: newItemTitle,
                        is_complete: false,
                        scheduled_day: null
                    })
                    .select()
                    .single();

                if (error) throw error;
                if (newRock) setBigRocks(prev => [...prev, newRock]);

            } else {
                // Add Task (Q1, Q3, Q4)
                const { data: newTask, error } = await supabase
                    .from('tasks')
                    .insert({
                        user_id: user.id,
                        title: newItemTitle,
                        quadrant: newItemQuadrant,
                        is_complete: false,
                        scheduled_date: null
                    })
                    .select()
                    .single();

                if (error) throw error;
                if (newTask) setTasks(prev => [...prev, newTask]);
            }

            setNewItemTitle('');
            setNewItemRole('');
            setShowAddItem(false);
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item. Please try again.');
        }
    };

    const scheduleRock = async (rockId: string, dayIndex: number | null) => {
        setBigRocks(prev => prev.map(r => r.id === rockId ? { ...r, scheduled_day: dayIndex } : r));
        await supabase.from('big_rocks').update({ scheduled_day: dayIndex }).eq('id', rockId);
    };

    const unscheduledRocks = bigRocks.filter(r => r.scheduled_day === null);

    if (loading) {
        return <div className="container" style={{ paddingTop: '2rem' }}>Loading planner...</div>;
    }

    return (
        <div className={styles.plannerPage}>
            {/* Navigation */}
            <nav className="nav">
                <div className="container nav-container">
                    <Link href="/" className="nav-logo">
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        Principle Planner
                    </Link>
                    <ul className="nav-links">
                        <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
                        <li><Link href="/mission-builder" className="nav-link">Mission</Link></li>
                        <li><Link href="/renewal" className="nav-link">Renewal</Link></li>
                    </ul>
                </div>
            </nav>

            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Weekly Planner 📅</h1>
                        <p>Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Link href="/planner/weekly-setup" className="btn btn-primary">
                        🗓️ Weekly Setup
                    </Link>
                </div>

                <div className={styles.plannerLayout}>
                    {/* Left Column: Big Rocks & Tasks */}
                    <div className={styles.bigRocksSection}>
                        
                        {/* Add Item Button */}
                        {!showAddItem ? (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginBottom: '1rem' }}
                                onClick={() => setShowAddItem(true)}
                            >
                                + Add Task or Big Rock
                            </button>
                        ) : (
                            <div className={styles.addRockForm}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="What needs to be done?"
                                        style={{ flex: 1 }}
                                        value={newItemTitle}
                                        onChange={(e) => setNewItemTitle(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select
                                        className="input"
                                        value={newItemQuadrant}
                                        onChange={(e) => setNewItemQuadrant(e.target.value as any)}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="q2">Q2: Big Rock (Important, Not Urgent) ⭐</option>
                                        <option value="q1">Q1: Urgent & Important 🔥</option>
                                        <option value="q3">Q3: Urgent, Not Important 🔔</option>
                                        <option value="q4">Q4: Neither 🗑️</option>
                                    </select>
                                    
                                    {newItemQuadrant === 'q2' && (
                                        <select
                                            className="input"
                                            value={newItemRole}
                                            onChange={(e) => setNewItemRole(e.target.value)}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">No Role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.icon} {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className={styles.addRockActions}>
                                    <button className="btn btn-primary" onClick={addItem}>
                                        Add Item
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setShowAddItem(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={styles.sectionHeader}>
                            <h2>🪨 Big Rocks (Q2)</h2>
                            <p>Schedule these first!</p>
                        </div>

                        {/* Unscheduled Rocks */}
                        <div className={styles.unscheduledRocks}>
                            <h3>Unscheduled</h3>
                            <div className={styles.rocksList}>
                                {unscheduledRocks.length === 0 ? (
                                    <p className={styles.emptyText}>No unscheduled rocks.</p>
                                ) : (
                                    unscheduledRocks.map(rock => {
                                        const role = getRoleById(rock.role_id);
                                        return (
                                            <div key={rock.id} className={styles.rockCard}>
                                                <div className={styles.rockContent}>
                                                    <input
                                                        type="checkbox"
                                                        checked={rock.is_complete}
                                                        onChange={() => toggleRockComplete(rock.id, rock.is_complete)}
                                                    />
                                                    <span className={rock.is_complete ? styles.completed : ''}>
                                                        {rock.title}
                                                    </span>
                                                </div>
                                                <div className={styles.rockMeta}>
                                                    {role && (
                                                        <span
                                                            className={styles.roleTag}
                                                            style={{ backgroundColor: `${role.color}20`, color: role.color }}
                                                        >
                                                            {role.icon} {role.name}
                                                        </span>
                                                    )}
                                                    <select
                                                        value=""
                                                        onChange={(e) => scheduleRock(rock.id, parseInt(e.target.value))}
                                                        className={styles.scheduleSelect}
                                                    >
                                                        <option value="">Schedule →</option>
                                                        {weekDays.map(day => (
                                                            <option key={day.dayIndex} value={day.dayIndex}>
                                                                {day.label} {day.dayNum}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Other Tasks List (Q1, Q3, Q4) */}
                        <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                            <h2>📝 Other Tasks</h2>
                        </div>
                        <div className={styles.unscheduledRocks}>
                             <div className={styles.rocksList}>
                                {tasks.filter(t => !t.is_complete).length === 0 ? (
                                    <p className={styles.emptyText}>No pending tasks.</p>
                                ) : (
                                    tasks.filter(t => !t.is_complete).map(task => (
                                        <div key={task.id} className={styles.rockCard}>
                                            <div className={styles.rockContent}>
                                                <input
                                                    type="checkbox"
                                                    checked={task.is_complete}
                                                    onChange={() => toggleTaskComplete(task.id, task.is_complete)}
                                                />
                                                <span style={{ flex: 1 }}>{task.title}</span>
                                                <span className={styles.roleTag} style={{ 
                                                    backgroundColor: task.quadrant === 'q1' ? '#fecaca' : 
                                                                    task.quadrant === 'q3' ? '#fde68a' : '#e2e8f0',
                                                    color: task.quadrant === 'q1' ? '#dc2626' : 
                                                           task.quadrant === 'q3' ? '#d97706' : '#475569'
                                                }}>
                                                    {task.quadrant.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Week Calendar */}
                    <div className={styles.weekCalendar}>
                        <h3>Week View</h3>
                        <div className={styles.calendarGrid}>
                            {weekDays.map(day => {
                                const dayRocks = bigRocks.filter(r => r.scheduled_day === day.dayIndex);
                                const isToday = day.date.toDateString() === today.toDateString();

                                return (
                                    <div
                                        key={day.dayIndex}
                                        className={`${styles.dayColumn} ${isToday ? styles.today : ''}`}
                                    >
                                        <div className={styles.dayHeader}>
                                            <span className={styles.dayName}>{day.label}</span>
                                            <span className={styles.dayNumber}>{day.dayNum}</span>
                                        </div>
                                        <div className={styles.dayContent}>
                                            {dayRocks.map(rock => {
                                                const role = getRoleById(rock.role_id);
                                                return (
                                                    <div
                                                        key={rock.id}
                                                        className={`${styles.scheduledRock} ${rock.is_complete ? styles.completed : ''}`}
                                                        style={{ borderLeftColor: role?.color || '#cbd5e1' }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={rock.is_complete}
                                                            onChange={() => toggleRockComplete(rock.id, rock.is_complete)}
                                                        />
                                                        <span>{rock.title}</span>
                                                        <button
                                                            className={styles.unscheduleBtn}
                                                            onClick={() => scheduleRock(rock.id, null)}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
