import React from 'react';
import Link from 'next/link';
import { Vote, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ElectionEdu</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering citizens through education and transparency. Our mission is to make the electoral process accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-indigo-400 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors"><Mail className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Learning Center</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/learn/voter-registration" className="hover:text-white transition-colors">Voter Registration</Link></li>
              <li><Link href="/learn/polling-process" className="hover:text-white transition-colors">Polling Process</Link></li>
              <li><Link href="/learn/election-laws" className="hover:text-white transition-colors">Election Laws</Link></li>
              <li><Link href="/learn/candidate-info" className="hover:text-white transition-colors">Candidate Research</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Tools & Resources</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/polling-lookup" className="hover:text-white transition-colors">Polling Station Lookup</Link></li>
              <li><Link href="/quiz" className="hover:text-white transition-colors">Civic Knowledge Quiz</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition-colors">Election Glossary</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Official ECI Forms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Join the Community</h3>
            <p className="text-sm mb-6">Subscribe to our newsletter for election updates and civic reminders.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2024 ElectionEdu. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
