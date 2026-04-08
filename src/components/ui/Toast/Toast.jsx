import { useEffect, useState } from 'react';
import { Toast as RadixToast } from 'radix-ui';
import styles from './Toast.module.css';

const ICONS = {
    success: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    error: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    warning: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="currentColor" />
        </svg>
    ),
    info: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="currentColor" />
        </svg>
    ),
};

const DURATION = 6000;

export default function Toast({ message, variant = 'info', onDismiss }) {
    // Holds the variant that is currently displayed. Only updates when a new
    // message arrives (open), not when dismissing — prevents the color from
    // snapping to the next variant during the exit animation.
    const [displayVariant, setDisplayVariant] = useState(variant);

    useEffect(() => {
        if (!message) return;

        // Freeze the variant for this toast's lifetime
        setDisplayVariant(variant);

        const timer = setTimeout(() => {
            onDismiss?.();
        }, DURATION);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <RadixToast.Provider>
            <RadixToast.Root
                open={!!message}
                onOpenChange={(open) => { if (!open) onDismiss?.(); }}
                className={`${styles.toast} ${styles[displayVariant]}`}
            >
                <div className={styles.content}>
                    <span className={styles.icon}>{ICONS[displayVariant]}</span>
                    <RadixToast.Description className={styles.message}>
                        {message}
                    </RadixToast.Description>
                </div>

                <RadixToast.Close className={styles.close} aria-label="Dismiss">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </RadixToast.Close>
            </RadixToast.Root>

            <RadixToast.Viewport className={styles.viewport} />
        </RadixToast.Provider>
    );
}