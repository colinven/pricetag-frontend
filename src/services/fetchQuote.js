export default async function fetchQuote(formData) {

    try {
        const response = await fetch(`${import.meta.env.VITE_QUOTE_API_URL}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e.message);
    }
    return null;

}