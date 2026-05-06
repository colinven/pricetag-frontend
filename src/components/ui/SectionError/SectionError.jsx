import Button from '../Button';
import styles from './SectionError.module.css';

export default function SectionError({ message, onRetry }) {
    return (
        <div className={styles.sectionError}>
            <span>{message}</span>
            <Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>
        </div>
    );
}
