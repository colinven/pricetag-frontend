import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import NotFoundState from '../components/ui/NotFoundState';
import ServerErrorState from '../components/ui/ServerErrorState';
import StreetViewEmbed from '../components/ui/StreetViewEmbed';
import ConfettiOverlay from '../components/ui/ConfettiOverlay';
import { viewFinalizedQuote, acceptOrDeclineQuote } from '../api/quote';
import { formatRelativeFuture, formatAbsoluteDate } from '../util/dateUtils';
import { formatPropertyType } from '../util/propertyType';
import styles from './FinalQuotePage.module.css';

export default function FinalQuotePage() {
    const { quoteId } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')?.trim() || null;

    const [state, setState] = useState(() =>
        token
            ? { data: null, loading: true, error: null }
            : { data: null, loading: false, error: { kind: 'invalid' } }
    );

    const [justAccepted, setJustAccepted] = useState(false);

    const handleMutationSuccess = (status) => {
        setState((prev) => {
            if (!prev.data) return prev;
            const stamp = new Date().toISOString();
            return {
                ...prev,
                data: {
                    ...prev.data,
                    status,
                    ...(status === 'ACCEPTED' ? { acceptedAt: stamp } : { declinedAt: stamp }),
                },
            };
        });
        if (status === 'ACCEPTED') {
            setJustAccepted(true);
        }
    };

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        setState({ data: null, loading: true, error: null });

        viewFinalizedQuote(quoteId, token)
            .then((data) => {
                if (cancelled) return;
                if (data.status === 'PENDING') {
                    setState({ data: null, loading: false, error: { kind: 'invalid' } });
                    return;
                }
                setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                if (cancelled) return;
                console.error('Failed to load quote: ', error);
                setState({ data: null, loading: false, error: { kind: classifyGetError(error) } });
            });

        return () => { cancelled = true; };
    }, [quoteId, token]);

    const refetch = () => {
        if (!token) return;
        setState({ data: null, loading: true, error: null });
        viewFinalizedQuote(quoteId, token)
            .then((data) => {
                if (data.status === 'PENDING') {
                    setState({ data: null, loading: false, error: { kind: 'invalid' } });
                    return;
                }
                setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                console.error('Failed to load quote: ', error);
                setState({ data: null, loading: false, error: { kind: classifyGetError(error) } });
            });
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {state.loading && (
                    <div className={styles.loading}>
                        <Spinner size="lg" />
                    </div>
                )}

                {state.error?.kind === 'invalid' && (
                    <NotFoundState
                        title="This link is invalid"
                        description="Check the link from your email or contact the company."
                    />
                )}

                {state.error?.kind === 'expired' && (
                    <NotFoundState
                        title="This quote has expired"
                        description="The window to respond to this quote has closed."
                    />
                )}

                {state.error?.kind === 'server' && (
                    <ServerErrorState onRetry={refetch} />
                )}

                {state.data && (
                    <LetterCard
                        quote={state.data}
                        quoteId={quoteId}
                        token={token}
                        onMutationSuccess={handleMutationSuccess}
                    />
                )}
            </div>
            <ConfettiOverlay fire={justAccepted} />
        </div>
    );
}

function classifyGetError(error) {
    if (error.statusCode === 404) return 'invalid';
    if (error.statusCode === 410) return 'expired';
    return 'server';
}

function classifyMutationError(error) {
    if (error.statusCode === 409) {
        return {
            phase: 'error-terminal',
            copy: 'This quote was already responded to.',
        };
    }
    if (error.statusCode === 410) {
        return {
            phase: 'error-terminal',
            copy: 'This quote just expired and can no longer be accepted.',
        };
    }
    return {
        phase: 'error-recoverable',
        copy: "Couldn't submit. Try again.",
    };
}

function LetterCard({ quote, quoteId, token, onMutationSuccess }) {
    return (
        <article className={styles.card}>
            <LetterHeader
                companyName={quote.companyName}
                companyPhone={quote.companyPhone}
                companyEmail={quote.companyEmail}
            />
            <LetterGreeting
                customerFirstName={quote.customerFirstName}
                propertyAddress={quote.propertyAddress}
            />
            <StreetViewEmbed
                address={quote.propertyAddress}
                className={styles.streetView}
            />
            <PropertyMetaLine quote={quote} />
            <PriceBlock quote={quote} showExpiry={quote.status === 'REVIEWED'} />
            <ActionRegion
                quoteId={quoteId}
                token={token}
                quote={quote}
                onMutationSuccess={onMutationSuccess}
            />
        </article>
    );
}

