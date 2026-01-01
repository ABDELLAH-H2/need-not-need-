'use client';

import Link from 'next/link';
import { useUser, signOut } from '@/lib/hooks/useUser';
import styles from './Navigation.module.css';

export default function Navigation() {
    const { user, loading } = useUser();

    return (
        <nav className="nav">
            <div className="container nav-container">
                <Link href="/" className="nav-logo">
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    Principle Planner
                </Link>
                <ul className="nav-links">
                    {user ? (
                        <>
                            <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
                            <li><Link href="/mission-builder" className="nav-link">Mission</Link></li>
                            <li><Link href="/planner" className="nav-link">Planner</Link></li>
                            <li><Link href="/renewal" className="nav-link">Renewal</Link></li>
                            <li>
                                <button
                                    onClick={() => signOut()}
                                    className={styles.logoutBtn}
                                >
                                    Sign Out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/auth/login" className="nav-link">Login</Link></li>
                            <li><Link href="/auth/signup" className="btn btn-primary">Get Started</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
