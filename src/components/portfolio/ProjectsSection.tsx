import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Project } from "@/types/portfolio";
import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal, fadeUp } from "@/components/animations/ScrollAnimations";

interface ProjectsSectionProps {
  projects: Project[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
} as const;

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background patterns and glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] glow-blue opacity-10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] glow-red opacity-10 blur-[130px] pointer-events-none" />

      <div className="section-container relative z-10">
        <ScrollReveal variants={fadeUp}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">
                Featured <span className="text-gradient-crimson">Creations</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl font-body">
                Selected work that exemplifies my philosophy on performance and user experience.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="rounded-full glass border-primary/20 hover:border-primary/50 text-xs uppercase tracking-widest font-mono p-6">
                Explore Full Archive
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 gap-12 mb-24">
          {featuredProjects.map((project, index) => (
            <ScrollReveal
              key={project.id}
              variants={cardVariants}
              delay={index * 0.15}
            >
              <motion.a
                href={project.githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative card-elevated p-8 md:p-12 overflow-hidden bg-gradient-to-br from-card to-background block cursor-pointer"
              >
                {/* Holographic detail */}
                <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-mono tracking-widest uppercase">
                        Case Study 0{index + 1}
                      </span>
                      {project.featured && (
                        <span className="px-3 py-1 bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20 rounded-full text-[10px] font-mono tracking-widest uppercase">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-lg mb-8 font-body leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {project.technologies.map(tech => (
                        <span
                          key={tech}
                          className="px-3 py-1 glass rounded-md text-xs font-mono text-foreground/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <Button
                          variant="hero"
                          size="sm"
                          className="rounded-md relative z-20"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.liveUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="order-1 md:order-2 relative aspect-[16/10] bg-card/50 rounded-xl overflow-hidden glass border border-white/5">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-primary/10 font-display font-bold text-4xl uppercase tracking-[0.2em] rotate-12">
                        Project Showcase
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />
                  </div>
                </div>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>

        {/* Other Projects Section */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-xl font-display font-bold mb-12 uppercase tracking-[0.3em] text-primary/50 text-center">
              System Archive // Experiments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project, index) => (
                <ScrollReveal
                  key={project.id}
                  variants={cardVariants}
                  delay={index * 0.1}
                >
                  <motion.a
                    href={project.githubUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -8,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="group card-elevated p-8 transition-all duration-300 relative h-full flex flex-col cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <Folder className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
                      <div className="flex gap-4">
                        {project.liveUrl && (
                          <div
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.liveUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xl font-display font-bold mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-8 font-body flex-grow">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-auto">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[10px] font-mono text-primary/60 tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
