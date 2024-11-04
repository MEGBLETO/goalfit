'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../components/logo';

export default function VerifyPrompt() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <Logo />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">Vérifiez votre e-mail</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Merci de vous être inscrit ! Nous vous avons envoyé un lien de vérification par e-mail. Veuillez consulter votre boîte de réception et cliquer sur le lien pour vérifier votre compte.
        </p>
        <button 
          onClick={() => router.push('/login')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Retour à la Connexion
        </button>
      </div>
    </div>
  );
}
