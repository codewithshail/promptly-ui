import { Suspense } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar'
import { ContextualSidebar } from '@/components/layout/sidebar/contextual-sidebar'
import { CategoryCarousel } from '@/components/layout/navigation/category-carousel'
import { ToolGrid } from '@/components/tools/tool-grid'
import { ToolCard } from '@/components/tools/tool-card'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/login')
  }
  
  // Fetch user's bookmarks
  const bookmarks = await db.query.bookmarks.findMany({
    where: (bookmarks, { eq }) => eq(bookmarks.userId, userId),
    with: {
      tool: {
        with: {
          categories: {
            with: {
              category: true
            }
          }
        }
      }
    }
  })
  
  // Get all categories that have bookmarked tools
  const bookmarkedCategories = new Map()
  
  bookmarks.forEach(bookmark => {
    bookmark.tool.categories.forEach(tc => {
      const category = tc.category
      
      if (!bookmarkedCategories.has(category.id)) {
        bookmarkedCategories.set(category.id, {
          id: category.id,
          name: category.name,
          icon: category.icon,
          tools: []
        })
      }
      
      bookmarkedCategories.get(category.id).tools.push({
        id: bookmark.tool.id,
        name: bookmark.tool.name,
        href: `/apps/${bookmark.tool.id}`
      })
    })
  })
  
  const formattedCategories = Array.from(bookmarkedCategories.values())
  
  // Determine which tools to show based on search params
  let tools = bookmarks.map(b => b.tool)
  
  if (searchParams.category) {
    // Filter tools by category
    tools = bookmarks
      .filter(bookmark => 
        bookmark.tool.categories.some(tc => 
          tc.category.name.toLowerCase() === searchParams.category?.toLowerCase()
        )
      )
      .map(b => b.tool)
  } else if (searchParams.search) {
    // Search within bookmarked tools
    const searchTerm = searchParams.search.toLowerCase()
    
    tools = bookmarks
      .filter(bookmark => 
        bookmark.tool.name.toLowerCase().includes(searchTerm) || 
        bookmark.tool.description.toLowerCase().includes(searchTerm) ||
        (bookmark.tool.subtitle && bookmark.tool.subtitle.toLowerCase().includes(searchTerm))
      )
      .map(b => b.tool)
  }
  
  return (
    <div className="flex h-screen">
      <ContextualSidebar 
        type="bookmarks"
        categories={formattedCategories}
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search in bookmarks..." 
                className="pl-10"
                defaultValue={searchParams.search || ''}
              />
            </div>
            
            {formattedCategories.length > 0 && (
              <CategoryCarousel 
                categories={formattedCategories} 
              />
            )}
          </div>
          
          <Suspense fallback={<div>Loading bookmarks...</div>}>
            {tools.length > 0 ? (
              <ToolGrid>
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </ToolGrid>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    {searchParams.category || searchParams.search
                      ? "No bookmarks found matching your criteria"
                      : "You haven't bookmarked any tools yet"}
                  </p>
                  <Button asChild>
                    <a href="/apps">Explore Tools</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  )
}