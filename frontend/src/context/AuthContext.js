import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await axios.get("http://localhost:3000/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error("❌ Authentication Error:", error.response?.data || error.message);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  //LOGIN FUNCTION
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    navigate("/"); 
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);