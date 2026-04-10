import { Outlet, Link } from "react-router-dom";
import Stack from '../components/ui/Stack';
import Card from '../components/ui/Card';
import styles from './AuthLayout.module.css';
import logo from '../assets/pricetag-logo.png';

export default function AuthLayout() {
    return (
        <div className={styles.page}>
            <Stack align="center" className={styles.container}>
                <Link to="/">
                    <img className={styles.logo} src={logo} alt="PriceTag" />
                </Link>
                <Card className={styles.card}>
                    <Outlet />
                </Card>
            </Stack>
        </div>
    );
}