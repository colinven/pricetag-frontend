import { Link } from 'react-router-dom';
import Button from '../Button';
import styles from './NotFoundState.module.css';

export default function NotFoundState({ title, description, backHref, backLabel }) {
    return (
        <div className={styles.fullPageState}>
            <h1 className={styles.fullPageHeadline}>{title}</h1>
            <p className={styles.fullPageSubline}>{description}</p>
            {backHref && (
                <Button as={Link} to={backHref} variant="secondary">
                    {backLabel}
                </Button>
            )}
        </div>
    );
}
