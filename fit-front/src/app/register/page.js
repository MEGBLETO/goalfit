'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Logo from '../../components/logo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 

export default function Home() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm(); 
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const registrationData = {
        email: data.email,
        password: data.password,
        surname: data.lastName,
        name: data.firstName,
      };
      const registrationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;
      const response = await axios.post(registrationUrl, registrationData);
      if (response.status === 201) {
        toast.success("Compte créé avec succès !");
        reset();
        setTimeout(() => {
          router.push('/verify-prompt'); 
        }, 2000);
      } else {
        toast.error("Une erreur s'est produite");
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message); 
      console.error(error);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`;
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordBorderColor = password && confirmPassword 
    ? (password === confirmPassword ? "border-green-500" : "border-red-500")
    : "";

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-screen">
      <ToastContainer />

      <div className="flex-1 flex-col md:flex hidden bg-blue-600 text-white px-8 dark:bg-blue-700 dark:text-white">
        <div className="flex justify-start items-center py-2">
          <Link href="/" className="cursor-pointer flex items-center"> 
            <Logo />
            <h1 className="text-xl font-bold ms-2 font-mono">GoalFit</h1>
          </Link>
        </div>
        <div className="max-w-md text-center md:text-left my-auto">
          <p className="text-xl mb-4">
            « La motivation est ce qui vous fait commencer. L'habitude est ce qui vous fait continuer. »
          </p>
          <p>Jim Ryun</p>
        </div>
      </div>

      <div className="flex-1 flex md:flex-row flex-col items-center justify-center md:px-8 px-4 dark:bg-gray-900 dark:text-gray-100">
        <div
          className="md:hidden flex justify-start items-center py-2 w-full"
        >
          <Link href="/" className="cursor-pointer flex items-center"> 
            <Logo color="#3b82f6" />
            <h1 className="text-xl font-bold ms-2 font-mono text-blue-600 dark:text-blue-400">
              GoalFit
            </h1>
          </Link>
        </div>
        <div className="w-full max-w-sm my-auto">
          <div className="md:text-start text-center">
            <h2 className="text-2xl font-bold dark:text-gray-100">
              Créer un compte
            </h2>
            <div className="text-gray-500 text-sm mb-5 dark:text-gray-400">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="underline dark:text-gray-300">
                Se connecter
              </a>
              .
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="firstName" className="sr-only">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                placeholder="Prénom"
                required
                aria-label="Prénom"
                {...register("firstName")}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                placeholder="Nom"
                required
                aria-label="Nom"
                {...register("lastName")}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                placeholder="nom@example.com"
                required
                aria-label="Email"
                {...register("email")}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className={`w-full p-3 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 ${passwordBorderColor}`}
                placeholder="Mot de passe"
                required
                aria-label="Mot de passe"
                {...register("password", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`w-full p-3 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 ${passwordBorderColor}`}
                placeholder="Confirmer le mot de passe"
                required
                aria-label="Confirmer le mot de passe"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Les mots de passe ne correspondent pas",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-md dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                S'inscrire
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-4 text-xs text-gray-500 dark:text-gray-400">
                ou continuez avec
              </span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <button
              type="button"
              className="w-full p-3 border rounded-md flex items-center justify-center space-x-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              onClick={handleGoogleSignIn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span>Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
