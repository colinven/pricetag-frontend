import { useAuth } from '../../../context/AuthContext';
import styles from './TopBar.module.css';

export default function TopBar({ title }) {
    const { user } = useAuth();

    return (
        <header className={styles.topBar}>
            <h1 className={styles.title}>{title}</h1>
            {user && (
                <span className={styles.userName}>
                    {user.firstName} {user.lastName}
                </span>
            )}
        </header>
    );
}
