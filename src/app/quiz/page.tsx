'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Timer, 
  Award,
  RefreshCcw,
  BookOpen,
  Share2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    id: 1,
    question: "What is the minimum age to be eligible to vote in India?",
    options: [
      { label: "A", text: "16 years" },
      { label: "B", text: "18 years" },
      { label: "C", text: "21 years" },
      { label: "D", text: "25 years" }
    ],
    correct: "B",
    explanation: "The voting age in India was reduced from 21 to 18 years by the 61st Constitutional Amendment Act in 1988."
  },
  {
    id: 2,
    question: "What does 'EPIC' stand for in the context of Indian elections?",
    options: [
      { label: "A", text: "Election Photo Identity Card" },
      { label: "B", text: "Electronic Polling Identity Code" },
      { label: "C", text: "Electoral Process Information Center" },
      { label: "D", text: "Every Person Is Counting" }
    ],
    correct: "A",
    explanation: "EPIC stands for Electoral Photo Identity Card, commonly known as a Voter ID card."
  },
  {
    id: 3,
    question: "How often are general elections held in India?",
    options: [
      { label: "A", text: "Every 4 years" },
      { label: "B", text: "Every 6 years" },
      { label: "C", text: "Every 5 years" },
      { label: "D", text: "Every 10 years" }
    ],
    correct: "C",
    explanation: "Under the Indian Constitution, Lok Sabha (General) elections must be held every five years, unless dissolved earlier."
  }
];

export default function CivicQuiz() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (label: string) => {
    if (selectedOption) return;
    setSelectedOption(label);
    if (label === QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameState('end');
    }
  };

  const restartQuiz = () => {
    setGameState('start');
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {gameState === 'start' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-12"
          >
            <div className="bg-indigo-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-3">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">Civic Master Quiz</h1>
              <p className="text-xl text-slate-600 max-w-lg mx-auto">
                Test your knowledge about the Indian electoral process and earn your "Informed Citizen" badge!
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <Timer className="h-5 w-5 text-indigo-600 mb-2 mx-auto" />
                <p className="text-xs font-bold text-slate-400 uppercase">Duration</p>
                <p className="font-bold text-slate-800">5 Mins</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <BookOpen className="h-5 w-5 text-orange-600 mb-2 mx-auto" />
                <p className="text-xs font-bold text-slate-400 uppercase">Questions</p>
                <p className="font-bold text-slate-800">{QUESTIONS.length} Items</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <Award className="h-5 w-5 text-green-600 mb-2 mx-auto" />
                <p className="text-xs font-bold text-slate-400 uppercase">Passing</p>
                <p className="font-bold text-slate-800">70% Score</p>
              </div>
            </div>
            <Button 
              onClick={() => setGameState('playing')}
              className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl shadow-xl shadow-indigo-200"
            >
              Start Quiz Now
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
                <h2 className="text-2xl font-bold text-slate-900">General Election Trivia</h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                <p className="text-xl font-black text-indigo-600">{score}/{QUESTIONS.length}</p>
              </div>
            </div>

            <Progress value={((currentQuestion + 1) / QUESTIONS.length) * 100} className="h-3 rounded-full bg-slate-200" />

            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl leading-snug text-slate-800">
                  {QUESTIONS[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {QUESTIONS[currentQuestion].options.map((opt) => {
                    const isSelected = selectedOption === opt.label;
                    const isCorrect = opt.label === QUESTIONS[currentQuestion].correct;
                    const showResult = selectedOption !== null;

                    let variantStyle = "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50";
                    if (showResult) {
                      if (isCorrect) variantStyle = "bg-green-50 border-green-500 text-green-700 shadow-sm shadow-green-100";
                      else if (isSelected) variantStyle = "bg-red-50 border-red-500 text-red-700 shadow-sm shadow-red-100";
                      else variantStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={showResult}
                        onClick={() => handleOptionSelect(opt.label)}
                        className={`group flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left relative ${variantStyle}`}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-4 shrink-0 transition-colors ${
                          isSelected || (showResult && isCorrect) ? 'bg-current text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="font-semibold text-lg flex-grow">{opt.text}</span>
                        {showResult && isCorrect && <CheckCircle2 className="h-6 w-6 text-green-500 absolute right-5" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-500 absolute right-5" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        Did you know?
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {QUESTIONS[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="p-8 bg-slate-50 flex justify-end">
                <Button 
                  disabled={!selectedOption}
                  onClick={handleNext}
                  className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2"
                >
                  {currentQuestion === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {gameState === 'end' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full animate-pulse" />
              <div className="bg-white p-8 rounded-full shadow-2xl relative border-8 border-indigo-50">
                <Trophy className="h-20 w-20 text-yellow-500" />
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-2">Quiz Completed!</h1>
            <p className="text-xl text-slate-500 mb-8">You scored <span className="text-indigo-600 font-black">{score} out of {QUESTIONS.length}</span></p>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Accuracy</span>
                  <span className="font-bold text-slate-900">{Math.round((score/QUESTIONS.length)*100)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Time Taken</span>
                  <span className="font-bold text-slate-900">1:42 Min</span>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Badge className="bg-indigo-600 px-4 py-1.5 rounded-lg text-xs">Voter Champion Level 1</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={restartQuiz}
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 font-bold flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button 
                className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Share2 className="h-4 w-4" />
                Share Results
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
