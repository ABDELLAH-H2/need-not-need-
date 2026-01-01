import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <Link href="/" className="nav-logo">
            <span style={{ fontSize: "1.5rem" }}>⚡</span>
            Principle Planner
          </Link>
          <ul className="nav-links">
            <li><Link href="/mission-builder" className="nav-link">Mission</Link></li>
            <li><Link href="/planner" className="nav-link">Planner</Link></li>
            <li><Link href="/renewal" className="nav-link">Renewal</Link></li>
            <li><Link href="/auth/login" className="btn btn-primary">Get Started</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`${styles.hero} section`}>
        <div className="container text-center">
          <div className={styles.heroContent}>
            <span className="badge badge-primary mb-md animate-fade-in">
              Based on Stephen Covey's 7 Habits
            </span>
            <h1 className="animate-slide-up">
              Live Life by <span className="text-gradient">Design</span>,<br />
              Not by Default
            </h1>
            <p className={`${styles.heroText} mt-lg animate-slide-up`}>
              Most to-do apps just list tasks. This is a Life Operating System that helps you
              plan your week around your <strong>values</strong>, <strong>roles</strong>, and
              <strong> principles</strong>—not just endless productivity.
            </p>
            <div className={`${styles.heroButtons} mt-xl`}>
              <Link href="/auth/signup" className="btn btn-primary btn-lg">
                Start Your Journey →
              </Link>
              <Link href="#features" className="btn btn-secondary btn-lg">
                See How It Works
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className={`${styles.stats} mt-2xl`}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>7</span>
              <span className={styles.statLabel}>Powerful Habits</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>Renewal Dimensions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Life Transformation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container">
          <div className="text-center mb-2xl">
            <h2>Three Pillars of Effective Living</h2>
            <p className="mt-md">Each module is designed to transform a different aspect of your life</p>
          </div>

          <div className="grid grid-3">
            {/* Module 1 */}
            <div className="card">
              <div className={styles.moduleIcon}>🎯</div>
              <h3 className="card-title">The Foundation</h3>
              <p className="card-description">Habits 1 & 2</p>
              <ul className={styles.featureList}>
                <li>
                  <strong>Mission Statement Builder</strong>
                  <span>Craft your personal constitution through guided questions</span>
                </li>
                <li>
                  <strong>Circle of Control</strong>
                  <span>Focus your energy on what you can actually change</span>
                </li>
              </ul>
              <Link href="/mission-builder" className="btn btn-secondary mt-lg" style={{ width: "100%" }}>
                Build Your Foundation →
              </Link>
            </div>

            {/* Module 2 */}
            <div className="card">
              <div className={styles.moduleIcon}>📅</div>
              <h3 className="card-title">The Weekly Planner</h3>
              <p className="card-description">Habit 3: Put First Things First</p>
              <ul className={styles.featureList}>
                <li>
                  <strong>Role-Based Planning</strong>
                  <span>Plan as a Parent, Developer, Friend—not just tasks</span>
                </li>
                <li>
                  <strong>Big Rocks First</strong>
                  <span>Schedule your major goals before the small stuff</span>
                </li>
              </ul>
              <Link href="/planner" className="btn btn-secondary mt-lg" style={{ width: "100%" }}>
                Plan Your Week →
              </Link>
            </div>

            {/* Module 3 */}
            <div className="card">
              <div className={styles.moduleIcon}>✨</div>
              <h3 className="card-title">The Renewal Tracker</h3>
              <p className="card-description">Habit 7: Sharpen the Saw</p>
              <ul className={styles.featureList}>
                <li>
                  <strong>4 Dimensions of Renewal</strong>
                  <span>Track Physical, Mental, Spiritual & Social growth</span>
                </li>
                <li>
                  <strong>Prevent Burnout</strong>
                  <span>Balance productivity with sustainable self-care</span>
                </li>
              </ul>
              <Link href="/renewal" className="btn btn-secondary mt-lg" style={{ width: "100%" }}>
                Start Tracking →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="text-center mb-2xl">
            <h2>How Principle-Based Planning Works</h2>
            <p className="mt-md">A systematic approach to living your best week, every week</p>
          </div>

          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h4>Define Your Core</h4>
              <p>Use the Mission Builder to clarify your values and principles. This becomes your personal compass.</p>
            </div>
            <div className={styles.stepLine}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h4>Identify Your Roles</h4>
              <p>You're not just one thing. Define the different hats you wear: Parent, Professional, Friend, etc.</p>
            </div>
            <div className={styles.stepLine}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h4>Set Big Rocks</h4>
              <p>Each Sunday, ask: "What's the most important thing I can do for each role this week?"</p>
            </div>
            <div className={styles.stepLine}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h4>Sharpen the Saw</h4>
              <p>Daily check-ins ensure you're renewing all four dimensions: body, mind, heart, and spirit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Big Rocks Story */}
      <section className="section">
        <div className="container">
          <div className={styles.storySection}>
            <div className={styles.storyContent}>
              <h2>The Big Rocks Philosophy</h2>
              <p className="mt-md">
                Imagine you have a jar, some big rocks, pebbles, and sand. If you put the sand in first,
                there's no room for the big rocks.
              </p>
              <p className="mt-md">
                But if you put the <strong>big rocks in first</strong>, then the pebbles, then the sand—everything fits.
              </p>
              <p className="mt-md">
                Your "big rocks" are the things that matter most: quality time with family,
                important projects, your health. Most people fill their days with "sand" (emails,
                notifications, busywork) and wonder why they never accomplish what truly matters.
              </p>
              <Link href="/auth/signup" className="btn btn-accent btn-lg mt-xl">
                Schedule Your Big Rocks →
              </Link>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.jar}>
                <div className={`${styles.rock} ${styles.rock1}`}>Family</div>
                <div className={`${styles.rock} ${styles.rock2}`}>Health</div>
                <div className={`${styles.rock} ${styles.rock3}`}>Projects</div>
                <div className={styles.pebbles}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--primary-900) 0%, var(--bg-primary) 100%)" }}>
        <div className="container text-center">
          <h2>Ready to Live Principle-Centered?</h2>
          <p className="mt-md" style={{ maxWidth: "600px", margin: "var(--space-md) auto" }}>
            Stop drifting through life reacting to urgencies. Start designing your weeks
            around what truly matters to you.
          </p>
          <Link href="/auth/signup" className="btn btn-primary btn-lg mt-xl">
            Create Your Free Account →
          </Link>
          <p className="mt-md" style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
            No credit card required • Set up in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span style={{ fontSize: "1.5rem" }}>⚡</span>
              <span>Principle-Centered Planner</span>
            </div>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>
              Inspired by Stephen Covey's "The 7 Habits of Highly Effective People"
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
