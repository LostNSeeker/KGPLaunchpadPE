import { useState, useEffect } from 'react'
import {
    Newspaper, Database, FileText, BookOpen, Wrench, BarChart3,
    Users, Building2, ArrowRight, Sparkles, Globe, TrendingUp, ExternalLink,
    ArrowLeft, Search, MapPin, Tag, Loader2
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { getApiUrl } from '../config'

type Investor = {
    id: number
    name: string
    location: string
    sectors: string
    stage: string
}

interface Resource {
    id: number
    title: string
    description: string
    category: string
    link: string
    image_url: string
    created_at: string
}

const vcFirms = [
    { id: 1, name: 'Sequoia Capital India', location: 'Bangalore', sectors: 'Tech, Consumer, Healthcare', stage: 'Seed, Series A, Series B, Growth' },
    { id: 2, name: 'Accel Partners', location: 'Bangalore', sectors: 'SaaS, Consumer Internet, Fintech', stage: 'Seed, Series A, Series B' },
    { id: 3, name: 'Matrix Partners India', location: 'Mumbai', sectors: 'Consumer, SaaS, Fintech', stage: 'Seed, Series A, Series B' },
    { id: 4, name: 'Nexus Venture Partners', location: 'Mumbai', sectors: 'Tech, Enterprise, Deep Tech', stage: 'Seed, Series A, Series B' },
    { id: 5, name: 'Blume Ventures', location: 'Mumbai', sectors: 'Tech, Consumer, Fintech', stage: 'Pre-seed, Seed, Series A' },
    { id: 6, name: 'Kalaari Capital', location: 'Bangalore', sectors: 'Consumer, Healthcare, Edtech', stage: 'Seed, Series A, Series B' },
    { id: 7, name: 'Lightspeed India', location: 'Delhi NCR', sectors: 'Consumer, Enterprise, SaaS', stage: 'Seed, Series A, Series B, Growth' },
    { id: 8, name: 'Elevation Capital', location: 'Delhi NCR', sectors: 'Consumer, Fintech, SaaS', stage: 'Seed, Series A, Series B' },
    { id: 9, name: 'Tiger Global', location: 'Mumbai', sectors: 'Consumer Internet, Fintech, SaaS', stage: 'Series A, Series B, Growth' },
    { id: 10, name: 'Peak XV Partners', location: 'Bangalore', sectors: 'Tech, Consumer, Fintech', stage: 'Seed, Series A, Series B, Growth' },
    { id: 11, name: 'Chiratae Ventures', location: 'Bangalore', sectors: 'Tech, Healthcare, Consumer', stage: 'Seed, Series A, Series B' },
    { id: 12, name: 'India Quotient', location: 'Mumbai', sectors: 'Consumer, Fintech, Edtech', stage: 'Pre-seed, Seed, Series A' },
]

const angelInvestors: Investor[] = [
    { id: 1, name: 'Kunal Shah', location: 'Mumbai', sectors: 'Fintech, Consumer Internet, Edtech', stage: 'Pre-seed, Seed, Series A, Series B' },
    { id: 2, name: 'Anupam Mittal', location: 'Mumbai', sectors: 'Technology, Consumer Internet, SaaS', stage: 'Pre-seed, Seed, Series A' },
    { id: 3, name: 'Sanjay Mehta', location: 'Mumbai', sectors: 'Deep Tech, Fintech, Edtech', stage: 'Pre-seed, Seed, Series A, Series B' },
    { id: 4, name: 'Rajan Anandan', location: 'Bangalore', sectors: 'SaaS, Big Data, Healthcare', stage: 'Pre-seed, Seed, Series A' },
    { id: 5, name: 'Sachin Bansal', location: 'Bangalore', sectors: 'SaaS, AI, E-commerce', stage: 'Seed, Series A, Series B' },
    { id: 6, name: 'Binny Bansal', location: 'Bangalore', sectors: 'Consumer Internet, Fintech, Edtech', stage: 'Seed, Series A' },
    { id: 7, name: 'Vijay Shekhar Sharma', location: 'Delhi NCR', sectors: 'Fintech, Consumer Tech', stage: 'Series A, Series B, Series C' },
    { id: 8, name: 'Ratan Tata', location: 'Mumbai', sectors: 'E-commerce, Healthcare, Mobility', stage: 'Seed, Series A, Series B' },
    { id: 9, name: 'Kunal Bahl', location: 'Delhi NCR', sectors: 'Technology, Retail, Edtech', stage: 'Seed, Series A, Series B' },
    { id: 10, name: 'Rohit Bansal', location: 'Delhi NCR', sectors: 'Consumer Internet, SaaS', stage: 'Pre-seed, Seed, Series A' },
    { id: 11, name: 'Gokul Rajaram', location: 'Bangalore', sectors: 'Technology, Fintech', stage: 'Series A, Series B' },
    { id: 12, name: 'Zishaan Hayath', location: 'Mumbai', sectors: 'Edtech, E-commerce, Mobility', stage: 'Pre-seed, Seed, Series A' },
    { id: 13, name: 'T.V. Mohandas Pai', location: 'Bangalore', sectors: 'Technology, Women-led Startups', stage: 'Pre-seed, Seed, Series A' },
    { id: 14, name: 'Girish Mathrubootham', location: 'Chennai', sectors: 'SaaS, Cybersecurity, Coworking', stage: 'Pre-seed, Seed, Series A' },
    { id: 15, name: 'Sujeet Kumar', location: 'Bangalore', sectors: 'E-commerce, Fintech, Edtech', stage: 'Seed, Series A, Series B' },
    { id: 16, name: 'Gaurav Munjal', location: 'Bangalore', sectors: 'Edtech, Consumer Tech', stage: 'Pre-seed, Seed, Series A' },
    { id: 17, name: 'Ritesh Agarwal', location: 'Delhi NCR', sectors: 'Consumer Internet, Hospitality', stage: 'Seed, Series A, Series B' },
    { id: 18, name: 'Jitendra Gupta', location: 'Mumbai', sectors: 'Fintech, Consumer Internet', stage: 'Pre-seed, Seed, Series A' },
    { id: 19, name: 'Deep Kalra', location: 'Delhi NCR', sectors: 'Travel, Edtech, Healthtech', stage: 'Pre-seed, Seed, Series A' },
    { id: 20, name: 'Rajesh Sawhney', location: 'Delhi NCR', sectors: 'Fintech, Edtech, Construction', stage: 'Pre-seed, Seed, Series A' },
    { id: 21, name: 'Ramakant Sharma', location: 'Bangalore', sectors: 'E-commerce, SaaS', stage: 'Pre-seed, Seed, Series A' },
    { id: 22, name: 'Amit Lakhotia', location: 'Delhi NCR', sectors: 'Fintech, Social Commerce', stage: 'Pre-seed, Seed, Series A' },
    { id: 23, name: 'Anjali Bansal', location: 'Mumbai', sectors: 'Consumer, Fintech, Healthtech', stage: 'Seed, Series A, Series B' },
    { id: 24, name: 'Arjun Vaidya', location: 'Mumbai', sectors: 'Consumer, Wellness', stage: 'Pre-seed, Seed, Series A' },
    { id: 25, name: 'Amrish Rau', location: 'Bangalore', sectors: 'Fintech, Payments', stage: 'Series A, Series B' },
    { id: 26, name: 'Nikhil Kamath', location: 'Bangalore', sectors: 'Fintech, D2C', stage: 'Seed, Series A, Series B' },
    { id: 27, name: 'Nithin Kamath', location: 'Bangalore', sectors: 'Fintech, Consumer Tech', stage: 'Pre-seed, Seed, Series A' },
    { id: 28, name: 'Kiran Mazumdar-Shaw', location: 'Bangalore', sectors: 'Biotech, Deep Tech', stage: 'Seed, Series A, Series B' },
    { id: 29, name: 'Nandan Nilekani', location: 'Bangalore', sectors: 'Fintech, Deep Tech', stage: 'Series A, Series B, Series C' },
    { id: 30, name: 'Kris Gopalakrishnan', location: 'Bangalore', sectors: 'Deep Tech, Healthtech', stage: 'Seed, Series A, Series B' },
    { id: 31, name: 'Vishal Gondal', location: 'Mumbai', sectors: 'Healthtech, Gaming', stage: 'Seed, Series A, Series B' },
    { id: 32, name: 'Anand Mahindra', location: 'Mumbai', sectors: 'Mobility, Consumer Tech', stage: 'Series A, Series B, Series C' },
    { id: 33, name: 'Sridhar Vembu', location: 'Chennai', sectors: 'SaaS, Consumer Tech', stage: 'Seed, Series A, Series B' },
    { id: 34, name: 'Bhavish Aggarwal', location: 'Bangalore', sectors: 'Mobility, Deep Tech', stage: 'Series A, Series B, Series C' },
    { id: 35, name: 'Vidit Aatrey', location: 'Bangalore', sectors: 'E-commerce, Consumer Tech', stage: 'Seed, Series A, Series B' },
]

const resourceSections = [
    {
        title: 'Startup News',
        description: 'Stay updated with the latest startup ecosystem news, funding rounds, and industry trends.',
        icon: Newspaper,
        gradient: 'from-blue-500 to-blue-600',
        bgGlow: 'bg-blue-500/10',
        items: [
            { name: 'Latest News', desc: 'Breaking stories from the startup world', link: '/resources/news' },
            { name: 'Funding Updates', desc: 'Recent funding rounds and investments', link: '/resources/news' },
        ]
    },
    {
        title: 'Investor Database',
        description: 'Explore a comprehensive database of angel investors, VCs, and funding sources.',
        icon: Database,
        gradient: 'from-blue-600 to-cyan-500',
        bgGlow: 'bg-cyan-500/10',
        items: [
            { name: 'Angel Investors', desc: 'Individual investors & mentors', link: '/resources/database/angels', icon: Users },
            { name: 'VC Firms', desc: 'Venture capital firms & funds', link: '/resources/database/vc', icon: Building2 },
        ]
    },
    {
        title: 'Policy Hub',
        description: 'Government policies, regulations, and incentives for startups in India.',
        icon: FileText,
        gradient: 'from-sky-500 to-blue-600',
        bgGlow: 'bg-sky-500/10',
        items: [
            { name: 'Startup Policies', desc: 'Government schemes & incentives', link: '/resources/policies' },
            { name: 'Compliance Guides', desc: 'Legal & regulatory frameworks', link: '/resources/policies' },
        ]
    },
    {
        title: 'Guides & Learning',
        description: 'Step-by-step guides, frameworks, and playbooks for building startups.',
        icon: BookOpen,
        gradient: 'from-blue-400 to-blue-600',
        bgGlow: 'bg-blue-400/10',
        items: [
            { name: 'Startup Guides', desc: 'Playbooks & how-to guides', link: '/resources/guides' },
            { name: 'Case Studies', desc: 'Learn from real startups', link: '/resources/guides' },
        ]
    },
    {
        title: 'Tools & Reports',
        description: 'Essential tools, templates, and industry reports every founder needs.',
        icon: Wrench,
        gradient: 'from-indigo-500 to-blue-500',
        bgGlow: 'bg-indigo-500/10',
        items: [
            { name: 'Startup Tools', desc: 'Templates, calculators & more', link: '/resources/tools', icon: Wrench },
            { name: 'Industry Reports', desc: 'Market research & insights', link: '/resources/reports', icon: BarChart3 },
        ]
    },
]

function InvestorDatabaseView({ type }: { type: 'angels' | 'vc' }) {
    const [search, setSearch] = useState('')
    const [locationFilter, setLocationFilter] = useState('')
    const navigate = useNavigate()

    const data = type === 'angels' ? angelInvestors : vcFirms
    const title = type === 'angels' ? 'Angel Investors' : 'VC Firms'
    const subtitle = type === 'angels'
        ? 'Browse individual angel investors across India'
        : 'Explore top venture capital firms and funds'

    const locations = [...new Set(data.map(d => d.location))].sort()

    const filtered = data.filter(item => {
        const matchesSearch = !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.sectors.toLowerCase().includes(search.toLowerCase())
        const matchesLocation = !locationFilter || item.location === locationFilter
        return matchesSearch && matchesLocation
    })

    return (
        <div className="min-h-screen bg-[#050510]">
            <section className="relative overflow-hidden pt-28 pb-12">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[128px] animate-pulse"></div>
                    <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <button
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back to Resources</span>
                    </button>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {title}
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 mb-8">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by name or sector..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                            />
                        </div>
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-gray-300 focus:border-blue-500 outline-none"
                        >
                            <option value="">All Locations</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">{filtered.length} {type === 'angels' ? 'investors' : 'firms'} found</p>
                </div>
            </section>

            <section className="pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-base truncate">{item.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin className="h-3 w-3 text-gray-500" />
                                            <span className="text-xs text-gray-400">{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Tag className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-gray-400 leading-relaxed">{item.sectors}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {item.stage.split(', ').map((s, i) => (
                                            <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5 border-blue-500/30 text-blue-300 bg-blue-500/5">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <Database className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-400">No results found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

function ResourceCategoryView({ category }: { category: string }) {
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const categoryTitles: Record<string, string> = {
        news: 'Startup News',
        policies: 'Policy Hub',
        guides: 'Guides & Learning',
        tools: 'Startup Tools',
        reports: 'Industry Reports',
    }

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/resources?category=${category}`))
                if (res.ok) {
                    const data = await res.json()
                    setResources(data)
                }
            } catch (err) {
                console.error('Failed to fetch resources:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchResources()
    }, [category])

    return (
        <div className="min-h-screen bg-[#050510]">
            <section className="relative overflow-hidden pt-28 pb-12">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[128px] animate-pulse"></div>
                </div>
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <button
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back to Resources</span>
                    </button>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {categoryTitles[category] || category}
                        </span>
                    </h1>
                </div>
            </section>

            <section className="pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-300"
                                >
                                    {resource.image_url && (
                                        <div className="h-40 overflow-hidden">
                                            <img src={resource.image_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-blue-500/30 text-blue-300 bg-blue-500/5 mb-3">
                                            {resource.category}
                                        </Badge>
                                        <h3 className="text-white font-semibold mb-2">{resource.title}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2">{resource.description}</p>
                                        <div className="flex items-center gap-1 mt-4 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                                            <span>Read More</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <BookOpen className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-400">No resources yet</h3>
                            <p className="text-gray-500 text-sm">Resources for this category will be added soon.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export function ResourcesPage() {
    const location = useLocation()
    const path = location.pathname

    if (path === '/resources/database/angels') {
        return <InvestorDatabaseView type="angels" />
    }
    if (path === '/resources/database/vc') {
        return <InvestorDatabaseView type="vc" />
    }

    const categoryRoutes: Record<string, string> = {
        '/resources/news': 'news',
        '/resources/policies': 'policies',
        '/resources/guides': 'guides',
        '/resources/tools': 'tools',
        '/resources/reports': 'reports',
    }

    if (categoryRoutes[path]) {
        return <ResourceCategoryView category={categoryRoutes[path]} />
    }

    return (
        <div className="min-h-screen bg-[#050510]">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-28 pb-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse"></div>
                    <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-40 right-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
                            <Sparkles className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Powered by KGP Launchpad</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">
                                Startup{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                                Resources
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Everything you need to build, launch, and scale your startup — from investor databases to policy guides, all in one place.
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> India Focused</span>
                            <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Updated Weekly</span>
                            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Community Driven</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resource Sections Grid */}
            <section className="pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resourceSections.map((section, idx) => {
                            const Icon = section.icon
                            return (
                                <div
                                    key={idx}
                                    className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-500"
                                >
                                    <div className={`absolute -inset-px rounded-2xl ${section.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>

                                    <div className="relative z-10">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} mb-5 shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                                            {section.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                                            {section.description}
                                        </p>

                                        <div className="space-y-2.5">
                                            {section.items.map((item, itemIdx) => {
                                                const ItemIcon = ('icon' in item && item.icon) ? item.icon : ExternalLink
                                                return (
                                                    <Link
                                                        key={itemIdx}
                                                        to={item.link}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-300 group/item"
                                                    >
                                                        <ItemIcon className="h-4 w-4 text-gray-500 group-hover/item:text-blue-400 transition-colors flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-300 group-hover/item:text-white transition-colors">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-600 truncate">{item.desc}</p>
                                                        </div>
                                                        <ArrowRight className="h-3.5 w-3.5 text-gray-600 group-hover/item:text-blue-400 group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
