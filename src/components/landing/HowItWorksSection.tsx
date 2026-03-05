import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProcessStep {
  id: string
  title: string
  subtitle: string
  description: string
  details: string[]
  image: string
  color: string
}

const STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Sign Up & Create Profile",
    subtitle: "Join the KGP Launchpad Community",
    description: "Register as a founder or student. Founders list services they need at a fair cost; students showcase skills and learn by doing real work.",
    details: ["Quick Registration", "Skill-Based Profiles", "Role Selection", "Portfolio Showcase"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "02",
    title: "Founders Get Work Done",
    subtitle: "Quality at a Fair Price",
    description: "Post your service needs on the Launchpad. Get matched with vetted students from IIT KGP who deliver at a cost that works for early-stage startups.",
    details: ["Post Services", "Set Your Budget", "Choose Talent", "Track Progress"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "03",
    title: "Students Learn & Earn",
    subtitle: "Real Projects, Real Skills",
    description: "Browse service requests from founders. Work on real tasks, build your portfolio, and learn from the community — all while earning at a fair rate.",
    details: ["Browse Requests", "Apply to Work", "Deliver & Learn", "Build Portfolio"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "04",
    title: "Launch & Grow Together",
    subtitle: "One Platform, Two Sides",
    description: "Founders get quality output without breaking the bank. Students gain experience and income. Events, courses, and resources support everyone.",
    details: ["Launchpad Services", "Events & Workshops", "Course Library", "Alumni Network"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop",
    color: "from-blue-500 to-cyan-500",
  },
]

const AUTO_ADVANCE_MS = 3000

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(STEPS[0].id)
  const activeStepData = STEPS.find(step => step.id === activeStep)!
  const activeIndex = STEPS.findIndex(step => step.id === activeStep)

  const advanceStep = useCallback(() => {
    setActiveStep(prev => {
      const currentIdx = STEPS.findIndex(s => s.id === prev)
      const nextIdx = (currentIdx + 1) % STEPS.length
      return STEPS[nextIdx].id
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(advanceStep, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [advanceStep])

  const handleStepClick = (id: string) => {
    setActiveStep(id)
  }

  return (
    <section className="py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Your Journey on KGP Launchpad
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            We connect founders who need work done with students who want to learn — at a fair cost for both.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeStep === step.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200/50'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              <span className="hidden sm:inline">{step.title.split(' ')[0]}</span>
              <span className="sm:hidden">{step.id}</span>
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStepData.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="grid md:grid-cols-2 gap-14 items-center min-h-[540px]"
            >
              <div className="py-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${activeStepData.color} text-white text-sm font-semibold mb-5`}>
                  <span>Step {activeStepData.id}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{activeStepData.title}</h3>
                <p className="text-blue-600 font-medium mb-5 text-lg">{activeStepData.subtitle}</p>
                <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg">{activeStepData.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {activeStepData.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-sm md:text-base text-gray-700 font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={activeStepData.image} 
                    alt={activeStepData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${activeStepData.color} opacity-20`} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative w-full h-1 bg-gray-200 rounded-full">
            <motion.div
              className="absolute h-1 bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-4 h-4 -top-1.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"
              initial={{ left: '0%' }}
              animate={{ left: `calc(${(activeIndex / (STEPS.length - 1)) * 100}% - 8px)` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-4 flex justify-between">
            {STEPS.map((step, i) => (
              <button key={step.id} onClick={() => handleStepClick(step.id)} className="text-center flex-1">
                <span className={`text-sm font-semibold transition-colors ${
                  i <= activeIndex ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.id}
                </span>
                <p className={`text-xs mt-1 transition-colors hidden sm:block ${
                  i <= activeIndex ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.title.split(' ').slice(0, 2).join(' ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
