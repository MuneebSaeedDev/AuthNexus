import { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser({ ...response.data.user, session: response.data.session });
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
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
