import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Eye, EyeOff, Loader2, Shield, Mail } from 'lucide-react'
import { getApiUrl } from '../config'
import logo from "../images/logo.png";

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

export const AdminLoginPage = () => {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  // Step 1: credentials
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  // Step 2: OTP
  const [otpStep, setOtpStep] = useState(false)
  const [pendingUserId, setPendingUserId] = useState<number | null>(null)
  const [otp, setOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }

      if (data.otp_required) {
        setPendingUserId(data.user_id)
        setOtpStep(true)
      } else {
        // Non-admin account tried this page — redirect to regular login
        setError('This login page is for admin accounts only.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(getApiUrl('/api/auth/admin/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: pendingUserId, otp }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid or expired OTP')
        return
      }

      loginWithToken(data.token, data.user)
      navigate('/admin/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-gradient-to-br from-blue-50/80 via-white/60 to-blue-100/80 flex items-center justify-center p-4">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50/80 via-white/60 to-blue-100/80 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />

      <div className="relative z-30 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full backdrop-blur-sm">
              <Link to='/'>
                <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Admin Login</h1>
          </div>
          <p className="text-gray-600">Sign in to access the admin panel</p>
        </div>

        <Card className="shadow-2xl bg-white/90 backdrop-blur-md border-blue-200/50">
          {!otpStep ? (
            <>
              <CardHeader>
                <CardTitle className="text-gray-800">Admin Sign In</CardTitle>
                <CardDescription className="text-gray-600">Enter your admin credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCredentials} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter admin email"
                      className="bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter admin password"
                        className="pr-10 bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
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

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                    ) : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-gray-800">Verify OTP</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  A 6-digit OTP has been sent to the admin email address. It expires in 5 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOtpVerify} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-gray-700">One-Time Password</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="text-center text-2xl tracking-[0.5em] bg-white/70 border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-lg"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                    ) : 'Verify OTP'}
                  </Button>

                  <button
                    type="button"
                    onClick={() => { setOtpStep(false); setOtp(''); setError('') }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Back to login
                  </button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
