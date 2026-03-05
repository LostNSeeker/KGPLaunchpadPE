import React from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    title: "Launchpad Services",
    description: "Founders: post your service needs at a fair cost. Students: find real work, learn on the job, and build your portfolio.",
    link: "/launchpad",
    linkText: "Go to Launchpad →",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop",
    borderColor: "border-blue-100",
    accentColor: "text-blue-600",
  },
  {
    title: "Founder Connect",
    description: "Connect with alumni entrepreneurs and mentors. Get guidance, find talent, and grow your network within the IIT KGP community.",
    link: "/alumni-connect",
    linkText: "Meet Founders →",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop",
    borderColor: "border-indigo-100",
    accentColor: "text-indigo-600",
  },
  {
    title: "Knowledge Hub",
    description: "Articles, guides, and resources from alumni. Learn from real experiences and stay updated on startup and career insights.",
    link: "/blog",
    linkText: "Read Articles →",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop",
    borderColor: "border-cyan-100",
    accentColor: "text-cyan-600",
  },
  {
    title: "Events & Workshops",
    description: "Seminars, webinars, and networking sessions. Stay sharp and connected with the latest from industry and the community.",
    link: "/events",
    linkText: "View Events →",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop",
    borderColor: "border-blue-100",
    accentColor: "text-blue-600",
  },
]

export const PlatformFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">What We Offer</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            For Founders & Students
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Get work done at a fair cost. Learn by doing. We bring founders and students together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl border ${feature.borderColor} overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{feature.description}</p>
                <Link
                  to={feature.link}
                  className={`inline-flex items-center text-sm font-semibold ${feature.accentColor} group-hover:gap-2 transition-all duration-300`}
                >
                  {feature.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
