import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../ui/Button';
import { navItems } from '../navConfig';
import logo from '../../../assets/pricetag-logo.png';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className={styles.sidebar} aria-label="Primary navigation">
            <Link to="/dashboard" className={styles.brand}>
                <img src={logo} alt="" className={styles.brandLogo} />
            </Link>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    clsx(styles.navLink, isActive && styles.active)
                                }
                            >
                                <Icon className={styles.navIcon} size={18} strokeWidth={2} aria-hidden="true" />
                                <span>{label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.footer}>
                {user && (
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>
                            {user.firstName} {user.lastName}
                        </span>
                        <span className={styles.userEmail}>{user.email}</span>
                    </div>
                )}
                <Button variant="ghost" size="sm" fullWidth onClick={logout}>
                    Sign out
                </Button>
            </div>
        </aside>
    );
}
