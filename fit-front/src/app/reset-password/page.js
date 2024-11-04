"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../components/logo';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or missing reset token or email.");
      router.push('/');
    }
  }, [token, email, router]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/authenticate/reset-password`,
        { token, email, password: data.password }
      );

      if (response.status === 200) {
        toast.success('Password has been reset successfully');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred while resetting the password');
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-50 dark:bg-gray-900">
      <ToastContainer />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo color="#1c64f2" /> 
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">Reset Your Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              id="password"
              className={`w-full p-3 border rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your new password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`w-full p-3 border rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Re-enter your new password"
              {...register("confirmPassword", { required: "Please confirm your password" })}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-2">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className={`w-full p-3 text-white font-semibold rounded-md transition duration-150 ease-in-out ${loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400'}`}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
