import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import Table from '../../components/ui/Table';
import QuoteStatusBadge from '../../components/ui/QuoteStatusBadge';
import Button from '../../components/ui/Button';
import { formatRelativeDate } from '../../util/dateUtils';
import { getAllQuotesPaginated } from '../../api/dashboard';
import styles from './QuoteListPage.module.css';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
    { value: null,       label: 'All'      },
    { value: 'PENDING',  label: 'Pending'  },
    { value: 'REVIEWED', label: 'Reviewed' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'DECLINED', label: 'Declined' },
];

const STATUS_LABELS = {
    PENDING:  'pending',
    REVIEWED: 'reviewed',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
};

export default function QuoteListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read URL params 
    const statusesParam = searchParams.get('statuses'); // null if absent
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        let cancelled = false;
        setState({ data: null, loading: true, error: null });

        getAllQuotesPaginated(page - 1, PAGE_SIZE, 'createdAt', sortDir, statusesParam)
            .then((data) => {
                if (cancelled) return;
                setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                if (cancelled) return;
                console.error('Failed to load quotes: ', error);
                setState({ data: null, loading: false, error });
            });

        return () => { cancelled = true; };
    }, [statusesParam, page, sortDir]);

    const refetch = () => {
        setState({ data: null, loading: true, error: null });
        getAllQuotesPaginated(page - 1, PAGE_SIZE, 'createdAt', sortDir, statusesParam)
            .then((data) => setState({ data, loading: false, error: null }))
            .catch((error) => {
                console.error('Failed to load quotes: ', error);
                setState({ data: null, loading: false, error });
            });
    };

    // Merge a patch into the URL search params. Null/undefined values delete the key.
    const updateParams = (patch) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(patch).forEach(([key, value]) => {
                if (value === null || value === undefined) {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            return next;
        });
    };

    const columns = [
        {
            key: 'customer',
            header: 'Customer',
            render: (r) => `${r.customerFirstName} ${r.customerLastName}`,
        },
        {
            key: 'address',
            header: 'Address',
            render: (r) => r.propertyAddress,
        },
        {
            key: 'range',
            header: 'Estimated',
            render: (r) => `$${r.priceLow.toLocaleString()} – $${r.priceHigh.toLocaleString()}`,
        },
        {
            key: 'final',
            header: 'Final',
            render: (r) => r.finalPrice ? `$${r.finalPrice.toLocaleString()}` : '—',
        },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <QuoteStatusBadge status={r.status} />,
        },
        {
            key: 'createdAt',
            header: 'Date',
            sortable: true,
            render: (r) => formatRelativeDate(r.createdAt),
        },
    ];

    const { data, loading, error } = state;
    const isEmpty = data && data.content.length === 0;
    const hasRows = data && data.content.length > 0;

    return (
        <div className={styles.page}>
            <StatusChipRow
                activeStatus={statusesParam}
                onChange={(next) => updateParams({ statuses: next, page: 1 })}
            />

            {loading && <QuoteListSkeleton />}
            {error && <SectionError onRetry={refetch} />}
            {isEmpty && (
                <QuoteEmptyState hasFilter={!!statusesParam} filter={statusesParam} />
            )}
            {hasRows && (
                <>
                    {/* Desktop — Table. */}
                    <div className={styles.desktopOnly}>
                        <Table
                            columns={columns}
                            rows={data.content}
                            rowKey={(r) => r.id}
                            rowHref={(r) => `/dashboard/quotes/${r.id}`}
                            sortBy="createdAt"
                            sortDirection={sortDir}
                            onSortChange={({ direction }) =>
                                updateParams({ sortDir: direction, page: 1 })
                            }
                            page={page - 1}
                            totalPages={data.page.totalPages}
                            totalItems={data.page.totalElements}
                            itemLabel="quote"
                            itemLabelPlural="quotes"
                            onPageChange={(zeroIdx) => updateParams({ page: zeroIdx + 1 })}
                        />
                    </div>

                    {/* Mobile — card stack + mirrored pagination. */}
                    <div className={styles.mobileOnly}>
                        <div className={styles.cardStack}>
                            {data.content.map((q) => (
                                <QuoteMobileCard key={q.id} quote={q} />
                            ))}
                        </div>
                        <MobilePagination
                            page={page}
                            totalPages={data.page.totalPages}
                            totalItems={data.page.totalElements}
                            onPageChange={(newPage) => updateParams({ page: newPage })}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function StatusChipRow({ activeStatus, onChange }) {
    return (
        <div className={styles.chipRow} role="group" aria-label="Filter by status">
            {STATUS_OPTIONS.map((opt) => {
                const isActive = activeStatus === opt.value;
                return (
                    <button
                        key={opt.label}
                        type="button"
                        className={clsx(styles.chip, isActive && styles.chipActive)}
                        aria-pressed={isActive}
                        onClick={() => onChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

function QuoteMobileCard({ quote }) {
    const name = `${quote.customerFirstName} ${quote.customerLastName}`;
    const range = `$${quote.priceLow.toLocaleString()} – $${quote.priceHigh.toLocaleString()}`;
    const finalStr = quote.finalPrice ? `$${quote.finalPrice.toLocaleString()}` : '—';

    return (
        <Link to={`/dashboard/quotes/${quote.id}`} className={styles.mobileCard}>
            <div className={styles.mobileTopRow}>
                <span className={styles.mobileName}>{name}</span>
                <QuoteStatusBadge status={quote.status} />
            </div>
            <p className={styles.mobileAddress}>{quote.propertyAddress}</p>
            <div className={styles.mobileMeta}>
                <span>{range}</span>
                <span className={styles.mobileMetaDot}>·</span>
                <span>{finalStr}</span>
                <span className={styles.mobileMetaDot}>·</span>
                <span>{formatRelativeDate(quote.createdAt)}</span>
            </div>
        </Link>
    );
}

function MobilePagination({ page, totalPages, totalItems, onPageChange }) {
    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <div className={styles.mobilePagination}>
            <button
                type="button"
                className={styles.mobilePageBtn}
                disabled={!canPrev}
                onClick={() => onPageChange(page - 1)}
            >
                ← Prev
            </button>
            <span className={styles.mobilePageMeta}>
                Page {page} of {totalPages || 1}
                {totalItems !== undefined && (
                    <> · {totalItems.toLocaleString()} {totalItems === 1 ? 'quote' : 'quotes'}</>
                )}
            </span>
            <button
                type="button"
                className={styles.mobilePageBtn}
                disabled={!canNext}
                onClick={() => onPageChange(page + 1)}
            >
                Next →
            </button>
        </div>
    );
}

function QuoteListSkeleton() {
    return (
        <>
            <div className={styles.desktopOnly}>
                <div className={styles.skeletonTable}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.skeletonRow} />
                    ))}
                </div>
            </div>
            <div className={styles.mobileOnly}>
                <div className={styles.cardStack}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={styles.skeletonMobileCard} />
                    ))}
                </div>
            </div>
        </>
    );
}

function QuoteEmptyState({ hasFilter, filter }) {
    const headline = hasFilter
        ? `No ${STATUS_LABELS[filter] ?? 'matching'} quotes`
        : 'No quotes yet';
    const subline = hasFilter
        ? 'Try a different status filter.'
        : 'Share your quote form link with customers to start receiving requests.';

    return (
        <div className={styles.emptyState}>
            <p className={styles.emptyHeadline}>{headline}</p>
            <p className={styles.emptySubline}>{subline}</p>
        </div>
    );
}

function SectionError({ onRetry }) {
    return (
        <div className={styles.sectionError}>
            <span>Couldn't load quotes.</span>
            <Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>
        </div>
    );
}
