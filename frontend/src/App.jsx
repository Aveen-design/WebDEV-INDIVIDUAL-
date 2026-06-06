import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Home     from './pages/Home';
import Register from './pages/Register';
import Login    from './pages/Login';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import ForgotPassword from './pages/ForgotPassword';
import BookVehicle from './pages/BookVehicle';
import Dashboard from './pages/Dashboard';
import OwnerVehicles from './pages/OwnerVehicles';
import AddVehicle from './pages/AddVehicle';
import OAuthCallback from './pages/OAuthCallback';
import ChooseRole from './pages/ChooseRole';
import Messages from './pages/Messages';

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
      <Route path="/vehicles/:id" element={<VehicleDetail />} />
      <Route path="/about"     element={<About />} />
      <Route path="/contact"   element={<Contact />} />
      <Route path="/register"  element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/login"     element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/vehicles/:id/book" element={<ProtectedRoute><BookVehicle /></ProtectedRoute>} />
      <Route path="/owner/vehicles"     element={<ProtectedRoute><OwnerVehicles /></ProtectedRoute>} />
      <Route path="/owner/vehicles/new" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/messages/:bookingId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;