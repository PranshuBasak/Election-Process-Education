'use client';

import React from 'react';
import { 
  Calendar, 
  Flag, 
  Vote, 
  BarChart3, 
  Megaphone, 
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const TIMELINE_DATA = [
  {
    id: 1,
    phase: "Notification of Election",
    date: "Day 1",
    icon: <Megaphone className="h-6 w-6" />,
    color: "bg-blue-500",
    description: "The President (for Lok Sabha) or Governor (for Assembly) issues the formal notification. The Model Code of Conduct (MCC) comes into immediate effect.",
    legal: "Section 14 & 15 of RPA, 1951"
  },
  {
    id: 2,
    phase: "Nominations & Scrutiny",
    date: "Day 1 - 8",
    icon: <Flag className="h-6 w-6" />,
    color: "bg-orange-500",
    description: "Candidates file their nomination papers and affidavits. Returning Officers (RO) scrutinize the papers to ensure eligibility.",
    legal: "Section 30 of RPA, 1951"
  },
  {
    id: 3,
    phase: "Campaigning Period",
    date: "Day 10 - 25",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "bg-indigo-500",
    description: "Political parties and candidates campaign to reach voters. Ends 48 hours before the conclusion of polling (Silence Period).",
    legal: "Article 324 of Constitution"
  },
  {
    id: 4,
    phase: "Poll Day",
    date: "Varies by Phase",
    icon: <Vote className="h-6 w-6" />,
    color: "bg-green-600",
    description: "Voters go to their designated polling stations to cast their votes via EVM/VVPAT machines.",
    legal: "Conduct of Election Rules, 1961"
  },
  {
    id: 5,
    phase: "Counting & Results",
    date: "Fixed Schedule",
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: "bg-purple-600",
    description: "Votes are counted under strict surveillance of the ECI. Results are declared and the winning candidate is certified.",
    legal: "Section 66 of RPA, 1951"
  }
];

export default function ElectoralTimeline() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1">2024 Election Cycle</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Electoral Timeline & Process</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Understanding the step-by-step journey of an Indian election, from formal notification to the declaration of results.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 md:-translate-x-1/2 rounded-full" />

          <div className="space-y-12">
            {TIMELINE_DATA.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-center gap-8 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Connector Dot */}
                <div className={`absolute left-4 md:left-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg z-10 md:-translate-x-1/2 flex items-center justify-center ${item.color}`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

                {/* Content Side */}
                <div className="md:w-1/2 pl-12 md:pl-0 md:px-12 text-left md:text-right">
                  {idx % 2 !== 0 && <div className="hidden md:block" />}
                  <div className={idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}>
                    <Badge variant="outline" className="mb-2 text-[10px] uppercase font-black tracking-widest border-slate-200 bg-white">
                      {item.date}
                    </Badge>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.phase}</h3>
                  </div>
                </div>

                {/* Card Side */}
                <div className="md:w-1/2 pl-12 md:pl-0 md:px-12">
                  <Card className="border-none shadow-xl rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                        <div className={`${item.color} p-3 rounded-2xl text-white shrink-0 shadow-lg`}>
                          {item.icon}
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-slate-600 leading-relaxed italic">
                            "{item.description}"
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none text-[10px] font-bold">
                              <ChevronRight className="h-3 w-3 inline mr-1" />
                              {item.legal}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 p-10 bg-indigo-600 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Clock className="h-48 w-48 rotate-12" />
          </div>
          <div className="relative z-10 space-y-6 max-w-2xl">
            <h2 className="text-3xl font-black leading-tight">Election Commission's Role in Scheduling</h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              The ECI considers various factors like weather, harvest season, exams, and movement of security forces while deciding the election dates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="https://eci.gov.in" 
                target="_blank"
                className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white text-indigo-600 font-bold shadow-lg hover:bg-indigo-50 transition-colors gap-2"
              >
                View Live Schedule
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-indigo-200" />
                <span className="text-sm font-medium">Updated for 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
