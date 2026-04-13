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
        return URL.createObjectURL(response.data);
    })
    .catch((error) => {
        console.error("Failed to fetch GMAPS image:", error);
    });
}

export { hasStreetView, getStreetView };