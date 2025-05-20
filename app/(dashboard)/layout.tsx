import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar'
import { ContextualSidebar } from '@/components/layout/sidebar/contextual-sidebar'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getRecommendedTools } from '@/lib/recommendations'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  
  
  return (
    <div className="flex h-screen">
      <PrimarySidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}