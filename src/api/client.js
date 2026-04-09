import axios from "axios";

class APIError extends Error {
    constructor({statusCode, message}) {
        super(message);
        this.statusCode = statusCode
    }
}

const createClient = (baseURL) => {
    const client = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });

    client.interceptors.response.use(
        (response) => response.data,
        (error) => {
            if (!error.response) {
                return Promise.reject(new APIError({
                    statusCode: 0,
                    message: "Network error - could not reach server"
                }));
            }
            const data = error.response?.data ?? {};
            return Promise.reject(new APIError(data));
        }
    );
    return client;
}



export default createClient;