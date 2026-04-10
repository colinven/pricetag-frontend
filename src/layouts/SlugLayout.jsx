import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner";
import { getCompanyInfo } from "../api/quote";

export default function SlugLayout() {

    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [notFound, setNotFound] = useState(false);


    useEffect(() => {
        getCompanyInfo(slug)
        .then((data) => setCompanyInfo(data))
        .catch((error) => {
            if (error.statusCode === 404){
                setNotFound(true);
            } else {
                console.error("Failed to fetch company info:", error);
            }
        })
        .finally(() => setIsLoading(false));
    }, [slug]);

    if (isLoading) {
        return (
            <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem"}} >
                <Spinner size="xl" />
            </div>
        )
    }

    if (notFound) {
        return (
            <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem"}} >
                 <h1>No company found for '{slug}'</h1>
            </div>
        );
    }

    return (
        <div>
            <Outlet context={{...companyInfo, slug}}/>
        </div>
    );
}