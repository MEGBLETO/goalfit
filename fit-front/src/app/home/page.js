"use client";
import jwt from 'jsonwebtoken'
import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
)

import { Button } from 'flowbite-react'
import { usePathname, useRouter } from 'next/navigation'
import {
  MdAccessTimeFilled,
  MdLocalFireDepartment,
  MdLock,
} from 'react-icons/md'
import { FaPlay } from 'react-icons/fa6'
import dayjs from 'dayjs'
import Skeleton from '@mui/material/Skeleton'
var isToday = require('dayjs/plugin/isToday')

dayjs.extend(isToday)

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [currentMealData, setCurrentMealData] = useState(null)
  const [currentWorkoutData, setCurrentWorkoutData] = useState(null)
  const [currentMealImage, setCurrentMealImage] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)
  const [totalFat, setTotalFat] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [totalCarbo, setTotalCarbo] = useState(0)

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  
  const fetchUserData = async () => {
    const token = getCookie('token')
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const decoded = jwt.decode(token)

      if (!decoded || !decoded.userId) {
        throw new Error('Invalid token or no userId found')
      }

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
      setUser(data)

      if (data && data.mealPlans) {
        const mealForDate = data.mealPlans.find((meal) =>
          dayjs(meal.day).isToday(dayjs())
        )
        setCurrentMealData(mealForDate || null)
        if (mealForDate) {
          fetchMealPlans(mealForDate.afternoonMealId)
        }
      }

      if (data && data.workoutPlans) {
        const workoutForDate = data.workoutPlans.find((workout) =>
          dayjs(workout.day).isToday(dayjs())
        )
        if (workoutForDate) {
          fetchWorkoutPlans(workoutForDate.id)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }


  const fetchMealPlans = async (id) => {
    const token = getCookie('token')

    try {
      const response = await fetch('http://localhost:5001/bdd/meal/' + id, {
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
      setCurrentMealData(data)
      if (data) {
        fetchMealImage(data.afternoonMeal.name.split(' ').slice(0, 3).join(' '))
      }

      const calories =
        data.morningMeal.nutrition.calories +
        data.afternoonMeal.nutrition.calories +
        data.eveningMeal.nutrition.calories
      setTotalCalories(calories)

      const fat =
        parseInt(data.morningMeal.nutrition.fat) +
        parseInt(data.afternoonMeal.nutrition.fat) +
        parseInt(data.eveningMeal.nutrition.fat)
      setTotalFat(fat)

      const protein =
        parseInt(data.morningMeal.nutrition.protein) +
        parseInt(data.afternoonMeal.nutrition.protein) +
        parseInt(data.eveningMeal.nutrition.protein)
      setTotalProtein(protein)

      const carbohydrates =
        parseInt(data.morningMeal.nutrition.carbohydrates) +
        parseInt(data.afternoonMeal.nutrition.carbohydrates) +
        parseInt(data.eveningMeal.nutrition.carbohydrates)
      setTotalCarbo(carbohydrates)
    } catch (error) {
      console.error('Error fetching meal plans:', error)
    }
  }

  const fetchMealImage = async (foodname) => {
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}?query=${encodeURIComponent(foodname)}&client_id=${process.env.UNSPLASH_API_KEY}&lang=fr`
      )
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const imageUrl = data.results[0].urls.regular
        setCurrentMealImage(imageUrl)
      }
    } catch (error) {
      console.error('Error fetching image:', error)
    }
  }

  const fetchWorkoutPlans = async (id) => {
    const token = getCookie('token')
    if (!token) {
      console.error('No token found, please login.')
      return
    }
    try {
      const response = await fetch('http://localhost:5001/bdd/workout/' + id, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch workout plans')
      }
      const data = await response.json()
      setCurrentWorkoutData(data.workouts[0])
    } catch (error) {
      console.error('Error fetching workout plans:', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const gradient = (ctx) => {
    if (!ctx?.chart?.ctx) return

    const gradientStroke = ctx.chart.ctx.createLinearGradient(0, 230, 0, 50)
    gradientStroke.addColorStop(1, 'rgba(255, 255, 255, 0.8)')
    gradientStroke.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)')
    gradientStroke.addColorStop(0, 'rgba(255, 255, 255, 0)')

    return gradientStroke
  }

  function logisticGrowth(
    currentWeight,
    targetWeight,
    months,
    k = 1,
    midpoint = 3
  ) {
    const weightData = []
    for (let t = 0; t < months; t++) {
      const progress =
        currentWeight +
        (targetWeight - currentWeight) / (1 + Math.exp(-k * (t - midpoint)))
      weightData.push(progress)
    }
    return weightData
  }


  
  const currentWeight = 95
  const targetWeight = 87
  const progressMonths = 6

  const predictedWeights = logisticGrowth(
    currentWeight,
    targetWeight,
    progressMonths,
    1.2,
    progressMonths / 2
  )

  const data = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Poids',
        data: predictedWeights,
        borderColor: '#fbfbfb',
        backgroundColor: (ctx) => gradient(ctx),
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#1c64f2',
        pointBorderColor: '#fbfbfb',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          borderDash: [5, 5],
        },
        ticks: {
          display: true,
          color: '#fbfbfb',
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          borderDash: [5, 5],
        },
        ticks: {
          display: true,
          color: '#fbfbfb',
          padding: 20,
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  }

  return (
    <div className="min-h-fit">
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-md bg-white flex flex-col lg:flex-row items-center justify-between px-10 py-4 my-8 md:py-6 xl:py-8 dark:bg-gray-800">
            <div className="w-full lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0">
              <h2 className="font-manrope text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 text-center lg:text-left dark:text-gray-400">
                Consommation du jour
              </h2>
            </div>
            <div className="w-full lg:w-2/3 xl:w-3/4 lg:ml-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="block shrink">
                  {user ? (
                    <>
                      <div className="font-manrope font-bold text-xl md:text-2xl lg:text-3xl text-blue-600 mb-3 text-center lg:text-left">
                        {totalProtein}
                        <span className="text-sm">g</span>
                      </div>
                      <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400 text-sm">
                        Protéines
                      </span>
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width={80} height={40} />
                  )}
                </div>

                <div className="block shrink">
                  {user ? (
                    <>
                      <div className="font-manrope font-bold text-xl md:text-2xl lg:text-3xl text-blue-600 mb-3 text-center lg:text-left">
                        {totalCarbo}
                        <span className="text-sm">g</span>
                      </div>
                      <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400 text-sm">
                        Glucides
                      </span>
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width={80} height={40} />
                  )}
                </div>

                <div className="block shrink">
                  {user ? (
                    <>
                      <div className="font-manrope font-bold text-xl md:text-2xl lg:text-3xl text-blue-600 mb-3 text-center lg:text-left">
                        {totalFat}
                        <span className="text-sm">g</span>
                      </div>
                      <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400 text-sm">
                        Lipides
                      </span>
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width={80} height={40} />
                  )}
                </div>

                <div className="block shrink">
                  {user ? (
                    <>
                      <div className="font-manrope font-bold text-xl md:text-2xl lg:text-3xl text-blue-600 mb-3 text-center lg:text-left">
                        {totalCalories}
                      </div>
                      <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400 text-sm">
                        Total de Calories
                      </span>
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width={80} height={40} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 grid-cols-1 gap-4 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full mt-0 lg:col-span-3 relative">
          <div className="relative flex flex-col min-w-0 break-words bg-blue-600 text-white dark:bg-slate-850 border-0 bg-clip-border z-20 rounded-2xl">
            <div className="p-6 pt-4 pb-0 border-b-0 rounded-t-2xl mb-0 border-black/12.5">
              <h5 className="font-semibold text-lg">Objectif de poids</h5>
              <div className="p-4 flex justify-between items-center max-w-md">
                <div className="text-center">
                  {user ? (
                    <>
                      <div className="text-lg font-bold">
                        {currentWeight} <span className="text-sm">kg</span>
                      </div>
                      <div className="text-sm">Actuel</div>
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width={80} height={40} />
                  )}
                </div>
                <div className="text-center">
                  {user ? (
                    <>
                      <div className="text-lg font-bold">
                        {targetWeight} <span className="text-sm">kg</span>
                      </div>
                      <div className="text-sm">Objectif</div>
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width={80} height={40} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex-auto p-4">
              {user ? (
                <div>
                  <Line options={options} data={data} height="300" />
                </div>
              ) : (
                <Skeleton variant="rectangular" width="100%" height={300} />
              )}
            </div>
          </div>

          {!!!user?.stripeCustomerId && (
            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-20 backdrop-blur-md flex justify-center items-center rounded-2xl z-30">
              <Button href="/subscription">
                <MdLock className="mr-2 h-5 w-5" />
                VIP
              </Button>
            </div>
          )}
        </div>

        {currentMealData?.eveningMeal && currentMealImage ? (
          <div className="w-full h-full mt-6 lg:mt-0 min-h-[300px] lg:col-span-2">
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <a href="/mealplan" className="group relative block h-full">
                <div className="relative h-full">
                  <img
                    src={currentMealImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10"></div>

                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <div className="relative inline-block text-lg font-bold text-transparent">
                    <span className="absolute inset-0 text-black stroke-text">
                      {currentMealData.eveningMeal.name}
                    </span>
                    <span className="relative text-white">
                      {currentMealData.eveningMeal.name}
                    </span>
                  </div>

                  <span className="mt-3 bg-blue-600 px-4 py-2 text-xs rounded-lg font-medium uppercase tracking-wide text-white flex items-center">
                    <span className="mr-2">Voir plus</span>
                    <svg
                      className="transition-all duration-500 group-hover:translate-x-1"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.25 9L14.25 9M10.5 13.5L14.4697 9.53033C14.7197 9.28033 14.8447 9.15533 14.8447 9C14.8447 8.84467 14.7197 8.71967 14.4697 8.46967L10.5 4.5"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        ) : (
          <Skeleton
            className="lg:col-span-2 w-full h-full min-h-[300px] rounded-2xl"
            variant="rectangular"
          />
        )}
      </div>

      <div className="grid lg:grid-cols-5 grid-cols-1 gap-4 mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {currentWorkoutData ? (
          <div className="col-span-1 lg:col-span-2">
            <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40">
              <img
                src="https://cdn.dribbble.com/users/2417352/screenshots/16943740/media/2030e4e3a40d20e4330b1300d34e399c.png?resize=1200x900&vertical=centera"
                alt="University of Southern California"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <h3 className="z-10 mt-3 text-xl font-bold text-white">
                {currentWorkoutData.name}
              </h3>
              <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <div className="inline-flex items-center">
                  <MdAccessTimeFilled className="mr-1 h-5 w-5 text-blue-500" />
                  <p className="text-xs">{currentWorkoutData.duration}</p>
                </div>
                <div className="inline-flex items-center ml-4">
                  <MdLocalFireDepartment className="mr-1 h-5 w-5 text-blue-500" />
                  <p className="text-xs">
                    Intensité: {currentWorkoutData.intensity}
                  </p>
                </div>
              </div>
              <a
                href="/workoutplan"
                className="z-10 absolute bottom-8 right-5 flex cursor-pointer align-middle none center h-12 max-h-[48px] w-12 max-w-[48px] rounded-full bg-blue-600 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
              >
                <FaPlay className="text-2xl mx-auto self-center "></FaPlay>
              </a>
            </article>
          </div>
        ) : (
          <Skeleton
            variant="rectangular"
            className="col-span-1 lg:col-span-2 h-full ounded-2xl"
          />
        )}
        <div className="col-span-1 lg:col-span-3"></div>
      </div>
    </div>
  )
}
