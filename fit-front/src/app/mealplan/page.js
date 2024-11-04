'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Tabs, List, Button } from 'flowbite-react'
import {
  MdOutlineWbSunny,
  MdAccessTimeFilled,
  MdLocalFireDepartment,
} from 'react-icons/md'
import { HiOutlineArrowRight, HiCheck } from 'react-icons/hi'
import { PiMoonFill, PiCloudMoonFill } from 'react-icons/pi'
import Image from 'next/image'
import Skeleton from '@mui/material/Skeleton'
import confetti from 'canvas-confetti'

// API Endpoints (Dynamic URLs based on environment variable)
const MEAL_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/meal`
const MEAL_DEFAULT_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/meal/default`
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos'
const UNSPLASH_API_KEY = '8Rm4rBtXqVlW7LyutI1Y9IsMDC5ovu-OkHqq1NxuCyA' // Replace with your actual Unsplash API Key

const MealPlan = () => {
  const [currentDate, setCurrentDate] = useState(dayjs().locale('fr'))
  const [dates, setDates] = useState(generateDates(dayjs().locale('fr')))
  const tabsRef = useRef(null)
  const [activeTab, setActiveTab] = useState(0)
  const [currentMealData, setCurrentMealData] = useState(null)
  const [mealImages, setMealImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [isDone, setIsDone] = useState(false)
  const [mealPlans, setMealPlans] = useState([])

  // Helper function to get token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  // Fetch meal plans based on user subscription status
  const fetchMealPlans = async () => {
    const token = getCookie('token')
    if (!token) {
      console.error('No token found, please login.')
      return
    }
    try {
      // Fetch user data to check subscription status
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bdd/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await userResponse.json()

      // Determine which meal plan API to call based on subscription status
      const mealApiUrl = userData.stripeCustomerId ? MEAL_API_URL : MEAL_DEFAULT_API_URL;

      const response = await fetch(mealApiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch meal plans')
      }

      const data = await response.json()
      setMealPlans(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching meal plans:', error)
      setLoading(false)
    }
  }

  // Generate an array of dates around a target date
  function generateDates(targetDate) {
    const datesArray = []
    for (let i = -3; i <= 3; i++) {
      datesArray.push(targetDate.add(i, 'day'))
    }
    return datesArray
  }

  // Check if a meal plan exists for a specific date
  const isMealAvailable = (date) => {
    return mealPlans.some((meal) => dayjs(meal.day).isSame(date, 'day'))
  }

  // Fetch image from Unsplash based on the food name
  const fetchMealImage = async (foodname, mealType) => {
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}?query=${encodeURIComponent(foodname)}&client_id=${UNSPLASH_API_KEY}&lang=fr`
      )
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const imageUrl = data.results[0].urls.regular
        setMealImages((prevImages) => ({
          ...prevImages,
          [mealType]: imageUrl,
        }))
      }
    } catch (error) {
      console.error('Error fetching image:', error)
    }
  }

  // Fetch meal plans when component mounts
  useEffect(() => {
    setLoading(true)
    fetchMealPlans()
  }, [])

  // Update the current meal plan based on the selected date
  useEffect(() => {
    const mealForDate = mealPlans.find((meal) =>
      dayjs(meal.day).isSame(currentDate, 'day')
    )
    setCurrentMealData(mealForDate || null)
    setMealImages({})

    if (mealForDate) {
      const mealTypes = ['morningMeal', 'afternoonMeal', 'eveningMeal']
      mealTypes.forEach((mealType) => {
        const meal = mealForDate[mealType]
        if (meal) {
          fetchMealImage(meal.name.split(' ').slice(0, 3).join(' '), mealType)
        }
      })
    }
  }, [currentDate, mealPlans])

  const handleClick = (date) => {
    if (isMealAvailable(date)) {
      setCurrentDate(date)
      setDates(generateDates(date))
    }
  }

  const handleNextMeal = () => {
    const mealKeys = ['morningMeal', 'afternoonMeal', 'eveningMeal']
    const totalMeals = mealKeys.length

    if (activeTab < totalMeals - 1) {
      const nextTab = activeTab + 1
      tabsRef.current?.setActiveTab(nextTab)
      setActiveTab(nextTab)
    } else if (activeTab === totalMeals - 1) {
      handleConfetti()
      setIsDone(true)
    }
  }

  const formatDayWithoutDot = (date) => {
    const formattedDay = date.format('ddd')
    return formattedDay.replace(/\.$/, '')
  }

  const getTotalDuration = (mealType) => {
    return currentMealData[mealType]?.steps.length * 5 || 0
  }

  const handleConfetti = () => {
    confetti({
      particleCount: 500,
      spread: 120,
      origin: { y: 0.6 },
    })
  }

  return (
    <div>
      {loading ? (
        <div className="p-4">
          <Skeleton variant="rectangular" width="100%" height={400} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </div>
      ) : (
        <div>
          <div className="flex justify-center mx-auto pt-4 pb-2 px-2 md:mx-12 mb-6 overflow-hidden">
            {dates.map((date, index) => {
              const mealAvailable = isMealAvailable(date)
              return (
                <motion.div
                  key={index}
                  className={`flex group relative mx-1 transition-all duration-300 justify-center w-14 ${
                    date.isSame(currentDate, 'day')
                      ? 'bg-blue-600 shadow-md'
                      : mealAvailable
                        ? 'hover:bg-blue-500 hover:shadow-md cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                  } rounded-full dark:bg-gray-700`}
                  onClick={() => handleClick(date)}
                  aria-label={`Sélectionner ${date.format('dddd, MMM D')}`}
                  initial={{ opacity: 0.7, scale: 0.9 }}
                  animate={{
                    opacity: date.isSame(currentDate, 'day') ? 1 : 0.7,
                    scale: date.isSame(currentDate, 'day') ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center px-3 py-3">
                    <div className="text-center">
                      <p
                        className={`text-sm ${
                          date.isSame(currentDate, 'day')
                            ? 'text-gray-100 font-semibold'
                            : mealAvailable
                              ? 'text-gray-900 group-hover:text-gray-100 group-hover:font-semibold dark:text-gray-300'
                              : 'text-gray-500 dark:text-gray-500'
                        } transition-all duration-300`}
                      >
                        {formatDayWithoutDot(date)}
                      </p>
                      <p
                        className={`mt-2 ${
                          date.isSame(currentDate, 'day')
                            ? 'text-blue-600 font-bold rounded-full bg-white p-1 w-8'
                            : mealAvailable
                              ? 'text-gray-900 group-hover:text-gray-100 group-hover:font-bold dark:text-gray-300'
                              : 'text-gray-500 dark:text-gray-500'
                        } transition-all duration-300`}
                      >
                        {date.format('D')}
                      </p>
                    </div>
                  </div>
                  {date.isSame(currentDate, 'day') && (
                    <span className="flex h-1 w-1 absolute bottom-1.5">
                      <span className="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-blue-400"></span>
                      <span className="relative inline-flex rounded-full h-1 w-1 bg-blue-100"></span>
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="mx-6 sm:mx-6 lg:mx-8">
            {currentMealData ? (
              <Tabs
                aria-label="Meal Plan Tabs"
                ref={tabsRef}
                activeTab={activeTab}
                onActiveTabChange={(tab) => setActiveTab(tab)}
              >
                {['morningMeal', 'afternoonMeal', 'eveningMeal'].map(
                  (mealType, index) => (
                    <Tabs.Item
                      key={index}
                      title={
                        mealType === 'morningMeal'
                          ? 'Matin'
                          : mealType === 'eveningMeal'
                            ? 'Soir'
                            : 'Après-midi'
                      }
                      icon={
                        mealType === 'morningMeal'
                          ? MdOutlineWbSunny
                          : mealType === 'eveningMeal'
                            ? PiMoonFill
                            : PiCloudMoonFill
                      }
                    >
                      <div className="px-6 pt-6 rounded-2xl bg-white pb-6 dark:bg-gray-900">
                        <div className="relative w-full h-[300px] md:h-[400px]">
                          {mealImages[mealType] ? (
                            <div>
                              <Image
                                src={mealImages[mealType]}
                                alt={`Image de ${currentMealData[mealType].name}`}
                                fill={true}
                                sizes="100%, 100%"
                                quality={80}
                                priority={true}
                                className="rounded-xl mx-auto object-cover"
                              />
                            </div>
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width="100%"
                              height={400}
                            />
                          )}
                          <div className="absolute shadow rounded-xl opacity-90 w-72 h-16 bg-white dark:bg-gray-800 left-1/2 bottom-4 transform -translate-x-1/2 flex justify-around content-center text-sm text-gray-600 dark:text-gray-400">
                            <div className="inline-flex items-center">
                              <MdAccessTimeFilled className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" />
                              <p>{getTotalDuration(mealType)} min</p>
                            </div>
                            <div className="inline-flex items-center">
                              <MdLocalFireDepartment className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" />
                              <p>
                                {currentMealData[mealType]?.nutrition.calories}{' '}
                                Kcal
                              </p>
                            </div>
                            <div className="inline-flex items-center">
                              <Button
                                pill
                                color="blue"
                                disabled={isDone}
                                onClick={handleNextMeal}
                              >
                                {activeTab === 2 ? (
                                  <HiCheck className="h-6 w-6" />
                                ) : (
                                  <HiOutlineArrowRight className="h-6 w-6" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Display meal details */}
                        <h1 className="font-manrope font-semibold text-3xl mt-8 text-blue-600 dark:text-blue-300">
                          {currentMealData[mealType]?.name}
                        </h1>

                        <section className="mt-8">
                          <h3 className="font-manrope text-2xl text-blue-600 dark:text-blue-300">
                            Ingrédients
                          </h3>
                          <List className="text-gray-800 dark:text-gray-400 mt-2">
                            {currentMealData[mealType]?.ingredients.map(
                              (ingredient, i) => (
                                <List.Item key={i}>{ingredient}</List.Item>
                              )
                            )}
                          </List>
                        </section>

                        <section className="mt-8">
                          <h3 className="font-manrope text-2xl text-blue-600 dark:text-blue-300">
                            Instructions
                          </h3>
                          <List
                            ordered
                            className="text-gray-800 dark:text-gray-400 mt-2"
                          >
                            {currentMealData[mealType]?.steps.map(
                              (instruction, i) => (
                                <List.Item key={i}>{instruction}</List.Item>
                              )
                            )}
                          </List>
                        </section>

                        <section className="mt-8">
                          <h3 className="font-manrope text-2xl text-blue-600 dark:text-blue-300">
                            Informations Nutritionnelles
                          </h3>
                          <table className="min-w-full">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-400">
                                  Calories
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-300">
                                  {
                                    currentMealData[mealType]?.nutrition
                                      .calories
                                  }{' '}
                                  Kcal
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-400">
                                  Protéines
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-300">
                                  {currentMealData[mealType]?.nutrition.protein}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-400">
                                  Glucides
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-300">
                                  {
                                    currentMealData[mealType]?.nutrition
                                      .carbohydrates
                                  }
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-400">
                                  Lipides
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-300">
                                  {currentMealData[mealType]?.nutrition.fat}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </section>
                      </div>
                    </Tabs.Item>
                  )
                )}
              </Tabs>
            ) : (
              <p>Aucun plan de repas disponible pour la date sélectionnée.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlan
