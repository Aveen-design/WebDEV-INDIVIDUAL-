import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Home     from './pages/Home';
import Register from './pages/Register';
import Login    from './pages/Login';
import Vehicles from './pages/Vehicles';

const Dashboard = () => <div style={{padding:'2rem'}}>Dashboard (coming soon)</div>;
const About     = () => <div style={{padding:'2rem'}}>About page</div>;
const Contact   = () => <div style={{padding:'2rem'}}>Contact page</div>;

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/vehicles"  element={<Vehicles />} />
      <Route path="/about"     element={<About />} />
      <Route path="/contact"   element={<Contact />} />
      <Route path="/register"  element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/login"     element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;