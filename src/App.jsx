import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SlugLayout from "./layouts/SlugLayout";
import QuoteFormPage from "./pages/QuoteFormPage";
import MoreInfoPage from "./pages/MoreInfoPage";
import QuoteResultsPage from "./pages/QuoteResultsPage";
import FinalQuotePage from "./pages/FinalQuotePage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import QuoteListPage from "./pages/dashboard/QuoteListPage";
import QuoteDetailPage from "./pages/dashboard/QuoteDetailPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import CustomerListPage from "./pages/dashboard/CustomerListPage";
import CustomerDetailPage from "./pages/dashboard/CustomerDetailPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";

import ComponentGallery from "./pages/ComponentGallery";
import AuthProvider from "./context/AuthContext";

export default function App(){
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>
                    <Route path="/quote/:slug" element={<SlugLayout />}>
                        <Route index element={<QuoteFormPage />} />
                        <Route path="more-info" element={<MoreInfoPage />} />
                        <Route path="results" element={<QuoteResultsPage />} />
                    </Route>
                    <Route path="/dashboard" element={<DashboardLayout />} >
                        <Route index element={<DashboardHome />} />
                        <Route path="quotes" element={<QuoteListPage />} />
                        <Route path="quotes/:quoteId" element={<QuoteDetailPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="customers" element={<CustomerListPage />} />
                        <Route path="customers/:customerId" element={<CustomerDetailPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                    </Route>
                    <Route path="/q/:quoteId" element={<FinalQuotePage />} />
                    <Route path="/dev/components" element={<ComponentGallery />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
        
    );
}