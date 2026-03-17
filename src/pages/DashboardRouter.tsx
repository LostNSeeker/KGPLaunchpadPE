import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export const DashboardRouter: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Route based on user role
  if (user.role === 'student') {
    return <Navigate to="/student-dashboard" replace />
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  } else if (['alumni', 'founder', 'mentor', 'investor'].includes(user.role)) {
    return <Navigate to="/founders-dashboard" replace />
  }

  // Fallback for unknown roles
  return <Navigate to="/login" replace />
}




