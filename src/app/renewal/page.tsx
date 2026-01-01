'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './renewal.module.css';

interface DailyLog {
    date: string;
    physical: number;
    mental: number;
    spiritual: number;
    social: number;
}

// Mock weekly data
const mockWeekData: DailyLog[] = [
    { date: '2025-12-29', physical: 8, mental: 6, spiritual: 4, social: 7 },
    { date: '2025-12-30', physical: 5, mental: 8, spiritual: 6, social: 5 },
    { date: '2025-12-31', physical: 7, mental: 7, spiritual: 5, social: 8 },
];

const dimensions = [
    {
        id: 'physical',
        label: 'Physical',
        icon: '💪',
        color: '#ef4444',
        gradient: 'linear-gradient(90deg, #ef4444, #f97316)',
        prompt: 'Did I move my body today?',
        examples: 'Exercise, walking, stretching, sports, dancing'
    },
    {
        id: 'mental',
        label: 'Mental',
        icon: '🧠',
        color: '#6366f1',
        gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        prompt: 'Did I learn something new today?',
        examples: 'Reading, puzzles, learning a skill, deep thinking'
    },
    {
        id: 'spiritual',
        label: 'Spiritual',
        icon: '✨',
        color: '#10b981',
        gradient: 'linear-gradient(90deg, #10b981, #34d399)',
        prompt: 'Did I connect with my values today?',
        examples: 'Meditation, prayer, nature walk, journaling, reflection'
    },
    {
        id: 'social',
        label: 'Social/Emotional',
        icon: '🤝',
        color: '#ec4899',
        gradient: 'linear-gradient(90deg, #ec4899, #f472b6)',
        prompt: 'Did I connect meaningfully with others?',
        examples: 'Quality time, helping someone, deep conversation, acts of kindness'
    },
];

