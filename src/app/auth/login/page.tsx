'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from './auth.module.css';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (data.session) {
                // JWT is automatically stored in cookies by Supabase SSR
                router.push(redirectTo);
                router.refresh(); // Refresh to update server components
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
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
    );
}

export default function LoginPage() {
    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <Suspense fallback={
                    <div className={styles.authCard}>
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                    </div>
                }>
                    <LoginForm />
                </Suspense>

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
