import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getApiUrl } from '../config'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { toast } from 'react-hot-toast'
import { Loader2, CheckCircle, Clock, AlertCircle, Send, FileText } from 'lucide-react'
import { AnimatedMarqueeHero } from '../components/ui/hero-3'

const ASK_SERVICES_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1756312148347-611b60723c7a?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1757865579201-693dd2080c73?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1756786605218-28f7dd95a493?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1757519740947-eef07a74c4ab?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1757263005786-43d955f07fb1?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1757207445614-d1e12b8f753e?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1757269746970-dc477517268f?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1755119902709-a53513bcbedc?w=900&auto=format&fit=crop&q=60',
]

interface ServiceRequest {
    id: number
    project_type: string
    description: string
    budget_range: string
    status: string
    admin_notes?: string
    created_at: string
    updated_at?: string
}

const statusSteps = ['submitted', 'reviewed', 'assigned', 'in_progress', 'completed']

const statusLabels: Record<string, string> = {
    submitted: 'Submitted',
    reviewed: 'Under Review',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    completed: 'Completed',
}

const statusColors: Record<string, string> = {
    submitted: 'bg-blue-500',
    reviewed: 'bg-yellow-500',
    assigned: 'bg-purple-500',
    in_progress: 'bg-orange-500',
    completed: 'bg-green-500',
}

export const AskServicesPage: React.FC = () => {
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const [requestsLoading, setRequestsLoading] = useState(true)
    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [formData, setFormData] = useState({
        project_type: '',
        description: '',
        budget_range: '',
    })

    const projectTypes = [
        'Web Development',
        'Mobile App Development',
        'Design & Branding',
        'Marketing & SEO',
        'Content Writing',
        'Consulting',
        'Other'
    ]

    useEffect(() => {
        fetchMyRequests()
    }, [token])

    const fetchMyRequests = async () => {
        if (!token) return
        try {
            setRequestsLoading(true)
            const res = await fetch(getApiUrl('/api/launchpad/my-requests'), {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        } catch (error) {
            console.error('Error fetching requests:', error)
        } finally {
            setRequestsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.project_type || !formData.description) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)
            const res = await fetch(getApiUrl('/api/launchpad/requests'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('Service request submitted successfully!')
                setFormData({ project_type: '', description: '', budget_range: '' })
                fetchMyRequests()
            } else {
                toast.error(data.error || 'Failed to submit request')
            }
        } catch (error) {
            console.error('Error submitting request:', error)
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const getStepIndex = (status: string) => {
        const idx = statusSteps.indexOf(status)
        return idx >= 0 ? idx : 0
    }

    const scrollToForm = () => {
        document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <AnimatedMarqueeHero
                tagline="Get matched with the right team"
                title={
                    <>
                        Ask for
                        <br />
                        Services
                    </>
                }
                description="Submit your project and we'll connect you with verified agencies and freelancers from our network. Track progress from submission to delivery."
                ctaText="Submit a request"
                onCtaClick={scrollToForm}
                images={ASK_SERVICES_HERO_IMAGES}
                className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80"
            />

            <div id="request-form" className="container mx-auto px-4 max-w-6xl pt-8 pb-12 scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl">
                                <Send className="h-5 w-5 mr-2 text-blue-600" />
                                New Service Request
                            </CardTitle>
                            <CardDescription>Tell us what you need and we'll connect you with the right experts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="project_type">Service Type <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.project_type}
                                        onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your requirements, goals, and any specific preferences..."
                                        className="min-h-[120px] resize-y"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="budget">Budget Range (Optional)</Label>
                                    <Input
                                        id="budget"
                                        placeholder="e.g. ₹10,000 - ₹50,000"
                                        value={formData.budget_range}
                                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-5 text-base"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Timeline Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                            Your Requests
                        </h2>

                        {requestsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : requests.length === 0 ? (
                            <Card className="shadow-md border-0 bg-white/80">
                                <CardContent className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No service requests yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Submit your first request to get started!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            requests.map((request) => {
                                const currentStep = getStepIndex(request.status)
                                return (
                                    <Card key={request.id} className="shadow-md border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                        <div className={`h-1 ${statusColors[request.status] || 'bg-gray-300'}`} />
                                        <CardContent className="pt-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{request.project_type}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{request.description}</p>
                                                    {request.budget_range && (
                                                        <p className="text-xs text-gray-400 mt-1">Budget: {request.budget_range}</p>
                                                    )}
                                                </div>
                                                <Badge className={`${statusColors[request.status]} text-white capitalize`}>
                                                    {statusLabels[request.status] || request.status}
                                                </Badge>
                                            </div>

                                            {/* Timeline Steps */}
                                            <div className="flex items-center justify-between mt-6 mb-2">
                                                {statusSteps.map((step, index) => {
                                                    const isCompleted = index <= currentStep
                                                    const isCurrent = index === currentStep
                                                    return (
                                                        <React.Fragment key={step}>
                                                            <div className="flex flex-col items-center relative">
                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                                        ? isCurrent
                                                                            ? `${statusColors[step]} text-white ring-4 ring-offset-2 ring-${step === 'completed' ? 'green' : 'blue'}-200`
                                                                            : 'bg-green-500 text-white'
                                                                        : 'bg-gray-200 text-gray-400'
                                                                    }`}>
                                                                    {isCompleted && !isCurrent ? (
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    ) : (
                                                                        <span className="text-xs font-bold">{index + 1}</span>
                                                                    )}
                                                                </div>
                                                                <span className={`text-[10px] mt-1 font-medium text-center w-16 ${isCompleted ? 'text-gray-700' : 'text-gray-400'
                                                                    }`}>
                                                                    {statusLabels[step]}
                                                                </span>
                                                            </div>
                                                            {index < statusSteps.length - 1 && (
                                                                <div className={`flex-1 h-0.5 mx-1 ${index < currentStep ? 'bg-green-400' : 'bg-gray-200'
                                                                    }`} />
                                                            )}
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </div>

                                            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                                                <span className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                                {request.admin_notes && (
                                                    <span className="text-blue-600 font-medium">Admin: {request.admin_notes}</span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
