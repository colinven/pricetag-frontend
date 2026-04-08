import clsx from 'clsx';
import styles from './Button.module.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className,
    ...rest
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                styles.btn,
                styles[variant],
                size !== 'md' && styles[size],
                fullWidth && styles.full,
                loading && styles.loading,
                className
            )}
            {...rest}
        >
            {loading && <span className={styles.spinner} />}
            {children}
        </button>
    )
};