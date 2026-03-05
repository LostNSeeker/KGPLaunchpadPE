import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'react-hot-toast'

export const ProjectSubmissionPage: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    project_type: '',
    description: '',
    budget_range: '',
    service_id: '' // Optional, if they came from a specific service context, though this specific page is generic "Connect with Admin"
  })

  // Pre-defined project types
  const projectTypes = [
    'Web Development',
    'Mobile App Development',
    'Design & Branding',
    'Marketing & SEO',
    'Content Writing',
    'Consulting',
    'Other'
  ]

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
        toast.success('Project request submitted successfully! An admin will contact you shortly.')
        navigate('/launchpad')
      } else {
        toast.error(data.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting project:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
          <h2 className="text-2xl font-bold text-white">Start Your Project</h2>
          <p className="text-blue-100 mt-2">
            Tell us about your needs and we'll connect you with the right experts.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project_type">Project Type <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.project_type} 
              onValueChange={(value) => setFormData({...formData, project_type: value})}
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
            <Label htmlFor="description">Project Description <span className="text-red-500">*</span></Label>
            <Textarea 
              id="description"
              placeholder="Describe your project requirements, goals, and any specific preferences..."
              className="min-h-[150px] resize-y"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Range (Optional)</Label>
            <Input 
              id="budget"
              placeholder="e.g. ₹50,000 - ₹2,00,000"
              value={formData.budget_range}
              onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Our team usually responds within 24 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
