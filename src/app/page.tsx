"use client";

import React from 'react';
import { Search, ChevronRight, BookOpen, MapPin, ClipboardList, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  {
    title: "Voter Registration",
    description: "Step-by-step guide on how to register and update your details.",
    icon: <ClipboardList className="h-6 w-6 text-indigo-600" />,
    link: "/learn/voter-registration",
    color: "bg-indigo-50"
  },
  {
    title: "Polling Process",
    description: "What to expect on election day and how to cast your vote.",
    icon: <MapPin className="h-6 w-6 text-orange-600" />,
    link: "/learn/polling-process",
    color: "bg-orange-50"
  },
  {
    title: "Election Laws",
    description: "Understand your rights and the rules governing elections.",
    icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
    link: "/learn/election-laws",
    color: "bg-emerald-50"
  },
  {
    title: "Candidate Info",
    description: "How to find and research candidates in your constituency.",
    icon: <Info className="h-6 w-6 text-blue-600" />,
    link: "/learn/candidate-info",
    color: "bg-blue-50"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 bg-gradient-to-br from-indigo-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Democracy is <span className="text-indigo-700 underline decoration-orange-400 decoration-4 underline-offset-8">Powered</span> by You.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl">
                Every vote counts. Get the essential knowledge you need to participate effectively in the world's largest democratic process.
              </p>
              
              <div className="mt-10 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                    placeholder="Search for voter registration, laws, or guides..."
                  />
                  <div className="absolute inset-y-2 right-2">
                    <button className="bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-800 transition-colors shadow-sm">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="flex items-center space-x-2 bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-800 transition-all shadow-lg hover:shadow-indigo-200 group">
                  <span>Start Learning</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold border border-gray-200 hover:border-indigo-700 hover:text-indigo-700 transition-all shadow-sm">
                  <span>Quick Quiz</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 lg:mt-0 relative"
            >
              <div className="aspect-square bg-gradient-to-tr from-indigo-100 to-orange-100 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 relative">
                 {/* Placeholder for an image - in a real app we'd use a high-quality photo of the election process */}
                 <div className="absolute inset-0 flex items-center justify-center p-12 -rotate-3">
                   <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 w-48 bg-indigo-200 rounded-full"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-40 bg-orange-200 rounded-full"></div>
                      </div>
                   </div>
                 </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-orange-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-indigo-400 rounded-full opacity-20 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Election Learning Center</h2>
            <p className="mt-4 text-xl text-gray-600">Choose a topic to begin your journey towards being an informed voter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map((mod, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`${mod.color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{mod.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {mod.description}
                </p>
                <button className="flex items-center text-sm font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
                  <span>Explore Module</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Need help with something specific?</h2>
                <p className="text-indigo-100 text-lg mb-8 max-w-lg">
                  Our AI-powered Chat Assistant is available 24/7 to answer your questions about the election process, voter IDs, and polling booths.
                </p>
                <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-400/40">
                  Chat with Assistant
                </button>
              </div>
              <div className="hidden lg:block relative">
                 {/* Visual representation of chat */}
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">AI</div>
                      <div className="bg-white/20 p-4 rounded-2xl text-white text-sm">
                        Hello! How can I help you learn about elections today?
                      </div>
                    </div>
                    <div className="flex items-start justify-end space-x-4">
                      <div className="bg-indigo-600 p-4 rounded-2xl text-white text-sm">
                        How do I check if I'm registered to vote?
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 h-96 w-96 bg-indigo-800 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
