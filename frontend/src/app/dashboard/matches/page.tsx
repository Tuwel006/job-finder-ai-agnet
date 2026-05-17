'use client'

import { Search, Info, ExternalLink } from 'lucide-react'

const mockMatch = {
  title: 'Senior Frontend Engineer',
  company: 'Acme Corp',
  score: 94,
  reasons: [
    'Strong experience with React & Next.js aligns with their core stack.',
    '5+ years of required experience matches your profile.',
    'TypeScript proficiency is a key requirement.'
  ],
  missing: [
    'GraphQL experience is preferred but not required.'
  ]
}

export default function MatchesPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-300">
      {/* Left List */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-3">
        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Filter matches..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
          {/* Active Match Card */}
          <div className="bg-white border-2 border-secondary p-3 rounded-lg shadow-sm cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-10 h-10 bg-secondary/10 rounded-bl-full"></div>
            <div className="flex justify-between items-start mb-1.5 relative z-10">
              <h4 className="text-sm font-bold text-slate-800">Senior Frontend</h4>
              <span className="text-secondary font-bold text-xs">94%</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Acme Corp • San Francisco</p>
          </div>
          
          {/* Inactive Match Card */}
          <div className="bg-white border border-slate-200 hover:border-slate-300 p-3 rounded-lg shadow-sm cursor-pointer transition-colors">
            <div className="flex justify-between items-start mb-1.5">
              <h4 className="text-sm font-semibold text-slate-700">React Developer</h4>
              <span className="text-green-600 font-bold text-xs">88%</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">TechStart • Remote</p>
          </div>
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="hidden md:flex flex-1 bg-white border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-md flex items-center justify-center text-lg font-bold text-slate-700 shadow-sm mb-3">
                A
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{mockMatch.title}</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{mockMatch.company}</p>
            </div>
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-secondary/10 border border-secondary/20 rounded-full">
              <span className="text-sm font-bold text-secondary">{mockMatch.score}%</span>
              <span className="text-[8px] font-semibold text-secondary uppercase tracking-wider">Match</span>
            </div>
          </div>
          <div className="flex gap-2.5 mt-5">
            <button className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm">
              Apply Now
            </button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm">
              <ExternalLink className="w-3.5 h-3.5" /> View Original
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <section>
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-green-500" /> Why you're a match
            </h3>
            <ul className="space-y-2">
              {mockMatch.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 bg-green-50/50 border border-green-100 p-2.5 rounded-md text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></div>
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-orange-500" /> Missing Skills
            </h3>
            <ul className="space-y-2">
              {mockMatch.missing.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 bg-orange-50/50 border border-orange-100 p-2.5 rounded-md text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></div>
                  {reason}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}