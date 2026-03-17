import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  Users, BookOpen, Bell, Briefcase, Loader2, Clock, CheckCircle,
  Rocket, TrendingUp, Calendar, PlusCircle, Eye, HandHeart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../config'

interface DashboardStats {
  active_projects: number
  total_projects: number
  mentees: number
  service_requests_count: number
  pitches_count: number
  interests_count: number
  mentorship_requests_count: number
}

interface RecentActivity {
  id: number
  type: 'mentorship' | 'project_application' | 'project' | 'pitch' | 'interest'
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
    service_requests_count: 0,
    pitches_count: 0,
    interests_count: 0,
    mentorship_requests_count: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Derive alumni type from alumni_type field, or fall back to role (for founder/mentor/investor roles)
  const roleToAlumniType: Record<string, string> = { founder: 'Founder', mentor: 'Mentor', investor: 'Investor' }
  const alumniType = user?.alumni_type || (user?.role ? roleToAlumniType[user.role] : undefined) || 'Founder'

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

        // Fetch service requests for count and recent activity
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

  // --- Role-specific configuration ---
  const getDashboardConfig = () => {
    switch (alumniType) {
      case 'Investor':
        return {
          title: "Investor Dashboard",
          subtitle: `Welcome back, ${user.name}! Discover and invest in IIT KGP startups.`,
          gradient: 'from-emerald-600 via-teal-600 to-emerald-600',
          accentColors: {
            primary: 'emerald',
            secondary: 'teal',
          }
        }
      case 'Mentor':
        return {
          title: "Mentor Dashboard",
          subtitle: `Welcome back, ${user.name}! Guide the next generation of founders.`,
          gradient: 'from-amber-600 via-orange-600 to-amber-600',
          accentColors: {
            primary: 'amber',
            secondary: 'orange',
          }
        }
      default: // Founder
        return {
          title: "Founder's Dashboard",
          subtitle: `Welcome back, ${user.name}! Manage your startup pitches and grow your venture.`,
          gradient: 'from-blue-600 via-purple-600 to-blue-600',
          accentColors: {
            primary: 'blue',
            secondary: 'purple',
          }
        }
    }
  }

  const config = getDashboardConfig()

  // Quick actions based on role
  const getQuickActions = () => {
    switch (alumniType) {
      case 'Investor':
        return [
          { label: 'Explore LaunchDeck', icon: Rocket, to: '/launchdeck', colors: 'from-emerald-100 to-teal-200 hover:from-emerald-200 hover:to-teal-300 text-emerald-800' },
          { label: 'Resources', icon: BookOpen, to: '/resources', colors: 'from-sky-100 to-blue-200 hover:from-sky-200 hover:to-blue-300 text-sky-700' },
          { label: 'Events', icon: Calendar, to: '/events', colors: 'from-violet-100 to-purple-200 hover:from-violet-200 hover:to-purple-300 text-violet-700' },
        ]
      case 'Mentor':
        return [
          { label: 'Mentorship Requests', icon: HandHeart, to: '/launchdeck/mentorship-requests', colors: 'from-amber-100 to-orange-200 hover:from-amber-200 hover:to-orange-300 text-amber-800' },
          { label: 'Explore LaunchDeck', icon: Rocket, to: '/launchdeck', colors: 'from-emerald-100 to-teal-200 hover:from-emerald-200 hover:to-teal-300 text-emerald-800' },
          { label: 'Resources', icon: BookOpen, to: '/resources', colors: 'from-sky-100 to-blue-200 hover:from-sky-200 hover:to-blue-300 text-sky-700' },
          { label: 'Events', icon: Calendar, to: '/events', colors: 'from-violet-100 to-purple-200 hover:from-violet-200 hover:to-purple-300 text-violet-700' },
        ]
      default: // Founder
        return [
          { label: 'My Pitches', icon: Rocket, to: '/launchdeck/my-pitches', colors: 'from-indigo-100 to-blue-200 hover:from-indigo-200 hover:to-blue-300 text-indigo-700' },
          { label: 'Create Pitch', icon: PlusCircle, to: '/launchdeck/create-pitch', colors: 'from-emerald-100 to-green-200 hover:from-emerald-200 hover:to-green-300 text-emerald-700' },
          { label: 'Explore Startups', icon: Eye, to: '/launchdeck', colors: 'from-purple-100 to-violet-200 hover:from-purple-200 hover:to-violet-300 text-purple-700' },
          { label: 'Manage Services', icon: Briefcase, to: '/alumni/services', colors: 'from-yellow-100 to-orange-200 hover:from-yellow-200 hover:to-orange-300 text-yellow-800' },
          { label: 'Resources', icon: BookOpen, to: '/resources', colors: 'from-sky-100 to-blue-200 hover:from-sky-200 hover:to-blue-300 text-sky-700' },
          { label: 'View Mentees', icon: Users, to: '/alumni/mentees', colors: 'from-pink-100 to-rose-200 hover:from-pink-200 hover:to-rose-300 text-pink-700' },
        ]
    }
  }

  const quickActions = getQuickActions()

