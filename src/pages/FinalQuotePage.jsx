import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import NotFoundState from '../components/ui/NotFoundState';
import ServerErrorState from '../components/ui/ServerErrorState';
import StreetViewEmbed from '../components/ui/StreetViewEmbed';
import { viewFinalizedQuote } from '../api/quote';
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

                {state.data && <LetterCard quote={state.data} />}
            </div>
        </div>
    );
}

function classifyGetError(error) {
    if (error.statusCode === 404) return 'invalid';
    if (error.statusCode === 410) return 'expired';
    return 'server';
}

function LetterCard({ quote }) {
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
        </article>
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
