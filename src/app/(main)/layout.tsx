import { type ReactNode } from 'react'
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getUser } from "@/lib/supabase/server";

interface MainLayoutProps {
  children: ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}