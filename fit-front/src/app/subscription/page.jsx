'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function SubscriptionOfferPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    try {
      setIsLoading(true)
      const token = Cookies.get('token')
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/payment/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const sessionUrl = response.data.url
      window.location.href = sessionUrl
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFreeVersion = () => {
    router.push('/home')
  }

  return (
    <section className="py-24 relative">
      <div className="absolute h-[36.5rem] w-full top-0 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-manrope text-5xl text-center font-bold text-white mb-4">
            Plan de souscription
          </h2>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-8 lg:space-y-0 lg:items-center">
          <div className="group relative flex flex-col mx-auto w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-300 p-8 xl:p-12">
            <div className="border-b border-solid border-gray-200 pb-9 mb-9">
              <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex justify-center items-center transition-all duration-300 group-hover:bg-blue-600">
                <svg
                  className="w-6 h-6 text-blue-600 transition-all duration-300 group-hover:text-white"
                  viewBox="0 0 31 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.42418 27.2608V12.0502C8.42418 11.8031 8.22388 11.6028 7.97681 11.6028V11.6028C5.55154 11.6028 4.3389 11.6028 3.58547 12.3562C2.83203 13.1097 2.83203 14.3223 2.83203 16.7476V22.116C2.83203 24.5413 2.83203 25.754 3.58547 26.5074C4.3389 27.2608 5.55154 27.2608 7.97681 27.2608H8.42418ZM8.42418 27.2608L8.42418 22.5246C8.42418 15.9141 9.90241 9.38734 12.7507 3.42199V3.42199C13.2066 2.46714 14.4408 2.19891 15.2519 2.87841C16.4455 3.87836 17.135 5.35554 17.135 6.91266V8.08463C17.135 9.40562 18.2059 10.4765 19.5269 10.4765H24.0982C25.1518 10.4765 25.6786 10.4765 26.0736 10.6078C27.0571 10.9346 27.7484 11.8197 27.8273 12.8531C27.859 13.2681 27.7314 13.7792 27.4762 14.8014L25.3389 23.3623C24.8715 25.2346 24.6377 26.1707 23.9399 26.7158C23.242 27.2609 22.2771 27.2609 20.3473 27.2609L8.42418 27.2608Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-manrope text-2xl font-bold my-7 text-center text-blue-600">
                Starter
              </h3>
              <div className="flex items-center justify-center">
                <span className="font-manrope text-4xl font-medium text-gray-900">
                  0 €
                </span>
                <span className="text-xl text-gray-500 ml-3">|&nbsp; Mois</span>
              </div>
            </div>
            <ul className="mb-12 space-y-6 text-left text-lg text-gray-600 group-hover:text-gray-900">
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Plans d'entraînement de base</span>
              </li>
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Plans de repas de base</span>
              </li>
            </ul>
            <button
              onClick={handleFreeVersion}
              className="py-2.5 px-5 bg-blue-50 shadow-sm rounded-full transition-all duration-500 text-base text-blue-600 font-semibold text-center w-fit mx-auto group-hover:bg-blue-600 group-hover:text-white"
            >
              Commencer
            </button>
          </div>
          <div className="group relative flex flex-col mx-auto w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-300 p-8 xl:p-12">
            <div className="border-b border-solid border-gray-200 pb-9 mb-9">
              <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex justify-center items-center transition-all duration-300 group-hover:bg-blue-600">
                <svg
                  className="w-6 h-6 text-blue-600 transition-all duration-300 group-hover:text-white"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.8333 21.25C26.8333 20.6977 26.3856 20.25 25.8333 20.25C25.281 20.25 24.8333 20.6977 24.8333 21.25H26.8333ZM5.16667 21.25C5.16667 20.6977 4.71895 20.25 4.16667 20.25C3.61438 20.25 3.16667 20.6977 3.16667 21.25H5.16667ZM4.16667 8.85714H25.8333V6.85714H4.16667V8.85714ZM26.5 9.64286V16.7857H28.5V9.64286H26.5ZM3.5 16.7857V9.64286H1.5V16.7857H3.5ZM12.5 17.5714H4.16667V19.5714H12.5V17.5714ZM25.8333 17.5714H17.5V19.5714H25.8333V17.5714ZM1.5 16.7857C1.5 18.2581 2.63005 19.5714 4.16667 19.5714V17.5714C3.86234 17.5714 3.5 17.2858 3.5 16.7857H1.5ZM26.5 16.7857C26.5 17.2858 26.1377 17.5714 25.8333 17.5714V19.5714C27.37 19.5714 28.5 18.2581 28.5 16.7857H26.5ZM25.8333 8.85714C26.1377 8.85714 26.5 9.14282 26.5 9.64286H28.5C28.5 8.17045 27.37 6.85714 25.8333 6.85714V8.85714ZM4.16667 6.85714C2.63004 6.85714 1.5 8.17045 1.5 9.64286H3.5C3.5 9.14282 3.86234 8.85714 4.16667 8.85714V6.85714ZM24.8333 21.25V25.7143H26.8333V21.25H24.8333ZM24.1667 26.5H5.83333V28.5H24.1667V26.5ZM5.16667 25.7143V21.25H3.16667V25.7143H5.16667ZM5.83333 26.5C5.52901 26.5 5.16667 26.2143 5.16667 25.7143H3.16667C3.16667 27.1867 4.29671 28.5 5.83333 28.5V26.5ZM24.8333 25.7143C24.8333 26.2143 24.471 26.5 24.1667 26.5V28.5C25.7033 28.5 26.8333 27.1867 26.8333 25.7143H24.8333ZM12.5 3.5H17.5V1.5H12.5V3.5ZM18.1667 4.28571V7.85714H20.1667V4.28571H18.1667ZM11.8333 7.85714V4.28571H9.83333V7.85714H11.8333ZM17.5 3.5C17.8043 3.5 18.1667 3.78567 18.1667 4.28571H20.1667C20.1667 2.81331 19.0366 1.5 17.5 1.5V3.5ZM12.5 1.5C10.9634 1.5 9.83333 2.81331 9.83333 4.28571H11.8333C11.8333 3.78567 12.1957 3.5 12.5 3.5V1.5ZM14.1667 16H15.8333V14H14.1667V16ZM16.5 16.7857V20.3571H18.5V16.7857H16.5ZM15.8333 21.1429H14.1667V23.1429H15.8333V21.1429ZM13.5 20.3571V16.7857H11.5V20.3571H13.5ZM14.1667 21.1429C13.8623 21.1429 13.5 20.8572 13.5 20.3571H11.5C11.5 21.8295 12.63 23.1429 14.1667 23.1429V21.1429ZM16.5 20.3571C16.5 20.8572 16.1377 21.1429 15.8333 21.1429V23.1429C17.37 23.1429 18.5 21.8295 18.5 20.3571H16.5ZM15.8333 16C16.1377 16 16.5 16.2857 16.5 16.7857H18.5C18.5 15.3133 17.37 14 15.8333 14V16ZM14.1667 14C12.63 14 11.5 15.3133 11.5 16.7857H13.5C13.5 16.2857 13.8623 16 14.1667 16V14Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="font-manrope text-2xl font-bold my-7 text-center text-blue-600">
                Pro
              </h3>
              <div className="flex items-center justify-center">
                <span className="font-manrope text-4xl font-medium text-gray-900">
                  29,99 €
                </span>
                <span className="text-xl text-gray-500 ml-3">|&nbsp; Mois</span>
              </div>
            </div>
            <ul className="mb-12 space-y-6 text-left text-lg text-gray-600 group-hover:text-gray-900">
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Plans d'entraînement personnalisés</span>
              </li>
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Plans de repas personnalisés</span>
              </li>
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Outils de suivi des progrès </span>
              </li>
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Support 24/7</span>
              </li>
              <li className="flex items-center space-x-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Accès à la communauté</span>
              </li>
            </ul>
            <button
              onClick={handleSubscribe}
              className="py-2.5 px-5 bg-blue-50 shadow-sm rounded-full transition-all duration-500 text-base text-blue-600 font-semibold text-center w-fit mx-auto group-hover:bg-blue-600 group-hover:text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Souscrire'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
