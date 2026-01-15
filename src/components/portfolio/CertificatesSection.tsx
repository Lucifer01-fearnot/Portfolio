import { Award, Calendar, FileText, X, Download, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { Certificate } from "@/types/portfolio";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ScrollReveal,
  fadeUp,
} from "@/components/animations/ScrollAnimations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    }
  }
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    }
  }
};

const CertificateCard = ({
  certificate,
  index,
  onClick
}: {
  certificate: Certificate;
  index: number;
  onClick: () => void;
}) => {
  return (
    <ScrollReveal
      variants={cardVariants}
      delay={index * 0.1}
      threshold={0.2}
    >
      <motion.div
        className="card-elevated overflow-hidden group h-full cursor-pointer"
        initial="rest"
        whileHover="hover"
        animate="rest"
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {/* Certificate Preview */}
        <div className="h-48 bg-muted relative overflow-hidden flex items-center justify-center">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : certificate.pdfUrl ? (
            <div className="w-full h-full relative group">
              <iframe
                src={`${certificate.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none pointer-events-none scale-[1.5] origin-top"
                title={`Preview of ${certificate.title}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                <div className="p-3 rounded-full bg-background/80 backdrop-blur-sm text-primary shadow-xl scale-0 group-hover:scale-100 transition-transform duration-300">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              variants={iconVariants}
              className="p-4 rounded-full bg-primary/20 text-primary relative z-10"
            >
              <Award className="h-10 w-10" />
            </motion.div>
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)] pointer-events-none" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <div className="p-6">
          <motion.h3
            className="text-xl font-display font-semibold mb-1 group-hover:text-primary transition-colors"
            variants={{
              rest: { x: 0 },
              hover: { x: 4 }
            }}
          >
            {certificate.title}
          </motion.h3>
          <p className="text-muted-foreground mb-3">
            {certificate.issuer}
          </p>
          {certificate.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {certificate.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{certificate.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-glow transition-colors">
              <FileText className="h-4 w-4" />
              View Details
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

export const CertificatesSection = ({ certificates }: CertificatesSectionProps) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] glow-blue opacity-10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] glow-red opacity-10 blur-[120px] pointer-events-none" />

      <div className="section-container">
        <div className="mb-16">
          <ScrollReveal variants={fadeUp}>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">
              Verified <span className="text-gradient-crimson">Expertise</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variants={fadeUp} delay={0.1}>
            <p className="text-muted-foreground text-lg mb-0 max-w-2xl font-body">
              Professional credentials and certifications that validate my technical foundation and growth.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((certificate, index) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              index={index}
              onClick={() => setSelectedCert(certificate)}
            />
          ))}
        </div>
      </div>

      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-background border-border flex flex-col">
          {selectedCert && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-display font-bold leading-tight">
                      {selectedCert.title}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {selectedCert.issuer}
                    </p>
                  </div>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Visual Preview - "Paper" style */}
                <div className="relative group mx-auto max-w-2xl">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white/5 border border-white/10 rounded-lg shadow-2xl overflow-hidden aspect-[1.414/1] flex items-center justify-center">
                    {selectedCert.imageUrl ? (
                      <img
                        src={selectedCert.imageUrl}
                        alt={selectedCert.title}
                        className="w-full h-full object-contain"
                      />
                    ) : selectedCert.pdfUrl ? (
                      <iframe
                        src={`${selectedCert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-none pointer-events-none scale-[1.1] origin-top"
                        title={`Viewer for ${selectedCert.title}`}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
                        <Award className="w-16 h-16" />
                        <p className="text-xs uppercase tracking-widest font-bold">Credential View</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex flex-wrap gap-8 items-start">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Issued
                      </h4>
                      <p className="text-base text-foreground font-medium">{selectedCert.date}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Authority</h4>
                      <p className="text-base text-foreground font-medium">{selectedCert.issuer}</p>
                    </div>
                    {selectedCert.pdfUrl && (
                      <div className="ml-auto">
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          Verified PDF
                        </Badge>
                      </div>
                    )}
                  </div>

                  {selectedCert.description && (
                    <div className="pt-6 border-t border-border">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Professional Summary</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {selectedCert.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-border bg-muted/5 flex items-center justify-center gap-4">
                {selectedCert.pdfUrl && (
                  <Button className="flex-1 max-w-xs gap-2 py-6 rounded-full font-bold shadow-glow hover:shadow-glow-hover transition-all duration-300" asChild>
                    <a href={selectedCert.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-4 h-4" />
                      Show credential
                    </a>
                  </Button>
                )}
                <DialogClose asChild>
                  <Button variant="ghost" className="px-8 rounded-full">
                    Done
                  </Button>
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
