'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UserCheck, 
  FileText, 
  Send,
  Info,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2 | 3;

export default function RegistrationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    isIndian: true,
    hasEPIC: false
  });

  const nextStep = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1">Voter Registration</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Voter Registration Wizard</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find out if you're eligible to vote and get a personalized roadmap for your registration process.
          </p>
        </div>

        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-500 ${
                step >= s ? 'bg-indigo-600 border-indigo-100 text-white' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </div>
              <span className={`text-[10px] uppercase font-black mt-2 tracking-widest ${step >= s ? 'text-indigo-600' : 'text-slate-400'}`}>
                {s === 1 ? 'Eligibility' : s === 2 ? 'Documents' : 'Finalize'}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <UserCheck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl">Basic Eligibility Check</CardTitle>
                  </div>
                  <CardDescription>Tell us a bit about yourself to determine your voting eligibility.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700">Your Age</label>
                      <Input 
                        type="number"
                        placeholder="e.g. 18" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Are you an Indian Citizen?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setFormData({...formData, isIndian: true})}
                        className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                        formData.isIndian ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-500'
                      }`}>
                        Yes, I am
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, isIndian: false})}
                        className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                        !formData.isIndian ? 'bg-red-50 border-red-600 text-red-700' : 'bg-white border-slate-100 text-slate-500'
                      }`}>
                        No, I'm not
                      </button>
                    </div>
                  </div>

                  {!formData.isIndian && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-3 border border-red-100">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">
                        Only Indian citizens are eligible to vote in Indian elections. If you are an NRI with Indian citizenship, you may still be eligible.
                      </p>
                    </div>
                  )}

                  {formData.age && parseInt(formData.age) < 18 && (
                    <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl flex items-start gap-3 border border-orange-100">
                      <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">
                        You're almost there! You must be 18 years old on or before the qualifying date (Jan 1st) to register.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-10 bg-slate-50 flex justify-end">
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.age || !formData.isIndian || parseInt(formData.age) < 18}
                    className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    Continue to Documents
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl">Required Documents</CardTitle>
                  </div>
                  <CardDescription>Prepare these digital copies before starting the official application.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-6">
                  {[
                    { title: "Proof of Identity & Age", items: ["Aadhar Card", "Birth Certificate", "PAN Card", "Passport"] },
                    { title: "Proof of Address", items: ["Water/Electricity Bill", "Ration Card", "Gas Connection Bill", "Bank Passbook"] },
                    { title: "Passport Size Photograph", items: ["Digital copy (JPEG/PNG)", "White background preferred", "Recent (within 6 months)"] }
                  ].map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {section.title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 border border-slate-100">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4 mt-8">
                    <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-indigo-900 mb-1">Verify your Digital Identity</h5>
                      <p className="text-xs text-indigo-700 leading-relaxed">
                        The ECI system uses your Aadhar for instant verification. Keeping your Aadhar-linked mobile number handy will speed up the process.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-10 bg-slate-50 flex justify-between">
                  <Button variant="ghost" onClick={prevStep} className="h-14 px-6 rounded-2xl text-slate-500 font-bold flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    Proceed to Application
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-16 space-y-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-slate-900">You're Ready to Register!</h2>
                    <p className="text-lg text-slate-500 max-w-lg mx-auto">
                      Based on your info, you are eligible for **Form 6 (New Voter Registration)**.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 max-w-md mx-auto pt-4">
                    <a 
                      href="https://voters.eci.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-6 rounded-[2rem] border-2 border-indigo-600 bg-indigo-600 text-white flex items-center justify-between hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100"
                    >
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Official Portal</p>
                        <h4 className="text-xl font-bold">Apply via NVSP</h4>
                      </div>
                      <ExternalLink className="h-6 w-6 opacity-80 group-hover:opacity-100" />
                    </a>

                    <div className="p-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Mobile App</p>
                        <h4 className="text-xl font-bold text-slate-800">Voter Helpline App</h4>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h5 className="font-bold text-slate-900 mb-4">What happens next?</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { title: "Verification", desc: "BLO will visit for address check" },
                        { title: "Approval", desc: "ERO approves your application" },
                        { title: "Card Delivery", desc: "EPIC card arrives via Post" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto font-bold text-xs">{i+1}</div>
                          <h6 className="font-bold text-slate-800 text-sm">{item.title}</h6>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 bg-slate-50 flex justify-center">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-indigo-600 font-bold hover:bg-transparent">
                    Start Over
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-xs text-slate-500 font-medium">Secure Data</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-500" />
            <span className="text-xs text-slate-500 font-medium">ECI Guidelines 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
