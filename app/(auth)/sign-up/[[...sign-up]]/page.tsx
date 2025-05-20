import { SignUp } from '@clerk/nextjs';
import { PrimarySidebar } from '@/components/layout/sidebar/primary-sidebar';

export default function SignupPage() {
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
