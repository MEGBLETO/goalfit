"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import Logo from "../../../components/logo";

export default function PaymentFailedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/account");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col items-center">
        <div className="p-4 bg-gray-100 rounded-full">
          <Logo width={100} height={100} color="#000" />
        </div>
        <FaTimesCircle className="text-red-500 text-7xl mb-4" />
        <h2 className="text-3xl font-bold mb-2">Échec du Paiement</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Votre paiement n'a pas pu être traité.
        </p>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Vous serez redirigé vers votre compte sous peu.
        </p>
      </div>
    </div>
  );
}
