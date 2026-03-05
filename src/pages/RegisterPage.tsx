import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react'
import logo from "../images/logo.png";

// Boxes Background Component
const BoxesCore = ({ className = '' }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  
  const colors = [
    "rgb(37 99 235)",   
    "rgb(59 130 246)",  
    "rgb(96 165 250)",  
    "rgb(29 155 209)", 
    "rgb(56 189 248)", 
    "rgb(99 102 241)",  
    "rgb(129 140 248)",
  ];
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={`absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 ${className}`}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-blue-200/40 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-blue-200/40 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-blue-200/40 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const Boxes = React.memo(BoxesCore);

export const RegisterPage = () => {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'student' | 'alumni';
    graduationYear: string;
    department: string;
    alumniType: string;
  }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    graduationYear: '',
    department: '',
    alumniType: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const departments = [
    'Computer Science and Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Electronics and Electrical Communication Engineering',
    'Industrial and Systems Engineering',
    'Aerospace Engineering',
    'Biotechnology',
    'Mathematics and Computing',
    'Physics',
    'Chemistry',
    'Humanities and Social Sciences',
    'Management Studies',
    'Architecture and Regional Planning',
    'Mining Engineering',
    'Metallurgical and Materials Engineering',
    'Ocean Engineering and Naval Architecture',
    'Agricultural and Food Engineering',
    'Textile Technology'
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (formData.role === 'alumni' && (!formData.graduationYear || !formData.department || !formData.alumniType)) {
      setError('Please provide graduation year, department and type for alumni registration')
      return
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      graduation_year: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
      department: formData.department || undefined,
      alumni_type: formData.alumniType || undefined
    })

    if (success) {
      navigate('/')
    } else {
      setError('Registration failed. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-gradient-to-br from-blue-50/80 via-white/60 to-blue-100/80 flex items-center justify-center p-4">
      {/* Boxes Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50/80 via-white/60 to-blue-100/80 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      
      {/* Registration Form - Centered */}
      <div className="relative z-30 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full backdrop-blur-sm">
              <Link to='/'>
                <img
                  src={logo}
                  alt="Logo"
                  className="h-16 w-16 object-contain"
                />
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Join KGP Launchpad
          </h1>
          <p className="text-gray-600">
            Create your account to get started
          </p>
        </div>

        <Card className="shadow-2xl bg-white/90 backdrop-blur-md border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-gray-800">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Fill in your details to join our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="pl-10 bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">I am a</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger className="bg-white/70 border-blue-200 text-gray-800">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200">
                    <SelectItem value="student">Current Student</SelectItem>
                    <SelectItem value="alumni">Alumni / Founder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'alumni' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="alumniType" className="text-gray-700">Type</Label>
                    <Select value={formData.alumniType} onValueChange={(value) => handleSelectChange('alumniType', value)}>
                      <SelectTrigger className="bg-white/70 border-blue-200 text-gray-800">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                         <SelectItem value="Founder">Founder</SelectItem>
                         <SelectItem value="Working Professional">Working Professional</SelectItem>
                         <SelectItem value="Agency Owner">Agency Owner</SelectItem>
                         <SelectItem value="Course Manager">Course Manager</SelectItem>
                         <SelectItem value="Higher Studies">Higher Studies</SelectItem>
                         <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear" className="text-gray-700">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      name="graduationYear"
                      type="number"
                      min="1950"
                      max="2024"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      placeholder="e.g., 2010"
                      className="bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                      <SelectTrigger className="bg-white/70 border-blue-200 text-gray-800">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200 max-h-60">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="pl-10 pr-10 bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full bg-white/70 border-blue-200 text-gray-800 hover:bg-blue-50" asChild>
                  <Link to="/login">
                    Sign in instead
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            By creating an account, you agree to our{' '}
            <Link to="/terms-of-service" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}