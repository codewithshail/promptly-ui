import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/users'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user exists in our database
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  // If user doesn't exist in our database, create them
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      redirect("/sign-in?redirect_url=/dashboard");
      return null;
    }

    await db.insert(users).values({
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      username: clerkUser.username || `user_${userId.substring(0, 8)}`,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      profileImage: clerkUser.imageUrl || "",
      reference: "", // or null if your schema allows
      creditCoins: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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