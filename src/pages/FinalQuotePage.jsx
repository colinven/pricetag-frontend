import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import NotFoundState from '../components/ui/NotFoundState';
import ServerErrorState from '../components/ui/ServerErrorState';
import { viewFinalizedQuote } from '../api/quote';
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

                {state.data && (
                    <div className={styles.placeholder}>
                        Letter goes here — status: {state.data.status}
                    </div>
                )}
            </div>
        </div>
    );
}

function classifyGetError(error) {
    if (error.statusCode === 404) return 'invalid';
    if (error.statusCode === 410) return 'expired';
    return 'server';
}
