import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const categoryId = url.searchParams.get('categoryId')
  const search = url.searchParams.get('search')
  const limit = parseInt(url.searchParams.get('limit') || '50')
  
  try {
    let tools = []
    
    if (categoryId) {
      // Fetch tools by category
      const toolCategories = await db.query.toolCategories.findMany({
        where: (toolCategories, { eq }) => eq(toolCategories.categoryId, categoryId),
        with: {
          tool: true
        }
      })
      
      tools = toolCategories.map(tc => tc.tool)
    } else if (search) {
      // Search tools
      const allTools = await db.query.tools.findMany()
      const searchTerm = search.toLowerCase()
      
      tools = allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) || 
        tool.description.toLowerCase().includes(searchTerm) ||
        (tool.subtitle && tool.subtitle.toLowerCase().includes(searchTerm))
      )
    } else {
      // Fetch all tools with pagination
      tools = await db.query.tools.findMany({
        limit
      })
    }
    
    return NextResponse.json(tools)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}