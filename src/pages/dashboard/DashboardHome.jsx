import { useEffect, useState } from "react";
import { getDashboardSummary } from '../../api/dashboard';
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import styles from "./DashboardHome.module.css";

export default function DashboardHome() {

    const [summary, setSummary] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        let cancelled = false;
        setSummary({ data: null, loading: true, error: null });

        getDashboardSummary()
        .then((data) => {
            if (cancelled) return;
            setSummary({ data, loading: false, error: null });
        })
        .catch((error) => {
            if (cancelled) return;
            console.error("Failed to load dashboard summary: ", error);
            setSummary({ data: null, loading: false, error });
        });

        return () => { cancelled = true; };
    }, []);

    const refetchSummary = () => {
        setSummary({ data: null, loading: true, error: null });
        getDashboardSummary()
        .then((data) => {
            setSummary({ data, loading: false, error: null });
        })
        .catch((error) => {
            console.error("Failed to load dashboard summary: ", error);
            setSummary({ data: null, loading: false, error });
        });
    }

    return (
        <div className={styles.page}>
            {/* place the onboarding banner here as a sibling */}
            <section className={styles.statsSection}>
                {summary.loading && (
                    <div className={styles.statsGrid}>
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className={styles.statsSkeleton} />
                        ))}
                    </div>
                )}
                {summary.error && (
                    <div className={styles.sectionError}>
                        <span>Couldn't load stats.</span>
                        <Button variant="secondary" size="sm" onClick={refetchSummary}>Retry</Button>
                    </div>
                )}
                {summary.data && (
                    <div className={styles.statsGrid}>
                        <StatCard 
                            label="Quotes to Review" 
                            value={summary.data.numOfQuotesToReview} 
                            description="Awaiting your review" 
                        />
                        <StatCard 
                            label="Total Quotes" 
                            value={summary.data.totalNumOfQuotes.toLocaleString()} 
                            description="All time" 
                        />
                        <StatCard 
                            label="Last 30 Days" 
                            value={summary.data.numOfQuotesThirtyDays} 
                            description="Recent requests" 
                        />
                        <StatCard 
                            label="Coversion Rate" 
                            value={`${Math.round(summary.data.conversionRate * 100)}%`}
                            description="Accepted / Finalized" 
                        />
                    </div>
                )}
                
            </section>

            <section className={styles.pendingSection}>
                <h2 className={styles.sectionHeading}>Pending Quotes</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>*placeholder*</p>
            </section>
        </div>
    );
}