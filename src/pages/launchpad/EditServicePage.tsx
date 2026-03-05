import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import toast from 'react-hot-toast'
import { Switch } from '../../components/ui/switch'

export const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_range: '',
    delivery_time: '',
    image_url: '',
    is_active: true
  })

  const CATEGORIES = [
    'Technology', 'Marketing', 'Design', 'Legal', 'Finance', 
    'Consulting', 'AI & Machine Learning', 'Blockchain', 'Education', 'Other'
  ]

  useEffect(() => {
    fetchService()
  }, [id, token])

  const fetchService = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/launchpad/services/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
            title: data.title,
            description: data.description,
            category: data.category,
            price_range: data.price_range || '',
            delivery_time: data.delivery_time || '',
            image_url: data.image_url || '',
            is_active: data.is_active ?? true // Handle if property missing
        })
      } else {
        toast.error('Failed to load service details')
        navigate('/alumni/services')
      }
    } catch {
      toast.error('Error loading service')
      navigate('/alumni/services')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleToggleActive = (checked: boolean) => {
      setFormData(prev => ({ ...prev, is_active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(getApiUrl(`/api/launchpad/services/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Service updated successfully!')
        navigate('/alumni/services')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update service')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/alumni/services" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Services
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Service</CardTitle>
            <CardDescription>
              Update your service details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                        {formData.is_active ? 'Your service is visible in Launchpad.' : 'Your service is hidden.'}
                    </p>
                </div>
                <Switch 
                    checked={formData.is_active}
                    onCheckedChange={handleToggleActive}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Full Stack Development"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your service..."
                  required
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price_range">Price Range</Label>
                  <Input
                    id="price_range"
                    name="price_range"
                    placeholder="e.g. ₹50,000 - ₹2,00,000"
                    value={formData.price_range}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_time">Delivery Time</Label>
                  <Input
                    id="delivery_time"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/alumni/services')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
