import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { cn } from '../../lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LogOut, User, ChevronDown } from 'lucide-react'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../ui/resizable-navbar'
import iitkgpLogo from '../../images/IITKGP.webp'
import launchpadLogo from '../../images/LaunchpadLOGO.png'
import EcellLogo from '../../../public/e_cell_long.png'

import {
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

export const AppNavbar: React.FC = () => {
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null)

  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100)
  })

  // Fetch profile avatar when user logs in
  useEffect(() => {
    const fetchAvatar = async () => {
      if (user && token) {
        try {
          const res = await fetch(getApiUrl('/api/profile'), {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const profile = await res.json()
            setProfileAvatar(profile.avatar)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      } else {
        setProfileAvatar(null)
      }
    }
    fetchAvatar()
  }, [user, token])

  const defaultNavItems = [
    { name: 'Blog', link: '/blog' },
    { name: 'About', link: '/about' },
  ]

  const getNavigationItems = () => {
    if (!user) return defaultNavItems

    if (user.role === 'admin') {
      return [
        { name: 'Dashboard', link: '/admin/dashboard' },
        { name: 'Approvals', link: '/admin/allowing' },
        { name: 'Events', link: '/admin/events' },
        { name: 'Support', link: '/admin/support' },
      ]
    } else if (user.role === 'alumni') {
      return [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Ask Services', link: '/launchpad' },
        { name: 'Resources', link: '/resources' },
        { name: 'Events', link: '/events' },
        { name: 'Messages', link: '/messages' },
      ]
    } else if (user.role === 'student') {
      return [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Service Profile', link: '/student-service-profile' },
        { name: 'Resources', link: '/resources' },
        { name: 'Courses', link: '/courses' },
        { name: 'Events', link: '/events' },
        { name: 'Messages', link: '/messages' },
      ]
    }

    return defaultNavItems
  }

  const items = getNavigationItems()

  return (
    <div className="relative w-full">
      {/* Click outside handler for the profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-[70]"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}

      <Navbar className="top-4">
        <NavBody>
          <div className="flex items-center gap-2 relative z-20">
            <Link to="/" className="flex items-center gap-2 mr-4">
              <div className={cn(
                "flex gap-2 items-center bg-white/50 p-1.5 rounded-lg transition-all duration-300",
                isScrolled ? "opacity-0 w-0 overflow-hidden p-0" : "opacity-100",
                "hidden md:flex"
              )}>
                <img src={iitkgpLogo} alt="IIT Kharagpur" className="h-8 object-contain" />
                <img src={launchpadLogo} alt="KGP Launchpad Startup Accelerator" className="h-9 object-contain" />
                <img src={EcellLogo} alt="E-Cell" className="h-8 object-contain" />
              </div>
              {/* Mobile: show Launchpad logo */}
              <img
                src={launchpadLogo}
                alt="KGP Launchpad"
                className="h-8 object-contain md:hidden flex-shrink-0"
              />
            </Link>
          </div>

          <NavItems items={items} />

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative z-[80]">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profileAvatar ? getApiUrl(`/api/profile/picture/${profileAvatar}`) : undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className={cn("hidden lg:inline-block text-sm font-medium text-gray-700 transition-all duration-300", isScrolled ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100")}>
                    {user.name}
                  </span>
                  <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5 text-gray-400" />
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileMenuOpen(false)
                          navigate('/')
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-400" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavbarButton href="/login" variant="secondary" className="hidden sm:inline-block">Login</NavbarButton>
                <NavbarButton href="/register" variant="primary" className="hidden sm:inline-block">Get Started</NavbarButton>
              </>
            )}

            {/* Mobile Toggle */}
            <div className="lg:hidden ml-2">
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </NavBody>

        <MobileNav visible={isMobileMenuOpen} className="lg:hidden">
          <MobileNavHeader>
            <Link to="/" className="flex items-center gap-2">
              <img src={launchpadLogo} alt="KGP Launchpad" className="h-8 object-contain" />
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {items.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 w-full py-2 hover:bg-gray-50 px-2 rounded-md"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            {!user && (
              <div className="flex w-full flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
                <NavbarButton
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full text-center"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full text-center"
                >
                  Get Started
                </NavbarButton>
              </div>
            )}

            {user && (
              <div className="flex w-full flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className="px-2 py-2 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profileAvatar ? getApiUrl(`/api/profile/picture/${profileAvatar}`) : undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                    navigate('/')
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="mr-3 h-5 w-5 text-red-400" />
                  Sign out
                </button>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  )
}
