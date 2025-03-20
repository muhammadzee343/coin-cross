'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeWeb3Auth } from '@/utils/web3auth';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const web3auth = await initializeWeb3Auth();
        await web3auth.handleRedirect();
        
        // Rest of your web authentication flow...
        router.push('/home');
      } catch (error) {
        console.error('Redirect handling failed:', error);
        router.push('/login');
      }
    };

    handleRedirect();
  }, [router]);

  return <div>Processing authentication...</div>;
}