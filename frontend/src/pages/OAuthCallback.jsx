import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    const pending = params.get('pending');

    if (pending) {
      navigate(`/choose-role?pending=${pending}`);
      return;
    }

    if (!token) {
      navigate('/login?error=no_token');
      return;
    }

    const finish = async () => {
      localStorage.setItem('token', token);
      try {
        const res = await api.get('/auth/me');
        login(res.data.data.user, token);
        navigate(res.data.data.user.role === 'admin' ? '/admin' : '/dashboard');
      } catch {
        navigate('/login?error=auth_failed');
      }
    };
    finish();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#EDEEF5', fontFamily: 'Inter, sans-serif', color: '#666' }}>
      Signing you in...
    </div>
  );
};

export default OAuthCallback;