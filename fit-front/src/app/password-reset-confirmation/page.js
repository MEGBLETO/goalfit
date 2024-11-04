'use client';
import Logo from "../../components/logo";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PasswordResetConfirmation() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000); 

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-screen">
      <div className="flex-1 flex-col md:flex hidden bg-blue-600 text-white px-8 dark:bg-blue-700 dark:text-white">
        <div className="flex justify-start items-center py-2">
          <Logo />
          <h1 className="text-xl font-bold ms-2 font-mono">GoalFit</h1>
        </div>
        <div className="max-w-md text-center md:text-left my-auto">
          <p className="text-xl mb-4">
            “Motivation is what gets you started. Habit is what keeps you going...”
          </p>
          <p>Jim Ryun</p>
        </div>
      </div>

      <div className="flex-1 flex md:flex-row flex-col items-center justify-center md:px-8 px-4 dark:bg-gray-900 dark:text-gray-100">
        <div className="w-full max-w-sm my-auto text-center">
          <h2 className="text-2xl font-bold dark:text-gray-100 mb-4">Check Your Email</h2>
          <p className="text-gray-500 dark:text-gray-400">
            If an account with that email exists, a password reset link has been sent.
          </p>
          <p className="mt-4">
            You will be redirected to the login page shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
