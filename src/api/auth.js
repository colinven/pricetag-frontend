import createClient from "./client";

const authClient = createClient(`${import.meta.env.VITE_BASE_API_URL}/auth`);

// see API_CONTRACT.md for request/response shapes

const register = (req) => authClient.post("/register", req);
const login = (req) => authClient.post("/login", req);
const logout = () => authClient.post("/logout");
const sessionCheck = () => authClient.get("/me");

export { register, login, logout, sessionCheck };