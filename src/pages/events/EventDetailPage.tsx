import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, User, Mail, Globe, Loader2, Users, ExternalLink } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { toast } from 'react-hot-toast'
import type { Event } from '../../types'

export const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { token } = useAuth()
    const [event, setEvent] = useState<Event | null>(null)
    const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/events/${id}`), {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                })
                if (res.ok) {
                    const data = await res.json()
                    setEvent(data)
                } else if (res.status === 404) {
                    toast.error('Event not found')
                    navigate('/events')
                }
            } catch (err) {
                console.error('Error fetching event:', err)
                toast.error('Failed to load event')
            } finally {
                setLoading(false)
            }
        }

        const fetchRelatedEvents = async () => {
            try {
                const res = await fetch(getApiUrl('/api/events'))
                if (res.ok) {
                    const data = await res.json()
                    setRelatedEvents(data.filter((e: Event) => e.id !== Number(id)).slice(0, 4))
                }
            } catch (err) {
                console.error('Error fetching related events:', err)
            }
        }

        if (id) {
            fetchEvent()
            fetchRelatedEvents()
        }
    }, [id, token, navigate])

    const handleEnroll = async () => {
        if (!token) {
            toast.error('Please login to register')
            navigate('/login')
            return
        }
        
        setEnrolling(true)
        try {
            const res = await fetch(getApiUrl(`/api/events/${id}/enroll`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (res.ok) {
                toast.success('Successfully registered!')
                const eventRes = await fetch(getApiUrl(`/api/events/${id}`), {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (eventRes.ok) {
                    setEvent(await eventRes.json())
                }
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to register')
            }
} catch {
                toast.error('Something went wrong')
            } finally {
            setEnrolling(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0f0a1f]">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (!event) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#0f0a1f]">
            {/* Hero Section - Dark */}
            <section className="relative bg-gradient-to-br from-[#0f0a1f] via-[#1a1033] to-[#0f0a1f] pt-24 pb-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600"} 
                        alt="" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1f]/80 via-[#0f0a1f]/70 to-[#0f0a1f]"></div>
                </div>

                {/* Stars */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: Math.random() * 0.5 + 0.2
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Back Button */}
                    <Link to="/events" className="inline-flex items-center text-purple-300 hover:text-purple-200 mb-6 group">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>

                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-400 mb-6">
                        <Link to="/" className="hover:text-purple-300">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/events" className="hover:text-purple-300">Events</Link>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {event.title}
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {event.description.slice(0, 250)}...
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content - Light Background */}
            <section className="relative -mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About Event Card - White */}
                            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4 border-b">
                                    <CardTitle className="text-2xl font-bold text-gray-900">About Event</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                                        {event.description.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-4">{paragraph}</p>
                                        ))}
                                    </div>

                                    {/* Event Image */}
                                    {event.image_url && (
                                        <div className="mt-8 rounded-xl overflow-hidden">
                                            <img 
                                                src={event.image_url} 
                                                alt={event.title}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Speaker Section - White */}
                            {event.speaker_name && (
                                <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="pb-4 border-b">
                                        <CardTitle className="text-2xl font-bold text-gray-900">Speaker</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {/* Speaker Image */}
                                            <div className="flex-shrink-0">
                                                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
                                                    <img 
                                                        src={event.speaker_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.speaker_name)}&size=200&background=7c3aed&color=fff`}
                                                        alt={event.speaker_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Speaker Info */}
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.speaker_name}</h3>
                                                
                                                {event.speaker_bio && (
                                                    <p className="text-gray-600 leading-relaxed mb-6">{event.speaker_bio}</p>
                                                )}

                                                {event.speaker_contact && (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Contact Info:</p>
                                                        <div className="space-y-2">
                                                            {event.speaker_contact.includes('@') ? (
                                                                <a 
                                                                    href={`mailto:${event.speaker_contact}`}
                                                                    className="flex items-center gap-3 text-purple-600 hover:text-purple-700"
                                                                >
                                                                    <Mail className="h-5 w-5" />
                                                                    {event.speaker_contact}
                                                                </a>
                                                            ) : (
                                                                <a 
                                                                    href={event.speaker_contact.startsWith('http') ? event.speaker_contact : `https://${event.speaker_contact}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 text-purple-600 hover:text-purple-700"
                                                                >
                                                                    <Globe className="h-5 w-5" />
                                                                    {event.speaker_contact}
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar - Dark Theme */}
                        <div className="space-y-6">
                            {/* Date and Time Card - Dark */}
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-[#1a1033] to-[#0f0a1f] rounded-2xl overflow-hidden">
                                <CardHeader className="pb-2 border-b border-white/10">
                                    <CardTitle className="text-xl font-bold text-white">Date and Time</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {new Date(event.date).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <p className="text-white font-medium">{event.time}</p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <p className="text-white font-medium">{event.location}</p>
                                    </div>

                                    {event.speaker_name && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <User className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <p className="text-white font-medium">{event.speaker_name}</p>
                                        </div>
                                    )}

                                    <div className="pt-4 mt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                                            <Users className="h-4 w-4" />
                                            <span>{event.attendee_count || 0} people registered</span>
                                        </div>
                                        
                                        {event.is_enrolled ? (
                                            <Button className="w-full bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30" disabled>
                                                ✓ Already Registered
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6"
                                                onClick={handleEnroll}
                                                disabled={enrolling}
                                            >
                                                {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                BUY TICKET
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Events - Dark */}
                            {relatedEvents.length > 0 && (
                                <Card className="border-0 shadow-xl bg-gradient-to-br from-[#1a1033] to-[#0f0a1f] rounded-2xl overflow-hidden">
                                    <CardHeader className="pb-2 border-b border-white/10">
                                        <CardTitle className="text-xl font-bold text-white">Related Events</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                        {relatedEvents.map((relEvent) => (
                                            <Link 
                                                key={relEvent.id} 
                                                to={`/events/${relEvent.id}`}
                                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={relEvent.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'}
                                                        alt={relEvent.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm line-clamp-2 text-white group-hover:text-purple-300 transition-colors">
                                                        {relEvent.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                        <Calendar className="h-3 w-3 text-purple-400" />
                                                        <span>
                                                            {new Date(relEvent.date).toLocaleDateString(undefined, { 
                                                                month: 'short', 
                                                                day: 'numeric', 
                                                                year: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Dark */}
            <section className="py-24 bg-gradient-to-br from-[#0f0a1f] via-[#1a1033] to-[#0f0a1f] mt-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                READY TO CREATE YOUR OWN UNFORGETTABLE EVENT?
                            </h2>
                        </div>
                        <div>
                            <p className="text-purple-300 mb-6">
                                Sign up for Eventify today and start planning your next success!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Input 
                                    type="email"
                                    placeholder="Write Your Email" 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1 py-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6">
                                    JOIN NOW
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer would go here - but keeping consistent with site footer */}
        </div>
    )
}
