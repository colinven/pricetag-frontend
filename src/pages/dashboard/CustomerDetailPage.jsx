import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from '../../components/ui/Table';
import QuoteStatusBadge from '../../components/ui/QuoteStatusBadge';
import NotFoundState from '../../components/ui/NotFoundState';
import ServerErrorState from '../../components/ui/ServerErrorState';
import { formatRelativeDate, formatAbsoluteDate } from '../../util/dateUtils';
import { getCustomerDetails } from '../../api/dashboard';
import styles from './CustomerDetailPage.module.css';

export default function CustomerDetailPage() {
    const { customerId } = useParams();

    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        let cancelled = false;
        setState({ data: null, loading: true, error: null });

        getCustomerDetails(customerId)
            .then((data) => {
                if (cancelled) return;
                setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                if (cancelled) return;
                console.error('Failed to load customer: ', error);
                const kind = error.statusCode === 404 ? 'not-found' : 'server';
                setState({ data: null, loading: false, error: { kind } });
            });

        return () => { cancelled = true; };
    }, [customerId]);

    const refetch = () => {
        setState({ data: null, loading: true, error: null });
        getCustomerDetails(customerId)
            .then((data) => setState({ data, loading: false, error: null }))
            .catch((error) => {
                console.error('Failed to load customer: ', error);
                const kind = error.statusCode === 404 ? 'not-found' : 'server';
                setState({ data: null, loading: false, error: { kind } });
            });
    };

    return (
        <>
            {state.loading && <CustomerDetailSkeleton />}
            {state.error?.kind === 'not-found' && (
                <div className={styles.page}>
                    <NotFoundState
                        title="Customer not found"
                        description="This customer doesn't exist or may have been removed."
                        backHref="/dashboard/customers"
                        backLabel="Back to Customers"
                    />
                </div>
            )}
            {state.error?.kind === 'server' && (
                <div className={styles.page}>
                    <ServerErrorState onRetry={refetch} />
                </div>
            )}
            {state.data && <CustomerDetailContent customer={state.data} />}
        </>
    );
}

function CustomerDetailContent({ customer }) {
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const hasContact = customer.email || customer.phone;
    const quotes = customer.quotes ?? [];

    const columns = [
        {
            key: 'address',
            header: 'Address',
            render: (q) => q.propertyAddress,
        },
        {
            key: 'price',
            header: 'Price',
            render: (q) =>
                q.finalPrice != null
                    ? `$${q.finalPrice.toLocaleString()}`
                    : `$${q.priceLow.toLocaleString()} – $${q.priceHigh.toLocaleString()}`,
        },
        {
            key: 'status',
            header: 'Status',
            render: (q) => <QuoteStatusBadge status={q.status} />,
        },
        {
            key: 'date',
            header: 'Date',
            render: (q) => formatRelativeDate(q.createdAt),
        },
    ];

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.customerName}>{fullName}</h1>
                {hasContact && (
                    <div className={styles.customerContact}>
                        {customer.email && (
                            <a href={`mailto:${customer.email}`} className={styles.customerContactLink}>
                                {customer.email}
                            </a>
                        )}
                        {customer.email && customer.phone && (
                            <span className={styles.customerContactDivider} aria-hidden="true">·</span>
                        )}
                        {customer.phone && (
                            <a href={`tel:${customer.phone}`} className={styles.customerContactLink}>
                                {customer.phone}
                            </a>
                        )}
                    </div>
                )}
            </header>

            <p className={styles.memberSince}>
                Member since {formatAbsoluteDate(customer.createdAt)}
            </p>

            <h2 className={styles.sectionHeading}>Quote history</h2>

            {quotes.length === 0 && <EmptyHistory />}

            {quotes.length > 0 && (
                <>
                    <div className={styles.desktopOnly}>
                        <Table
                            columns={columns}
                            rows={quotes}
                            rowKey={(q) => q.id}
                            rowHref={(q) => `/dashboard/quotes/${q.id}`}
                        />
                    </div>
                    <div className={styles.mobileOnly}>
                        <div className={styles.cardStack}>
                            {quotes.map((q) => (
                                <QuoteHistoryMobileCard key={q.id} quote={q} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function QuoteHistoryMobileCard({ quote }) {
    const priceLabel = quote.finalPrice != null
        ? `$${quote.finalPrice.toLocaleString()}`
        : `$${quote.priceLow.toLocaleString()} – $${quote.priceHigh.toLocaleString()}`;

    return (
        <Link to={`/dashboard/quotes/${quote.id}`} className={styles.mobileCard}>
            <p className={styles.mobileAddress}>{quote.propertyAddress}</p>
            <div className={styles.mobileMiddle}>
                <QuoteStatusBadge status={quote.status} />
                <span className={styles.mobilePrice}>{priceLabel}</span>
            </div>
            <span className={styles.mobileDate}>{formatRelativeDate(quote.createdAt)}</span>
        </Link>
    );
}

function EmptyHistory() {
    return (
        <p className={styles.emptyHistory}>No quotes on record.</p>
    );
}

function CustomerDetailSkeleton() {
    return (
        <div className={styles.page}>
            <div className={styles.skeletonHeader} />
            <div className={styles.skeletonMember} />
            <div className={styles.skeletonSection} />
            <div className={styles.desktopOnly}>
                <div className={styles.skeletonTable}>
                    {[0, 1, 2].map((i) => <div key={i} className={styles.skeletonRow} />)}
                </div>
            </div>
            <div className={styles.mobileOnly}>
                <div className={styles.cardStack}>
                    {[0, 1, 2].map((i) => <div key={i} className={styles.skeletonMobileCard} />)}
                </div>
            </div>
        </div>
    );
}
