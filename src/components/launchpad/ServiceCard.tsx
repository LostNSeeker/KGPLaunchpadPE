import React from 'react'
import { Link } from 'react-router-dom'
import type { Service } from '../../types'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Clock, DollarSign } from 'lucide-react'

interface ServiceCardProps {
  service: Service
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/launchpad/services/${service.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-gray-200">
        <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
          {service.image_url ? (
            <img 
              src={service.image_url} 
              alt={service.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800 hover:bg-white">
            {service.category}
          </Badge>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-blue-600">
            {service.title}
          </h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 pb-2">
          <p className="text-sm text-gray-500 line-clamp-2">
            {service.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 border-t bg-gray-50/50 flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span className="font-medium">{service.price_range || 'Contact for pricing'}</span>
          </div>
          {service.delivery_time && (
             <div className="flex items-center">
               <Clock className="h-4 w-4 mr-1 text-gray-400" />
               <span>{service.delivery_time}</span>
             </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
