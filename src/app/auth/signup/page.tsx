'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from '../login/auth.module.css';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                setSuccess(true);
                setLoading(false);
                return;
            }

            // If session exists, user is logged in (email confirmation disabled)
            if (data.session) {
                router.push('/mission-builder');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authContainer}>
                    <div className={styles.authCard}>
                        <div className={styles.authHeader}>
                            <span style={{ fontSize: '3rem' }}>✉️</span>
                            <h1>Check Your Email</h1>
                            <p>
                                We've sent a confirmation link to <strong>{email}</strong>.
                                Click the link to activate your account.
                            </p>
                        </div>
                        <Link href="/auth/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <Link href="/" className={styles.logo}>
                            <span style={{ fontSize: '2rem' }}>⚡</span>
                        </Link>
                        <h1>Start Your Journey</h1>
                        <p>Create an account to build your Life Operating System</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

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

                        <div className="input-group">
                            <label className="input-label">Confirm Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 'var(--space-md)' }}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        <p>
                            Already have an account?{' '}
                            <Link href="/auth/login">Sign in</Link>
                        </p>
                    </div>
                </div>

                <div className={styles.authSide}>
                    <div className={styles.authQuote}>
                        <blockquote>
                            "The key is not to prioritize what's on your schedule, but to schedule your priorities."
                        </blockquote>
                        <cite>— Stephen Covey</cite>
                    </div>
                </div>
            </div>
        </div>
    );
}
