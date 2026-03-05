import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { toast } from 'react-hot-toast'
import type { Event } from '../../types'
import { Loader2 } from 'lucide-react'

// Countdown Timer Component
const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const target = new Date(targetDate).getTime()
            const difference = target - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="flex gap-3 md:gap-6">
            {Object.entries(timeLeft).map(([key, value]) => (
                <div key={key} className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 md:px-6 py-3 border border-white/20">
                        <span className="text-2xl md:text-4xl font-bold text-white">{String(value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs text-purple-200 uppercase mt-2 block tracking-wider">{key}</span>
                </div>
            ))}
        </div>
    )
}

// FAQ Accordion Component
const FAQAccordion: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    
    const faqs = [
        { q: "What types of events are available?", a: "We host a variety of events including podcasts, seminars, webinars, fundae sessions, and networking meetings. Each event is designed to provide valuable insights and networking opportunities." },
        { q: "How do I register for an event?", a: "Simply click on the event you're interested in and click the 'Register' or 'Buy Ticket' button. You'll need to be logged in to complete your registration." },
        { q: "Can I cancel my registration?", a: "Yes, you can cancel your registration up to 24 hours before the event. Contact our support team for assistance with cancellations." },
        { q: "Are events recorded?", a: "Most of our webinars and online sessions are recorded. Registered attendees receive access to recordings after the event concludes." },
        { q: "How can I become a speaker?", a: "If you're interested in speaking at one of our events, please reach out through our contact form with your topic proposal and background." }
    ]

    return (
        <div className="space-y-4">
            {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                        className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        {openIndex === i ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                    </button>
                    {openIndex === i && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-600">{faq.a}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export const EventsPage: React.FC = () => {
    const { token } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [enrollingId, setEnrollingId] = useState<number | null>(null)
    const [selectedType, setSelectedType] = useState<string>('All')
    const [searchQuery] = useState('')
    const [email, setEmail] = useState('')

    const fetchEvents = async () => {
        try {
            const res = await fetch(getApiUrl('/api/events'), {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (err) {
            console.error('Error fetching events:', err)
            toast.error('Failed to load events')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [token])

    const handleEnroll = async (eventId: number) => {
        if (!token) {
            toast.error('Please login to register')
            return
        }
        
        setEnrollingId(eventId)
        try {
            const res = await fetch(getApiUrl(`/api/events/${eventId}/enroll`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (res.ok) {
                toast.success('Successfully registered!')
                fetchEvents()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to register')
            }
        } catch {
            toast.error('Something went wrong')
        } finally {
            setEnrollingId(null)
        }
    }

    const filteredEvents = events
        .filter(e => selectedType === 'All' || e.type === selectedType)
        .filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     e.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const featuredEvent = events.length > 0 ? events[0] : null
    const eventTypes = ['All', 'Podcast', 'Seminar', 'Webinar', 'Fundae Session', 'Meeting']

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0f0a1f]">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section - Dark */}
            <section className="relative bg-gradient-to-br from-[#0f0a1f] via-[#1a1033] to-[#0f0a1f] min-h-[80vh] flex items-center overflow-hidden pt-20">
                {/* Stars/Particles Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: Math.random() * 0.7 + 0.3
                            }}
                        />
                    ))}
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <p className="text-purple-400 mb-4 uppercase tracking-wider text-sm">MANAGE YOUR EVENTS WITH</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                The Ultimate Platform for Planning and Promoting Successful Events
                            </h1>
                            <p className="text-gray-400 text-lg mb-8">
                                Join thousands of event organizers and attendees. Discover, create, and manage amazing events with our comprehensive platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                                    Get Started
                                </Button>
                                <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:border-purple-300 hover:text-white">
                                    Learn More
                                </Button>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800" 
                                    alt="Speaker"
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1f]/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white font-medium">Featured Speaker</p>
                                    <p className="text-gray-400 text-sm">Industry Expert & Thought Leader</p>
                                </div>
                            </div>
                            
                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-xl">{events.length}+</p>
                                        <p className="text-gray-400 text-sm">Upcoming Events</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Are Section - Light */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="md:w-1/3">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">WHO WE ARE</h2>
                                <div className="w-16 h-1 bg-purple-600"></div>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    We are a community of innovators, thought leaders, and passionate individuals dedicated to 
                                    creating meaningful connections through events. Our platform brings together the brightest 
                                    minds from IIT Kharagpur and beyond.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    From tech talks to casual fundae sessions, our events are designed to foster learning, 
                                    networking, and meaningful connections. Join us to be part of something extraordinary.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Event with Countdown - Dark */}
            {featuredEvent && (
                <section className="py-20 bg-gradient-to-br from-[#0f0a1f] via-[#1a1033] to-[#0f0a1f] relative overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-30">
                        <img 
                            src={featuredEvent.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"} 
                            alt="" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a1f] via-[#0f0a1f]/90 to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-4">
                            <span className="text-purple-400 uppercase tracking-wider text-sm">DON'T MISS</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12">
                            {featuredEvent.title}
                        </h2>
                        
                        <div className="flex justify-center mb-12">
                            <CountdownTimer targetDate={featuredEvent.date} />
                        </div>

                        <div className="flex justify-center">
                            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 px-8">
                                <Link to={`/events/${featuredEvent.id}`}>
                                    View Event Details <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Events Section - Light Background */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-purple-600 uppercase tracking-wider text-sm font-medium">UPCOMING</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Latest Events</h2>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {eventTypes.map(type => (
                            <Button
                                key={type}
                                variant={selectedType === type ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedType(type)}
                                className={selectedType === type 
                                    ? "bg-purple-600 hover:bg-purple-700 rounded-full px-6" 
                                    : "rounded-full px-6 border-gray-300 text-gray-600 hover:border-purple-500 hover:text-purple-600"
                                }
                            >
                                {type === 'All' ? 'All Events' : type}
                            </Button>
                        ))}
                    </div>

                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20">
                            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No events found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md bg-white group">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <img 
                                                src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <Badge className="absolute top-4 left-4 bg-purple-600 text-white hover:bg-purple-600">
                                                {event.type}
                                            </Badge>
                                        </div>
                                        <CardContent className="flex-1 pt-4">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                <Link to={`/events/${event.id}`}>
                                                    {event.title}
                                                </Link>
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-purple-500" />
                                                    <span>{new Date(event.date).toLocaleDateString(undefined, {
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-purple-500" />
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>

                                            {/* Speaker Info */}
                                            {event.speaker_name && (
                                                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                                    <img 
                                                        src={event.speaker_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.speaker_name)}&background=7c3aed&color=fff`}
                                                        alt={event.speaker_name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <span className="text-sm text-gray-600">{event.speaker_name}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <div className="w-full flex items-center justify-between">
                                                <span className="text-sm text-gray-500">{event.attendee_count || 0} attending</span>
                                                {event.is_enrolled ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        Registered
                                                    </Badge>
                                                ) : (
                                                    <Button 
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-purple-500 text-purple-600 hover:bg-purple-50"
                                                        onClick={() => handleEnroll(event.id)}
                                                        disabled={enrollingId === event.id}
                                                    >
                                                        {enrollingId === event.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Register
                                                    </Button>
                                                )}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Speakers Section - Light */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-purple-600 uppercase tracking-wider text-sm font-medium">MEET OUR</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Speakers</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {events.slice(0, 4).filter(e => e.speaker_name).map((event, i) => (
                            <div key={i} className="text-center group">
                                <div className="relative mb-4 overflow-hidden rounded-xl">
                                    <img 
                                        src={event.speaker_image || `https://images.unsplash.com/photo-150${i}011347-78bfbfbd5f${24 + i}?w=300`}
                                        alt={event.speaker_name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">{event.speaker_name}</h3>
                                <p className="text-gray-500 text-sm">{event.type} Speaker</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section - Dark */}
            <section className="py-20 bg-gradient-to-br from-[#0f0a1f] via-[#1a1033] to-[#0f0a1f]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-purple-400 uppercase tracking-wider text-sm">EXPLORE</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Event Gallery</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
                            'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
                            'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
                            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
                            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
                            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
                            'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400',
                            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400'
                        ].map((src, i) => (
                            <div key={i} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer">
                                <img 
                                    src={src}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/30 transition-colors duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Our Community - Dark with wave pattern */}
            <section className="py-20 bg-gradient-to-br from-[#1a1033] to-[#0f0a1f] relative overflow-hidden">
                {/* Wave Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320">
                        <path fill="#7c3aed" fillOpacity="0.3" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Join Our Community</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Connect with like-minded professionals, get early access to events, and be part of an amazing community.
                    </p>

                    {/* Brand Logos */}
                    <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-60">
                        <div className="w-20 h-12 bg-white/20 rounded flex items-center justify-center text-white font-bold">IIT</div>
                        <div className="w-20 h-12 bg-white/20 rounded flex items-center justify-center text-white font-bold">KGPF</div>
                        <div className="w-20 h-12 bg-white/20 rounded flex items-center justify-center text-white font-bold">TECH</div>
                        <div className="w-20 h-12 bg-white/20 rounded flex items-center justify-center text-white font-bold">EDU</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8" asChild>
                            <Link to="/register">Get Started</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500/30 hover:text-white px-8" asChild>
                            <Link to="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ Section - Light */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-purple-600">Get Answers to Your Eventify</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Questions with Our FAQs</h2>
                        </div>
                        <FAQAccordion />
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA Section - Dark */}
            <section className="py-16 bg-gradient-to-r from-[#0f0a1f] to-[#1a1033]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                GET READY TO KNOW<br />THE LASTEST UPDATE!
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Input 
                                type="email"
                                placeholder="Enter Your Email" 
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-w-[280px]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap px-8">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
