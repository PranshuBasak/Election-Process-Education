"use client";

import React from 'react';
import { BookOpen, ClipboardList, MapPin, Info, Shield, Scale, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  {
    id: 1,
    title: "Voter Registration",
    description: "Learn how to apply for a Voter ID card, verify your details in the electoral roll, and update your information.",
    icon: <ClipboardList className="h-8 w-8 text-indigo-600" />,
    topics: ["Eligibility Criteria", "Online Registration (Form 6)", "Checking Name in Roll", "Voter ID Corrections"],
    color: "bg-indigo-50",
    border: "border-indigo-100"
  },
  {
    id: 2,
    title: "The Polling Process",
    description: "A comprehensive guide on what happens at the polling booth on election day.",
    icon: <MapPin className="h-8 w-8 text-orange-600" />,
    topics: ["Locating Polling Station", "Polling Hours", "EVM and VVPAT", "The Voting Step-by-Step"],
    color: "bg-orange-50",
    border: "border-orange-100"
  },
  {
    id: 3,
    title: "Election Laws & Rights",
    description: "Understand the Model Code of Conduct and your legal rights as a citizen and voter.",
    icon: <Scale className="h-8 w-8 text-emerald-600" />,
    topics: ["Model Code of Conduct", "Anti-Defection Law", "Right to NOTA", "Election Offences"],
    color: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    id: 4,
    title: "Political Parties & Candidates",
    description: "How to research candidates and understand the party system in India.",
    icon: <Users className="h-8 w-8 text-blue-600" />,
    topics: ["National vs State Parties", "Candidate Affidavits", "Manifesto Analysis", "Know Your Candidate"],
    color: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    id: 5,
    title: "Security & Transparency",
    description: "Learn about the measures taken to ensure free and fair elections.",
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    topics: ["Role of ECI", "VVPAT Verification", "Election Observers", "Security at Booths"],
    color: "bg-purple-50",
    border: "border-purple-100"
  },
  {
    id: 6,
    title: "Important Dates",
    description: "Stay updated with the upcoming election schedule and deadlines.",
    icon: <Calendar className="h-8 w-8 text-rose-600" />,
    topics: ["Registration Deadlines", "Nomination Dates", "Polling Phases", "Result Day"],
    color: "bg-rose-50",
    border: "border-rose-100"
  }
];

export default function LearnCenter() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><a href="/" className="hover:text-indigo-700">Home</a></li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-300">/</span>
                  <span className="font-medium text-gray-900">Learn Center</span>
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
              Learn Center
            </h1>
            <p className="mt-4 text-xl text-gray-600 leading-relaxed">
              Explore our comprehensive modules designed to help you navigate the electoral process with confidence.
            </p>
          </div>
        </div>
      </header>

      {/* Modules Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, idx) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-3xl p-8 border ${mod.border} shadow-sm hover:shadow-xl transition-all group cursor-pointer`}
            >
              <div className={`${mod.color} p-4 rounded-2xl w-fit mb-6`}>
                {mod.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                {mod.title}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {mod.description}
              </p>
              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Key Topics</h3>
                <ul className="space-y-2">
                  {mod.topics.map((topic, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300 mr-2"></div>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-50">
                 <button className="w-full flex items-center justify-center space-x-2 bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-indigo-700 hover:text-white transition-all">
                   <span>Start Module</span>
                   <BookOpen className="h-4 w-4" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Help Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-3xl p-12 border border-gray-200 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="mb-8 md:mb-0 md:mr-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Can't find what you're looking for?</h2>
            <p className="text-gray-600">Our support team and AI assistant are here to help you with any queries.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-200">
              Ask Assistant
            </button>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold border border-gray-200 hover:border-indigo-700 transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
