'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeWeb3Auth } from '@/utils/web3auth';

export default function TelegramCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleTelegramAuth = async () => {
      try {
        const web3auth = await initializeWeb3Auth();
        await web3auth.handleRedirect();
        
        const user = await web3auth.authenticateUser();
        const email = user.email;
        
        window.Telegram.WebApp.sendData(JSON.stringify({
          token: user.idToken,
          email: email
        }));
        window.Telegram.WebApp.close();
      } catch (error: any) {
        console.error("Telegram auth failed:", error);
        window.Telegram.WebApp.showAlert(`Authentication failed: ${error.message}`);
      }
    };

    handleTelegramAuth();
  }, [router]);

  return <div>Processing Telegram authentication...</div>;
}