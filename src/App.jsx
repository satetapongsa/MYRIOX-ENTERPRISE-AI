import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Datasets from './pages/Datasets';
import AIModels from './pages/AIModels';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MainLayout from './layouts/MainLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for session persistence
    return localStorage.getItem('isLogged') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLogged', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLogged');
  };

  // Ensure body theme matches
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        
        {/* All application routes are wrapped in MainLayout */}
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="models" element={<AIModels />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Catch-all for sub-routes of / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Global catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
