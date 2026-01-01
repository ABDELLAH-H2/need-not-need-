'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';

// Mock data - replace with Supabase data
const mockMission = "I am guided by the values of Integrity, Family, Growth. As a Professional, I will deliver excellent work that makes a difference. As a Parent, I will be present and nurturing.";
const mockRoles = [
    { id: '1', name: 'Professional', icon: '💼', color: '#6366f1' },
    { id: '2', name: 'Parent', icon: '👨‍👧', color: '#22d3ee' },
    { id: '3', name: 'Friend', icon: '🤝', color: '#10b981' },
    { id: '4', name: 'Self', icon: '🧘', color: '#f59e0b' },
];
const mockBigRocks = [
    { id: '1', title: 'Complete project proposal', role: 'Professional', isComplete: true },
    { id: '2', title: 'Family dinner on Saturday', role: 'Parent', isComplete: false },
    { id: '3', title: 'Call James', role: 'Friend', isComplete: false },
];
const mockRenewal = {
    physical: 7,
    mental: 5,
    spiritual: 3,
    social: 8,
};

export default function DashboardPage() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    };

    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className={styles.dashboardPage}>
            {/* Navigation */}
            <nav className="nav">
                <div className="container nav-container">
                    <Link href="/" className="nav-logo">
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        Principle Planner
                    </Link>
                    <ul className="nav-links">
                        <li><Link href="/mission-builder" className="nav-link">Mission</Link></li>
                        <li><Link href="/circle-of-control" className="nav-link">Circle</Link></li>
                        <li><Link href="/planner" className="nav-link">Planner</Link></li>
                        <li><Link href="/renewal" className="nav-link">Renewal</Link></li>
                    </ul>
                </div>
            </nav>

            <div className="container">
                {/* Welcome Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋</h1>
                        <p>Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                    <Link href="/planner/weekly-setup" className="btn btn-primary">
                        📅 Plan This Week
                    </Link>
                </div>

                {/* Week Overview */}
                <div className={styles.weekOverview}>
                    {weekDays.map((day) => (
                        <div
                            key={day.toISOString()}
                            className={`${styles.dayCell} ${isToday(day) ? styles.today : ''}`}
                        >
                            <span className={styles.dayLabel}>{formatDate(day)}</span>
                            {isToday(day) && <span className={styles.todayBadge}>Today</span>}
                        </div>
                    ))}
                </div>

                <div className={styles.dashboardGrid}>
                    {/* Mission Statement Card */}
                    <div className={`card ${styles.missionCard}`}>
                        <div className="card-header">
                            <h3 className="card-title">📜 My Mission</h3>
                            <Link href="/mission-builder" className={styles.editLink}>Edit</Link>
                        </div>
                        <p className={styles.missionText}>
                            {mockMission || "You haven't created your mission statement yet."}
                        </p>
                        {!mockMission && (
                            <Link href="/mission-builder" className="btn btn-secondary mt-md">
                                Create Mission Statement
                            </Link>
                        )}
                    </div>

                    {/* This Week's Big Rocks */}
                    <div className={`card ${styles.rocksCard}`}>
                        <div className="card-header">
                            <h3 className="card-title">🪨 This Week's Big Rocks</h3>
                            <Link href="/planner" className={styles.editLink}>View All</Link>
                        </div>
                        <div className={styles.rocksList}>
                            {mockBigRocks.map(rock => (
                                <div key={rock.id} className={styles.rockItem}>
                                    <input
                                        type="checkbox"
                                        checked={rock.isComplete}
                                        onChange={() => { }}
                                        className={styles.rockCheckbox}
                                    />
                                    <span className={rock.isComplete ? styles.completed : ''}>
                                        {rock.title}
                                    </span>
                                    <span className={styles.rockRole}>{rock.role}</span>
                                </div>
                            ))}
                            {mockBigRocks.length === 0 && (
                                <p className={styles.emptyText}>No big rocks scheduled this week</p>
                            )}
                        </div>
                        <Link href="/planner/weekly-setup" className="btn btn-secondary mt-md" style={{ width: '100%' }}>
                            + Add Big Rock
                        </Link>
                    </div>

                    {/* Roles Overview */}
                    <div className={`card ${styles.rolesCard}`}>
                        <div className="card-header">
                            <h3 className="card-title">🎭 My Roles</h3>
                            <Link href="/mission-builder" className={styles.editLink}>Edit</Link>
                        </div>
                        <div className={styles.rolesList}>
                            {mockRoles.map(role => (
                                <div key={role.id} className={styles.roleItem}>
                                    <span className={styles.roleIcon}>{role.icon}</span>
                                    <span>{role.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's Renewal */}
                    <div className={`card ${styles.renewalCard}`}>
                        <div className="card-header">
                            <h3 className="card-title">✨ Today's Renewal</h3>
                            <Link href="/renewal" className={styles.editLink}>Track</Link>
                        </div>
                        <div className={styles.renewalBars}>
                            <div className={styles.renewalItem}>
                                <span>💪 Physical</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill physical"
                                        style={{ width: `${mockRenewal.physical * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className={styles.renewalItem}>
                                <span>🧠 Mental</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill mental"
                                        style={{ width: `${mockRenewal.mental * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className={styles.renewalItem}>
                                <span>✨ Spiritual</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill spiritual"
                                        style={{ width: `${mockRenewal.spiritual * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className={styles.renewalItem}>
                                <span>🤝 Social</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill social"
                                        style={{ width: `${mockRenewal.social * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <Link href="/renewal" className="btn btn-accent mt-md" style={{ width: '100%' }}>
                            Log Today's Renewal
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <Link href="/circle-of-control" className={`card ${styles.actionCard}`}>
                        <span className={styles.actionIcon}>🎯</span>
                        <span>Circle of Control</span>
                    </Link>
                    <Link href="/planner" className={`card ${styles.actionCard}`}>
                        <span className={styles.actionIcon}>📋</span>
                        <span>Weekly Planner</span>
                    </Link>
                    <Link href="/renewal" className={`card ${styles.actionCard}`}>
                        <span className={styles.actionIcon}>🔋</span>
                        <span>Sharpen the Saw</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
