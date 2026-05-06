import Button from '../Button';
import styles from './ServerErrorState.module.css';

export default function ServerErrorState({ onRetry }) {
    return (
        <div className={styles.fullPageState}>
            <h1 className={styles.fullPageHeadline}>Something went wrong</h1>
            <p className={styles.fullPageSubline}>
                We couldn't load this. Give it another try.
            </p>
            <Button variant="secondary" onClick={onRetry}>Retry</Button>
        </div>
    );
}
