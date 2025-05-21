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
      redirect('/sign-in')
      return null;
    }
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