'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../components/logo'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'

import {
  Notifications,
  DarkMode,
  LightMode,
  NavigateNext,
} from '@mui/icons-material'
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Badge,
  IconButton,
} from '@mui/material'
import jwt from 'jsonwebtoken'

import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Button,
  Drawer,
  Sidebar,
  TextInput,
  Card,
} from 'flowbite-react'
import {
  HiChartPie,
  HiViewBoards,
  HiUser,
  HiFire,
  HiCog,
  HiViewGrid,
  HiCurrencyDollar,
} from 'react-icons/hi'
import { usePathname, useRouter } from 'next/navigation'

import Cookies from 'js-cookie'

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
}))
var isToday = require('dayjs/plugin/isToday')

dayjs.extend(isToday)

const Navbar = ({ handleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState({})

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    handleSidebar(!isSidebarOpen)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path) => pathname === path


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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleCloseDrawer = () => setIsSidebarOpen(false)

  const fetchUserData = async () => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
    const token = getCookie('token')

    if (!token) {
      router.push('/login')
      // setLoading(false)
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

  const signOut = () => {
    Cookies.remove('token')
    router.push('/login')
  }

  return (
    <>
      <nav className="fixed z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                id="toggleSidebarMobile"
                aria-expanded={isSidebarOpen}
                aria-controls="sidebar"
                className="p-2 mx-1 text-gray-600 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <div>
                    <svg
                      id="toggleSidebarMobileClose"
                      className="w-6 h-6 lg:hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      id="toggleSidebarMobileHamburger"
                      className="w-6 h-6 lg:flex hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <svg
                    id="toggleSidebarMobileHamburger"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <Link href="/" className="flex ml-2 md:mr-24">
                <span className="flex items-center space-x-2 text-2xl font-medium text-blue-600 dark:text-blue-400">
                  <span>
                    <Logo
                      color="#1c64f2"
                      width="50"
                      alt="N"
                      height="50"
                      className="w-8"
                    />
                  </span>
                  <h1 className="text-xl font-bold ms-2 font-mono">GoalFit</h1>
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              {/* Notifications Dropdown */}
              <IconButton
                className="text-gray-500 dark:text-gray-400"
                id="notification-button"
                aria-controls={open ? 'notification-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Badge badgeContent={2} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <Menu
                id="notification-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  style: {
                    width: '360px',
                  },
                }}
              >
                <MenuItem disabled>
                  <Typography variant="h6" align="center">
                    Notifications
                  </Typography>
                </MenuItem>

                <MenuItem>
                  <div>
                    <Typography variant="body2">
                      Compléter votre profil
                    </Typography>
                    <span className="text-xs text-blue-600">10:33</span>
                  </div>
                </MenuItem>

                <MenuItem>
                  <div>
                    <Typography variant="body2">
                      Nouvelle simulation disponible
                    </Typography>
                    <span className="text-xs text-blue-600">hier</span>
                  </div>
                </MenuItem>

                <MenuItem>
                  <Typography variant="body2" align="center" color="primary">
                    View All
                  </Typography>
                </MenuItem>
              </Menu>

              {/* Theme Button */}
              <IconButton
                className="text-gray-500 dark:text-gray-400"
                onClick={toggleTheme}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              {/* Profile Dropdown */}
              <Dropdown
                label={
                  user.stripeCustomerId ? (
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <SmallAvatar
                          alt="Remy Sharp"
                          src="https://img.icons8.com/?size=100&id=104236&format=png&color=000000"
                        />
                      }
                    >
                      <Avatar
                        alt="Travis Howard"
                        src="https://avatar.iran.liara.run/public/33"
                      />
                    </Badge>
                  ) : (
                    <Avatar
                      alt="Travis Howard"
                      src="https://avatar.iran.liara.run/public/33"
                    />
                  )
                }
                arrowIcon={false}
                inline
              >
                <DropdownHeader className="mb-2">
                  <span className="block text-sm">
                    {user.name + ' ' + user.surname}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </DropdownHeader>
                <Dropdown.Item icon={HiViewGrid} as="a" href="/home">
                  Dashboard
                </Dropdown.Item>
                <Dropdown.Item icon={HiCog} as="a" href="/profil">
                  Profile
                </Dropdown.Item>
                <DropdownItem
                  className="border-t mt-2"
                  onClick={() => signOut()}
                >
                  Déconnexion
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
      <div className="lg:hidden">
        <Drawer
          open={isSidebarOpen}
          onClose={handleCloseDrawer}
          className="z-40 h-full pt-[85px]"
        >
          <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
            <div className="flex flex-col justify-between h-full">
              <Sidebar.Items>
                <Sidebar.ItemGroup className="border-0 pt-0">
                  {sidebarItems.map((item) => (
                    <Sidebar.Item
                      key={item.link}
                      href={item.link}
                      icon={item.icon}
                      active={isActive(item.link)}
                    >
                      {item.name}
                    </Sidebar.Item>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>

              {!!!user.stripeCustomerId && (
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
                        quality={80}
                        alt="pro"
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
              )}
            </div>
          </Sidebar>
        </Drawer>
      </div>
    </>
  )
}

export default Navbar
