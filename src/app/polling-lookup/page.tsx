'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  CreditCard, 
  SearchIcon, 
  Info,
  Loader2,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function PollingLookup() {
  const [searchType, setSearchType] = useState<'details' | 'epic'>('details');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        station: "Government Primary School, Room No. 2",
        address: "123 Civic Lane, Sector 4, New Delhi - 110001",
        assembly: "New Delhi Assembly",
        parliamentary: "New Delhi Parliamentary",
        officer: "Mr. Rajesh Kumar (BLO)",
        contact: "+91 98765 43210"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-4 py-1">Voter Services</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Polling Station Lookup</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find your designated voting booth and assembly information in seconds. Use your EPIC card or personal details.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex space-x-1">
            <button
              onClick={() => setSearchType('details')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                searchType === 'details' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Search by Details
            </button>
            <button
              onClick={() => setSearchType('epic')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                searchType === 'epic' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Search by EPIC No.
            </button>
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden mb-8">
          <CardHeader className="bg-white border-b border-slate-100 p-8">
            <CardTitle className="text-xl flex items-center gap-2">
              {searchType === 'details' ? <User className="h-5 w-5 text-indigo-600" /> : <CreditCard className="h-5 w-5 text-indigo-600" />}
              {searchType === 'details' ? 'Personal Information' : 'Voter ID Details'}
            </CardTitle>
            <CardDescription>
              {searchType === 'details' 
                ? 'Enter your name, age, and state exactly as they appear on your voter ID.' 
                : 'Enter your unique 10-digit EPIC number found on your Voter ID card.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {searchType === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <Input placeholder="Enter your full name" className="h-12 rounded-xl border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Father's/Husband's Name</label>
                    <Input placeholder="Enter relation's name" className="h-12 rounded-xl border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">State / Union Territory</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option>Select State</option>
                      <option>Delhi</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Uttar Pradesh</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Constituency</label>
                    <Input placeholder="Search constituency" className="h-12 rounded-xl border-slate-200" />
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">EPIC Number</label>
                    <Input placeholder="e.g. ABC1234567" className="h-14 text-lg font-mono rounded-xl border-slate-200 text-center uppercase tracking-widest" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">State</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option>Select State</option>
                      <option>Delhi</option>
                      <option>Maharashtra</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
                  {loading ? 'Searching...' : 'Search Polling Station'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 p-6 flex items-start gap-3 border-t border-slate-100">
            <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              This information is fetched directly from the Election Commission of India (ECI) database. If your data is missing, please visit the official <a href="https://voters.eci.gov.in" className="text-indigo-600 font-bold hover:underline">Voter Portal</a>.
            </p>
          </CardFooter>
        </Card>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 px-2">Search Result</h2>
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <div className="bg-indigo-600 h-2 w-full" />
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-3 rounded-2xl">
                        <MapPin className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Polling Station</p>
                        <h3 className="text-xl font-bold text-slate-900">{result.station}</h3>
                        <p className="text-slate-600 mt-1">{result.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-2xl">
                        <Navigation className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Constituency</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="border-slate-200">{result.assembly}</Badge>
                          <Badge variant="outline" className="border-slate-200">{result.parliamentary}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">Booth Level Officer (BLO)</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Name</span>
                        <span className="text-sm font-bold text-slate-900">{result.officer}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Contact</span>
                        <span className="text-sm font-bold text-indigo-600">{result.contact}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4 rounded-xl border-slate-200 flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Get Directions on Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
