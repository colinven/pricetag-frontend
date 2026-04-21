import axios from "axios";

const hasStreetView = (addressString) => {

    return axios.get("https://maps.googleapis.com/maps/api/streetview/metadata", {
        params: {
            size: "640x360",
            location: addressString,
            key: import.meta.env.VITE_MAPS_API_KEY
        }
    })
    .then((response) => {
        const data = response.data;
        if (data.status === "OK") return true;
        else return false;
    })
    .catch((error) => {
        console.error("Failed to fetch GMAPS metadata:", error);
        return false;
    });
}

const getStreetView = (addressString) => {

    return axios.get("https://maps.googleapis.com/maps/api/streetview", {
        params : {
            size: "640x360",
            location: addressString,
            key: import.meta.env.VITE_MAPS_API_KEY
        },
        responseType: "blob"
    })
    .then((response) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
        });
    });
}

const getCachedStreetView = (addressString) => {
    const cachedImage = localStorage.getItem(`sv:${normalizeKey(addressString)}`);
    if (cachedImage) {
        return cachedImage === "noImagery" 
        ? Promise.resolve(null)
        : Promise.resolve(cachedImage);
    }
    return hasStreetView(addressString)
    .then((exists) => {
        if (!exists){
            return "noImagery";
        }
        return getStreetView(addressString);
    })
    .then((url) => {
        localStorage.setItem(`sv:${normalizeKey(addressString)}`, url ?? "noImagery");
        return url === "noImagery" ? null : url;
    })
    .catch((error) => {
        console.error("Failed to fetch GMAPS image:", error);
        return null;
    });
}

const normalizeKey = (addressString) => {
    return addressString.replace(/[.,]+$/, '').trim().toLowerCase();
}

export { hasStreetView, getStreetView, getCachedStreetView };