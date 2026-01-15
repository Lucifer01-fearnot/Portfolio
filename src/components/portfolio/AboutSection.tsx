import React from "react";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { User, Sparkles } from "lucide-react";

interface AboutSectionProps {
    description: string;
}

export const AboutSection = ({ description }: AboutSectionProps) => {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] glow-blue opacity-5 blur-[100px] pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Header Column */}
                    <div className="lg:col-span-4">
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 mb-6">
                                <User className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-mono font-medium tracking-widest uppercase text-primary">Identity</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                                About <span className="text-gradient-crimson">Me</span>
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent-crimson rounded-full" />
                        </ScrollReveal>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-8">
                        <ScrollReveal delay={0.2}>
                            <div className="relative">
                                {/* Accent icon */}
                                <Sparkles className="absolute -top-8 -left-8 w-12 h-12 text-primary/10" />

                                <div className="card-elevated p-8 md:p-12 relative overflow-hidden group">
                                    {/* Subtle background pattern */}
                                    <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-primary/20 uppercase tracking-tighter">
                                        [ User.Bio_Access.Authorized ]
                                    </div>

                                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-body font-light italic">
                                        <span className="text-foreground font-medium not-italic">"</span>
                                        {description}
                                        <span className="text-foreground font-medium not-italic">"</span>
                                    </p>

                                    <div className="mt-8 flex items-center gap-4 text-sm font-mono text-primary/60">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span>Driven by innovation and purpose-led design.</span>
                                    </div>
                                </div>

                                {/* Decorative dots grid */}
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};
