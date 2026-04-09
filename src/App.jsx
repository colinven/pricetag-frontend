import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FormPage from "./pages/FormPage";
import QuotePage from "./pages/QuotePage";
import MoreInfoPage from "./pages/MoreInfoPage";
import ComponentGallery from "./pages/ComponentGallery";
import AuthProvider from "./context/AuthContext";

export default function App(){
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    {/*<Route path="/get-a-quote" element={<FormPage />} />*/}
                    <Route path="/quote-result" element={<QuotePage />} />
                    <Route path="/need-more-info" element={<MoreInfoPage />} />
                    <Route path="/dev/components" element={<ComponentGallery />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
        
    )
}