import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell, CheckCircle, TrendingUp, Rocket,
  HandHeart, UserCheck, ExternalLink, Tag, Calendar, User
} from 'lucide-react'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Notification {
  id: number
  type: string
  reference_id: number
  message: string
  is_read: boolean
  created_at: string
}

interface Interest {
  id: number
  pitch_id: number
  investor_id: number
  message: string
  status: string
  created_at: string
  pitch_title: string
  investor_name: string
  investor_email: string
}

interface MentorshipReq {
  id: number
  pitch_id: number
  founder_id: number
  mentor_id: number | null
  message: string
  status: string
  created_at: string
  pitch_title: string
  pitch_category: string
  founder_name: string
  mentor_name: string | null
}

interface Pitch {
  id: number
  title: string
  tagline?: string
  category?: string
  status: string
  founder_name?: string
  created_at: string
}

interface Mentor {
  id: number
  name: string
}

type Tab = 'pitches' | 'interests' | 'mentorship' | 'notifications'

export const AdminLaunchDeckPage: React.FC = () => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('pitches')
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [interests, setInterests] = useState<Interest[]>([])
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipReq[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [assigningMentor, setAssigningMentor] = useState<number | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      if (activeTab === 'pitches') {
        const res = await fetch(getApiUrl('/api/launchdeck/pitches'), { headers })
        if (res.ok) {
          const data = await res.json()
          // Sort newest first
          const sorted = [...(Array.isArray(data) ? data : [])].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          setPitches(sorted)
        }
      } else if (activeTab === 'notifications') {
        const res = await fetch(getApiUrl('/api/launchdeck/admin/notifications'), { headers })
        if (res.ok) setNotifications(await res.json())
      } else if (activeTab === 'interests') {
        const res = await fetch(getApiUrl('/api/launchdeck/admin/interests'), { headers })
        if (res.ok) setInterests(await res.json())
      } else if (activeTab === 'mentorship') {
        const [reqRes, mentorRes] = await Promise.all([
          fetch(getApiUrl('/api/launchdeck/mentorship/requests'), { headers }),
          fetch(getApiUrl('/api/launchdeck/mentors'))
        ])
        if (reqRes.ok) setMentorshipRequests(await reqRes.json())
        if (mentorRes.ok) setMentors(await mentorRes.json())
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markNotifRead = async (id: number) => {
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/admin/notifications/${id}/read`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch {
      toast.error('Failed to mark notification')
    }
  }

  const updateInterestStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/admin/interests/${id}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Status → ${status.replace('_', ' ')}`)
        setInterests(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      }
    } catch {
      toast.error('Failed to update')
    }
  }

  const assignMentor = async (requestId: number) => {
    if (!selectedMentor) { toast.error('Select a mentor'); return }
    try {
      const res = await fetch(getApiUrl('/api/launchdeck/admin/assign-mentor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ request_id: requestId, mentor_id: selectedMentor })
      })
      if (res.ok) {
        toast.success('Mentor assigned!')
        setAssigningMentor(null)
        setSelectedMentor(null)
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed')
      }
    } catch {
      toast.error('Failed to assign')
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      admin_notified: 'bg-blue-100 text-blue-700',
      meeting_setup: 'bg-green-100 text-green-700',
      assigned: 'bg-indigo-100 text-indigo-700',
      accepted: 'bg-green-100 text-green-700',
      declined: 'bg-red-100 text-red-700',
      published: 'bg-emerald-100 text-emerald-700',
      draft: 'bg-gray-100 text-gray-600',
      closed: 'bg-red-100 text-red-600',
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status.replace('_', ' ')}</span>
  }

  const tabs: Array<{ key: Tab; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { key: 'pitches', label: 'New Pitches', icon: Rocket },
    { key: 'interests', label: 'Investor Interests', icon: TrendingUp },
    { key: 'mentorship', label: 'Mentorship', icon: HandHeart },
    { key: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-indigo-500" /> LaunchDeck Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review incoming pitches, investor alignments, mentorship requests, and notifications</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-6 gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
              {tab.badge && tab.badge > 0 && activeTab !== tab.key && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">

            {/* Pitches Tab */}
            {activeTab === 'pitches' && (
              pitches.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Rocket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pitches yet</p>
                </div>
              ) : pitches.map((pitch, idx) => (
                <motion.div key={pitch.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-base">{pitch.title}</h3>
                        {statusBadge(pitch.status)}
                      </div>
                      {pitch.tagline && (
                        <p className="text-sm text-gray-500 mb-2 italic">"{pitch.tagline}"</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                        {pitch.founder_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {pitch.founder_name}
                          </span>
                        )}
                        {pitch.category && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {pitch.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(pitch.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/launchdeck/pitch/${pitch.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      <ExternalLink className="w-3 h-3" /> View Pitch
                    </Link>
                  </div>
                </motion.div>
              ))
            )}

            {/* Interests Tab */}
            {activeTab === 'interests' && (
              interests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No investor interests yet</p>
                </div>
              ) : interests.map((interest, idx) => (
                <motion.div key={interest.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{interest.investor_name}</h3>
                        {statusBadge(interest.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Interested in: <Link to={`/launchdeck/pitch/${interest.pitch_id}`} className="text-indigo-600 hover:underline font-medium">{interest.pitch_title}</Link>
                      </p>
                      <p className="text-xs text-gray-400">{interest.investor_email} · {new Date(interest.created_at).toLocaleDateString()}</p>
                      {interest.message && <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg italic">"{interest.message}"</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      {interest.status === 'pending' && (
                        <>
                          <button onClick={() => updateInterestStatus(interest.id, 'admin_notified')} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors">Notified</button>
                          <button onClick={() => updateInterestStatus(interest.id, 'meeting_setup')} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors">Set Meeting</button>
                        </>
                      )}
                      {interest.status === 'admin_notified' && (
                        <button onClick={() => updateInterestStatus(interest.id, 'meeting_setup')} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors">Set Meeting</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {/* Mentorship Tab */}
            {activeTab === 'mentorship' && (
              mentorshipRequests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <HandHeart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No mentorship requests</p>
                </div>
              ) : mentorshipRequests.map((req, idx) => (
                <motion.div key={req.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Link to={`/launchdeck/pitch/${req.pitch_id}`} className="font-semibold text-gray-900 hover:text-indigo-600">{req.pitch_title}</Link>
                        {statusBadge(req.status)}
                      </div>
                      <p className="text-sm text-gray-500">By: <span className="font-medium text-gray-700">{req.founder_name}</span>
                        {req.pitch_category && <span className="ml-2 text-indigo-500">· {req.pitch_category}</span>}
                      </p>
                      {req.mentor_name && <p className="text-sm text-gray-500 mt-1">Mentor: <span className="font-medium text-green-700">{req.mentor_name}</span></p>}
                      {req.message && <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg italic">"{req.message}"</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      {req.status === 'pending' && !req.mentor_id && (
                        assigningMentor === req.id ? (
                          <div className="space-y-2">
                            <select value={selectedMentor || ''} onChange={(e) => setSelectedMentor(Number(e.target.value))}
                              className="block w-40 px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white">
                              <option value="">Select mentor</option>
                              {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <div className="flex gap-1">
                              <button onClick={() => assignMentor(req.id)} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium">Assign</button>
                              <button onClick={() => { setAssigningMentor(null); setSelectedMentor(null) }} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setAssigningMentor(req.id)} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                            <UserCheck className="w-3 h-3" /> Assign Mentor
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              notifications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : notifications.map((notif, idx) => (
                <motion.div key={notif.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className={`bg-white rounded-xl p-4 border transition-all ${notif.is_read ? 'border-gray-100' : 'border-indigo-200 bg-indigo-50/30'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${notif.type === 'interest_request' ? 'bg-green-100' : 'bg-purple-100'}`}>
                        {notif.type === 'interest_request'
                          ? <TrendingUp className="w-4 h-4 text-green-600" />
                          : <HandHeart className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className={`text-sm ${notif.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(notif.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/launchdeck/pitch/${notif.reference_id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {!notif.is_read && (
                        <button onClick={() => markNotifRead(notif.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

          </div>
        )}
      </div>
    </div>
  )
}
