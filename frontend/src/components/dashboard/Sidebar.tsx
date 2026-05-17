'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Heart, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/stores/ui_store'
import { motion, AnimatePresence } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cn } from '@/components/ui'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/dashboard/matches', icon: Heart, label: 'Matches' },
  { href: '/dashboard/preparation', icon: BookOpen, label: 'Preparation' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isSidebarExpanded, toggleSidebar } = useUIStore()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/'
    }
    return pathname.startsWith(href)
  }

  const userInitials = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <Tooltip.Provider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isSidebarExpanded ? 220 : 64 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-[#0F172A] flex flex-col z-50 border-r border-white/5"
      >
        {/* Header / Logo */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">J</span>
            </div>
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-white font-semibold text-sm tracking-tight"
                >
                  JobFind
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            const navLink = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all duration-150 group overflow-hidden",
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-150",
                  active ? "text-primary" : "group-hover:text-slate-200",
                  !isSidebarExpanded && "mx-auto"
                )} />
                
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )

            return isSidebarExpanded ? navLink : (
              <Tooltip.Root key={item.href}>
                <Tooltip.Trigger asChild>
                  {navLink}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content side="right" sideOffset={14} className="z-50 px-2 py-1 bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium rounded shadow-md animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
                    {item.label}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            )
          })}
        </nav>

        {/* Toggle Sidebar Collapse */}
        <div className="px-3 py-1.5 flex justify-end">
           <button 
             onClick={toggleSidebar}
             className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
           >
             {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
           </button>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-white/5 bg-[#0B1120]">
          <div className={cn("flex items-center", isSidebarExpanded ? "gap-2.5 mb-2" : "justify-center mb-2")}>
            <div className="w-7 h-7 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center shrink-0">
              <span className="text-slate-300 font-semibold text-[11px]">
                {userInitials}
              </span>
            </div>
            
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 whitespace-nowrap overflow-hidden"
                >
                  <p className="text-slate-200 text-[11px] font-medium truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-slate-500 text-[10px] truncate">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={logout}
            className={cn(
              "flex items-center transition-all duration-150 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded text-xs group",
              isSidebarExpanded ? "gap-2 w-full px-2.5 py-1.5" : "justify-center w-7 h-7 mx-auto"
            )}
          >
            <LogOut className="w-3.5 h-3.5" />
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden font-medium text-[11px]"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </Tooltip.Provider>
  )
}

export default Sidebar