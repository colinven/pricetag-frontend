import { useId, cloneElement } from 'react';
import styles from './FormField.module.css';

export default function FormField({ label, error, hint, children, required = false }) {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const describedBy = [
        error && errorId,
        hint && hintId,
    ].filter(Boolean).join(' ') || undefined;

    const child = cloneElement(children, {
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
    });

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {required && <span className={styles.required} aria-hidden="true">*</span>}
            </label>

            {child}

            {hint && !error && (
                <span id={hintId} className={styles.hint}>{hint}</span>
            )}
            {error && (
                <span id={errorId} className={styles.error} role="alert">{error}</span>
            )}
        </div>
    );
}