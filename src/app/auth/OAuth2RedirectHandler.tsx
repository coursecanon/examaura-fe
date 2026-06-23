import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useUser } from '../context/UserContext';

export function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 Extract BOTH tokens from the URL
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken'); 

    // Ensure we have both before proceeding
    if (token && refreshToken) {
      // Commit both tokens to localStorage and update context state
      loginWithToken(token, refreshToken); 
      // Send them to homepage or user dashboard
      navigate('/', { replace: true });
    } else {
      // Something went sideways, reject them back to base state
      navigate('/', { replace: true });
      window.dispatchEvent(new Event('open-signin'));
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      <p className="text-slate-600 font-medium">Securing profile connection...</p>
    </div>
  );
}