import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State ko localStorage se initialize karein taake reload par session zaya na ho
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });

  const [loading] = useState(false);

  // Jab bhi user state change ho, localStorage ko update karein
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = { ...response.data.user, session: response.data.session };
    setUser(userData);
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const AllUsersFetch = useCallback(async () => {
    const response = await api.get('/auth/users');
    return response.data;
  }, []);

  const deleteUserById = useCallback(async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }, []);

  const fetchUserById = useCallback(async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        AllUsersFetch,
        deleteUserById,
        fetchUserById,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};