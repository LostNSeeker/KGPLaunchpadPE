import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Loader2, Briefcase, TrendingUp, Clock, CheckCircle, MessageCircle, GraduationCap, Calendar, Wrench, Upload, IdCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../config'
import { toast } from 'react-hot-toast'

interface DashboardStats {
  applied_projects: number
  accepted_projects: number
  pending_applications: number
}

export const StudentDashboard: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  // stats displayed in UI; setStats reserved for future dashboard stats fetch
  const [stats] = useState<DashboardStats>({
    applied_projects: 0,
    accepted_projects: 0,
    pending_applications: 0
  })
  const [, setLoading] = useState(true)
  const [rollNumber, setRollNumber] = useState('')
  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
  const [existingIdCard, setExistingIdCard] = useState<string | null>(null)
  const [verificationLoading, setVerificationLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!token) return

      try {
        const verRes = await fetch(getApiUrl('/api/students/verification'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (verRes.ok) {
          const verData = await verRes.json()
          if (verData.roll_number) setRollNumber(verData.roll_number)
          if (verData.id_card_image) setExistingIdCard(verData.id_card_image)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access your dashboard.</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="relative mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight">
            Student Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your applications, find mentors, and explore exciting opportunities.
          </p>
          {/* Animated border decoration */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">Applied Projects</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.applied_projects}</div>
              <p className="text-sm text-gray-600">Total applications</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">Accepted Projects</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.accepted_projects}</div>
              <p className="text-sm text-gray-600">Projects you're part of</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">Pending Applications</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pending_applications}</div>
              <p className="text-sm text-gray-600">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Button asChild className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-red-200 hover:from-orange-200 hover:to-red-300 text-orange-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/student-service-profile">
                <Wrench className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">Applied to help</span>
              </Link>
            </Button>
            <Button asChild className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-200 hover:from-teal-200 hover:to-cyan-300 text-teal-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/messages">
                <MessageCircle className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">Messages</span>
              </Link>
            </Button>
            <Button asChild className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200 hover:from-purple-200 hover:to-pink-300 text-purple-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/my-courses">
                <GraduationCap className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">My Courses</span>
              </Link>
            </Button>
            <Button asChild className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 hover:from-orange-200 hover:to-amber-300 text-orange-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Link to="/my-events">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">My Events</span>
              </Link>
            </Button>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-gray-600">Your latest project applications</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">Start by browsing projects or your applications.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/student/applications">View My Applications</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Verification Section — same theme as dashboard */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm group relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <IdCard className="h-6 w-6 mr-2 text-blue-600" />
                Student Verification
              </CardTitle>
              <CardDescription className="text-gray-600">Enter your roll number and upload your ID card for verification</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-gray-700 font-medium">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      placeholder="e.g. 21CS10045"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="bg-white/70 border-gray-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idCard" className="text-gray-700 font-medium">ID Card Photo</Label>
                    <div className="relative">
                      <input
                        type="file"
                        id="idCard"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setIdCardFile(file)
                            const reader = new FileReader()
                            reader.onloadend = () => setIdCardPreview(reader.result as string)
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <label
                        htmlFor="idCard"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">{idCardFile ? idCardFile.name : 'Upload ID Card Photo'}</span>
                      </label>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    disabled={verificationLoading}
                    onClick={async () => {
                      if (!rollNumber && !idCardFile) {
                        toast.error('Please enter roll number or upload ID card')
                        return
                      }
                      setVerificationLoading(true)
                      try {
                        const formData = new FormData()
                        if (rollNumber) formData.append('roll_number', rollNumber)
                        if (idCardFile) formData.append('id_card', idCardFile)
                        const res = await fetch(getApiUrl('/api/students/verification'), {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData,
                        })
                        if (res.ok) {
                          const data = await res.json()
                          toast.success('Verification data saved!')
                          if (data.id_card_image) setExistingIdCard(data.id_card_image)
                        } else {
                          toast.error('Failed to save verification data')
                        }
                      } catch {
                        toast.error('Something went wrong')
                      } finally {
                        setVerificationLoading(false)
                      }
                    }}
                  >
                    {verificationLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      'Save Verification Data'
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  {idCardPreview ? (
                    <img src={idCardPreview} alt="ID Card Preview" className="max-h-48 rounded-xl shadow-md border" />
                  ) : existingIdCard ? (
                    <img src={getApiUrl(`/uploads/${existingIdCard}`)} alt="ID Card" className="max-h-48 rounded-xl shadow-md border" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 py-8">
                      <IdCard className="h-16 w-16 mb-3 opacity-30 text-blue-300" />
                      <p className="text-sm">No ID card uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
