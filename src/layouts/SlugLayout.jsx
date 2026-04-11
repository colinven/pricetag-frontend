import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner";
import { getCompanyInfo } from "../api/quote";

export default function SlugLayout() {

    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        getCompanyInfo(slug)
        .then((data) => setCompanyInfo(data))
        .catch((error) => {
            if (error.statusCode === 404) {
                setError("not-found");
            } else {
                setError("server");
            }
        })
        .finally(() => setIsLoading(false));
    }, [slug]);

    if (isLoading) {
        return (
            <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem"}} >
                <Spinner size="xl" />
            </div>
        );
    }

    if (error === "not-found") {
        return (
            <div style={{height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem", gap: "8px"}} >
                <h1>No company found for '{slug}'</h1>
                <p style={{color: "var(--color-text-muted)", fontSize: "var(--text-sm)"}}>Check the URL and try again.</p>
            </div>
        );
    }

    if (error === "server") {
        return (
            <div style={{height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem", gap: "8px"}} >
                <h1>Something went wrong</h1>
                <p style={{color: "var(--color-text-muted)", fontSize: "var(--text-sm)"}}>We're having trouble loading this page. Please try again later.</p>
            </div>
        );
    }

    return (
        <div>
            <Outlet context={{...companyInfo, slug}}/>
        </div>
    );
}