'use client'

import jwt from 'jsonwebtoken'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { NavigateNext } from '@mui/icons-material'
import { Button, Sidebar, Card } from 'flowbite-react'
import { HiChartPie, HiViewBoards, HiUser, HiFire } from 'react-icons/hi'
import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'
var isToday = require('dayjs/plugin/isToday')

dayjs.extend(isToday)

export default function SidebarHome({ isSidebarOpen }) {
  const pathname = usePathname()
  const isActive = (path) => pathname === path
  const [user, setUser] = useState({})

  const sidebarItems = [
    {
      name: 'Dashboard',
      link: '/home',
      icon: HiChartPie,
    },
    {
      name: 'Repas',
      link: '/mealplan',
      icon: HiViewBoards,
    },
    {
      name: 'Exercice',
      link: '/workoutplan',
      icon: HiFire,
    },
    {
      name: 'Compte',
      link: '/profil',
      icon: HiUser,
    },
  ]

  const fetchUserData = async () => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
    const token = getCookie('token')

    if (!token) {
      router.push('/login')
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
      setUser(data)
    } catch (error) {
      console.error('Error fetching workout plans:', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 flex-col flex-shrink-0 hidden h-full pt-16 font-normal duration-75 lg:flex transition-width border-gray-200 dark:bg-gray-800 dark:border-gray-700 justify-items-center ${
          isSidebarOpen ? 'w-[74px]' : 'w-64'
        }`}
        aria-label="Sidebar"
      >
        <Sidebar
          className={`relative flex flex-col flex-1 min-h-0 pt-0 border-r [&>div]:bg-white ${
            isSidebarOpen ? 'w-[74px]' : 'w-full'
          }`}
        >
          <div className={`flex flex-col justify-between h-full`}>
            <Sidebar.Items
              className={`flex flex-col justify-between h-full justify-items-center ${
                isSidebarOpen ? 'w-12' : 'w-full'
              }`}
            >
              <Sidebar.ItemGroup className="border-0 pt-0">
                {sidebarItems.map((item) => (
                  <Sidebar.Item
                    key={item.link}
                    href={item.link}
                    icon={item.icon}
                    active={isActive(item.link)}
                    className={` ${isSidebarOpen ? 'pl-8' : ''}`}
                  >
                    <span className={` ${isSidebarOpen ? 'hidden' : ''}`}>
                      {item.name}
                    </span>
                  </Sidebar.Item>
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>

            {!isSidebarOpen && !!!user.stripeCustomerId ? (
              <Sidebar.CTA className="p-0">
                <Card
                  renderImage={() => (
                    <Image
                      className="max-h-32"
                      width={260}
                      height={100}
                      style={{
                        objectFit: 'cover',
                      }}
                      alt="pro"
                      quality={50}
                      priority={true}
                      src="https://cdn.dribbble.com/users/2071065/screenshots/15963154/media/6219d2910c46b43eeeec676f90ef9a9c.png"
                    />
                  )}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Passez à la version Pro pour plus de fonctionnalités et un
                    meilleur support !
                  </p>
                  <Button className="bg-blue-600 dark:bg-blue-400 flex content-center justify-center">
                    Passez Pro
                    <NavigateNext className="ml-2" fontSize="small" />
                  </Button>
                </Card>
              </Sidebar.CTA>
            ) : (
              <></>
            )}
          </div>
        </Sidebar>
      </aside>
    </>
  )
}
