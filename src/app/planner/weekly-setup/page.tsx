'use client';

import Link from 'next/link';
import styles from './weekly-setup.module.css';

export default function WeeklySetupPage() {
    return (
        <div className={styles.container}>
            {/* Navigation */}
            <nav className="nav">
                <div className="container nav-container">
                    <Link href="/" className="nav-logo">
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        Principle Planner
                    </Link>
                    <ul className="nav-links">
                        <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
                        <li><Link href="/planner" className="nav-link">Planner</Link></li>
                        <li><Link href="/mission-builder" className="nav-link">Mission</Link></li>
                    </ul>
                </div>
            </nav>

            <div className="container">
                <div className={styles.header}>
                    <div>
                        <h1>Weekly Setup 🗓️</h1>
                        <p>Sharpen the saw before cutting the wood.</p>
                    </div>
                    <Link href="/planner" className="btn btn-secondary">
                        ← Back to Planner
                    </Link>
                </div>

                <div className={styles.setupContent}>
                    <h2>Weekly Planning Process</h2>
                    <p>Spend 20-30 minutes clarifying your priorities for the week ahead.</p>

                    <div className={styles.stepList}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepContent}>
                                <h3>Connect with Mission</h3>
                                <p>Review your personal mission statement. Remind yourself of what truly matters most to you in the long run.</p>
                                <Link href="/mission-builder" className="btn btn-secondary btn-sm">
                                    Review Mission →
                                </Link>
                            </div>
                        </div>

                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepContent}>
                                <h3>Review Roles</h3>
                                <p>Look at your key roles (e.g., Parent, Manager, Friend). Are you neglecting any important area of your life?</p>
                                <button className="btn btn-secondary btn-sm">
                                    Check Roles →
                                </button>
                            </div>
                        </div>

                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepContent}>
                                <h3>Identify Big Rocks</h3>
                                <p>For each role, ask: "What is the one most important thing I can do this week that would have the greatest positive impact?"</p>
                                <Link href="/planner" className="btn btn-primary btn-sm">
                                    Go to Planner to Add Rocks →
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/dashboard" className="btn btn-secondary">
                            Cancel
                        </Link>
                        <Link href="/planner" className="btn btn-primary">
                            Finish Setup
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
