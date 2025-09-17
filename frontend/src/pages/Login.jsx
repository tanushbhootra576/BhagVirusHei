import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginWithGoogle, error } = useAuth();

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={loginWithGoogle}>Sign in with Google</button>
    </div>
  );
}