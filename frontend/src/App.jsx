import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { AuthProvider, useAuth } from './context/AuthContext';

import { useSelector } from "react-redux";
// useSelector use karne ke liye aapki React application ko <Provider store={store}> ke andar wrap kiya hona chahiye. Aam tor par ye main.jsx mein hota hai, App.jsx mein nahi.
 
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';


function AuthStorageSync() {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return null;
}

const ProtectedRoute = ({ children }) => {
  // const { user } = useAuth();
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  // const { user } = useAuth();
  const user = useSelector((state) => state.auth.user);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthStorageSync />
        <AppRoutes />
    </Router>
  );
}

export default App;
