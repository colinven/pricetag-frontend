import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

export default function DashboardLayout() {

    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return (
            <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem"}} >
                <Spinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div>
            <Outlet />
        </div>
    );

}