"use client"

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

const CLOUD_IMAGE = 'https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/cloud.jpg'

interface CloudWatchFormProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function CloudWatchForm({ children, className, contentClassName }: CloudWatchFormProps) {
  const [isTyping, setIsTyping] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 40
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 20
    setEyePos({ x: offsetX, y: offsetY })
  }, [cursor])

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleFocus = () => setIsTyping(true)
  const handleBlur = () => {
    setTimeout(() => {
      if (formRef.current && !formRef.current.contains(document.activeElement)) {
        setIsTyping(false)
      }
    }, 0)
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-6 rounded-xl border bg-white/30 p-8 shadow-xl backdrop-blur-md',
        className
      )}
    >
      {/* Cartoon Face */}
      <div className="relative h-40 w-[280px] shrink-0">
        <img
          src={CLOUD_IMAGE}
          alt=""
          className="h-full w-full object-contain"
        />
        {['left', 'right'].map((side, idx) => (
          <div
            key={side}
            className="absolute flex items-end justify-center overflow-hidden"
            style={{
              top: 60,
              left: idx === 0 ? 80 : 150,
              width: 28,
              height: isTyping ? 4 : blink ? 6 : 40,
              borderRadius: isTyping || blink ? '2px' : '50% / 60%',
              backgroundColor: isTyping ? 'black' : 'white',
              transition: 'all 0.15s ease',
            }}
          >
            {!isTyping && (
              <div
                className="bg-black"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  marginBottom: 4,
                  transform: `translate(${eyePos.x}px, 0px)`,
                  transition: 'all 0.1s ease',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div
        ref={formRef}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
        className={cn('w-full flex flex-col gap-4', contentClassName)}
      >
        {children}
      </div>
    </div>
  )
}
