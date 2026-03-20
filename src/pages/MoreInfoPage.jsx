import Header from "../components/layout/Header";
import NeedMoreInfo from "../components/moreinfo/NeedMoreInfo";
import { useNavigate } from "react-router-dom";

export default function MoreInfoPage() {
    const navigate = useNavigate();

    async function handleSubmit(updatedState) {
        const amendedQuoteRequest = updatedState.amendedQuoteRequest;
        const originalQuoteResponse = updatedState.QuoteResponse;
        try {
            const response = await fetch(`${import.meta.env.VITE_AMEND_QUOTE_API_URL}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(amendedQuoteRequest)
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();

            originalQuoteResponse.price = data.price;
            originalQuoteResponse.lookupResult.data = amendedQuoteRequest.data;

            navigate("/quote-result", { state: originalQuoteResponse });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
        <Header />
        <NeedMoreInfo onSubmit={handleSubmit}/>
        </>
    )
}