import clsx from 'clsx';
import styles from './Stack.module.css';

export default function Stack({
    children,
    direction = 'column',
    gap = 4,
    align = 'flex-start',
    justify = 'flex-start',
    className,
    ...rest
}) {
    return (
        <div
            className={clsx(styles.stack, className)}
            style={{
                flexDirection: direction,
                gap: `var(--space-${gap})`,
                alignItems: align,
                justifyContent: justify,
            }}
            {...rest}
        >
            {children}
        </div>
    );
}