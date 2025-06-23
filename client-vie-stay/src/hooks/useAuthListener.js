// hooks/useAuthListener.js
import { useEffect } from 'react';
import { useAuth } from '../pages/contexts/AuthContext';

export const useAuthListener = () => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    // Listen for storage changes across tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        // Refresh user data when storage changes
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

    // Listen for custom login events
    const handleUserLogin = (event) => {
      const { user: userData, token } = event.detail;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", token);
      setUser(userData);
    };

    // Listen for custom logout events
    const handleUserLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      setUser(null);
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, [setUser]);

  return user;
};