"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Loader2 } from 'lucide-react';
import { Sidebar } from "@/components/layout/sidebar";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!authLoading) {
      if (!user && !isLoginPage) {
        router.push('/login');
      }
      if (user && isLoginPage) {
        router.push('/');
      }
    }
  }, [user, authLoading, router, pathname, isLoginPage]);

  if (authLoading || (!user && !isLoginPage) || (user && isLoginPage)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isLoginPage) {
      return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex flex-1 flex-col sm:py-4 sm:pl-14">
        {children}
      </main>
    </div>
  );
}
