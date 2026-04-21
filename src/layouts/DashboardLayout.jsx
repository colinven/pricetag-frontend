import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import MobileTopBar from "../components/layout/MobileTopBar";
import BottomNav from "../components/layout/BottomNav";
import styles from "./DashboardLayout.module.css";

/**
 * Order matters: /dashboard must be matched last so /dashboard/quotes/abc
 * doesn't prefix-match it first. Using an array makes that explicit.
 */
const ROUTE_TITLES = [
    ['/dashboard/quotes',        'Quotes'],
    ['/dashboard/customers',     'Customers'],
    ['/dashboard/analytics',     'Analytics'],
    ['/dashboard/notifications', 'Notifications'],
    ['/dashboard/settings',      'Settings'],
    ['/dashboard',               'Home'],
];

function titleFor(pathname) {
    const hit = ROUTE_TITLES.find(([prefix]) => pathname.startsWith(prefix));
    return hit ? hit[1] : '';
}

export default function DashboardLayout() {
    const { isLoading, isAuthenticated } = useAuth();
    const { pathname } = useLocation();

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const title = titleFor(pathname);

    return (
        <div className={styles.shell}>
            <Sidebar />
            <TopBar title={title} />
            <MobileTopBar title={title} />
            <main className={styles.content}>
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
