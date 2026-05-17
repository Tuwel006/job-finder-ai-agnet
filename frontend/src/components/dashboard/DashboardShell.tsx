'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardShellProps {
  children: ReactNode
  title?: string
}

export function DashboardShell({ children, title = 'Dashboard' }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-60">
        <Header title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardShell