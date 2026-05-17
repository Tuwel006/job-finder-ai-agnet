'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/components/ui'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200/60 shadow-sm transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs font-medium">{label}</p>
          <p className="text-xl font-bold text-slate-800 mt-1 tracking-tight">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm w-fit",
              trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trendUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="p-2 bg-slate-50 border border-slate-100 rounded-md">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </div>
  )
}

export default StatCard