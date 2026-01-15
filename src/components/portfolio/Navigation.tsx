import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Edit, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  isOwner?: boolean;
  isLoggedIn?: boolean;
}

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Events", href: "#events" },
  { label: "Grades", href: "#grades" },
];

const navVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    }
  }
};

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.05, delayChildren: 0.1 }
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
};

const mobileLinkVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
};

export const Navigation = ({ isOwner, isLoggedIn }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass border-b border-border/50 py-2' : 'py-4'
        }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#"
            className="text-2xl font-display font-bold text-gradient-crimson"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PORTFOLIO<span className="text-primary">.</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium relative group"
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border/50 pl-6">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {isOwner && (
                    <Button variant="hero" size="sm" onClick={() => navigate("/edit")} className="h-9 px-4">
                      <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-9">
                    <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="subtle" size="sm" onClick={() => navigate("/auth")} className="h-9 px-4">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" /> Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="c">
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="m">
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden glass border-b border-border/50 overflow-hidden"
          >
            <div className="section-container py-8">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    variants={mobileLinkVariants}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-3 px-4 rounded-lg hover:bg-black/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* Mobile auth buttons */}
                <div className="border-t border-border/50 mt-6 pt-6 flex flex-col gap-4">
                  {isLoggedIn ? (
                    <>
                      {isOwner && (
                        <Button
                          variant="hero"
                          className="w-full justify-center"
                          onClick={() => { navigate("/edit"); setIsMobileMenuOpen(false); }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Portfolio
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="subtle"
                      className="w-full justify-center"
                      onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
