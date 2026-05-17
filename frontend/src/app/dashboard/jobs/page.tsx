'use client'

import { useState } from 'react'
import { Search, MapPin, Building2, DollarSign, Filter, Bookmark, ChevronDown } from 'lucide-react'
import { cn } from '@/components/ui'

const mockJobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Acme Corp', location: 'San Francisco, CA (Hybrid)', salary: '$140k - $180k', type: 'Full-time', match: 94, posted: '2d ago', logo: 'A' },
  { id: 2, title: 'React Developer', company: 'TechStart', location: 'Remote', salary: '$120k - $150k', type: 'Full-time', match: 88, posted: '5h ago', logo: 'T' },
  { id: 3, title: 'Lead UI/UX Engineer', company: 'DesignSystem Inc', location: 'New York, NY', salary: '$150k - $190k', type: 'Contract', match: 82, posted: '1d ago', logo: 'D' },
  { id: 4, title: 'Frontend Developer', company: 'Global Solutions', location: 'London, UK (Remote)', salary: '£70k - £90k', type: 'Full-time', match: 79, posted: '3d ago', logo: 'G' },
]

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="w-full flex-1 space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Search Roles</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="e.g. Senior React Developer" 
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center justify-between gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 flex-1 md:flex-none">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Location</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('all')}
          className={cn("pb-2 text-xs font-semibold transition-colors relative", activeTab === 'all' ? "text-primary" : "text-slate-500 hover:text-slate-800")}
        >
          All Jobs
          {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={cn("pb-2 text-xs font-semibold transition-colors relative", activeTab === 'saved' ? "text-primary" : "text-slate-500 hover:text-slate-800")}
        >
          Saved (4)
          {activeTab === 'saved' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      {/* Job List */}
      <div className="grid gap-2.5">
        {mockJobs.map(job => (
          <div key={job.id} className="group bg-white border border-slate-200 p-3.5 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-3.5 items-start sm:items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 rounded-md flex items-center justify-center shrink-0 text-sm font-bold text-slate-600 shadow-sm">
              {job.logo}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{job.title}</h3>
                {job.match > 90 && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded">High Match</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</div>
                <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</div>
              </div>
              <div className="flex gap-1.5 mt-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">{job.type}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded">{job.match}% AI Match</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 mt-3 sm:mt-0">
              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <div className="text-[10px] font-medium text-slate-400">{job.posted}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}