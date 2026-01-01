'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // TODO: Integrate with Supabase auth when credentials are provided
            // For now, simulate login
            console.log('Login attempt:', { email, password });

            // Simulated success - redirect to dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err) {
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <Link href="/" className={styles.logo}>
                            <span style={{ fontSize: '2rem' }}>⚡</span>
                        </Link>
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue your principle-centered journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 'var(--space-md)' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        <p>
                            Don't have an account?{' '}
                            <Link href="/auth/signup">Create one</Link>
                        </p>
                    </div>
                </div>

                <div className={styles.authSide}>
                    <div className={styles.authQuote}>
                        <blockquote>
                            "Begin with the end in mind."
                        </blockquote>
                        <cite>— Stephen Covey, Habit 2</cite>
                    </div>
                </div>
            </div>
        </div>
    );
}
