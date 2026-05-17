'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/stores/ui_store'
import { motion } from 'framer-motion'

interface DashboardLayoutProps {
  children: ReactNode
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/jobs': 'Job Search',
  '/dashboard/matches': 'My Matches',
  '/dashboard/preparation': 'Preparation',
  '/dashboard/settings': 'Settings',
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { isSidebarExpanded } = useUIStore()

  const title = pageTitles[pathname] || 'Dashboard'

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-sm">J</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans text-sm">
      <Sidebar />
      <motion.div 
        layout
        initial={false}
        animate={{ paddingLeft: isSidebarExpanded ? 220 : 64 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex flex-col min-h-screen"
      >
        <Header title={title} />
        <main className="flex-1 p-5 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </motion.div>
    </div>
  )
}