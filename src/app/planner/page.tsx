'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './planner.module.css';

// Mock roles
const mockRoles = [
    { id: '1', name: 'Professional', icon: '💼', color: '#6366f1' },
    { id: '2', name: 'Parent', icon: '👨‍👧', color: '#22d3ee' },
    { id: '3', name: 'Friend', icon: '🤝', color: '#10b981' },
    { id: '4', name: 'Self', icon: '🧘', color: '#f59e0b' },
];

interface BigRock {
    id: string;
    title: string;
    roleId: string;
    scheduledDay: number | null;
    isComplete: boolean;
}

interface Task {
    id: string;
    title: string;
    quadrant: 'q1' | 'q2' | 'q3' | 'q4';
    scheduledDay: number | null;
    isComplete: boolean;
}

export default function PlannerPage() {
    const [bigRocks, setBigRocks] = useState<BigRock[]>([
        { id: '1', title: 'Complete project proposal', roleId: '1', scheduledDay: 1, isComplete: false },
        { id: '2', title: 'Family dinner on Saturday', roleId: '2', scheduledDay: 6, isComplete: false },
        { id: '3', title: 'Call James', roleId: '3', scheduledDay: 3, isComplete: false },
        { id: '4', title: 'Morning workout routine', roleId: '4', scheduledDay: null, isComplete: false },
    ]);

    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Reply to emails', quadrant: 'q3', scheduledDay: 1, isComplete: false },
        { id: '2', title: 'Review quarterly goals', quadrant: 'q2', scheduledDay: 2, isComplete: false },
    ]);

    const [newRockTitle, setNewRockTitle] = useState('');
    const [newRockRole, setNewRockRole] = useState('');
    const [showAddRock, setShowAddRock] = useState(false);

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return {
            date: d,
            dayIndex: i,
            label: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate()
        };
    });

    const getRoleById = (roleId: string) => mockRoles.find(r => r.id === roleId);

    const toggleRockComplete = (id: string) => {
        setBigRocks(prev => prev.map(rock =>
            rock.id === id ? { ...rock, isComplete: !rock.isComplete } : rock
        ));
    };

    const addBigRock = () => {
        if (!newRockTitle.trim() || !newRockRole) return;

        setBigRocks(prev => [...prev, {
            id: Date.now().toString(),
            title: newRockTitle,
            roleId: newRockRole,
            scheduledDay: null,
            isComplete: false
        }]);

        setNewRockTitle('');
        setNewRockRole('');
        setShowAddRock(false);
    };

    const scheduleRock = (rockId: string, dayIndex: number | null) => {
        setBigRocks(prev => prev.map(rock =>
            rock.id === rockId ? { ...rock, scheduledDay: dayIndex } : rock
        ));
    };

    const unscheduledRocks = bigRocks.filter(r => r.scheduledDay === null);

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
                    {/* Big Rocks Container */}
                    <div className={styles.bigRocksSection}>
                        <div className={styles.sectionHeader}>
                            <h2>🪨 Big Rocks</h2>
                            <p>Schedule your most important goals first</p>
                        </div>

                        {/* Unscheduled Rocks */}
                        <div className={styles.unscheduledRocks}>
                            <h3>Unscheduled</h3>
                            <div className={styles.rocksList}>
                                {unscheduledRocks.map(rock => {
                                    const role = getRoleById(rock.roleId);
                                    return (
                                        <div
                                            key={rock.id}
                                            className={styles.rockCard}
                                            draggable
                                        >
                                            <div className={styles.rockContent}>
                                                <input
                                                    type="checkbox"
                                                    checked={rock.isComplete}
                                                    onChange={() => toggleRockComplete(rock.id)}
                                                />
                                                <span className={rock.isComplete ? styles.completed : ''}>
                                                    {rock.title}
                                                </span>
                                            </div>
                                            <div className={styles.rockMeta}>
                                                <span
                                                    className={styles.roleTag}
                                                    style={{ backgroundColor: `${role?.color}20`, color: role?.color }}
                                                >
                                                    {role?.icon} {role?.name}
                                                </span>
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
                                })}

                                {unscheduledRocks.length === 0 && !showAddRock && (
                                    <p className={styles.emptyText}>All rocks are scheduled! 🎉</p>
                                )}

                                {/* Add New Rock Form */}
                                {showAddRock ? (
                                    <div className={styles.addRockForm}>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="What's your big goal?"
                                            value={newRockTitle}
                                            onChange={(e) => setNewRockTitle(e.target.value)}
                                        />
                                        <select
                                            className="input"
                                            value={newRockRole}
                                            onChange={(e) => setNewRockRole(e.target.value)}
                                        >
                                            <option value="">Select Role</option>
                                            {mockRoles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.icon} {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className={styles.addRockActions}>
                                            <button className="btn btn-primary" onClick={addBigRock}>
                                                Add Rock
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setShowAddRock(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        style={{ width: '100%' }}
                                        onClick={() => setShowAddRock(true)}
                                    >
                                        + Add Big Rock
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Eisenhower Matrix Hint */}
                        <div className={styles.matrixHint}>
                            <h4>💡 Remember the Eisenhower Matrix</h4>
                            <div className={styles.quadrants}>
                                <div className={styles.quadrant}>
                                    <span className={styles.q1}>Q1</span>
                                    <span>Urgent & Important</span>
                                </div>
                                <div className={styles.quadrant}>
                                    <span className={styles.q2}>Q2</span>
                                    <span>Important, Not Urgent ⭐</span>
                                </div>
                                <div className={styles.quadrant}>
                                    <span className={styles.q3}>Q3</span>
                                    <span>Urgent, Not Important</span>
                                </div>
                                <div className={styles.quadrant}>
                                    <span className={styles.q4}>Q4</span>
                                    <span>Neither</span>
                                </div>
                            </div>
                            <p>Focus on Q2! These are your Big Rocks.</p>
                        </div>
                    </div>

                    {/* Week Calendar */}
                    <div className={styles.weekCalendar}>
                        <h3>Week View</h3>
                        <div className={styles.calendarGrid}>
                            {weekDays.map(day => {
                                const dayRocks = bigRocks.filter(r => r.scheduledDay === day.dayIndex);
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
                                                const role = getRoleById(rock.roleId);
                                                return (
                                                    <div
                                                        key={rock.id}
                                                        className={`${styles.scheduledRock} ${rock.isComplete ? styles.completed : ''}`}
                                                        style={{ borderLeftColor: role?.color }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={rock.isComplete}
                                                            onChange={() => toggleRockComplete(rock.id)}
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
