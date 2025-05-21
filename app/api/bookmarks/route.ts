import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { bookmarks } from '@/lib/db'

export async function GET(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const userBookmarks = await db.query.bookmarks.findMany({
      where: (bookmarks, { eq }) => eq(bookmarks.userId, userId),
      with: {
        tool: true
      }
    })
    
    return NextResponse.json(userBookmarks)
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const { toolId } = await request.json()
    
    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      )
    }
    
    // Check if bookmark already exists
    const existingBookmark = await db.query.bookmarks.findFirst({
      where: (bookmarks, { eq, and }) => 
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.toolId, toolId)
        )
    })
    
    if (existingBookmark) {
      return NextResponse.json(
        { error: 'Bookmark already exists' },
        { status: 400 }
      )
    }
    
    // Create new bookmark
    await db.insert(bookmarks).values({
      userId,
      toolId,
      createdAt: new Date()
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const url = new URL(request.url)
    const toolId = url.searchParams.get('toolId')
    
    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      )
    }
    
    // Delete bookmark
    await db.delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.toolId, toolId)
        )
      )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}