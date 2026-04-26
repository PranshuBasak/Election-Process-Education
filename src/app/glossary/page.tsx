'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  Scale, 
  ExternalLink, 
  Hash,
  ChevronRight,
  Info,
  Filter,
  X
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const TERMS = [
  { id: "evm", term: "EVM (Electronic Voting Machine)", category: "Technology", definition: "A portable electronic device used for recording votes in Indian elections. It consists of a Ballot Unit and a Control Unit. EVMs have been used in all general elections since 2004." },
  { id: "vvpat", term: "VVPAT (Voter Verifiable Paper Audit Trail)", category: "Technology", definition: "A printer attached to the EVM that produces a slip showing the candidate's name and symbol selected by the voter. Mandatory in all elections since 2019." },
  { id: "mcc", term: "MCC (Model Code of Conduct)", category: "Legal", definition: "A set of guidelines issued by ECI that comes into force from the date of election announcement until results are declared. It regulates the conduct of parties and candidates." },
  { id: "nota", term: "NOTA (None Of The Above)", category: "Voter Rights", definition: "An option on the EVM that allows voters to officially reject all candidates. Introduced in 2013 by the Supreme Court." },
  { id: "epic", term: "EPIC (Electors Photo Identity Card)", category: "Voter ID", definition: "Commonly known as Voter ID card. A photo identity card issued by ECI to registered voters. It is the primary document for identification." },
  { id: "fptp", term: "FPTP (First Past The Post)", category: "System", definition: "The electoral system where the candidate with the most votes in a constituency wins, regardless of whether they have a majority (50%+)." },
  { id: "blo", term: "BLO (Booth Level Officer)", category: "Administration", definition: "A local official assigned to each polling booth to maintain the voter list and assist with voter registration." },
  { id: "form-6", term: "Form 6", category: "Registration", definition: "The application form for new voter registration or inclusion of name in the electoral roll." }
];

export default function LegalGlossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(TERMS.map(t => t.category)));

  const filteredTerms = TERMS.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? t.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-4 py-1">Legal Repository</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Election Glossary</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Demystifying the complex legal and technical terms used in the Indian electoral process.
          </p>
        </div>

        <div className="relative mb-12 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search for terms (e.g. EVM, MCC, NOTA...)" 
            className="h-16 pl-12 pr-4 rounded-3xl border-none shadow-xl text-lg focus-visible:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all ${
              activeCategory === null ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'
            }`}
          >
            All Terms
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all ${
                activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTerms.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden group">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <Scale className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[10px] uppercase tracking-wider">
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-black text-slate-800 leading-tight">
                      {item.term}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {item.definition}
                    </p>
                    <div className="pt-4 border-t border-slate-50">
                      <a href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline">
                        Read Legal Reference
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-24">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No terms found</h3>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
          </div>
        )}

        <div className="mt-24 p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Book className="h-64 w-64 -rotate-12" />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Info className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Can't find a term?</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our AI-powered assistant can explain any election-related term in simple language. Try asking the bot directly!
              </p>
              <button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Ask the Election Bot
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["First-time Voter", "Model Code", "Electoral Roll", "Polling Booth"].map((tag, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-3">
                  <Hash className="h-5 w-5 text-indigo-400" />
                  <span className="font-bold text-slate-700 text-sm">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
