import createClient from "./client";

const settingsClient = createClient(`${import.meta.env.VITE_BASE_API_URL}/company/settings`);

// see API_CONTRACT.md for request/response shapes

const getSettings = () => settingsClient.get("");
const setPricingConfig = (req) => settingsClient.put("/pricing-config", req);
const setServiceArea = (req) => settingsClient.put("/service-area", req);

export { getSettings, setPricingConfig, setServiceArea };