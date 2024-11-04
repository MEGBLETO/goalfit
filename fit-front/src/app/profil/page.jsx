'use client'
import { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import jwt from 'jsonwebtoken'
import { useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import dayjs from 'dayjs'

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const ProfilPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const { register, handleSubmit, setValue } = useForm()
  const [badgeColor, setBadgeColor] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getCookie('token')
      if (!token) {
        setError('User is not authenticated')
        setLoading(false)
        return
      }
      try {
        const decoded = jwt.decode(token)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/user/${decoded.userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()

        // Check if subscription exists before trying to access it
        if (data.subscription) {
          data.subscription.status === 'ACTIVE'
            ? setBadgeColor('bg-green-100 text-green-800')
            : setBadgeColor('bg-red-100 text-red-800')
        } else {
          setBadgeColor('bg-gray-100 text-gray-800') // Default color for no subscription
        }

        // Set form values
        setValue('name', data.name || '')
        setValue('surname', data.surname || '')
        setValue('age', data.age || '')
        setValue('weight', data.weight || '')
        setValue('height', data.height || '')
        setValue('contact', data.contact || '')
        setValue('email', data.email || '')

        // For the Repas & Fitness section
        setValue('healthConsiderations', data.healthConsiderations || '')
        setValue('fitnessLevel', data.fitnessLevel || '')
        setValue('dietaryPreferences', data.dietaryPreferences || '')

        setUser(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [setValue])

  const handleUnsubscription = async () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir vous désabonner ?'
    )
    if (confirmed) {
      try {
        const token = getCookie('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payment/payment/cancel-subscription/${user.subscription.stripeSubscriptionId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!response.ok) {
          throw new Error('Failed to update user data')
        }
      } catch (error) {
        console.error('Error updating user data:', error)
        setError('Failed to update user data')
      }
    }
  }

  const onSubmit = async (formData) => {
    const formattedData = {
      ...formData,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
    }

    try {
      const token = getCookie('token')
      const decoded = jwt.decode(token)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/user/${decoded.userId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update user data')
      }

      const updatedData = await response.json()
      setUser(updatedData)
      setSuccess(true)
      setShowButton(false)

      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      console.error('Error updating user data:', error)
      setError('Failed to update user data')
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }

  const handleInputChange = () => {
    setShowButton(true)
  }

  if (loading) {
    return <div style={{ padding: '15px' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ padding: '15px', color: 'red' }}>Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Profil
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Tabs className="w-full">
          <TabList className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
            <Tab className="px-6 py-2 cursor-pointer focus:outline-none transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 active:bg-gray-100 dark:active:bg-gray-700">
              Infos Perso
            </Tab>
            <Tab className="px-6 py-2 cursor-pointer focus:outline-none transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 active:bg-gray-100 dark:active:bg-gray-700">
              Souscription
            </Tab>
            <Tab className="px-6 py-2 cursor-pointer focus:outline-none transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 active:bg-gray-100 dark:active:bg-gray-700">
              Repas & Fitness
            </Tab>
          </TabList>

          {/* Personal Information Section */}
          <TabPanel>
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              Infos Perso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom :
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    {...register('name')}
                    onChange={handleInputChange}
                    defaultValue={user?.name}
                  />
                  <FiEdit className="absolute top-2 right-2 text-blue-500 cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prénom :
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    {...register('surname')}
                    onChange={handleInputChange}
                    defaultValue={user?.surname}
                  />
                  <FiEdit className="absolute top-2 right-2 text-blue-500 cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Âge :
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('age')}
                  onChange={handleInputChange}
                  defaultValue={user?.age}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Poids (kg) :
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('weight')}
                  onChange={handleInputChange}
                  defaultValue={user?.weight}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Taille (cm) :
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('height')}
                  onChange={handleInputChange}
                  defaultValue={user?.height}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Téléphone :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('contact')}
                  onChange={handleInputChange}
                  defaultValue={user?.contact}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('email')}
                  defaultValue={user?.email}
                  readOnly
                />
              </div>
            </div>

            {showButton && (
              <button
                type="submit"
                className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                Enregistrer
              </button>
            )}
          </TabPanel>

          {/* Subscription Section */}
          <TabPanel>
            <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                Détails de la Souscription
              </h2>

              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                    <strong>Statut :</strong>
                  </p>
                  <div className="inline-flex items-center space-x-2">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${badgeColor}`}
                    >
                      {user?.subscription ? (
                        user.subscription.status === 'ACTIVE' ? (
                          <>
                            <svg
                              className="w-4 h-4 inline-block mr-1 text-green-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Actif
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 inline-block mr-1 text-red-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Inactif
                          </>
                        )
                      ) : (
                        'Aucun abonnement'
                      )}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                    <strong>Date de début :</strong>{' '}
                    {user?.subscription?.startDate
                      ? dayjs(user.subscription.startDate).format('YYYY/MM/DD')
                      : 'N/A'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                    <strong>Date de fin :</strong>{' '}
                    {user?.subscription?.endDate
                      ? dayjs(user.subscription.endDate).format('YYYY/MM/DD')
                      : 'N/A'}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="button"
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300"
                    onClick={handleUnsubscription}
                  >
                    Se désabonner
                  </button>
                </div>
              </div>
            </div>
          </TabPanel>
          {/* Meals & Fitness Section */}
          <TabPanel>
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              Repas & Fitness
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Etat de santé :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('healthConsiderations')}
                  onChange={handleInputChange}
                  defaultValue={user?.healthConsiderations}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Niveau de fitness :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('fitnessLevel')}
                  onChange={handleInputChange}
                  defaultValue={user?.fitnessLevel}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Préférences alimentaires :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  {...register('dietaryPreferences')}
                  onChange={handleInputChange}
                  defaultValue={user?.dietaryPreferences}
                />
              </div>
            </div>

            {showButton && (
              <button
                type="submit"
                className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                Enregistrer
              </button>
            )}
          </TabPanel>
        </Tabs>

        {success && (
          <p className="mt-4 text-green-500">
            Les modifications ont été enregistrées avec succès.
          </p>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  )
}

export default ProfilPage
