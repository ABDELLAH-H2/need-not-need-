'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './circle.module.css';

interface CircleItem {
    id: string;
    text: string;
    category: 'control' | 'no_control' | 'unassigned';
}

export default function CircleOfControlPage() {
    const [items, setItems] = useState<CircleItem[]>([]);
    const [newItem, setNewItem] = useState('');
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const addItem = () => {
        if (!newItem.trim()) return;

        setItems(prev => [...prev, {
            id: Date.now().toString(),
            text: newItem.trim(),
            category: 'unassigned'
        }]);
        setNewItem('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addItem();
        }
    };

    const moveItem = (itemId: string, category: 'control' | 'no_control') => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, category } : item
        ));
    };

    const removeItem = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleDragStart = (itemId: string) => {
        setDraggedItem(itemId);
    };

    const handleDrop = (category: 'control' | 'no_control') => {
        if (draggedItem) {
            moveItem(draggedItem, category);
            setDraggedItem(null);
        }
    };

    const controlItems = items.filter(i => i.category === 'control');
    const noControlItems = items.filter(i => i.category === 'no_control');
    const unassignedItems = items.filter(i => i.category === 'unassigned');

    const controlPercentage = items.length > 0
        ? Math.round((controlItems.length / items.length) * 100)
        : 0;

    return (
        <div className={styles.circlePage}>
            {/* Navigation */}
            <nav className="nav">
                <div className="container nav-container">
                    <Link href="/" className="nav-logo">
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        Principle Planner
                    </Link>
                    <ul className="nav-links">
                        <li><Link href="/mission-builder" className="nav-link">Mission</Link></li>
                        <li><Link href="/planner" className="nav-link">Planner</Link></li>
                        <li><Link href="/renewal" className="nav-link">Renewal</Link></li>
                        <li><Link href="/dashboard" className="btn btn-primary">Dashboard</Link></li>
                    </ul>
                </div>
            </nav>

            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <span className="badge badge-primary">Habit 1: Be Proactive</span>
                    <h1>Circle of Control</h1>
                    <p>
                        Focus your energy on what you <strong>can</strong> control.
                        Let go of what you <strong>cannot</strong>. This is the foundation of proactivity.
                    </p>
                </div>

                {/* Input Section */}
                <div className={styles.inputSection}>
                    <div className="input-group" style={{ flex: 1 }}>
                        <input
                            type="text"
                            className="input"
                            placeholder="What's on your mind? What are you worried about?"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={addItem}>
                        Add Concern
                    </button>
                </div>

                {/* Unassigned Items */}
                {unassignedItems.length > 0 && (
                    <div className={styles.unassignedSection}>
                        <h3>Sort these concerns:</h3>
                        <div className={styles.unassignedList}>
                            {unassignedItems.map(item => (
                                <div
                                    key={item.id}
                                    className={styles.unassignedItem}
                                    draggable
                                    onDragStart={() => handleDragStart(item.id)}
                                >
                                    <span>{item.text}</span>
                                    <div className={styles.itemActions}>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => moveItem(item.id, 'control')}
                                            title="I can control this"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            className={styles.noControlBtn}
                                            onClick={() => moveItem(item.id, 'no_control')}
                                            title="I cannot control this"
                                        >
                                            ✗
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Circles Visualization */}
                <div className={styles.circlesContainer}>
                    {/* Cannot Control (Outer) */}
                    <div
                        className={`${styles.outerCircle} drop-zone ${draggedItem ? 'active' : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop('no_control')}
                    >
                        <div className={styles.circleLabel}>
                            <span className={styles.circleLabelIcon}>🔓</span>
                            <span>Circle of Concern</span>
                            <span className={styles.circleCount}>{noControlItems.length}</span>
                        </div>

                        <div className={styles.circleItems}>
                            {noControlItems.map(item => (
                                <div
                                    key={item.id}
                                    className={styles.concernItem}
                                    draggable
                                    onDragStart={() => handleDragStart(item.id)}
                                >
                                    <span>{item.text}</span>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeItem(item.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Can Control (Inner) */}
                        <div
                            className={`${styles.innerCircle} drop-zone ${draggedItem ? 'active' : ''}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('control')}
                        >
                            <div className={styles.circleLabel}>
                                <span className={styles.circleLabelIcon}>🎯</span>
                                <span>Circle of Control</span>
                                <span className={styles.circleCount}>{controlItems.length}</span>
                            </div>

                            <div className={styles.circleItems}>
                                {controlItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={styles.controlItem}
                                        draggable
                                        onDragStart={() => handleDragStart(item.id)}
                                    >
                                        <span>{item.text}</span>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {controlItems.length === 0 && (
                                <div className={styles.emptyCircle}>
                                    <p>Drag items here that you CAN control</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Insights */}
                {items.length > 0 && (
                    <div className={styles.insights}>
                        <div className={styles.insightCard}>
                            <div className={styles.insightValue}>{controlPercentage}%</div>
                            <div className={styles.insightLabel}>Focus on Controllable</div>
                        </div>
                        <div className={styles.insightMessage}>
                            {controlPercentage >= 50 ? (
                                <p>✨ Great! You're focusing most of your energy on what you can control.</p>
                            ) : controlPercentage > 0 ? (
                                <p>💡 Try to shift more focus to your Circle of Control. That's where your power lies.</p>
                            ) : (
                                <p>🎯 Start sorting your concerns to see where to focus your energy.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className={styles.tips}>
                    <h3>💡 Tips for Being Proactive</h3>
                    <ul>
                        <li><strong>Circle of Control:</strong> Things you can directly influence - your words, actions, attitudes, and effort.</li>
                        <li><strong>Circle of Concern:</strong> Things you care about but cannot directly control - weather, economy, others' actions.</li>
                        <li><strong>The Key:</strong> Proactive people focus on their Circle of Control, which causes it to grow over time.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
