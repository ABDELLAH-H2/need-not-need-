'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './mission-builder.module.css';

// Core values list for selection
const CORE_VALUES = [
    { id: 'integrity', label: 'Integrity', icon: '🛡️' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'growth', label: 'Growth', icon: '🌱' },
    { id: 'creativity', label: 'Creativity', icon: '🎨' },
    { id: 'health', label: 'Health', icon: '💪' },
    { id: 'wisdom', label: 'Wisdom', icon: '📚' },
    { id: 'service', label: 'Service', icon: '🤝' },
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'freedom', label: 'Freedom', icon: '🦅' },
    { id: 'love', label: 'Love', icon: '❤️' },
    { id: 'faith', label: 'Faith', icon: '✨' },
    { id: 'excellence', label: 'Excellence', icon: '🏆' },
    { id: 'balance', label: 'Balance', icon: '⚖️' },
    { id: 'loyalty', label: 'Loyalty', icon: '🤞' },
    { id: 'courage', label: 'Courage', icon: '🦁' },
    { id: 'compassion', label: 'Compassion', icon: '💝' },
];

// Default roles to suggest
const SUGGESTED_ROLES = [
    { id: 'self', label: 'Individual/Self', icon: '🧘', description: 'Personal growth and self-care' },
    { id: 'parent', label: 'Parent', icon: '👨‍👧', description: 'Raising and nurturing children' },
    { id: 'spouse', label: 'Spouse/Partner', icon: '💑', description: 'Relationship with significant other' },
    { id: 'professional', label: 'Professional', icon: '💼', description: 'Career and work responsibilities' },
    { id: 'friend', label: 'Friend', icon: '🤝', description: 'Maintaining meaningful friendships' },
    { id: 'son_daughter', label: 'Son/Daughter', icon: '👨‍👩‍👧', description: 'Relationship with parents' },
    { id: 'community', label: 'Community Member', icon: '🏘️', description: 'Contributing to community' },
    { id: 'student', label: 'Student/Learner', icon: '📖', description: 'Continuous learning and growth' },
];

interface WizardData {
    legacy: string;
    values: string[];
    customValues: string[];
    roles: { id: string; label: string; icon: string; goal: string }[];
    missionStatement: string;
}

