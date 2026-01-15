import React from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { easings } from "@/components/animations/ScrollAnimations";

interface HeroSectionProps {
  name: string;
  title: string;
  description: string;
  email?: string;
  linkedIn?: string;
  github?: string;
  avatarUrl?: string;
  isAvailable?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    }
  }
};

const floatVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    }
  }
};

export const HeroSection = ({ name, title, description, email, linkedIn, github, avatarUrl, isAvailable = true }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Atmospheric Mokn-style glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] glow-blue opacity-20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] glow-red opacity-10 blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            className="flex-1 max-w-3xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 mb-6"
            >
              <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-primary animate-pulse' : 'bg-orange-500'}`} />
              <span className={`text-[10px] font-mono font-medium tracking-widest uppercase ${isAvailable ? 'text-primary' : 'text-orange-500'}`}>
                {isAvailable ? 'Available for Projects' : 'Involved in other projects'}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-[0.9]"
            >
              {name.split(' ')[0]}<br />
              <span className="text-gradient-crimson">{name.split(' ')[1] || ''}</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground font-body font-light mb-10 max-w-xl"
            >
              {title} — <span className="text-foreground font-medium">Crafting high-performance digital experiences.</span>
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero" size="xl" asChild className="rounded-full shadow-glow">
                  <a href="#projects">
                    View Case Studies
                    <ArrowDown className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </motion.div>

              <div className="flex gap-4">
                {email && (
                  <motion.div variants={floatVariants} whileHover={{ y: -3 }}>
                    <Button variant="outline" size="icon" asChild className="rounded-full w-12 h-12 glass">
                      <a href={`mailto:${email}`} aria-label="Email">
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                  </motion.div>
                )}
                {linkedIn && (
                  <motion.div variants={floatVariants} whileHover={{ y: -3 }}>
                    <Button variant="outline" size="icon" asChild className="rounded-full w-12 h-12 glass">
                      <a href={linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {avatarUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: easings.smooth }}
              className="relative"
            >
              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
                <div className="absolute inset-0 border-[1px] border-primary/20 rounded-3xl rotate-3 scale-105" />
                <div className="absolute inset-0 border-[1px] border-primary/10 rounded-3xl -rotate-2 scale-100" />

                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl glass p-1">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-primary opacity-50 uppercase tracking-tighter hidden md:block">
                  [ System.Profile_Active ]
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 1.5, duration: 0.5 }
        }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};
