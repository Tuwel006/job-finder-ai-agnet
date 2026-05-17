'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Menu, Command } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/stores/ui_store'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/components/ui'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()
  const { toggleSidebar } = useUIStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const userInitials = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 h-12 transition-all duration-150 ease-in-out px-4 flex items-center justify-between",
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]" : "bg-white border-b border-slate-200"
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-8 pr-10 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all shadow-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[9px] font-medium text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded-sm pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors focus:outline-none">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary border-2 border-white rounded-full" />
        </button>

        {/* User Avatar Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative flex items-center justify-center w-7 h-7 bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-md transition-all focus:outline-none focus:ring-1 focus:ring-primary overflow-hidden">
              <span className="text-slate-600 font-semibold text-[11px]">
                {userInitials}
              </span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end" 
              sideOffset={6}
              className="z-50 w-48 bg-white rounded-md border border-slate-200 shadow-md p-1 animate-in fade-in zoom-in-95"
            >
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
              
              <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-sm cursor-pointer outline-none transition-colors">
                Profile Settings
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-sm cursor-pointer outline-none transition-colors">
                Billing
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
              
              <DropdownMenu.Item 
                onClick={logout}
                className="flex items-center px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-sm cursor-pointer outline-none transition-colors"
              >
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}

export default Header