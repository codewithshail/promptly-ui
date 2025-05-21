import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db'; // Adjust this import if your db instance is elsewhere
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Query Neon DB for user with Clerk userId
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user.length) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json({ user: user[0] });
}

export async function POST() {
  const { userId } = await auth();
  console.log('POST /api/user called, userId:', userId);
  if (!userId) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const clerkUser = await currentUser();
    console.log('Clerk user:', clerkUser);
    if (!clerkUser) {
      return Response.json({ error: 'User not found in Clerk' }, { status: 404 });
    }

    const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    console.log('Existing user:', existing);
    if (existing.length) {
      return Response.json({ user: existing[0] });
    }

    const [created] = await db
      .insert(users)
      .values({
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        username:
          clerkUser.username ||
          clerkUser.emailAddresses[0]?.emailAddress ||
          `user_${userId}`,
        profileImage: clerkUser.imageUrl || '',
        reference: 'other', // Default value
      })
      .returning();

    console.log('Created user:', created);

    return Response.json({ user: created });
  } catch (error) {
    console.error('Error inserting user:', error);
    return Response.json({ error: 'Failed to create user', details: String(error) }, { status: 500 });
  }
}