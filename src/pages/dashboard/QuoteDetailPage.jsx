import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DropdownMenu } from 'radix-ui';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast/Toast';
import QuoteStatusBadge from '../../components/ui/QuoteStatusBadge';
import StreetViewEmbed from '../../components/ui/StreetViewEmbed';
import {
    getQuoteDetails,
    finalizeQuote,
    manuallySetQuoteStatus,
} from '../../api/dashboard';
import { formatRelativeDate, formatAbsoluteDateTime } from '../../util/dateUtils';
import styles from './QuoteDetailPage.module.css';

const PROPERTY_TYPE_LABELS = {
    SINGLE_FAMILY: 'Single Family',
    TOWNHOMES: 'Townhome',
};

// All four for label lookup in the modal description.
const STATUS_OPTIONS = [
    { value: 'PENDING',  label: 'Pending'  },
    { value: 'REVIEWED', label: 'Reviewed' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'DECLINED', label: 'Declined' },
];

// Backend only allows manual override to ACCEPTED or DECLINED.
const OVERRIDE_OPTIONS = [
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'DECLINED', label: 'Declined' },
];

// Stamps the matching timestamp when a manual override sets a new status.
// Mirrors what the server likely does so the timeline updates without a refetch.
const TIMESTAMP_FIELD_FOR_STATUS = {
    REVIEWED: 'reviewedAt',
    ACCEPTED: 'acceptedAt',
    DECLINED: 'declinedAt',
};

export default function QuoteDetailPage() {
    const { quoteId } = useParams();

    const [state, setState] = useState({ data: null, loading: true, error: null });
    const [toast, setToast] = useState({ message: null, variant: 'info' });

    useEffect(() => {
        let cancelled = false;
        setState({ data: null, loading: true, error: null });

        getQuoteDetails(quoteId)
            .then((data) => {
                if (cancelled) return;
                setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                if (cancelled) return;
                console.error('Failed to load quote: ', error);
                const kind = error.statusCode === 404 ? 'not-found' : 'server';
                setState({ data: null, loading: false, error: { kind } });
            });

        return () => { cancelled = true; };
    }, [quoteId]);

    const refetch = () => {
        setState({ data: null, loading: true, error: null });
        getQuoteDetails(quoteId)
            .then((data) => setState({ data, loading: false, error: null }))
            .catch((error) => {
                console.error('Failed to load quote: ', error);
                const kind = error.statusCode === 404 ? 'not-found' : 'server';
                setState({ data: null, loading: false, error: { kind } });
            });
    };

    const showToast = (message, variant) => setToast({ message, variant });
    const dismissToast = () => setToast({ message: null, variant: 'info' });

    const handleFinalize = async (finalPrice) => {
        try {
            await finalizeQuote(quoteId, { finalPrice });
            setState((s) => ({
                ...s,
                data: {
                    ...s.data,
                    status: 'REVIEWED',
                    finalPrice,
                    reviewedAt: new Date().toISOString(),
                },
            }));
            showToast(
                `Quote finalized at $${finalPrice.toLocaleString()} — customer will receive an email shortly.`,
                'success',
            );
        } catch (err) {
            console.error('Failed to finalize quote: ', err);
            showToast("Couldn't finalize — try again.", 'error');
        }
    };

    // Throws on failure so StatusOverrideMenu can show its inline-modal error
    const handleStatusOverride = async (nextStatus) => {
        await manuallySetQuoteStatus(quoteId, { status: nextStatus });
        const label = STATUS_OPTIONS.find((o) => o.value === nextStatus)?.label ?? nextStatus;
        const tsField = TIMESTAMP_FIELD_FOR_STATUS[nextStatus];
        setState((s) => ({
            ...s,
            data: {
                ...s.data,
                status: nextStatus,
                ...(tsField && !s.data[tsField] ? { [tsField]: new Date().toISOString() } : {}),
            },
        }));
        showToast(`Quote marked as ${label}.`, 'success');
    };

    return (
        <>
            {state.loading && <QuoteDetailSkeleton />}
            {state.error?.kind === 'not-found' && <NotFoundState />}
            {state.error?.kind === 'server' && <ServerErrorState onRetry={refetch} />}
            {state.data && (
                <QuoteDetailContent
                    quote={state.data}
                    onFinalize={handleFinalize}
                    onStatusOverride={handleStatusOverride}
                />
            )}
            <Toast
                message={toast.message}
                variant={toast.variant}
                onDismiss={dismissToast}
            />
        </>
    );
}

