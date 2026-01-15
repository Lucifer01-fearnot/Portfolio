import React from "react";
import { motion } from "framer-motion";

const codeSnippets = [
    "const portfolio = new Developer();",
    "function animate() {",
    "  return <Code />",
    "}",
    "import { motion } from 'framer-motion';",
    "git commit -m 'Fixed CSS'",
    "npm run dev --port 8080",
    "supabase.from('profiles').select('*')",
    "array.map(item => <Card key={item.id} />)",
    "const [loading, setLoading] = useState(true);",
    "console.log('Portfolio Loaded');",
    "<html>",
    "  <body>",
    "    <App />",
    "  </body>",
    "</html>",
    "interface HeroSectionProps {",
    "  name: string;",
    "  title: string;",
    "}",
    "export default App;",
];

export const CodeBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-500">
            {codeSnippets.map((snippet, i) => {
                const initialX = Math.random() * 100;
                const initialY = Math.random() * 100;
                const duration = 25 + Math.random() * 45;
                const delay = Math.random() * -60;

                return (
                    <motion.div
                        key={i}
                        initial={{
                            x: `${initialX}vw`,
                            y: `${initialY}vh`,
                            opacity: 0,
                            scale: 0.8
                        }}
                        animate={{
                            y: ["-30vh", "130vh"],
                            rotate: [0, 10, -10, 0],
                            opacity: [0, 0.4, 0.4, 0],
                            scale: [0.8, 1, 1, 0.8]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            delay: delay,
                            ease: "linear",
                        }}
                        className="absolute whitespace-nowrap"
                        style={{ left: `${initialX}vw` }}
                    >
                        <div className="glass px-4 py-2 rounded-lg border border-primary/20 shadow-2xl relative group">
                            {/* Glowing corner anchors */}
                            <div className="absolute top-0 left-0 w-1 h-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_hsl(var(--primary))]" />
                            <div className="absolute top-0 right-0 w-1 h-1 bg-primary rounded-full translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 left-0 w-1 h-1 bg-primary rounded-full -translate-x-1/2 translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary rounded-full translate-x-1/2 translate-y-1/2" />

                            <span className="text-[10px] md:text-xs font-mono text-primary font-medium">
                                {snippet}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
