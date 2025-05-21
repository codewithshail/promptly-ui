'use client'
import { SignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar';

export default function SignupPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // Call API to create user in DB
      fetch('/api/user', { method: 'POST' });
      // Redirect to reference form
      router.replace('/refrence-form');
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null; // Prevent flicker

  return (
    <div className="flex min-h-screen">
      <PrimarySidebar />
      <main className="flex-1 flex items-center justify-center">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "shadow-none border rounded-lg",
            }
          }}
          forceRedirectUrl="/refrence-form"
        />
      </main>
    </div>
  );
}