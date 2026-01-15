import { Skill } from "@/types/portfolio";
import { motion, Variants } from "framer-motion";
import {
  ScrollReveal,
  StaggerWrapper,
  fadeUp,
  easings
} from "@/components/animations/ScrollAnimations";

interface SkillsSectionProps {
  skills: Skill[];
}

const skillTagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    }
  }
};

const categoryOrder = ["Proficient", "Comfortable", "Learning"];

export const SkillsSection = ({ skills }: SkillsSectionProps) => {
  // Group skills by category with specific order
  const groupedSkills = categoryOrder.reduce((acc, category) => {
    const categorySkills = skills.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
    if (categorySkills.length > 0) {
      acc[category] = categorySkills;
    }
    return acc;
  }, {} as Record<string, Skill[]>);

  // Also include any other categories that might exist
  skills.forEach((skill) => {
    if (!categoryOrder.some(c => c.toLowerCase() === skill.category.toLowerCase())) {
      if (!groupedSkills[skill.category]) {
        groupedSkills[skill.category] = [];
      }
      groupedSkills[skill.category].push(skill);
    }
  });

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] glow-blue opacity-5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] glow-red opacity-5 blur-[100px] pointer-events-none" />

      <div className="section-container">
        <ScrollReveal variants={fadeUp}>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">
            Skills & <span className="text-gradient-crimson">Expertise</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal variants={fadeUp} delay={0.1}>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl font-body">
            My technical arsenal and the tools I use to bring ideas to life.
            Organized by my level of familiarity.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <ScrollReveal
              key={category}
              delay={categoryIndex * 0.15}
              className="h-full"
            >
              <div className="card-elevated p-8 relative h-full flex flex-col group border-primary/10 hover:border-primary/30">
                {/* Visual accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-2 h-2 rounded-full ${category === "Proficient" ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
                      category === "Comfortable" ? "bg-accent-crimson" : "bg-muted-foreground/50"
                    }`} />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] font-mono">
                    {category}
                  </h3>
                </div>

                <StaggerWrapper className="flex flex-wrap gap-3" fast>
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      variants={skillTagVariants}
                      whileHover={{ y: -2, scale: 1.05 }}
                      className="px-4 py-2 rounded-lg glass border-white/5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all cursor-default"
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </StaggerWrapper>

                {/* Counter */}
                <div className="mt-auto pt-8 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-tighter">
                  Total Items: {categorySkills.length.toString().padStart(2, '0')}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
