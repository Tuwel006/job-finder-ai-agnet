'use client'

import { useAuth } from '@/hooks/useAuth'
import { StatCard } from '@/components/dashboard/StatCard'
import { Briefcase, Heart, Clock, TrendingUp, Sparkles, ChevronRight, FileText, CheckCircle2, Search } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-semibold text-blue-700 mb-2">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI Matching Active</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}.
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Your profile is currently matching with 12 new positions.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Jobs Matched" value={12} icon={Briefcase} trend="3 new today" trendUp />
        <StatCard label="Saved Matches" value={8} icon={Heart} />
        <StatCard label="Applications" value={3} icon={Clock} trend="2 pending" trendUp={false} />
        <StatCard label="Match Rate" value="87%" icon={TrendingUp} trend="+5% this week" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard/jobs" className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">Search Jobs</p>
                <p className="text-[11px] text-slate-500">Explore 500+ tech roles</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
            
            <Link href="/dashboard/matches" className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-slate-600 group-hover:text-secondary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-secondary transition-colors">View Matches</p>
                <p className="text-[11px] text-slate-500">AI-curated specifically for you</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link href="/dashboard/preparation" className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">Interview Prep</p>
                <p className="text-[11px] text-slate-500">Practice with AI questions</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link href="/dashboard/settings" className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">Update Resume</p>
                <p className="text-[11px] text-slate-500">Improve your match score</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="relative border-l border-slate-200 ml-2 space-y-4">
              
              <div className="relative pl-4">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <p className="text-xs font-semibold text-slate-800">Resume Parsed</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Extracted 15 skills.</p>
                <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase">2 hrs ago</p>
              </div>

              <div className="relative pl-4">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-green-500 ring-4 ring-white"></div>
                <p className="text-xs font-semibold text-slate-800">3 New Matches</p>
                <p className="text-[11px] text-slate-500 mt-0.5">High compatibility roles.</p>
                <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase">5 hrs ago</p>
              </div>

              <div className="relative pl-4">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-white"></div>
                <p className="text-xs font-semibold text-slate-800">Prep Generated</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Questions for Stripe ready.</p>
                <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase">Yesterday</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}