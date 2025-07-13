import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Whiteboard from './components/Whiteboard';
import { authUtils } from './services/api';

const ProtectedRoute = ({ children }) => {
  return authUtils.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername.startsWith('Guest-')) {
      localStorage.removeItem('username');
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/whiteboard" element={<ProtectedRoute><Whiteboard /></ProtectedRoute>} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/whiteboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
