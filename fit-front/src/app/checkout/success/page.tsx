'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import Logo from '../../../components/logo';

// Disable server-side rendering for this page
const SuccessPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch search params only on the client side within useEffect
  useEffect(() => {
    const sessionIdFromParams = searchParams.get('session_id');
    if (sessionIdFromParams) {
      setSessionId(sessionIdFromParams);
    }
  }, [searchParams]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          setMessage('Thank you for your payment.');
          setTimeout(() => {
            router.push('/loader');
          }, 5000);
        } catch (error) {
          setMessage('Error verifying payment.');
          console.error('Error verifying payment:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col items-center">
        <div className="p-4 bg-gray-100 rounded-full">
          <Logo width={100} height={100} color="#000" />
        </div>
        <FaCheckCircle className="text-green-500 text-7xl mb-4" />
        <h2 className="text-3xl font-bold mb-2">Paiement Réussi !</h2>
        {loading ? (
          <p className="text-lg text-gray-600 dark:text-gray-400">Vérification de votre paiement...</p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
        )}
        {!loading && (
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Vous serez redirigé vers votre tableau de bord sous peu.
          </p>
        )}
      </div>
    </div>
  );
};

// Disable SSR for this page
export default dynamic(() => Promise.resolve(SuccessPage), { ssr: false });
