import { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext();

const getIdentityProvider = () => {
  const network = import.meta.env.VITE_DFX_NETWORK;
  const canisterId = import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY;

  console.log("Network:", network);
  console.log("Internet Identity Canister ID:", canisterId);

  if (network === "ic") {
    return "https://identity.ic0.app";
  } else {
    return `http://${canisterId}.localhost:4943`;
  }
};

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const client = await AuthClient.create();
        setAuthClient(client);
        
        if (await client.isAuthenticated()) {
          setIsAuthenticated(true);
          setPrincipal(client.getIdentity().getPrincipal());
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (onSuccessRedirect = "/management") => {
    try {
      if (!authClient) {
        console.error("Auth client not initialized");
        return false;
      }
      console.log(import.meta.env.VITE_DFX_NETWORK)
      const identityProvider = import.meta.env.VITE_DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://${import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

      return new Promise((resolve) => {
        authClient.login({
          identityProvider,
          onSuccess: () => {
            setIsAuthenticated(true);
            const identity = authClient.getIdentity();
            setPrincipal(identity.getPrincipal());
            resolve(true);
            
            // redirect dulu
            window.location.href = onSuccessRedirect;
          },
          onError: (error) => {
            console.error("Login failed:", error);
            resolve(false);
          },
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000)
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (authClient) {
        await authClient.logout();
        setIsAuthenticated(false);
        setPrincipal(null);
        window.location.href = "/";
        return true;
      }
      return false;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      principal,
      loading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};