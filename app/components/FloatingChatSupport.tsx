'use client'

import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'support'
  timestamp: Date
}

export default function FloatingChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can we help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ])
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState('')
  const [step, setStep] = useState<'initial' | 'form' | 'submitted'>('initial')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(error => {
        console.log('Auto-play was prevented:', error)
      })
    }
  }, [])

  const handleToggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !query) return

    setIsSubmitting(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Email: ${email}\nQuery: ${query}`,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate processing time
    setTimeout(() => {
      // Add auto-response message
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'We have received your message, thank you. We\'ll get back to you as soon as we\'re back online during our working hours: Monday to Friday, 9:30 AM – 5:30 PM IST.',
        sender: 'support',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, autoResponse])
      
      // Add follow-up message
      setTimeout(() => {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Hi! Thank you for reaching out to us. We are currently away. Please write to us at service@kailash.asia and our team will reach out to you as soon as possible.',
          sender: 'support',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, followUpMessage])
        setIsSubmitting(false)
        setStep('submitted')
      }, 1000)
    }, 1000)
  }

  const handleStartNewConversation = () => {
    setStep('form')
    setEmail('')
    setQuery('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button - Circular Video */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div
          onClick={handleToggleChat}
          className="relative group cursor-pointer"
        >
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8A9C66] shadow-lg hover:scale-110 transition-transform duration-300 bg-[#8A9C66]">
            {/* Video element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://ik.imagekit.io/gqrc4jrxj/kailash/Shilajit%20Documentry%20720p.mov" type="video/mp4" />
              <source src="https://ik.imagekit.io/gqrc4jrxj/kailash/Shilajit%20Documentry%20720p.mov" type="video/quicktime" />
            </video>

            {/* Overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {/* Message icon overlay - always visible with slight transparency */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-[#FFFCF9] rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-[#8A9C66] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Support</h3>
            <button
              onClick={handleToggleChat}
              className="hover:bg-[#7a8a5a] rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#8A9C66] text-white'
                      : 'bg-gray-100 text-[#373436]'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isSubmitting && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">Typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            {step === 'initial' && (
              <button
                onClick={handleStartNewConversation}
                className="w-full bg-[#8A9C66] hover:bg-[#7a8a5a] text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Start Conversation
              </button>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmitQuery} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="How can we help you?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent text-sm resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email || !query}
                  className="w-full bg-[#8A9C66] hover:bg-[#7a8a5a] disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}

            {step === 'submitted' && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Your message has been sent successfully!
                </p>
                <button
                  onClick={() => {
                    setStep('initial')
                    setMessages([{
                      id: '1',
                      text: 'Hello! How can we help you today?',
                      sender: 'support',
                      timestamp: new Date()
                    }])
                  }}
                  className="text-[#8A9C66] hover:text-[#7a8a5a] text-sm font-medium"
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}