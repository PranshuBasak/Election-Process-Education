'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  User, 
  Bot,
  Vote,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white border-4 border-white"
            >
              <MessageCircle className="h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className={`${isExpanded ? 'w-[450px] h-[700px]' : 'w-80 sm:w-96 h-[500px]'} transition-all duration-300 ease-in-out`}
          >
            <Card className="h-full flex flex-col shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-md">
              <CardHeader className="bg-indigo-600 text-white p-4 space-y-0 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Vote className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">ElectionEdu AI</CardTitle>
                    <div className="flex items-center space-x-1">
                      <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] text-indigo-100 uppercase tracking-wider font-semibold">Online Assistant</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow p-0 overflow-hidden bg-slate-50">
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-10 px-6 space-y-4">
                        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                          <Bot className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">How can I help you today?</h3>
                        <p className="text-sm text-slate-500">Ask me anything about voter registration, polling booths, or election rules.</p>
                        <div className="grid grid-cols-1 gap-2 pt-4">
                          {[
                            "How to register to vote?",
                            "What is an EPIC card?",
                            "Find my polling station",
                            "Model Code of Conduct"
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                              className="text-xs bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 p-2 rounded-lg transition-all text-left shadow-sm"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <Avatar className="h-8 w-8 border">
                            <AvatarFallback className={m.role === 'user' ? 'bg-indigo-100' : 'bg-orange-100'}>
                              {m.role === 'user' ? <User className="h-4 w-4 text-indigo-600" /> : <Bot className="h-4 w-4 text-orange-600" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                            m.role === 'user' 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                          }`}>
                            {m.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                          <span className="text-xs text-slate-400">Typing...</span>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                        Something went wrong. Please try again.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 bg-white border-t border-slate-100">
                <form 
                  onSubmit={handleSubmit}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    placeholder="Type your question..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-grow rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input || isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 h-11 w-11 rounded-xl shrink-0 shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
