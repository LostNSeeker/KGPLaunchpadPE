import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import type { Service } from '../../types'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import toast from 'react-hot-toast'

export const MyServicesPage: React.FC = () => {
  const { token } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [token])

  const fetchServices = async () => {
    try {
      const response = await fetch(getApiUrl('/api/launchpad/my-services'), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        toast.error('Failed to fetch your services')
      }
    } catch {
      toast.error('Error loading services')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(getApiUrl(`/api/launchpad/services/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success('Service deleted successfully')
        setServices(services.filter(s => s.id !== id))
      } else {
        toast.error('Failed to delete service')
      }
    } catch {
      toast.error('Error deleting service')
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/alumni/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
              <p className="text-gray-500 mt-1">Manage the services you offer to the community</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/alumni/services/create">
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Link>
          </Button>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't listed any services yet. Start offering your expertise to the alumni community!
            </p>
            <Button asChild>
              <Link to="/alumni/services/create">Create Your First Service</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="relative h-48 bg-gray-200">
                  {service.image_url ? (
                    <img 
                      src={service.image_url} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={service.is_active ? "default" : "secondary"} className={service.is_active ? "bg-green-500" : "bg-gray-500"}>
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">{service.category}</Badge>
                    <span className="text-xs text-gray-500">{new Date(service.created_at).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="line-clamp-1 text-xl">{service.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-gray-600 line-clamp-3 text-sm">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                    <span>{service.price_range || 'Price negotiable'}</span>
                    <span>•</span>
                    <span>{service.delivery_time || 'Check details'}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-gray-50 p-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/alumni/services/${service.id}/edit`}>
                      <Edit2 className="h-3 w-3 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
