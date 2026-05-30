const Home = () => {
  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex',
                  alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <h1 style={{ color:'#fff', fontSize:'3rem', fontWeight:'700' }}>
          Drive<span style={{ color:'#e63946' }}>Nepal</span>
        </h1>
        <p style={{ color:'#888', marginTop:'1rem' }}>
          Nepal's first online vehicle rental platform
        </p>
      </div>
    </div>
  );
};

export default Home;