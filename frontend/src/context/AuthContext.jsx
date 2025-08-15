import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile } from "../api/auth.service";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const navigate = useNavigate();
  const { showSnackbar} = useSnackbar();

  useEffect(() => {
    const authenticateUser = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await getMyProfile(storedToken);
          setUser(userData);
          setToken(storedToken);
          
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          setLoading(false);
        }
      }
      setLoading(false);
    };

    authenticateUser();
  }, []);

  const login = (userData, userToken) => {
    setLoading(true);
    setUser(userData);
    setToken(userToken);
    showSnackbar('Success!', 'success');
    localStorage.setItem("token", userToken);
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    showSnackbar('Logged Out!', 'success');
    setLoading(false);
    navigate("/");
  };

  const value = { user, token, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
