'use client'
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

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
