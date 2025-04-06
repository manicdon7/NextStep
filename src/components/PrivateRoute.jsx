import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from "firebase/auth";

// This component will check if the user is authenticated through either:
// 1. Firebase authentication (Google auth)
// 2. Traditional login form (stored in localStorage)
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // Check for traditional login first
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (token && storedEmail) {
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // If no traditional login, check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    // You can replace this with a loading spinner or component
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;