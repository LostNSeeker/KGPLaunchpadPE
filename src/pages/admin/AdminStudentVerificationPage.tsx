import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { IdCard, Loader2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../config'

interface StudentVerification {
  id: number
  name: string
  email: string
  role: string
  roll_number: string
  id_card_image: string
  graduation_year: number | null
  department: string
}

export const AdminStudentVerificationPage: React.FC = () => {
  const { user, token, isLoading } = useAuth()
  const navigate = useNavigate()
  const [list, setList] = useState<StudentVerification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    const fetchList = async () => {
      if (!token) return
      try {
        const res = await fetch(getApiUrl('/api/admin/students/verification'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setList(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [token, user, navigate])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-8">
          <IdCard className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Verification</h1>
            <p className="text-gray-600">View students who have submitted roll number or ID card for verification</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/95">
          <CardHeader>
            <CardTitle>Verification submissions</CardTitle>
            <CardDescription>Students with roll number or ID card on file</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : list.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No student verification submissions yet.</p>
            ) : (
              <div className="space-y-6">
                {list.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-600 truncate">{s.email}</p>
                      {(s.department || s.graduation_year) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {[s.department, s.graduation_year ? `Batch ${s.graduation_year}` : null].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {s.roll_number && (
                        <p className="text-sm text-blue-700 mt-1">
                          Roll: <span className="font-mono">{s.roll_number}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {s.id_card_image ? (
                        <a
                          href={getApiUrl(`/uploads/${s.id_card_image}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={getApiUrl(`/uploads/${s.id_card_image}`)}
                            alt={`ID card for ${s.name}`}
                            className="h-24 w-auto rounded-lg border border-gray-200 object-contain bg-white"
                          />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No ID image</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