function ActionRegion({ quoteId, token, quote, onMutationSuccess }) {
    const [phase, setPhase] = useState('idle');
    // 'idle' | 'decline-confirming' | 'submitting-accept' | 'submitting-decline'
    // | 'error-terminal' | 'error-recoverable'

    const [lastAction, setLastAction] = useState(null);
    const [errorCopy, setErrorCopy] = useState('');

    if (quote.status === 'ACCEPTED') {
        return (
            <div className={styles.acceptedStrip}>
                <div className={styles.stripHeader}>
                    <Check size={18} className={styles.stripIcon} aria-hidden="true" />
                    <span className={styles.stripTitle}>Quote accepted</span>
                </div>
                <p className={styles.stripBody}>
                    {quote.companyName} will reach out soon to schedule.
                </p>
                {quote.acceptedAt && (
                    <p className={styles.stripMeta}>
                        Accepted on {formatAbsoluteDate(quote.acceptedAt)}
                    </p>
                )}
            </div>
        );
    }

    if (quote.status === 'DECLINED') {
        return (
            <div className={styles.declinedStrip}>
                <div className={styles.stripHeader}>
                    <span className={styles.stripTitle}>Quote declined</span>
                </div>
                <p className={styles.stripBody}>
                    Thanks for considering {quote.companyName}.
                </p>
                {quote.declinedAt && (
                    <p className={styles.stripMeta}>
                        Declined on {formatAbsoluteDate(quote.declinedAt)}
                    </p>
                )}
            </div>
        );
    }

    const submit = async (status) => {
        setLastAction(status);
        setPhase(status === 'ACCEPTED' ? 'submitting-accept' : 'submitting-decline');
        try {
            await acceptOrDeclineQuote(quoteId, token, { status });
            onMutationSuccess(status);
        } catch (error) {
            console.error('PATCH failed:', error);
            const { phase: nextPhase, copy } = classifyMutationError(error);
            setErrorCopy(copy);
            setPhase(nextPhase);
        }
    };

    if (phase === 'error-terminal') {
        return (
            <div className={styles.errorStripTerminal}>
                <p className={styles.stripBody}>{errorCopy}</p>
            </div>
        );
    }

    if (phase === 'error-recoverable') {
        return (
            <div className={styles.errorStripRecoverable}>
                <p className={styles.stripBody}>{errorCopy}</p>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => submit(lastAction)}
                >
                    Try again
                </Button>
            </div>
        );
    }

    if (phase === 'decline-confirming') {
        return (
            <div className={styles.actionRow}>
                <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setPhase('idle')}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    fullWidth
                    onClick={() => submit('DECLINED')}
                >
                    Yes, decline this quote
                </Button>
            </div>
        );
    }

    const submitting = phase === 'submitting-accept' || phase === 'submitting-decline';
    return (
        <div className={styles.actionRow}>
            <Button
                variant="primary"
                fullWidth
                loading={phase === 'submitting-accept'}
                disabled={submitting}
                onClick={() => submit('ACCEPTED')}
            >
                Accept
            </Button>
            <Button
                variant="secondary"
                fullWidth
                disabled={submitting}
                onClick={() => setPhase('decline-confirming')}
            >
                Decline
            </Button>
        </div>
    );
}

function LetterHeader({ companyName, companyPhone, companyEmail }) {
    return (
        <header className={styles.cardHeader}>
            <h1 className={styles.companyName}>{companyName}</h1>
            <div className={styles.companyContact}>
                {companyPhone && (
                    <a href={`tel:${companyPhone}`} className={styles.companyContactLink}>
                        {companyPhone}
                    </a>
                )}
                {companyPhone && companyEmail && (
                    <span className={styles.companyContactDivider} aria-hidden="true">·</span>
                )}
                {companyEmail && (
                    <a href={`mailto:${companyEmail}`} className={styles.companyContactLink}>
                        {companyEmail}
                    </a>
                )}
            </div>
        </header>
    );
}

function LetterGreeting({ customerFirstName, propertyAddress }) {
    const greetingName = customerFirstName?.trim() || '';
    return (
        <div className={styles.greetingBlock}>
            <p className={styles.greeting}>
                Hi {greetingName ? `${greetingName} ` : ''}—
            </p>
            <p className={styles.lead}>
                Here's your final quote for <strong>{propertyAddress}</strong>.
            </p>
        </div>
    );
}

function PropertyMetaLine({ quote }) {
    const segments = [];
    if (quote.propertySqft)       segments.push(`${quote.propertySqft.toLocaleString()} sqft`);
    if (quote.propertyStories)    segments.push(`${quote.propertyStories} ${quote.propertyStories === 1 ? 'story' : 'stories'}`);
    if (quote.propertyYearBuilt)  segments.push(`Built ${quote.propertyYearBuilt}`);
    if (quote.propertyGarageSize) segments.push(`${quote.propertyGarageSize}-car garage`);
    if (quote.propertyType)       segments.push(formatPropertyType(quote.propertyType) ?? quote.propertyType);

    if (segments.length === 0) return null;
    return <p className={styles.propertyMeta}>{segments.join(' · ')}</p>;
}

function PriceBlock({ quote, showExpiry }) {
    const captionParts = [
        `Estimated $${quote.priceLow.toLocaleString()} – $${quote.priceHigh.toLocaleString()}`,
    ];
    if (showExpiry) {
        const relative = formatRelativeFuture(quote.expiresAt);
        const absolute = formatAbsoluteDate(quote.expiresAt);
        if (relative) captionParts.push(`Expires ${relative}`);
        if (absolute) captionParts.push(absolute);
    }

    return (
        <div className={styles.priceBlock}>
            <p className={styles.finalPrice}>${quote.finalPrice.toLocaleString()}</p>
            <p className={styles.priceCaption}>{captionParts.join(' · ')}</p>
        </div>
    );
}
