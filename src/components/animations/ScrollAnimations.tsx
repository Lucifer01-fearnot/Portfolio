import { useRef } from "react";
import { 
  motion, 
  useInView, 
  useScroll, 
  useTransform,
  type Variants,
  type MotionProps 
} from "framer-motion";

// Physics-based easing curves
export const easings = {
  // Natural spring-like bounce
  bounce: [0.34, 1.56, 0.64, 1] as const,
  // Smooth deceleration (like friction)
  smooth: [0.22, 1, 0.36, 1] as const,
  // Elastic snap
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  // Gravity-like drop
  gravity: [0.55, 0, 1, 0.45] as const,
  // Soft landing
  softLand: [0.25, 0.46, 0.45, 0.94] as const,
};

// Reusable animation variants
export const fadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -60,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
    }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 60,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
    }
  }
};

export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.bounce,
    }
  }
};

export const dropBounce: Variants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      mass: 1,
    }
  }
};

export const floatUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 80,
    rotateX: 15,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    }
  }
};

// Stagger container for child animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
};

// Card-specific animations
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    }
  }
};

// Scroll-triggered animation wrapper component
interface ScrollRevealProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal = ({ 
  children, 
  className = "",
  variants = fadeUp,
  delay = 0,
  threshold = 0.2,
  once = true,
  ...props
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold 
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      style={{ 
        transitionDelay: `${delay}s`,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger children wrapper
interface StaggerWrapperProps {
  children: React.ReactNode;
  className?: string;
  fast?: boolean;
  threshold?: number;
}

export const StaggerWrapper = ({ 
  children, 
  className = "",
  fast = false,
  threshold = 0.1,
}: StaggerWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fast ? staggerContainerFast : staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax wrapper using scroll progress
interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative = slower, positive = faster
  direction?: "up" | "down";
}

export const Parallax = ({ 
  children, 
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Export motion for direct use
export { motion, useInView, useScroll, useTransform };
