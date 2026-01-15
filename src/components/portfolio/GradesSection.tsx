import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Grade } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ScrollReveal,
  fadeUp,
  dropBounce,
  easings
} from "@/components/animations/ScrollAnimations";

interface GradesSectionProps {
  grades: Grade[];
  showGrades: boolean;
}

const gradeCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 15,
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: easings.smooth,
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

const gradeValueVariants: Variants = {
  hidden: { scale: 0, rotate: -10 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
      delay: 0.2,
    }
  }
};

const GradeCard = ({ grade }: { grade: Grade }) => {
  const getGradeColor = (gradeValue: string) => {
    if (gradeValue.includes('A')) return 'text-[#E11D48] drop-shadow-[0_0_8px_rgba(225,29,72,0.3)]';
    if (gradeValue.includes('B')) return 'text-primary/80';
    if (gradeValue.includes('C')) return 'text-muted-foreground';
    return 'text-muted-foreground';
  };

  return (
    <motion.div
      variants={gradeCardVariants}
      className="card-elevated p-5 group"
      whileHover={{
        y: -4,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="p-2 rounded-lg bg-primary/10 text-primary"
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <BookOpen className="h-5 w-5" />
          </motion.div>
          <div>
            <h3 className="font-medium group-hover:text-primary transition-colors">
              {grade.subject}
            </h3>
            {grade.semester && (
              <p className="text-sm text-muted-foreground">
                {grade.semester}
              </p>
            )}
          </div>
        </div>
        <motion.span
          variants={gradeValueVariants}
          className={`text-2xl font-display font-bold ${getGradeColor(grade.grade)}`}
        >
          {grade.grade}
        </motion.span>
      </div>
    </motion.div>
  );
};

const HiddenState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="card-elevated p-12 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
    >
      <EyeOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    </motion.div>
    <p className="text-muted-foreground text-lg">
      Grades are currently hidden. Click "Show Grades" to reveal them.
    </p>
  </motion.div>
);

export const GradesSection = ({ grades, showGrades }: GradesSectionProps) => {
  // Only show this section if grades are visible
  if (!showGrades) return null;

  return (
    <section id="grades" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] glow-red opacity-10 blur-[120px] pointer-events-none" />

      <div className="section-container">
        <div className="mb-16">
          <ScrollReveal variants={fadeUp}>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">
              Academic <span className="text-gradient-crimson">Excellence</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variants={fadeUp} delay={0.1}>
            <p className="text-muted-foreground text-lg max-w-2xl font-body">
              Consistent performance across core computer science and engineering disciplines.
            </p>
          </ScrollReveal>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-4"
        >
          {grades.map((grade) => (
            <GradeCard key={grade.id} grade={grade} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
