import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    let { reference } = body;

    // Accept both string and array, always store as JSON string
    if (Array.isArray(reference)) {
      reference = JSON.stringify(reference);
    } else if (typeof reference === 'string') {
      // If comma-separated string, convert to array then JSON
      reference = JSON.stringify(reference.split(',').map(r => r.trim()));
    } else {
      return Response.json({ error: 'Invalid reference format' }, { status: 400 });
    }

    const updated = await db
      .update(users)
      .set({ reference })
      .where(eq(users.id, userId))
      .returning();

    return Response.json({ user: updated[0] });
  } catch (error) {
    console.error('PATCH /api/users error:', error);
    return Response.json({ error: 'Failed to update reference', details: String(error) }, { status: 500 });
  }
}