export default function RenewalPage() {
    const today = new Date().toISOString().split('T')[0];

    const [todayLog, setTodayLog] = useState<DailyLog>({
        date: today,
        physical: 0,
        mental: 0,
        spiritual: 0,
        social: 0,
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSliderChange = (dimension: string, value: number) => {
        setTodayLog(prev => ({ ...prev, [dimension]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        // TODO: Save to Supabase
        console.log('Saving renewal log:', todayLog);

        setTimeout(() => {
            setSaving(false);
            setSaved(true);
        }, 500);
    };

    // Calculate weekly averages
    const weekLogs = [...mockWeekData, todayLog];
    const weekAverages = dimensions.reduce((acc, dim) => {
        const sum = weekLogs.reduce((s, log) => s + (log[dim.id as keyof DailyLog] as number), 0);
        acc[dim.id] = Math.round(sum / weekLogs.length);
        return acc;
    }, {} as Record<string, number>);

    const overallAverage = Math.round(
        Object.values(weekAverages).reduce((a, b) => a + b, 0) / 4
    );

    const getScoreLabel = (score: number) => {
        if (score >= 8) return 'Excellent!';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Fair';
        if (score >= 2) return 'Needs attention';
        return 'Not tracked';
    };

    return (
        <div className={styles.renewalPage}>
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
                {/* Header */}
                <div className={styles.header}>
                    <span className="badge badge-accent">Habit 7: Sharpen the Saw</span>
                    <h1>Renewal Tracker ✨</h1>
                    <p>
                        Balance productivity with self-care. Track your daily renewal across
                        the four dimensions of your life.
                    </p>
                </div>

                <div className={styles.renewalLayout}>
                    {/* Today's Check-in */}
                    <div className={styles.todaySection}>
                        <div className={styles.sectionHeader}>
                            <h2>Today's Check-in</h2>
                            <span className={styles.dateLabel}>
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className={styles.dimensionCards}>
                            {dimensions.map(dim => (
                                <div key={dim.id} className={styles.dimensionCard}>
                                    <div className={styles.dimensionHeader}>
                                        <span className={styles.dimensionIcon}>{dim.icon}</span>
                                        <div>
                                            <h3>{dim.label}</h3>
                                            <p>{dim.prompt}</p>
                                        </div>
                                    </div>

                                    <div className={styles.sliderContainer}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={todayLog[dim.id as keyof DailyLog] as number}
                                            onChange={(e) => handleSliderChange(dim.id, parseInt(e.target.value))}
                                            className={styles.slider}
                                            style={{ '--slider-color': dim.color } as React.CSSProperties}
                                        />
                                        <div className={styles.sliderLabels}>
                                            <span>0</span>
                                            <span className={styles.sliderValue} style={{ color: dim.color }}>
                                                {todayLog[dim.id as keyof DailyLog]}
                                            </span>
                                            <span>10</span>
                                        </div>
                                    </div>

                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${(todayLog[dim.id as keyof DailyLog] as number) * 10}%`,
                                                background: dim.gradient
                                            }}
                                        ></div>
                                    </div>

                                    <p className={styles.examples}>{dim.examples}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            className={`btn ${saved ? 'btn-accent' : 'btn-primary'} btn-lg`}
                            style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Today\'s Log'}
                        </button>
                    </div>

                    {/* Weekly Overview */}
                    <div className={styles.weeklySection}>
                        <h2>Weekly Overview</h2>

                        {/* Overall Score */}
                        <div className={styles.overallScore}>
                            <div className={styles.scoreCircle}>
                                <span className={styles.scoreNumber}>{overallAverage}</span>
                                <span className={styles.scoreLabel}>/10</span>
                            </div>
                            <div className={styles.scoreText}>
                                <span className={styles.scoreStatus}>{getScoreLabel(overallAverage)}</span>
                                <span>Weekly Balance Score</span>
                            </div>
                        </div>

                        {/* Dimension Averages */}
                        <div className={styles.weeklyBars}>
                            {dimensions.map(dim => (
                                <div key={dim.id} className={styles.weeklyBar}>
                                    <div className={styles.weeklyBarHeader}>
                                        <span>{dim.icon} {dim.label}</span>
                                        <span style={{ color: dim.color }}>{weekAverages[dim.id]}/10</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${weekAverages[dim.id] * 10}%`,
                                                background: dim.gradient
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Insights */}
                        <div className={styles.insights}>
                            <h3>💡 Insights</h3>
                            {weekAverages.spiritual < 4 && (
                                <p className={styles.insightItem}>
                                    🔸 Your spiritual dimension could use more attention. Try 10 minutes of meditation tomorrow.
                                </p>
                            )}
                            {weekAverages.physical >= 7 && (
                                <p className={styles.insightItem}>
                                    ✅ Great job staying active this week!
                                </p>
                            )}
                            {overallAverage >= 6 && (
                                <p className={styles.insightItem}>
                                    🌟 You're maintaining good balance across all dimensions.
                                </p>
                            )}
                            {overallAverage < 5 && (
                                <p className={styles.insightItem}>
                                    💭 Consider focusing on one dimension each day this week.
                                </p>
                            )}
                        </div>

                        {/* Quote */}
                        <div className={styles.quote}>
                            <blockquote>
                                "The greatest battles are fought in the quiet chambers of one's own soul."
                            </blockquote>
                            <cite>— Stephen Covey</cite>
                        </div>
                    </div>
                </div>

                {/* Bottom Tips */}
                <div className={styles.tips}>
                    <h3>🔋 Why Renewal Matters</h3>
                    <div className={styles.tipGrid}>
                        <div className={styles.tipCard}>
                            <span>💪</span>
                            <h4>Physical</h4>
                            <p>Your body is the vehicle for everything else. Exercise, eat well, rest.</p>
                        </div>
                        <div className={styles.tipCard}>
                            <span>🧠</span>
                            <h4>Mental</h4>
                            <p>Keep your mind sharp through learning, creativity, and challenging yourself.</p>
                        </div>
                        <div className={styles.tipCard}>
                            <span>✨</span>
                            <h4>Spiritual</h4>
                            <p>Connect with your deepest values through meditation, nature, or service.</p>
                        </div>
                        <div className={styles.tipCard}>
                            <span>🤝</span>
                            <h4>Social</h4>
                            <p>Meaningful relationships fuel everything. Invest in connections.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
