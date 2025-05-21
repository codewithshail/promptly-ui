import { auth } from '@clerk/nextjs/server'
import { Search, Crown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getRecommendedTools } from '@/lib/recommendations'
import { db } from '@/lib/db'
import { ToolCard } from '@/components/tools/tool-card'
import { ToolGrid } from '@/components/tools/tool-grid'

export default async function Dashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }
  
  // Fetch user data
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId)
  })
  
  // Fetch recommended tools
  const recommendedTools = await getRecommendedTools(userId, 6)
  
  // Fetch new tools
  const newTools = await db.query.tools.findMany({
    where: (tools, { eq }) => eq(tools.isNew, true),
    limit: 6
  })
  
  // Fetch recent tools
  const recentTools = await db.query.usageLogs.findMany({
    where: (usageLogs, { eq }) => eq(usageLogs.userId, userId),
    orderBy: (usageLogs, { desc }) => [desc(usageLogs.timestamp)],
    limit: 6,
    with: {
      tool: true
    }
  })
  
  // Get unique tools from usage logs
  const uniqueRecentTools = Array.from(
    new Map(recentTools.map(log => [log.tool.id, log.tool])).values()
  )
  
  // Fetch bookmarked tools
  const bookmarkedTools = await db.query.bookmarks.findMany({
    where: (bookmarks, { eq }) => eq(bookmarks.userId, userId),
    limit: 6,
    with: {
      tool: true
    }
  })
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-cyan-500 to-purple-900 text-white py-8 rounded-lg mb-8">
        {/* Upgrade your plan button in top right */}
        <div className="absolute top-4 right-4">
          <Button 
            className="bg-black text-white-400 border border-purple-400 hover:bg-gray-900 transition-colors"
            asChild
          >
            <a href="/upgrade">
              <Crown color='gold'/>
              <span>Upgrade to Promptly</span>
            </a>
          </Button>
        </div>

        {/* Main header content */}
        <div className="text-center">
          <h1 className="text-4xl mt-10 font-bold mb-4">What will you Prompt today?</h1>
          <div className="flex justify-center space-x-4 mb-6">
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100 h-4 w-4" />
              <Input 
                placeholder="Search tools as you type..." 
                className="pl-10 bg-gray-800 text-white border-gray-600 focus:border-white placeholder:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended Tools</h2>
          <Button variant="link" asChild>
            <a href="/apps">See all</a>
          </Button>
        </div>
        {recommendedTools.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                No recommendations yet. Select your interests in the reference form!
              </p>
              <Button asChild>
                <a href="/reference-form">Choose Interests</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          recommendedTools.map(({ category, tools }) => (
            <div key={category.id} className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{category.icon}</span>
                <span className="font-semibold">{category.name}</span>
              </div>
              <ToolGrid>
                {tools.map(t => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </ToolGrid>
            </div>
          ))
        )}
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">What's New</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newTools.map(tool => (
            <Card key={tool.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {tool.subtitle || tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted relative">
                  {tool.screenshots && tool.screenshots.length > 0 ? (
                    <img 
                      src={tool.screenshots[0] || "/placeholder.svg"} 
                      alt={tool.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground">No preview</span>
                    </div>
                  )}
                  <Button 
                    className="absolute bottom-4 right-4"
                    size="sm"
                    asChild
                  >
                    <a href={`/apps/${tool.id}`}>Use Tool</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Used Tools</h2>
          <Button variant="link" asChild>
            <a href="/apps">See all</a>
          </Button>
        </div>
        {uniqueRecentTools.length > 0 ? (
          <ToolGrid>
            {uniqueRecentTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </ToolGrid>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't used any tools yet</p>
              <Button asChild>
                <a href="/apps">Explore Tools</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Bookmarked Tools</h2>
          <Button variant="link" asChild>
            <a href="/bookmarks">See all</a>
          </Button>
        </div>
        {bookmarkedTools.length > 0 ? (
          <ToolGrid>
            {bookmarkedTools.map(bookmark => (
              <ToolCard key={bookmark.tool.id} tool={bookmark.tool} />
            ))}
          </ToolGrid>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't bookmarked any tools yet</p>
              <Button asChild>
                <a href="/apps">Explore Tools</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}