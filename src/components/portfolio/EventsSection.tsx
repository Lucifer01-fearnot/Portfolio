import { Calendar, Users } from "lucide-react";
import { VolunteerEvent } from "@/types/portfolio";
import { motion, Variants } from "framer-motion";
import {
  ScrollReveal,
  fadeUp,
  easings
} from "@/components/animations/ScrollAnimations";

interface EventsSectionProps {
  events: VolunteerEvent[];
}

const timelineVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    }
  }
};

const dotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
      delay: 0.2,
    }
  }
};

const lineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    }
  }
};

const EventCard = ({ event, index }: { event: VolunteerEvent; index: number }) => {
  return (
    <ScrollReveal
      variants={timelineVariants}
      delay={index * 0.15}
      threshold={0.3}
      className="relative flex items-start group"
    >
      {/* Timeline line */}
      <motion.div
        variants={lineVariants}
        className="absolute left-8 top-16 bottom-0 w-px bg-border group-last:hidden origin-top"
      />

      {/* Timeline dot */}
      <motion.div
        variants={dotVariants}
        className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 border-border group-hover:border-primary transition-colors duration-300"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { type: "spring" as const, stiffness: 400, damping: 10 }
        }}
      >
        <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-1 ml-6 card-elevated p-6"
        whileHover={{
          x: 8,
          transition: { type: "spring" as const, stiffness: 300, damping: 20 }
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <motion.h3
              className="text-xl font-display font-semibold group-hover:text-primary transition-colors"
            >
              {event.title}
            </motion.h3>
            <p className="text-primary font-medium">
              {event.organization}
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </motion.div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      </motion.div>
    </ScrollReveal>
  );
};

export const EventsSection = ({ events }: EventsSectionProps) => {
  return (
    <section id="events" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] glow-blue opacity-10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] glow-red opacity-10 blur-[120px] pointer-events-none" />

      <div className="section-container">
        <ScrollReveal variants={fadeUp}>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">
            Community <span className="text-gradient-crimson">Impact</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal variants={fadeUp} delay={0.1}>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl font-body">
            Mentorship, leadership, and public contributions to the engineering community.
          </p>
        </ScrollReveal>

        <div className="space-y-12 max-w-4xl relative">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
