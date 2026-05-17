'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronDown, PlayCircle, FileText } from 'lucide-react'
import { cn } from '@/components/ui'

const tabs = ['Interview Questions', 'Company Insights', 'Resume Tips']

const questions = [
  { q: "Tell me about a time you optimized a React application's performance.", practiced: true },
  { q: "How do you handle state management in Next.js?", practiced: false },
  { q: "Describe your experience with CI/CD pipelines.", practiced: false },
]

export default function PreparationPage() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#0F172A] rounded-lg p-6 text-white shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
           <div>
             <h2 className="text-xl font-bold tracking-tight">Interview Prep Hub</h2>
             <p className="text-white/70 mt-1 text-xs max-w-lg">
               AI-generated preparation materials tailored specifically for your upcoming interviews.
             </p>
           </div>
           <button className="px-4 py-2 bg-white text-[#0F172A] text-xs font-bold rounded-md hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
             <PlayCircle className="w-4 h-4" /> Start Mock Interview
           </button>
         </div>
      </div>

      <div className="flex gap-1.5 p-1 bg-slate-100/80 border border-slate-200 rounded-md w-fit">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-1.5 rounded-sm text-xs font-medium transition-all",
              activeTab === tab ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {questions.map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-md p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-shadow group">
            <div className="flex gap-3">
              <button className={cn("mt-0.5 shrink-0 transition-colors", item.practiced ? "text-green-500" : "text-slate-300 hover:text-green-400")}>
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 text-sm">{item.q}</h4>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-primary cursor-pointer hover:text-primary/80 transition-colors w-fit">
                  <FileText className="w-3.5 h-3.5" /> View AI Suggested Answer <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}