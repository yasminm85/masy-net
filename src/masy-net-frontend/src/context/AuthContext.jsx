import React, { createContext, useContext, useState, useEffect} from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext();

export const AuthDesc = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('Must be used an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [principal, setPrincipal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authClient, setAuthClient] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async () => {
        try {
            const client = await AuthClient.create();
            setAuthClient(client);

            const isAuth = await client.isAuthenticated();
            if (isAuth) {
                const Useridentity = client.getIdentity();
                const IdPrincipal = Useridentity.getPrincipal().toText();
                setPrincipal(IdPrincipal);
                setIdentity(Useridentity);
                setIsAuthenticated(true);
            }
        }
        catch (error) {
            console.error("Authentication failed", error);
        }
        finally {
            setLoading(false);
        }
    };

    const login = async () => {
        if (!authClient) return;

        try {
            await authClient.login({
                identityProvider: `http://uzt4z-lp777-77774-qaabq-cai.localhost:4943`,
                onSuccess: async () => {
                    const Useridentity = authClient.getIdentity();
                    const principalId = Useridentity.getPrincipal().toText();
                    setPrincipal(principalId);
                    setIdentity(Useridentity);
                    setIsAuthenticated(true);
                },
            });
        } 
        catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = async () => {
        if(!authClient) return;

        try{
            await authClient.logout();
            setPrincipal(null);
            setIdentity(null);
            setIsAuthenticated(false);
        }
        catch (error) {
            console.error("Logout failed", error);
        }
    };

    const value = {
        principal,
        identity,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}