import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { usageLogs } from '@/lib/db'

export async function GET(request: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const logs = await db.query.usageLogs.findMany({
      where: (usageLogs, { eq }) => eq(usageLogs.userId, userId),
      orderBy: (usageLogs, { desc }) => [desc(usageLogs.timestamp)],
      with: {
        tool: true
      }
    })
    
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching usage logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const { toolId, quantity, cost } = await request.json()
    
    if (!toolId || !quantity || cost === undefined) {
      return NextResponse.json(
        { error: 'Tool ID, quantity, and cost are required' },
        { status: 400 }
      )
    }
    
    // Create usage log
    const id = crypto.randomUUID()
    await db.insert(usageLogs).values({
      id,
      userId,
      toolId,
      quantity,
      cost,
      timestamp: new Date()
    })
    
    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error('Error creating usage log:', error)
    return NextResponse.json(
      { error: 'Failed to create usage log' },
      { status: 500 }
    )
  }
}