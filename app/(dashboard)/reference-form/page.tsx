'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar'

const referenceOptions = [
  {
    id: 'design',
    name: 'Design',
    description: 'Tools for graphic design, UI/UX, and creative projects',
    icon: '📣'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning, teaching, and educational content tools',
    icon: '🎓'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical research, patient care, and health management',
    icon: '🏥'
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Legal research, document analysis, and compliance',
    icon: '⚖️'
  },
  {
    id: 'fintech',
    name: 'Fintech',
    description: 'Financial analysis, investment, and banking tools',
    icon: '💰'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Lead generation, CRM, and marketing automation',
    icon: '🤝'
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Content creation, scheduling, and analytics',
    icon: '📱'
  },
  {
    id: 'general',
    name: 'General',
    description: 'General purpose AI tools for various needs',
    icon: '🔍'
  },
  {
    id: 'writing',
    name: 'Writing',
    description: 'Content generation, editing, and proofreading tools',
    icon: '✍️'
  }
]

export default function ReferenceSelectionPage() {
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user, isLoaded } = useUser()
  
  const toggleReference = (name: string) => {
    setSelectedReferences(prev =>
      prev.includes(name)
        ? prev.filter(ref => ref !== name)
        : [...prev, name]
    )
  }

  const handleSubmit = async () => {
    if (selectedReferences.length === 0) return

    setIsSubmitting(true)
    
    try {
      // Save reference to database
      await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: selectedReferences,
        }),
      })
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving reference:', error)
      setIsSubmitting(false)
    }
  }
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  if (!user) {
    router.push('/login')
    return null
  }
  
  return (
    <div className="flex min-h-screen">
      <PrimarySidebar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Promptly AI</CardTitle>
              <CardDescription>
                To help us personalize your experience, please select your primary area of interest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {referenceOptions.map(option => (
                  <Button
                    key={option.id}
                    variant={selectedReferences.includes(option.name) ? "default" : "outline"}
                    className="h-auto p-4 justify-start text-left flex items-start gap-3"
                    onClick={() => toggleReference(option.name)}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h3 className="font-medium">{option.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={handleSubmit}
                  disabled={selectedReferences.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    'Continue to Dashboard'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}