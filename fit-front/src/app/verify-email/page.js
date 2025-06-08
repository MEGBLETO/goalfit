'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../components/logo';

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Invalid verification token.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email`,
          { params: { token } }
        );

        console.log('response', response);

        if (response.status === 200) {
          toast.success('Email verified successfully!');
          setMessage('Your email has been verified successfully.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          throw new Error('Failed to verify email.');
        }
      } catch (error) {
        toast.error('An error occurred during email verification.');
        console.error('Error verifying email:', error);
        setMessage('An error occurred during email verification.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, []); 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo color="#1c64f2" /> 
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Email Verification
        </h2>
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Verifying your email...</p>
        ) : (
          <p className="text-center text-gray-800 dark:text-gray-100">{message}</p>
        )}
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-blue-600 underline dark:text-blue-400">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
