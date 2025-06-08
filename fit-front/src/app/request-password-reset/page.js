'use client';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../../components/logo";

export default function RequestPasswordReset() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/request-password-reset`,
        data
      );
      if (response.status === 200) {
        toast.success("An email has been sent to your account");
        setTimeout(() => {
          router.push("/password-reset-confirmation");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to request password reset");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      toast.error(error.response?.data?.message || "An error occurred while requesting password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-screen">
      <ToastContainer />
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
        <div className="md:hidden flex justify-start items-center py-2 w-full">
          <Logo color="#1c64f2" />
          <h1 className="text-xl font-bold ms-2 font-mono text-blue-600 dark:text-blue-400">
            GoalFit
          </h1>
        </div>
        <div className="w-full max-w-sm my-auto">
          <div className="md:text-start text-center">
            <h2 className="text-2xl font-bold dark:text-gray-100">Request Password Reset</h2>
            <div className="text-gray-500 text-sm mb-5 dark:text-gray-400">
              Enter your email to receive a password reset link.
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
                placeholder="name@example.com"
                required
                aria-label="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className={`w-full p-3 text-white rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400'}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
