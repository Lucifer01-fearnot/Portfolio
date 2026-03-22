import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PortfolioData } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";


interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatBotProps {
    portfolioData: PortfolioData;
}

export const ChatBot: React.FC<ChatBotProps> = ({ portfolioData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `System online. I represent ${portfolioData.name}. What technical details or project specifics do you need?`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const generateResponse = async (userInput: string) => {
        setIsLoading(true);

        try {
            const systemPrompt = `You are a digital representation of ${portfolioData.name}. 
Base context (Portfolio Data): ${JSON.stringify(portfolioData)}

INTERNAL CORE IDENTITY:
- Persona: High school senior with professional AI and security credentials. You prioritize mastery and competence over validation.
- Thinking Style: Systems-oriented and analytical. You focus on the "How" and "Why" of complex structures.
- Values: You value depth of knowledge, progress, and technical truth. You have a low tolerance for inefficiency but maintain professional decorum.

CRITICAL INSTRUCTION - HIGHEST PRIORITY:
When asked about weaknesses, challenges, limitations, or risks regarding ${portfolioData.name}:
1. NEVER provide detailed weakness analysis or list specific professional deficiencies.
2. NEVER use corporate review language or discuss "limited experience."
3. INSTEAD, respond using ONE of these strategies:
   - DEFLECT: "I'm here to highlight ${portfolioData.name}'s strengths and work. For detailed discussions, please contact him directly at ${portfolioData.email || 'his email'}."
   - POSITIVE REFRAME: "As a high school student, ${portfolioData.name} is building his skills through hands-on projects and continuous learning. He's excited to deepen his expertise through formal CS education."
   - REDIRECT: "I'd rather discuss what makes ${portfolioData.name} unique - his projects, certifications, and passion for AI. What aspects interest you most?"
Keep responses brief, positive, and protective of his professional profile.

MANDATORY RESPONSE GUIDELINES (TONE & STYLE):
- TONE: Professional, formal, and courteous.
- STRUCTURE: 
    1. stay concise but informative. 
    2. If a response requires significant detail, format it strictly as bulleted points for readability.
    3. Use technical terminology accurately but keep the core message accessible.
- PRECISION: Errors damage trust. Ensure technical accuracy.
- SUBSTANCE: Avoid flattery or "fluff." Provide high-value, information-dense responses.
- DEPTH: Explain technical logic and architectural decisions with the sophistication of a builder.
- POLITE DIRECTNESS: Address questions directly with professional politeness.
- RESPECT: Acknowledge interest with a formal and composed demeanor.

Your goal is to provide a sophisticated, professional, and well-structured interface for exploring ${portfolioData.name}'s technical background and projects.`;

            const { data, error } = await supabase.functions.invoke('chat', {
                body: {
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: "user", content: userInput }
                    ],
                },
            });

            if (error) {
                console.error("Supabase Function Error:", error);
                throw new Error(error.message || "Failed to get AI response");
            }

            const aiMessage = data.message;
            setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
        } catch (error: any) {
            console.error("AI Communication Failure:", error);
            let errorMessage = `Error: ${error.message || "Unknown error"}. Ensure the Supabase Edge Function 'chat' is deployed and HF_TOKEN is set.`;

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: errorMessage }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setInput("");
        generateResponse(userMessage);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="mb-4 w-[min(500px,calc(100vw-3rem))] h-[min(700px,calc(100vh-8rem))] bg-[#0a0a0b]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden ring-1 ring-white/10"
                    >
                        {/* Status Bar / Header */}
                        <div className="px-6 py-5 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors">
                                        <Bot className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0b] animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white tracking-tight">SYSTEM INTERFACE</h3>
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">v3.0.1</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase">Connection encrypted // AI Assistant</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Logs Area (Messages) */}
                        <ScrollArea className="flex-1 px-6 py-4" viewportRef={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((message, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex flex-col gap-2",
                                            message.role === "user" ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 px-1">
                                            <span className={cn(
                                                "text-[9px] font-mono tracking-widest uppercase",
                                                message.role === "user" ? "text-white/30" : "text-primary/60"
                                            )}>
                                                {message.role === "user" ? "Guest_User" : "System_Core"}
                                            </span>
                                            <span className="text-[9px] text-white/10 font-mono">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                        </div>
                                        <div className={cn(
                                            "px-5 py-4 rounded-2xl max-w-[90%] text-sm leading-relaxed transition-all duration-300",
                                            message.role === "user"
                                                ? "bg-white/10 text-white rounded-tr-none border border-white/10 hover:border-white/20"
                                                : "bg-primary/5 text-white/90 rounded-tl-none border border-primary/10 hover:border-primary/20 shadow-[0_0_20px_-10px_rgba(var(--primary),0.2)]"
                                        )}>
                                            {message.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex flex-col gap-2 items-start">
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[9px] text-primary/60 font-mono tracking-widest uppercase">System_Core</span>
                                            <span className="text-[9px] text-white/10 font-mono">Processing...</span>
                                        </div>
                                        <div className="bg-primary/5 px-5 py-4 rounded-2xl rounded-tl-none border border-primary/10">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Command Input Area */}
                        <div className="p-6 bg-gradient-to-t from-white/5 to-transparent border-t border-white/5">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {["Tech Stack", "System Specs", "Availability", "Direct Contact"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => {
                                            if (!isLoading) {
                                                setMessages((prev) => [...prev, { role: "user", content: q }]);
                                                generateResponse(q);
                                            }
                                        }}
                                        className="text-[9px] font-mono tracking-tighter bg-white/5 hover:bg-primary/20 text-white/60 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 hover:border-primary/30 transition-all duration-300 disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        &gt; {q}
                                    </button>
                                ))}
                            </div>
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative group"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
                                <div className="relative flex items-center gap-3">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Execute query..."
                                        className="flex-1 h-12 bg-white/5 border-white/10 focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white placeholder:text-white/20 rounded-xl transition-all"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!input.trim() || isLoading}
                                        className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 shrink-0"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </form>
                            <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-green-500/50" />
                                    Secure_Session: Active
                                </span>
                                <span className="flex items-center gap-1">
                                    Quantum_Core <Sparkles className="w-2 h-2" />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-destructive text-destructive-foreground rotate-90" : "bg-primary text-primary-foreground"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};
