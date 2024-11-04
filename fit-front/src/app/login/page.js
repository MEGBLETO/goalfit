"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Logo from "../../components/logo";
export default function Home() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = atob(base64);
      return JSON.parse(decodedData);
  }
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/authenticate/login`,
        data
      );
  
      if (response.status === 200) {
        toast.success("Login successful!");
  
        const token = response.data.token;
        Cookies.set("token", token, { expires: 1, path: "/" });
  
        // Use atob to decode the JWT token
        const decodedToken = parseJwt(token);
          const userId = decodedToken.userId;
          const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/user/${userId}`
        );
  
        if (userResponse.status === 200) {
          if (userResponse.data.firstLogin) {
            router.push("/account");
          } else {
            router.push("/home");
          }
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/authenticate/auth/google`;
  };

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
            “La motivation est ce qui vous fait commencer. L'habitude est ce qui
            vous fait continuer...”
          </p>
          <p>Jim Ryun</p>
        </div>
      </div>

      <div className="flex-1 flex md:flex-row flex-col items-center justify-center md:px-8 px-4 dark:bg-gray-900 dark:text-gray-100">
        <div className="md:hidden flex justify-start items-center py-2 w-full">
          <Link href="/" className="cursor-pointer flex items-center">
            <Logo color="#3b82f6" />
            <h1 className="text-xl font-bold ms-2 font-mono text-blue-600 dark:text-blue-400">
              GoalFit
            </h1>
          </Link>
        </div>
        <div className="w-full max-w-sm my-auto">
          <div className="md:text-start text-center">
            <h2 className="text-2xl font-bold dark:text-gray-100">Connexion</h2>
            <div className="text-gray-500 text-sm mb-5 dark:text-gray-400">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register" className="underline dark:text-gray-300">
                S'inscrire
              </Link>
              .
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                placeholder="Mot de passe"
                required
                aria-label="Mot de passe"
                {...register("password")}
              />
            </div>
            <div>
              <button
                type="submit"
                className={`w-full p-3 text-white rounded-md ${
                  loading
                    ? "bg-gray-500"
                    : "bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
                }`}
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link
                href="/request-password-reset"
                className="text-sm text-blue-600 underline dark:text-blue-400"
              >
                Mot de passe oublié ?
              </Link>
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
          <p className="mt-4 text-center text-gray-500 text-xs dark:text-gray-400">
            En continuant, vous acceptez nos{" "}
            <a href="#" className="underline dark:text-gray-300">
              Conditions d'utilisation
            </a>{" "}
            et{" "}
            <a href="#" className="underline dark:text-gray-300">
              Politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