  // Stat cards based on role
  const getStatCards = () => {
    switch (alumniType) {
      case 'Investor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Startups Viewed"
              value="-"
              subtitle="Browse LaunchDeck"
              icon={<Rocket className="h-5 w-5 text-emerald-600" />}
              gradientColors="from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300"
              bgColors="from-emerald-50/50"
              loading={loading}
            />
            <StatCard
              title="Interests Submitted"
              value="-"
              subtitle="Startup interests"
              icon={<TrendingUp className="h-5 w-5 text-teal-600" />}
              gradientColors="from-teal-100 to-teal-200 group-hover:from-teal-200 group-hover:to-teal-300"
              bgColors="from-teal-50/50"
              loading={loading}
            />
            <StatCard
              title="Upcoming Events"
              value="-"
              subtitle="Events & meetups"
              icon={<Calendar className="h-5 w-5 text-blue-600" />}
              gradientColors="from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300"
              bgColors="from-blue-50/50"
              loading={loading}
            />
          </div>
        )
      case 'Mentor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <StatCard
              title="Mentees"
              value={stats.mentees}
              subtitle="Active mentees"
              icon={<Users className="h-5 w-5 text-amber-600" />}
              gradientColors="from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300"
              bgColors="from-amber-50/50"
              loading={loading}
            />
            <StatCard
              title="Mentorship Requests"
              value="-"
              subtitle="From founders"
              icon={<HandHeart className="h-5 w-5 text-orange-600" />}
              gradientColors="from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300"
              bgColors="from-orange-50/50"
              loading={loading}
            />
          </div>
        )
      default: // Founder
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <StatCard
              title="Mentees"
              value={stats.mentees}
              subtitle="Active mentees"
              icon={<Users className="h-5 w-5 text-purple-600" />}
              gradientColors="from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300"
              bgColors="from-purple-50/50"
              loading={loading}
            />
            <StatCard
              title="Service Requests"
              value={stats.service_requests_count}
              subtitle="Applied services"
              icon={<Briefcase className="h-5 w-5 text-blue-600" />}
              gradientColors="from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300"
              bgColors="from-blue-50/50"
              loading={loading}
            />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12">
          <div className="relative">
            <h1 className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-4 leading-tight`}>
              {config.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {config.subtitle}
            </p>
            
            {/* Animated border decoration */}
            <div className={`absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r ${config.gradient} rounded-full animate-pulse`}></div>
            <div className={`absolute -bottom-2 left-28 h-1 w-16 bg-gradient-to-r ${config.gradient} rounded-full animate-pulse delay-300`} style={{ opacity: 0.7 }}></div>
            <div className={`absolute -bottom-2 left-48 h-1 w-12 bg-gradient-to-r ${config.gradient} rounded-full animate-pulse delay-700`} style={{ opacity: 0.4 }}></div>
          </div>
        </div>

        {/* Statistics Cards */}
        {getStatCards()}

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(quickActions.length, 4)} gap-6`}>
            {quickActions.map((action) => (
              <Button key={action.label} asChild className={`h-24 flex flex-col items-center justify-center bg-gradient-to-br ${action.colors} shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
                <Link to={action.to}>
                  <div className="p-3 rounded-full transition-all duration-300 mb-2">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold">{action.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity + Pending Requests */}
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

          {/* Right Panel — role-specific */}
          {alumniType === 'Founder' && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Your Pitches</CardTitle>
                  <Button size="sm" asChild>
                    <Link to="/launchdeck/my-pitches" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-indigo-100">
                        <Rocket className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Startup Pitches</p>
                        <p className="text-xs text-gray-500">Manage your LaunchDeck pitches</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/launchdeck/create-pitch">+ New Pitch</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Service Requests</p>
                        <p className="text-xs text-gray-500">Your Ask Services requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.service_requests_count}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {alumniType === 'Investor' && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Explore Startups</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-emerald-100">
                        <Rocket className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">LaunchDeck</p>
                        <p className="text-xs text-gray-500">Browse startup pitches from IIT KGP founders</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/launchdeck">Explore</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-50 border border-teal-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-teal-100">
                        <BookOpen className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resources</p>
                        <p className="text-xs text-gray-500">Investor database & startup resources</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/resources">View</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Upcoming Events</p>
                        <p className="text-xs text-gray-500">Networking events, pitch days & more</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/events">View</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {alumniType === 'Mentor' && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Mentorship</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-amber-100">
                        <HandHeart className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mentorship Requests</p>
                        <p className="text-xs text-gray-500">Startups requesting your mentorship</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/launchdeck/mentorship-requests">View</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-orange-100">
                        <Users className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Your Mentees</p>
                        <p className="text-xs text-gray-500">Students you are mentoring</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/alumni/mentees">View</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-emerald-100">
                        <Rocket className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Explore LaunchDeck</p>
                        <p className="text-xs text-gray-500">Browse all IIT KGP startup pitches</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/launchdeck">Explore</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable stat card component
interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: React.ReactNode
  gradientColors: string
  bgColors: string
  loading: boolean
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, gradientColors, bgColors, loading }) => (
  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${bgColors} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradientColors} rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700`}></div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`p-2 rounded-xl bg-gradient-to-br ${gradientColors} transition-all duration-300`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : value}
      </div>
      <p className="text-xs text-gray-500 flex items-center">
        {subtitle}
      </p>
    </CardContent>
  </Card>
)