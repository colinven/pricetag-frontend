import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Table from '../../components/ui/Table';
import MobilePagination from '../../components/ui/MobilePagination';
import SectionError from '../../components/ui/SectionError';
import { formatRelativeDate } from '../../util/dateUtils';
import { getAllCustomersPaginated } from '../../api/dashboard';
import styles from './CustomerListPage.module.css';

const PAGE_SIZE = 10;

export default function CustomerListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page'), 10) || 1;
    const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        let cancelled = false;
        setState({ data: null, loading: true, error: null });

        getAllCustomersPaginated(page - 1, PAGE_SIZE, 'createdAt', sortDir)
            .then((data) => {
                if (cancelled) return;
                setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                if (cancelled) return;
                console.error('Failed to load customers: ', error);
                setState({ data: null, loading: false, error });
            });

        return () => { cancelled = true; };
    }, [page, sortDir]);

    const refetch = () => {
        setState({ data: null, loading: true, error: null });
        getAllCustomersPaginated(page - 1, PAGE_SIZE, 'createdAt', sortDir)
            .then((data) => setState({ data, loading: false, error: null }))
            .catch((error) => {
                console.error('Failed to load customers: ', error);
                setState({ data: null, loading: false, error });
            });
    };

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
            key: 'name',
            header: 'Customer',
            render: (c) => `${c.firstName} ${c.lastName}`,
        },
        {
            key: 'createdAt',
            header: 'Joined',
            sortable: true,
            render: (c) => formatRelativeDate(c.createdAt),
        },
    ];

    const { data, loading, error } = state;
    const isEmpty = data && data.content.length === 0;
    const hasRows = data && data.content.length > 0;

    return (
        <div className={styles.page}>
            {loading && <CustomerListSkeleton />}
            {error && <SectionError message="Couldn't load customers." onRetry={refetch} />}
            {isEmpty && <CustomerEmptyState />}
            {hasRows && (
                <>
                    <div className={styles.desktopOnly}>
                        <Table
                            columns={columns}
                            rows={data.content}
                            rowKey={(c) => c.id}
                            rowHref={(c) => `/dashboard/customers/${c.id}`}
                            sortBy="createdAt"
                            sortDirection={sortDir}
                            onSortChange={({ direction }) =>
                                updateParams({ sortDir: direction, page: 1 })
                            }
                            page={page - 1}
                            totalPages={data.page.totalPages}
                            totalItems={data.page.totalElements}
                            itemLabel="customer"
                            itemLabelPlural="customers"
                            onPageChange={(zeroIdx) => updateParams({ page: zeroIdx + 1 })}
                        />
                    </div>

                    <div className={styles.mobileOnly}>
                        <div className={styles.cardStack}>
                            {data.content.map((c) => (
                                <CustomerMobileCard key={c.id} customer={c} />
                            ))}
                        </div>
                        <MobilePagination
                            page={page}
                            totalPages={data.page.totalPages}
                            totalItems={data.page.totalElements}
                            onPageChange={(newPage) => updateParams({ page: newPage })}
                            itemLabel="customer"
                            itemLabelPlural="customers"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function CustomerMobileCard({ customer }) {
    const name = `${customer.firstName} ${customer.lastName}`;
    return (
        <Link to={`/dashboard/customers/${customer.id}`} className={styles.mobileCard}>
            <span className={styles.mobileName}>{name}</span>
            <span className={styles.mobileMeta}>{formatRelativeDate(customer.createdAt)}</span>
        </Link>
    );
}

function CustomerListSkeleton() {
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

function CustomerEmptyState() {
    return (
        <div className={styles.emptyState}>
            <p className={styles.emptyHeadline}>No customers yet</p>
            <p className={styles.emptySubline}>
                Customers will appear here once someone submits a quote through your form.
            </p>
        </div>
    );
}
