import React from "react";
import { Container } from "../Container";

export const Pricing = () => {
  return (
    <Container>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          {/* Plan Pro */}
          <div className="rounded-2xl border border-blue-600 p-6 shadow-sm ring-1 ring-blue-600 sm:order-last sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                Pro
                <span className="sr-only"> Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  {" "}
                  29,99 €{" "}
                </strong>

                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  /mois
                </span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700">
                  {" "}
                  Plans d'entraînement personnalisés{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Plans de repas personnalisés </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Outils de suivi des progrès </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Support 24/7 </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Accès à la communauté </span>
              </li>
            </ul>

            <a
              href="#"
              className="mt-8 block rounded-full border border-blue-600 bg-blue-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 hover:ring-1 hover:ring-blue-700 focus:outline-none focus:ring active:text-blue-600"
            >
              Commencer
            </a>
          </div>

          {/* Plan Starter */}
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                Starter
                <span className="sr-only"> Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-200">
                  {" "}
                  Gratuit{" "}
                </strong>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Plans d'entraînement de base </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Plans de repas de base </span>
              </li>
            </ul>

            <a
              href="/register"
              className="mt-8 block rounded-full border border-blue-600 bg-white px-12 py-3 text-center text-sm font-medium text-blue-600 hover:ring-1 hover:ring-blue-600 focus:outline-none focus:ring active:text-blue-600"
            >
              Commencer
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};
