import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar'
import { ContextualSidebar } from '@/components/layout/sidebar/contextual-sidebar'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getRecommendedTools } from '@/lib/recommendations'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/login')
  }
  
  // Fetch recent tools
  const recentTools = await db.query.usageLogs.findMany({
    where: (usageLogs, { eq }) => eq(usageLogs.userId, userId),
    orderBy: (usageLogs, { desc }) => [desc(usageLogs.timestamp)],
    limit: 5,
    with: {
      tool: true
    }
  })
  
  // Map to the format expected by ContextualSidebar
  const recentToolsFormatted = recentTools.map(log => ({
    id: log.tool.id,
    name: log.tool.name,
    href: `/apps/${log.tool.id}`
  }))
  
  // Fetch recommended tools
  const recommendedTools = await getRecommendedTools(userId, 5)
  
  // Map to the format expected by ContextualSidebar
  const recommendedToolsFormatted = recommendedTools.flatMap(category =>
    category.tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      href: `/apps/${tool.id}`
    }))
  )
  
  return (
    <div className="flex h-screen">
      <ContextualSidebar 
        type="dashboard"
        recentTools={recentToolsFormatted}
        recommendedTools={recommendedToolsFormatted}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}