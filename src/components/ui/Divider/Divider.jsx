import clsx from 'clsx';
import styles from './Divider.module.css';

export default function Divider({ spacing = 0, className }) {
    return (
        <hr
            className={clsx(styles.divider, className)}
            style={spacing ? { margin: `var(--space-${spacing}) 0` } : undefined}
        />
    );
}