import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary, getQuotesToReview } from '../../api/dashboard';
import { formatRelativeDate } from "../../util/dateUtils";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import styles from "./DashboardHome.module.css";

export default function DashboardHome() {

    const [summary, setSummary] = useState({ data: null, loading: true, error: null });
    const [pendingQuotes, setPendingQuotes] = useState({ data: null, loading: true, error: null });

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

    useEffect(() => {
        let cancelled = false;
        setPendingQuotes({ data: null, loading: true, error: null });

        getQuotesToReview()
        .then((data) => {
            if (cancelled) return;
            setPendingQuotes({ data: data.quotes, loading: false, error: null });
        })
        .catch((error) => {
            if (cancelled) return;
            console.error("Failed to load pending quotes: ", error);
            setPendingQuotes({ data: null, loading: false, error });
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
    };

    const refetchPendingQuotes = () => {
        setPendingQuotes({ data: null, loading: true, error: null });
        getQuotesToReview()
        .then((data) => {
            setPendingQuotes({ data: data.quotes, loading: false, error: null });
        })
        .catch((error) => {
            console.error("Failed to load pending quotes: ", error);
            setPendingQuotes({ data: null, loading: false, error });
        });
    };

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
                {pendingQuotes.loading && (
                    <div className={styles.pendingList}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={styles.rowSkeleton} />
                        ))}
                    </div>
                )}
                {pendingQuotes.error && (
                    <div className={styles.sectionError}>
                        <span>Couldn't load pending quotes.</span>
                        <Button variant="secondary" size="sm" onClick={refetchPendingQuotes}>Retry</Button>
                    </div>
                )}
                {pendingQuotes.data && pendingQuotes.data.length === 0 && (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyHeadline}>You're all caught up.</p>
                        <p className={styles.emptySubline}>New quote requests will appear here.</p>
                    </div>
                )}
                {pendingQuotes.data && pendingQuotes.data.length > 0 && (
                    <div className={styles.pendingList}>
                        {pendingQuotes.data.map((quote) => <PendingQuoteRow key={quote.id} quote={quote}/>)}
                    </div>
                )}
            </section>
        </div>
    );
}

function PendingQuoteRow({ quote }) {
    const priceRange = `$${quote.priceLow.toLocaleString()} - $${quote.priceHigh.toLocaleString()}`;
    const customerFullName = `${quote.customerFirstName} ${quote.customerLastName}`;

    return (
        <Link to={`/dashboard/quotes/${quote.id}`} className={styles.row}>
            <span className={styles.rowName}>{customerFullName}</span>
            <span className={styles.rowAddress}>{quote.propertyAddress}</span>
            <span className={styles.rowPrice}>{priceRange}</span>
            <span className={styles.rowDate}>{formatRelativeDate(quote.createdAt)}</span>
        </Link>
    );
}