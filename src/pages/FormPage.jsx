import QuoteForm from "../components/quote/QuoteForm";
import Header from "../components/layout/Header";
import ErrorToast from "../components/ui/ErrorToast";

import fetchQuote from "../services/fetchQuote";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function handleSubmit(formData) {
        setError(null);
        try {
            const response = await fetchQuote(formData);
            //if data is returned, but price is null, direct to 'need more info' page to append missing details
            if (response.lookupResult.data && !response.price) {
                navigate("/need-more-info", { state: { QuoteResponse: response, lastWash: formData.lastWash} });
                return; // TODO: figure out if we need to pass all form data as state
            }
            //if response is whole, direct to quote result
            if (response.lookupResult.data) {
                navigate("/quote-result", { state: response });
            } else {
                setError(response.lookupResult.message);
            }
        } catch (e) {
            console.error(e);
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <>
            <Header />
            <QuoteForm onSubmit={handleSubmit}/>
            <ErrorToast message={error} onDismiss={() => setError(null)} />
        </>
    )
}