import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { navItems } from '../navConfig';
import styles from './BottomNav.module.css';

export default function BottomNav() {
    const mobileItems = navItems.filter((item) => item.mobile);

    return (
        <nav className={styles.bar} aria-label="Primary navigation">
            <ul className={styles.list}>
                {mobileItems.map(({ to, label, icon: Icon, end }) => (
                    <li key={to} className={styles.item}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                clsx(styles.link, isActive && styles.active)
                            }
                        >
                            <Icon size={22} strokeWidth={2} aria-hidden="true" />
                            <span className={styles.label}>{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
