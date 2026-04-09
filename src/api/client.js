import axios from "axios";

const createClient = (baseUrl) => {
    const client = axios.create({
        baseUrl,
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });

    client.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const data = error.response?.data ?? {};
            return Promise.reject(new APIError(data));
        }
    );
    return client;
}

class APIError extends Error {
    constructor({statusCode, message}) {
        super(message);
        this.statusCode = statusCode
    }
}

export default createClient;