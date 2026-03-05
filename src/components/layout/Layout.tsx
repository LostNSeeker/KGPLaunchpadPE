import React, { useEffect } from 'react'
import { AppNavbar } from './AppNavbar'
import { Footer } from './Footer'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const hideHeaderFooter = ['/login', '/register', '/navbar-demo'].includes(location.pathname)

  // Scroll to top when route (tab) changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <AppNavbar />}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 min-w-0"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}
