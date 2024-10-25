'use client';

export default function Home() {
  const handleLogin = () => {
    // Redirect to the backend to initiate Google OAuth
    window.location.href = 'http://localhost:5050/auth/login';
  };

  return (
    <div>
      <h1>Google Auth with Supabase</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}
