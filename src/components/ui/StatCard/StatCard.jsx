import clsx from 'clsx';
import Card from '../Card';
import styles from './StatCard.module.css';

export default function StatCard({ label, value, description, className }) {
    return (
        <Card shadow="sm" className={clsx(styles.card, className)}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
            {description && <span className={styles.description}>{description}</span>}
        </Card>
    );
}
