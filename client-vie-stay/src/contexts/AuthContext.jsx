// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user từ localStorage và sessionStorage khi load app
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = JSON.parse(
      localStorage.getItem("user") || 
      sessionStorage.getItem("user") || 
      "{}"
    );
    if (token && storedUser && Object.keys(storedUser).length > 0) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = JSON.parse(
          localStorage.getItem("user") || 
          sessionStorage.getItem("user") || 
          "{}"
        );
        
        if (token && storedUser && Object.keys(storedUser).length > 0) {
          setUser(storedUser);
        } else {
          setUser(null);
        }
      }
    };

    const handleUserLogin = (event) => {
      const { user: userData, token } = event.detail;
      setUser(userData);
    };

    const handleUserLogout = () => {
      setUser(null);
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  // Function to save user to both storages for compatibility
  const saveUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
    setUser(userData);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('userLoggedIn', {
      detail: { user: userData, token }
    }));
  };

  // Function to logout user from both storages
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  // Function to update user data
  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      saveUser, 
      logout, 
      isLoading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);