export default function MissionBuilderPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState<WizardData>({
        legacy: '',
        values: [],
        customValues: [],
        roles: [],
        missionStatement: '',
    });

    const totalSteps = 5;

    const handleValueToggle = (valueId: string) => {
        setData(prev => ({
            ...prev,
            values: prev.values.includes(valueId)
                ? prev.values.filter(v => v !== valueId)
                : [...prev.values, valueId]
        }));
    };

    const handleRoleToggle = (role: typeof SUGGESTED_ROLES[0]) => {
        setData(prev => {
            const exists = prev.roles.find(r => r.id === role.id);
            if (exists) {
                return { ...prev, roles: prev.roles.filter(r => r.id !== role.id) };
            }
            return { ...prev, roles: [...prev.roles, { ...role, goal: '' }] };
        });
    };

    const handleRoleGoal = (roleId: string, goal: string) => {
        setData(prev => ({
            ...prev,
            roles: prev.roles.map(r => r.id === roleId ? { ...r, goal } : r)
        }));
    };

    const generateMissionStatement = () => {
        const selectedValues = data.values.map(v =>
            CORE_VALUES.find(cv => cv.id === v)?.label
        ).join(', ');

        const rolesSummary = data.roles
            .filter(r => r.goal)
            .map(r => `As a ${r.label}, I will ${r.goal}`)
            .join('. ');

        const statement = `
My Personal Mission Statement

I am guided by the values of ${selectedValues || '[your values]'}.

${rolesSummary || 'I commit to excellence in all my roles.'}

My legacy: ${data.legacy || '[what you want to be remembered for]'}

I commit to living proactively, focusing on what I can control, and putting first things first in service of this mission.
    `.trim();

        setData(prev => ({ ...prev, missionStatement: statement }));
    };

    const handleSave = async () => {
        setSaving(true);
        // TODO: Save to Supabase
        console.log('Saving mission statement:', data);

        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
    };

    const nextStep = () => {
        if (currentStep === 4) {
            generateMissionStatement();
        }
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className={styles.builderPage}>
            {/* Header */}
            <nav className="nav">
                <div className="container nav-container">
                    <Link href="/" className="nav-logo">
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        Principle Planner
                    </Link>
                    <Link href="/dashboard" className="btn btn-secondary">
                        Save & Exit
                    </Link>
                </div>
            </nav>

            <div className="container">
                {/* Progress Steps */}
                <div className="wizard-steps">
                    {[1, 2, 3, 4, 5].map((step, index) => (
                        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                className={`wizard-step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                            >
                                {currentStep > step ? '✓' : step}
                            </div>
                            {index < 4 && (
                                <div className={`wizard-line ${currentStep > step ? 'completed' : ''}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className={styles.stepContainer}>
                    {/* Step 1: Legacy */}
                    {currentStep === 1 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepLabel}>Step 1 of 5</span>
                                <h2>Begin with the End in Mind</h2>
                                <p>Imagine your 80th birthday. What do you want people to say about you?</p>
                            </div>

                            <div className={styles.questionCard}>
                                <label className={styles.questionLabel}>
                                    What legacy do you want to leave behind?
                                </label>
                                <textarea
                                    className="input"
                                    placeholder="I want to be remembered as someone who..."
                                    value={data.legacy}
                                    onChange={(e) => setData({ ...data, legacy: e.target.value })}
                                    rows={6}
                                />
                                <p className={styles.hint}>
                                    Think about your relationships, contributions, character traits, and impact on others.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Core Values */}
                    {currentStep === 2 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepLabel}>Step 2 of 5</span>
                                <h2>Identify Your Core Values</h2>
                                <p>Select the values that resonate most deeply with you (choose 3-5)</p>
                            </div>

                            <div className={styles.valuesGrid}>
                                {CORE_VALUES.map(value => (
                                    <button
                                        key={value.id}
                                        className={`${styles.valueCard} ${data.values.includes(value.id) ? styles.selected : ''}`}
                                        onClick={() => handleValueToggle(value.id)}
                                    >
                                        <span className={styles.valueIcon}>{value.icon}</span>
                                        <span className={styles.valueLabel}>{value.label}</span>
                                    </button>
                                ))}
                            </div>

                            <p className={styles.selectionCount}>
                                {data.values.length} values selected
                            </p>
                        </div>
                    )}

                    {/* Step 3: Roles */}
                    {currentStep === 3 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepLabel}>Step 3 of 5</span>
                                <h2>Define Your Life Roles</h2>
                                <p>You wear many hats in life. Select the roles that are most important to you.</p>
                            </div>

                            <div className={styles.rolesGrid}>
                                {SUGGESTED_ROLES.map(role => (
                                    <button
                                        key={role.id}
                                        className={`${styles.roleCard} ${data.roles.find(r => r.id === role.id) ? styles.selected : ''}`}
                                        onClick={() => handleRoleToggle(role)}
                                    >
                                        <span className={styles.roleIcon}>{role.icon}</span>
                                        <span className={styles.roleLabel}>{role.label}</span>
                                        <span className={styles.roleDesc}>{role.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Role Goals */}
                    {currentStep === 4 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepLabel}>Step 4 of 5</span>
                                <h2>Set Goals for Each Role</h2>
                                <p>What do you want to achieve or represent in each role?</p>
                            </div>

                            <div className={styles.roleGoals}>
                                {data.roles.map(role => (
                                    <div key={role.id} className={styles.roleGoalCard}>
                                        <div className={styles.roleGoalHeader}>
                                            <span style={{ fontSize: '1.5rem' }}>{role.icon}</span>
                                            <h4>{role.label}</h4>
                                        </div>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder={`As a ${role.label}, I will...`}
                                            value={role.goal}
                                            onChange={(e) => handleRoleGoal(role.id, e.target.value)}
                                        />
                                    </div>
                                ))}

                                {data.roles.length === 0 && (
                                    <div className={styles.emptyState}>
                                        <p>No roles selected. Go back and select your life roles.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review & Generate */}
                    {currentStep === 5 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepLabel}>Step 5 of 5</span>
                                <h2>Your Personal Mission Statement</h2>
                                <p>Review and customize your personal constitution</p>
                            </div>

                            <div className={styles.missionPreview}>
                                <textarea
                                    className={`input ${styles.missionTextarea}`}
                                    value={data.missionStatement}
                                    onChange={(e) => setData({ ...data, missionStatement: e.target.value })}
                                    rows={12}
                                />
                            </div>

                            <div className={styles.missionActions}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={generateMissionStatement}
                                >
                                    🔄 Regenerate
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className={styles.stepNav}>
                        {currentStep > 1 && (
                            <button className="btn btn-secondary" onClick={prevStep}>
                                ← Previous
                            </button>
                        )}

                        <div style={{ marginLeft: 'auto' }}>
                            {currentStep < totalSteps ? (
                                <button className="btn btn-primary" onClick={nextStep}>
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    className="btn btn-accent btn-lg"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : '✓ Save My Mission Statement'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
