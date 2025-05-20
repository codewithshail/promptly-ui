import { auth } from '@clerk/nextjs/server'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getRecommendedTools } from '@/lib/recommendations'
import { db } from '@/lib/db'
import { ToolCard } from '@/components/tools/tool-card'
import { ToolGrid } from '@/components/tools/tool-grid'
import Image from 'next/image'


export default async function Dashboard() {
  const { userId } = auth()
  
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
    <div className="container mx-auto py-6 space-y-10">

  <div className="flex items-center justify-center">
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search for AI tools..."
        className="pl-10 border rounded-md shadow-sm dark:bg-background"
      />
    </div>
  </div>


  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-foreground">Recommended Tools</h2>
      <Button variant="link" asChild>
        <a href="/apps">See all</a>
      </Button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedTools.map(tool => (
        <div key={tool.id} className="border rounded-xl shadow-sm hover:shadow-md transition bg-card dark:bg-muted p-4">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  </section>

 
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-foreground">What's New</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {newTools.map(tool => (
        <Card key={tool.id} className="overflow-hidden border rounded-xl shadow-sm bg-card dark:bg-muted">
          <CardHeader className="p-4">
            <CardTitle className="text-lg text-foreground">{tool.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-muted-foreground">
              {tool.subtitle || tool.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted relative">
              {tool.screenshots?.length ? (
                <img
                  src={tool.screenshots[0]}
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
      <h2 className="text-2xl font-bold text-foreground">Recently Used Tools</h2>
      <Button variant="link" asChild>
        <a href="/apps" className="text-primary hover:underline">See all</a>
      </Button>
    </div>

    {uniqueRecentTools.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {uniqueRecentTools.map(tool => (
          <div
            key={tool.id}
            className="flex items-start gap-4 p-4 rounded-xl border shadow-sm bg-card dark:bg-muted hover:bg-accent transition cursor-pointer"
          >
            <div className="min-w-[48px] min-h-[48px] relative rounded overflow-hidden">
              <Image
                src={tool.logo}
                alt={tool.name}
                width={48}
                height={48}
                className="object-contain rounded"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground leading-tight">
                {tool.name}
              </h4>
              <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-background rounded-lg shadow-sm border p-6 text-center">
        <p className="text-muted-foreground mb-4">You haven't used any tools yet</p>
        <Button asChild>
          <a href="/apps">Explore Tools</a>
        </Button>
      </div>
    )}
  </section>


  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-foreground">Bookmarked Tools</h2>
      <Button variant="link" asChild>
        <a href="/bookmarks" className="text-primary hover:underline">See all</a>
      </Button>
    </div>

    {bookmarkedTools.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bookmarkedTools.map(bookmark => (
          <div
            key={bookmark.tool.id}
            className="flex items-start gap-4 p-4 rounded-xl border shadow-sm bg-card dark:bg-muted hover:bg-accent transition cursor-pointer"
          >
            <div className="min-w-[48px] min-h-[48px] relative rounded overflow-hidden">
              <Image
                src={bookmark.tool.logo}
                alt={bookmark.tool.name}
                width={48}
                height={48}
                className="object-contain rounded"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground leading-tight">
                {bookmark.tool.name}
              </h4>
              <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                {bookmark.tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-background rounded-lg shadow-sm border p-6 text-center">
        <p className="text-muted-foreground mb-4">You haven't bookmarked any tools yet</p>
        <Button asChild>
          <a href="/apps">Explore Tools</a>
        </Button>
      </div>
    )}
  </section>
</div>

  )
}