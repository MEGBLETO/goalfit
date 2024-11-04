'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      Cookies.set('token',token, { expires: 1, path: '/' }); 

      router.push('/home');
    }
  }, [router]);

  return <p>Redirecting...</p>;
}
