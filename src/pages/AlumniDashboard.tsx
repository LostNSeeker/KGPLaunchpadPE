import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Users, BookOpen, Bell, Briefcase, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../config'

interface DashboardStats {
  active_projects: number
  total_projects: number
  mentees: number
  service_requests_count: number
}

interface RecentActivity {
  id: number
  type: 'mentorship' | 'project_application' | 'project'
  title: string
  description: string
  status: string
  created_at: string
}

export const AlumniDashboard: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    active_projects: 0,
    total_projects: 0,
    mentees: 0,
    service_requests_count: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!token) return
      
      try {
        const statsRes = await fetch(getApiUrl('/api/alumni/dashboard-stats'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats((prev) => ({
            ...prev,
            ...statsData,
            service_requests_count: 0
          }))
        }

        // Fetch my service requests (applied for services) for count and recent activity
        const requestsRes = await fetch(getApiUrl('/api/launchpad/my-requests'), {
          headers: { Authorization: `Bearer ${token}` }
        })
        const activities: RecentActivity[] = []
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json()
          const list = Array.isArray(requestsData) ? requestsData : requestsData.requests || []
          setStats((prev) => ({ ...prev, service_requests_count: list.length }))
          for (const r of list.slice(0, 10)) {
            activities.push({
              id: r.id,
              type: 'project',
              title: r.project_type ? `Service: ${r.project_type}` : 'Service request',
              description: r.description || r.project_type || 'Ask Services request',
              status: r.status || 'pending',
              created_at: r.created_at
            })
          }
        }
        activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setRecentActivity(activities.slice(0, 10))
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access your dashboard.</p>
      </div>
    )
  }

  if (user.role !== 'alumni') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Only alumni can access this dashboard.</p>
      </div>
    )
  }

  // Show waiting message if not approved
  if (user.is_approved === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Account Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your account is pending admin approval. You can browse the site, but full access will be granted once an admin reviews your registration.
            </p>
            <p className="text-sm text-gray-500">
              We'll notify you once your account has been approved.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight">
              Founder's Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              Welcome back, {user.name}! Manage your projects, mentorship, and community engagement.
            </p>
            
            {/* Animated border decoration */}
            <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 left-28 h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-300"></div>
            <div className="absolute -bottom-2 left-48 h-1 w-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>

        {/* Statistics Cards — project stats removed for alumni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600">Mentees</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.mentees}
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <Users className="h-3 w-3 mr-1 text-purple-500" />
                Active mentees
              </p>
            </CardContent>
          </Card>

          </div>

        {/* Quick Actions with Enhanced Animations — Manage Services first; project functionality removed */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button asChild className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 hover:from-yellow-200 hover:to-orange-300 text-yellow-800 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/alumni/services">
                <div className="p-3 rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-all duration-300 mb-2">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold">Manage Services</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 hover:from-indigo-200 hover:to-purple-300 text-indigo-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/alumni/mentees">
                <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-all duration-300 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold">View Mentees</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 hover:from-sky-200 hover:to-blue-300 text-sky-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/resources">
                <div className="p-3 rounded-full bg-sky-100 group-hover:bg-sky-200 transition-all duration-300 mb-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold">Resources</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity with Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Last 7 days</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'mentorship' 
                          ? 'bg-purple-100 group-hover:bg-purple-200' 
                          : activity.type === 'project'
                          ? activity.status === 'completed' ? 'bg-green-100 group-hover:bg-green-200' : 'bg-blue-100 group-hover:bg-blue-200'
                          : 'bg-blue-100 group-hover:bg-blue-200'
                      } transition-colors duration-200`}>
                        {activity.type === 'mentorship' ? (
                          <Users className="h-4 w-4 text-purple-600" />
                        ) : activity.type === 'project' ? (
                          activity.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          )
                        ) : (
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge 
                            variant={
                              activity.status === 'pending' ? 'secondary' : 
                              activity.status === 'completed' ? 'default' :
                              activity.status === 'active' ? 'default' : 'secondary'
                            }
                            className={`text-xs ${
                              activity.status === 'completed' ? 'bg-green-500' :
                              activity.status === 'active' ? 'bg-blue-500' : ''
                            }`}
                          >
                            {activity.status === 'active' ? 'ongoing' : activity.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Pending Requests</CardTitle>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-500">Action Required</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Applied for services</p>
                      <p className="text-xs text-gray-500">Your Ask Services requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.service_requests_count}
                    </div>
                    <Button size="sm" variant="outline" className="mt-1" asChild>
                      <Link to="/launchpad">View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}