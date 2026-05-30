import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex',
                  alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI', sans-serif" }}>
      <div style={{ background:'#1a1a1a', borderRadius:'16px', padding:'2.5rem',
                    width:'100%', maxWidth:'420px', border:'1px solid #2a2a2a', textAlign:'center' }}>
        <div style={{ fontSize:'1.8rem', fontWeight:'700', marginBottom:'1rem' }}>
          <span style={{ color:'#fff' }}>Drive</span>
          <span style={{ color:'#e63946' }}>Nepal</span>
        </div>
        <p style={{ color:'#888', marginBottom:'1.5rem' }}>Login page coming in Step 5</p>
        <Link to="/register" style={{ color:'#e63946' }}>Go to Register →</Link>
      </div>
    </div>
  );
};

export default Login;