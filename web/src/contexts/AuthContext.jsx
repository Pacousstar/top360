import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://top360-api.onrender.com/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const token = localStorage.getItem('top360_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setRestaurant(res.data.restaurant);
    } catch (error) {
      localStorage.removeItem('top360_token');
      setUser(null);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: userData, restaurant: restaurantData } = res.data;
      localStorage.setItem('top360_token', token);
      setUser(userData);
      setRestaurant(restaurantData);
      toast.success(`Bienvenue ${userData.fullname} !`);
      return { success: true, user: userData, restaurant: restaurantData };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      const { token, user: userData, restaurant: restaurantData } = res.data;
      localStorage.setItem('top360_token', token);
      setUser(userData);
      if (restaurantData) setRestaurant(restaurantData);
      toast.success('Compte créé avec succès !');
      return { success: true, user: userData, restaurant: restaurantData };
    } catch (error) {
      const message = error.response?.data?.error || "Erreur d'inscription";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('top360_token');
    setUser(null);
    setRestaurant(null);
    toast.success('Déconnexion réussie');
  };

  const updateProfile = async (data) => {
    try {
      const token = localStorage.getItem('top360_token');
      const res = await axios.put(`${API_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      toast.success('Profil mis à jour');
      return { success: true };
    } catch (error) {
      toast.error('Erreur mise à jour');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        restaurant,
        setRestaurant,
        loading,
        login,
        register,
        logout,
        updateProfile,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}

export { API_URL };
