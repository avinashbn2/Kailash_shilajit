'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  disabled?: boolean
}

export default function OTPInput({
  length = 6,
  onComplete,
  disabled = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (disabled) return

    // Allow only digits
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]

    // Handle pasted content
    if (value.length > 1) {
      const pastedData = value.slice(0, length).split('')
      pastedData.forEach((char, i) => {
        if (index + i < length && /^\d+$/.test(char)) {
          newOtp[index + i] = char
        }
      })
      setOtp(newOtp)

      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + pastedData.length, length - 1)
      inputRefs.current[nextIndex]?.focus()

      // Check if OTP is complete
      if (newOtp.every((digit) => digit !== '')) {
        onComplete(newOtp.join(''))
      }
      return
    }

    // Handle single character input
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length)

    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(length).fill('')).slice(0, length)
    setOtp(newOtp)

    // Focus last filled input
    const lastFilledIndex = pastedData.length - 1
    inputRefs.current[Math.min(lastFilledIndex, length - 1)]?.focus()

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
            ${
              disabled
                ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                : 'border-gray-300 focus:border-olive focus:ring-2 focus:ring-olive/20'
            }
            transition-all outline-none`}
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}
