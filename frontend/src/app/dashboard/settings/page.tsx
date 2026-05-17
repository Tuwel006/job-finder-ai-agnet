'use client'

import { User, Bell, Shield, Key } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
      {/* Sidebar Nav */}
      <div className="w-full md:w-56 space-y-1 shrink-0">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 bg-primary/5 border border-primary/10 text-primary font-semibold rounded-md text-xs shadow-sm">
          <User className="w-4 h-4" /> Profile Info
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md text-xs transition-colors">
          <Bell className="w-4 h-4" /> Notifications
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md text-xs transition-colors">
          <Shield className="w-4 h-4" /> Privacy & Security
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md text-xs transition-colors">
          <Key className="w-4 h-4" /> Integrations
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <h2 className="text-base font-bold text-slate-900 mb-5">Personal Information</h2>
          
          <div className="flex items-center gap-5 mb-6">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-center text-xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                Change Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
              <input type="text" defaultValue={user?.name || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all hover:bg-white" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input type="email" defaultValue={user?.email || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all hover:bg-white" />
            </div>
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Current Title</label>
              <input type="text" defaultValue="Senior Software Engineer" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all hover:bg-white" />
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
            <button className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-red-50/50 border border-red-100 rounded-lg p-6">
          <h3 className="text-sm font-bold text-red-800 mb-1.5">Danger Zone</h3>
          <p className="text-xs text-red-600/80 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-md hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}