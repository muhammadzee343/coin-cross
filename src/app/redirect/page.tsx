'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeWeb3Auth } from '@/utils/web3auth';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await initializeWeb3Auth();
        const params = new URLSearchParams(window.location.search);
        
        if (typeof window !== 'undefined' && window.opener) {
          window.opener.postMessage({
            type: 'WEB3AUTH_REDIRECT_SUCCESS',
            token: params.get('token'),
            email: params.get('email')
          });
          window.close();
        } else {
          router.push('/home');
        }
      } catch (error) {
        console.error('Redirect handling failed:', error);
        window.opener?.postMessage({ type: 'WEB3AUTH_REDIRECT_ERROR', error });
        window.close();
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Processing authentication...</p>
    </div>
  );
}