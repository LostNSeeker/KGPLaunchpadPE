import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getApiUrl } from '../config'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { CloudWatchForm } from '../components/ui/cloud-watch-form'
import { toast } from 'react-hot-toast'
import { Loader2, CheckCircle, Award, Briefcase, Clock, Upload, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const MAX_SKILLS = 5
const SKILLS_OPTIONS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'UI/UX Design',
  'Figma', 'HTML/CSS', 'MongoDB', 'SQL', 'AWS', 'Docker', 'Machine Learning', 'Data Analytics',
  'Content Writing', 'Digital Marketing', 'Project Management', 'Communication', 'Research',
  'Case Studies', 'RAG / LLM', 'Sales', 'Other',
]

interface StudentProfile {
  resume_url?: string
  skills?: string
  experience?: string
  education?: string
  linkedin_url?: string
  portfolio_url?: string
  other_info?: string
  created_at?: string
  updated_at?: string
}

interface Allotment {
  id: number
  service_id: number
  service_title: string
  status: 'pending_agreement' | 'agreed' | 'declined'
  created_at: string
  agreed_at?: string
}

export const StudentServiceProfilePage: React.FC = () => {
  const { token, user } = useAuth()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [allotments, setAllotments] = useState<Allotment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cvUploading, setCvUploading] = useState(false)
  const [agreeingId, setAgreeingId] = useState<number | null>(null)
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false)
  const skillsDropdownRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    resume_url: '',
    skills: '',
    experience: '',
    education: '',
    linkedin_url: '',
    portfolio_url: '',
    other_info: '',
  })

  useEffect(() => {
    if (user?.role !== 'student' || !token) return
    fetchProfile()
    fetchAllotments()
  }, [token, user?.role])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(e.target as Node)) {
        setSkillsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedSkillsList = formData.skills
    ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF file')
      return
    }
    try {
      setCvUploading(true)
      const form = new FormData()
      form.append('cv', file)
      const res = await fetch(getApiUrl('/api/profile/cv'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (res.ok && data.cv_url) {
        const fullUrl = data.cv_url.startsWith('http') ? data.cv_url : getApiUrl(data.cv_url)
        setFormData((f) => ({ ...f, resume_url: fullUrl }))
        toast.success('CV uploaded successfully')
      } else {
        toast.error(data.error || 'Failed to upload CV')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload CV')
    } finally {
      setCvUploading(false)
      e.target.value = ''
    }
  }

  const toggleSkill = (skill: string) => {
    setFormData((f) => {
      const list = f.skills ? f.skills.split(',').map((s) => s.trim()).filter(Boolean) : []
      const idx = list.indexOf(skill)
      if (idx >= 0) {
        list.splice(idx, 1)
      } else if (list.length < MAX_SKILLS) {
        list.push(skill)
      } else {
        toast.error(`Maximum ${MAX_SKILLS} skills allowed`)
        return f
      }
      return { ...f, skills: list.join(', ') }
    })
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(getApiUrl('/api/launchpad/student-profile'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        if (data && typeof data === 'object' && (data.created_at != null || data.resume_url != null)) {
          setFormData({
            resume_url: data.resume_url || '',
            skills: data.skills || '',
            experience: data.experience || '',
            education: data.education || '',
            linkedin_url: data.linkedin_url || '',
            portfolio_url: data.portfolio_url || '',
            other_info: data.other_info || '',
          })
        }
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const hasSubmittedProfile = profile && typeof profile === 'object' && (profile.created_at != null || (profile as StudentProfile).resume_url != null)

  const fetchAllotments = async () => {
    try {
      const res = await fetch(getApiUrl('/api/launchpad/my-allotments'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAllotments(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    const skillsList = formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : []
    if (!formData.resume_url?.trim()) {
      toast.error('Please upload a CV or add a resume link')
      return
    }
    if (skillsList.length === 0) {
      toast.error('Please select at least 1 skill (max 5)')
      return
    }
    if (skillsList.length > MAX_SKILLS) {
      toast.error(`Maximum ${MAX_SKILLS} skills allowed`)
      return
    }

    try {
      setSaving(true)
      const res = await fetch(getApiUrl('/api/launchpad/student-profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast.success('Profile saved successfully')
        fetchProfile()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to save')
      }
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleAgree = async (allotmentId: number) => {
    if (!token) return
    try {
      setAgreeingId(allotmentId)
      const res = await fetch(getApiUrl(`/api/launchpad/allotments/${allotmentId}/agree`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'You have agreed. The team will reach out to you.')
        fetchAllotments()
      } else {
        toast.error(data.error || 'Failed to submit')
      }
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong')
    } finally {
      setAgreeingId(null)
    }
  }

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Only students can access the Service Profile page.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Profile</h1>
          <p className="text-gray-600 mt-1">
            {hasSubmittedProfile
              ? "You've submitted your profile. Check below if you're selected for a service."
              : 'Fill your CV and important details. If you get selected for a service, you can agree here.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : hasSubmittedProfile ? (
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/90">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium">Profile submitted</p>
                    <p className="text-sm text-gray-500">Status: Pending — we&apos;ll match you when a service fits.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Award className="h-5 w-5 mr-2 text-amber-600" />
                  Selected for a service
                </CardTitle>
                <CardDescription>If you are selected for any service, you can agree here.</CardDescription>
              </CardHeader>
              <CardContent>
                {allotments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No service selections yet.</p>
                    <p className="text-sm mt-1">You&apos;ll see an Agree button here when selected.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {allotments.map((a) => (
                      <li key={a.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">{a.service_title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Selected on {new Date(a.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {a.status === 'pending_agreement' ? (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAgree(a.id)}
                                disabled={agreeingId === a.id}
                              >
                                {agreeingId === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                Agree
                              </Button>
                            ) : a.status === 'agreed' ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Agreed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Declined</Badge>
                            )}
                          </div>
                        </div>
                        {a.status === 'agreed' && a.agreed_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            Agreed on {new Date(a.agreed_at).toLocaleDateString()}. The team will reach out to you.
                          </p>
                        )}
                        <Link
                          to={`/launchpad/services/${a.service_id}`}
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View service details →
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center">
              <CloudWatchForm className="w-full max-w-6xl">
                <form onSubmit={handleSubmitProfile} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
                  {/* Upload CV + optional link */}
                  <div className="space-y-2 md:col-span-2 xl:col-span-3">
                    <Label>CV / Resume <span className="text-red-500">*</span></Label>
                    <div className="flex flex-wrap gap-3 items-start">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          id="cv-upload"
                          onChange={handleCvUpload}
                          disabled={cvUploading}
                        />
                        <label
                          htmlFor="cv-upload"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer disabled:opacity-50"
                        >
                          {cvUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          Upload CV (PDF)
                        </label>
                      </div>
                      <span className="text-sm text-muted-foreground self-center">or paste a link below</span>
                    </div>
                    <Input
                      placeholder="https://drive.google.com/... or link to your CV"
                      value={formData.resume_url}
                      onChange={(e) => setFormData((f) => ({ ...f, resume_url: e.target.value }))}
                    />
                  </div>

                  {/* Skills dropdown - max 5 */}
                  <div className="space-y-2 md:col-span-2 xl:col-span-3" ref={skillsDropdownRef}>
                    <Label>Skills <span className="text-red-500">*</span> (select up to {MAX_SKILLS})</Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSkillsDropdownOpen((o) => !o)}
                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <span className="text-muted-foreground">
                          {selectedSkillsList.length > 0
                            ? `${selectedSkillsList.length} selected`
                            : 'Select skills...'}
                        </span>
                        <span className="text-xs text-muted-foreground">{selectedSkillsList.length}/{MAX_SKILLS}</span>
                      </button>
                      {skillsDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-2 shadow-lg max-h-56 overflow-y-auto">
                          {SKILLS_OPTIONS.map((skill) => (
                            <label
                              key={skill}
                              className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-accent"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSkillsList.includes(skill)}
                                onChange={() => toggleSkill(skill)}
                                className="rounded border-input"
                              />
                              <span className="text-sm">{skill}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedSkillsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedSkillsList.map((s) => (
                          <Badge key={s} variant="secondary" className="pr-1">
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSkill(s)}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                              aria-label={`Remove ${s}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2 xl:col-span-3">
                    <Label>Experience</Label>
                    <Textarea
                      placeholder="Previous roles, projects, internships..."
                      className="min-h-[100px]"
                      value={formData.experience}
                      onChange={(e) => setFormData((f) => ({ ...f, experience: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Textarea
                      placeholder="Degree, institution, year..."
                      className="min-h-[80px]"
                      value={formData.education}
                      onChange={(e) => setFormData((f) => ({ ...f, education: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData((f) => ({ ...f, linkedin_url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Portfolio / GitHub</Label>
                    <Input
                      placeholder="https://..."
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData((f) => ({ ...f, portfolio_url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 xl:col-span-3">
                    <Label>Anything else</Label>
                    <Textarea
                      placeholder="Other info you want to share"
                      className="min-h-[60px]"
                      value={formData.other_info}
                      onChange={(e) => setFormData((f) => ({ ...f, other_info: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2 xl:col-span-3">
                    <Button type="submit" className="mt-2 w-full bg-blue-600 hover:bg-blue-700" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Submit profile
                    </Button>
                  </div>
                </form>
              </CloudWatchForm>
            </div>
            <Card className="shadow-lg border-0 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Award className="h-5 w-5 mr-2 text-amber-600" />
                  Selected for a service
                </CardTitle>
                <CardDescription>If you are selected for any service, you can agree here.</CardDescription>
              </CardHeader>
              <CardContent>
                {allotments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No service selections yet.</p>
                    <p className="text-sm mt-1">You&apos;ll see an Agree button here when selected.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {allotments.map((a) => (
                      <li key={a.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">{a.service_title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Selected on {new Date(a.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {a.status === 'pending_agreement' ? (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAgree(a.id)}
                                disabled={agreeingId === a.id}
                              >
                                {agreeingId === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                Agree
                              </Button>
                            ) : a.status === 'agreed' ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Agreed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Declined</Badge>
                            )}
                          </div>
                        </div>
                        {a.status === 'agreed' && a.agreed_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            Agreed on {new Date(a.agreed_at).toLocaleDateString()}. The team will reach out to you.
                          </p>
                        )}
                        <Link
                          to={`/launchpad/services/${a.service_id}`}
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View service details →
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
