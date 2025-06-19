// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user từ sessionStorage khi load app
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (token && storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
