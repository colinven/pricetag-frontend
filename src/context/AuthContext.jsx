import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { login as userLogin, register as userRegister, logout as userLogout, sessionCheck } from '../api/auth';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = user !== null;

    useEffect(() => {
        sessionCheck()
        .then((data) => setUser(data))
        .catch((error) => {
            if (error.statusCode !== 401) {
                console.error("Session check failed: ", error);
            }
        })
        .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback((email, password) => {
        return userLogin({email, password})
        .then((data) => setUser(data));
    }, []);

    const register = useCallback((req) => {
        return userRegister(req)
        .then((data) => setUser(data));
    }, []);

    const logout = useCallback(() => {
        userLogout()
        .catch((error) => {
            console.error("Logout request failed: ", error);
        });
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, isLoading, isAuthenticated, login, logout, register }),
        [user, isLoading, login, register, logout]
    );
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}