function QuoteDetailContent({ quote, onFinalize, onStatusOverride }) {
    const customerName = `${quote.customerFirstName} ${quote.customerLastName}`;
    const hasContact = quote.customerEmail || quote.customerPhone;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div className={styles.pageHeaderMain}>
                    <h1 className={styles.customerName}>{customerName}</h1>
                    {hasContact && (
                        <div className={styles.customerContact}>
                            {quote.customerEmail && (
                                <a href={`mailto:${quote.customerEmail}`} className={styles.customerContactLink}>
                                    {quote.customerEmail}
                                </a>
                            )}
                            {quote.customerEmail && quote.customerPhone && (
                                <span className={styles.customerContactDivider} aria-hidden="true">·</span>
                            )}
                            {quote.customerPhone && (
                                <a href={`tel:${quote.customerPhone}`} className={styles.customerContactLink}>
                                    {quote.customerPhone}
                                </a>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.pageHeaderActions}>
                    <QuoteStatusBadge status={quote.status} />
                    <StatusOverrideMenu
                        currentStatus={quote.status}
                        onConfirm={onStatusOverride}
                    />
                </div>
            </header>

            <div className={styles.body}>
                <div className={styles.leftCol}>
                    <StreetViewEmbed address={quote.propertyAddress} />
                    <PropertyDetailsCard quote={quote} />
                </div>

                <div className={styles.rightCol}>
                    {quote.status === 'PENDING' ? (
                        <FinalizeCard
                            customerFirstName={quote.customerFirstName}
                            priceLow={quote.priceLow}
                            priceHigh={quote.priceHigh}
                            onSubmit={onFinalize}
                        />
                    ) : (
                        <FinalPriceCard quote={quote} />
                    )}
                    <TimelineCard quote={quote} />
                </div>
            </div>
        </div>
    );
}

/* FinalizeCard (status === PENDING) */

function FinalizeCard({ customerFirstName, priceLow, priceHigh, onSubmit }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const parsedValue = parseFloat(value);

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        if (!value || Number.isNaN(parsedValue)) {
            setError('Enter a price.');
            return;
        }
        if (parsedValue <= 0) {
            setError('Price must be greater than zero.');
            return;
        }
        if (!Number.isInteger(parsedValue)) {
            setError('Price must be a whole number.');
            return;
        }
        setError(null);
        setConfirming(true);
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            await onSubmit?.(parsedValue);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card shadow="sm" className={styles.finalizeCard}>
            <h2 className={styles.cardHeading}>Set Final Price</h2>
            <p className={styles.estimateRange}>
                Estimated: <strong>${priceLow.toLocaleString()} – ${priceHigh.toLocaleString()}</strong>
            </p>
            <p className={styles.cardCaption}>
                Setting a final price emails the customer an accept/decline link.
            </p>

            <form onSubmit={handleInitialSubmit} className={styles.finalizeForm}>
                <FormField label="Final price ($)" error={error} required>
                    <Input
                        type="number"
                        step="1"
                        min="1"
                        value={value}
                        onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
                        placeholder="0"
                        disabled={confirming || submitting}
                    />
                </FormField>

                {!confirming ? (
                    <Button type="submit" variant="primary">Set Final Price</Button>
                ) : (
                    <div className={styles.confirmRow}>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setConfirming(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleConfirm}
                            loading={submitting}
                        >
                            Confirm — Send ${parsedValue.toLocaleString()} quote to {customerFirstName}?
                        </Button>
                    </div>
                )}
            </form>
        </Card>
    );
}

/* FinalPriceCard (status !== PENDING) */

function FinalPriceCard({ quote }) {
    const priceLabel = quote.finalPrice != null
        ? `$${quote.finalPrice.toLocaleString()}`
        : '—';

    return (
        <Card shadow="sm">
            <h2 className={styles.cardHeading}>Final Price</h2>
            <p className={styles.finalPriceHero}>{priceLabel}</p>
            {quote.reviewedAt && (
                <p className={styles.finalPriceSub}>
                    Set {formatRelativeDate(quote.reviewedAt)}
                </p>
            )}
            <p className={styles.estimateRange}>
                Estimated: <strong>${quote.priceLow.toLocaleString()} – ${quote.priceHigh.toLocaleString()}</strong>
            </p>
        </Card>
    );
}

/* TimelineCard */

function TimelineCard({ quote }) {
    const rows = [
        { label: 'Submitted', value: formatAbsoluteDateTime(quote.createdAt) },
        { label: 'Reviewed',  value: formatAbsoluteDateTime(quote.reviewedAt) },
    ];

    if (quote.status === 'ACCEPTED') {
        rows.push({ label: 'Accepted', value: formatAbsoluteDateTime(quote.acceptedAt) });
    } else if (quote.status === 'DECLINED') {
        rows.push({ label: 'Declined', value: formatAbsoluteDateTime(quote.declinedAt) });
    } else {
        rows.push({ label: 'Awaiting customer', value: null });
    }

    rows.push({ label: 'Expires', value: formatAbsoluteDateTime(quote.expiresAt) });

    return (
        <Card shadow="sm">
            <h2 className={styles.cardHeading}>Timeline</h2>
            <ul className={styles.timelineList}>
                {rows.map((row) => (
                    <li key={row.label} className={styles.timelineRow}>
                        <span className={styles.timelineLabel}>{row.label}</span>
                        <span className={row.value ? styles.timelineValue : styles.timelineValueEmpty}>
                            {row.value ?? '—'}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* PropertyDetailsCard */

function PropertyDetailsCard({ quote }) {
    return (
        <Card shadow="sm" className={styles.infoCard}>
            <h2 className={styles.infoLabel}>Property</h2>
            <p className={styles.infoAddress}>{quote.propertyAddress}</p>
            <ul className={styles.infoList}>
                <li><span>Square footage</span><span>{quote.propertySqft?.toLocaleString()}</span></li>
                <li><span>Stories</span><span>{quote.propertyStories}</span></li>
                <li><span>Year built</span><span>{quote.propertyYearBuilt}</span></li>
                {quote.propertyGarageSize != null && (
                    <li><span>Garage</span><span>{quote.propertyGarageSize}-car</span></li>
                )}
                <li><span>Type</span><span>{PROPERTY_TYPE_LABELS[quote.propertyType] ?? quote.propertyType}</span></li>
            </ul>
        </Card>
    );
}

/* StatusOverrideMenu (kebab → dropdown → modal) */

function StatusOverrideMenu({ currentStatus, onConfirm }) {
    const [targetStatus, setTargetStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const currentLabel = STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label;
    const newLabel = STATUS_OPTIONS.find((o) => o.value === targetStatus)?.label;

    // A PENDING quote has no final price yet — blocking the override until
    // finalization keeps the backend state consistent.
    const isBlocked = currentStatus === 'PENDING';

    const closeModal = () => {
        setTargetStatus(null);
        setError(null);
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await onConfirm?.(targetStatus);
            setSubmitting(false);
            closeModal();
        } catch {
            setSubmitting(false);
            setError("Couldn't update status. Try again.");
        }
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button type="button" className={styles.kebabBtn} aria-label="More actions">
                        <KebabIcon />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={styles.dropdownContent}
                        align="end"
                        sideOffset={4}
                    >
                        <div className={styles.dropdownLabel}>Change status</div>
                        {OVERRIDE_OPTIONS.map((opt) => (
                            <DropdownMenu.Item
                                key={opt.value}
                                className={styles.dropdownItem}
                                disabled={opt.value === currentStatus}
                                onSelect={() => {
                                    setTargetStatus(opt.value);
                                    setError(null);
                                }}
                            >
                                {opt.label}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Modal
                open={!!targetStatus}
                onOpenChange={(open) => { if (!open) closeModal(); }}
                title={isBlocked ? 'Set a final price first' : 'Change status?'}
                description={
                    !targetStatus ? null
                    : isBlocked
                        ? 'You need to finalize this quote before manually updating its status.'
                        : `Change status from ${currentLabel} to ${newLabel}. This won't notify the customer.`
                }
            >
                {!isBlocked && error && <div className={styles.modalError}>{error}</div>}
                <Modal.Footer>
                    {isBlocked ? (
                        <Button variant="primary" onClick={closeModal}>Got it</Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={closeModal} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button variant="primary" loading={submitting} onClick={handleConfirm}>
                                Confirm
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

function KebabIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
        </svg>
    );
}

/* QuoteDetailSkeleton */

function QuoteDetailSkeleton() {
    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div className={styles.skeletonHeader} />
            </div>
            <div className={styles.body}>
                <div className={styles.leftCol}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonCard} />
                    <div className={styles.skeletonCard} />
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.skeletonCard} />
                    <div className={styles.skeletonCard} />
                </div>
            </div>
        </div>
    );
}

/* NotFoundState (404) */

function NotFoundState() {
    return (
        <div className={styles.page}>
            <div className={styles.fullPageState}>
                <h1 className={styles.fullPageHeadline}>Quote not found</h1>
                <p className={styles.fullPageSubline}>
                    This quote may have been deleted or the link may be invalid.
                </p>
                <Button as={Link} to="/dashboard/quotes" variant="secondary">
                    Back to Quotes
                </Button>
            </div>
        </div>
    );
}

/* ServerErrorState (5xx / network) */

function ServerErrorState({ onRetry }) {
    return (
        <div className={styles.page}>
            <div className={styles.fullPageState}>
                <h1 className={styles.fullPageHeadline}>Something went wrong</h1>
                <p className={styles.fullPageSubline}>
                    We couldn't load this quote. Give it another try.
                </p>
                <Button variant="secondary" onClick={onRetry}>Retry</Button>
            </div>
        </div>
    );
}
