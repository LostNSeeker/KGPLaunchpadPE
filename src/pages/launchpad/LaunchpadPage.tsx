import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceCard } from '../../components/launchpad/ServiceCard'
import type { Service } from '../../types'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import { AnimatedMarqueeHero } from '../../components/ui/hero-3'
import { FeatureSteps } from '../../components/ui/feature-steps'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'react-hot-toast'
import { Loader2, Send } from 'lucide-react'

const LAUNCHPAD_SERVICE_TYPES = [
  'Web development',
  'App development',
  'UI/UX designing',
  'Case Studies and Analytics',
  'Rag Implementation',
  'Sales AI booster',
]

export const LaunchpadPage: React.FC = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [requestForm, setRequestForm] = useState({
    project_type: '',
    description: '',
    budget_range: '',
  })
  const { token, user } = useAuth()

  useEffect(() => {
    if (user?.role === 'student') {
      navigate('/student-service-profile', { replace: true })
      return
    }
    fetchServices()
  }, [user?.role])

  const fetchServices = async (query = '') => {
    try {
      setLoading(true)
      const url = query 
        ? getApiUrl(`/api/launchpad/services?search=${encodeURIComponent(query)}`)
        : getApiUrl('/api/launchpad/services')
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestForm.project_type || !requestForm.description) {
      toast.error('Please fill in service type and description')
      return
    }
    try {
      setSubmitLoading(true)
      const res = await fetch(getApiUrl('/api/launchpad/requests'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_type: requestForm.project_type,
          description: requestForm.description,
          budget_range: requestForm.budget_range || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Request submitted. We\'ll match you with the right team.')
        setRequestDialogOpen(false)
        setRequestForm({ project_type: '', description: '', budget_range: '' })
      } else {
        toast.error(data.error || 'Failed to submit request')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50 pb-5 pt-5">
      {/* Hero / Banner Section */}
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
                onCtaClick={() => setRequestDialogOpen(true)}
                images={ASK_SERVICES_HERO_IMAGES}
                className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80"
            />

      {/* Submit request dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Tell us about the service you need
            </DialogTitle>
            <DialogDescription>
              Describe your project and we'll connect you with the right experts from our network.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="req-service-type">Service type <span className="text-red-500">*</span></Label>
              <Select
                value={requestForm.project_type}
                onValueChange={(v) => setRequestForm((f) => ({ ...f, project_type: v }))}
              >
                <SelectTrigger id="req-service-type">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {LAUNCHPAD_SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="req-description"
                placeholder="Describe your requirements, goals, and timeline..."
                className="min-h-[120px] resize-y"
                value={requestForm.description}
                onChange={(e) => setRequestForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-budget">Budget range (optional)</Label>
              <Input
                id="req-budget"
                placeholder="e.g. ₹50,000 - ₹2,00,000"
                value={requestForm.budget_range}
                onChange={(e) => setRequestForm((f) => ({ ...f, budget_range: e.target.value }))}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRequestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Services Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Explore Services</h2>
          {/* Filter options could go here */}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-600 font-medium">No services found matching your criteria.</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms or browse all categories.</p>
          </div>
        )}
      </div>

      {/* How we do — feature steps */}
      <section className="bg-white border-t border-gray-100">
        <FeatureSteps
          features={LAUNCHPAD_HOW_STEPS}
          title="How we do it"
          autoPlayInterval={4000}
          imageHeight="h-[200px] md:h-[300px] lg:h-[400px]"
        />
      </section>
    </div>
  )
}

const LAUNCHPAD_HOW_STEPS = [
  {
    step: 'Step 1',
    title: 'Browse or search services',
    content: 'Find the right category and service providers from our verified network of agencies and freelancers.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&auto=format&fit=crop&q=60',
  },
  {
    step: 'Step 2',
    title: 'Submit your request',
    content: 'Describe your project, timeline, and budget via Ask Services or contact a provider directly.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=60',
  },
  {
    step: 'Step 3',
    title: 'Get matched',
    content: 'We connect you with the best-fit team. Align on scope, deliverables, and milestones.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=60',
  },
  {
    step: 'Step 4',
    title: 'Work & deliver',
    content: 'Collaborate, track progress, and get your project delivered. Scale with the same team or try new ones.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=60',
  },
]
