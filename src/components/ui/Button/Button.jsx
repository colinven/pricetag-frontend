import clsx from 'clsx';
import styles from './Button.module.css';

export default function Button({
    children,
    as: Component = 'button',
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
    const isButton = Component === 'button';
    const isDisabled = disabled || loading;

    const elementProps = isButton
        ? { type, disabled: isDisabled, onClick }
        : {
              onClick,
              // Anchors/other tags have no native disabled — mimic it
              ...(isDisabled && {
                  'aria-disabled': true,
                  tabIndex: -1,
                  onClick: (e) => e.preventDefault(),
              }),
          };

    return (
        <Component
            {...elementProps}
            className={clsx(
                styles.btn,
                styles[variant],
                size !== 'md' && styles[size],
                fullWidth && styles.full,
                loading && styles.loading,
                isDisabled && !isButton && styles.disabledLink,
                className
            )}
            {...rest}
        >
            {loading && <span className={styles.spinner} />}
            {children}
        </Component>
    );
}