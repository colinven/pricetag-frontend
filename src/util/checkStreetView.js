export default async function checkStreetView(addressString) {

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?size=640x360&location=${encodeURIComponent(addressString)}&key=${import.meta.env.VITE_MAPS_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Error fetching maps metadata. Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === "OK") return true;
        else return false;
    } catch (e) {
        console.error(e);
        return false;
    }
}