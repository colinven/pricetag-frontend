import clsx from 'clsx';
import styles from './Card.module.css';

export default function Card({ children, shadow = 'sm', className, ...rest }) {
    return (
        <div
            className={clsx(
                styles.card,
                shadow !== 'none' && styles[`shadow-${shadow}`],
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}