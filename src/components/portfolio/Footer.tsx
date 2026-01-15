import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, fadeUp } from "@/components/animations/ScrollAnimations";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 border-t border-border/50 glass relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="section-container">
        <ScrollReveal variants={fadeUp}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-xl font-display font-bold text-gradient-crimson">
                PORTFOLIO<span className="text-primary">.</span>
              </p>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-[0.2em]">
                © {currentYear} Design & Dev
              </p>
            </div>

            <motion.p
              className="text-muted-foreground text-sm font-medium flex items-center gap-2 px-6 py-2 glass rounded-full"
              whileHover={{ scale: 1.02 }}
            >
              System status: <span className="text-green-500 animate-pulse">Operational</span>
              <span className="mx-2 text-border">|</span>
              Built with{" "}
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="h-4 w-4 fill-primary text-primary" />
              </motion.span>
            </motion.p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};
