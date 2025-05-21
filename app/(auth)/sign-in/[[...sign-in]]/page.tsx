'use client'
import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar';

export default function LoginPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/user', { method: 'POST' });
      router.replace(redirectUrl);
    }
  }, [isSignedIn, redirectUrl, router]);

  return (
    <div className="flex min-h-screen">
      <PrimarySidebar />
      <main className="flex-1 flex items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "shadow-none border rounded-lg",
            }
          }}
          forceRedirectUrl={redirectUrl}
        />
      </main>
    </div>
  );
}