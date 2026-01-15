import React from "react";
import { Navigation } from "@/components/portfolio/Navigation";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { CertificatesSection } from "@/components/portfolio/CertificatesSection";
import { EventsSection } from "@/components/portfolio/EventsSection";
import { GradesSection } from "@/components/portfolio/GradesSection";
import { Footer } from "@/components/portfolio/Footer";
import { CodeBackground } from "@/components/portfolio/CodeBackground";
import { ChatBot } from "@/components/portfolio/ChatBot";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { portfolioData, loading, isOwner } = usePortfolioData();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <CodeBackground />
      <Navigation isOwner={isOwner} isLoggedIn={!!user} />

      <HeroSection
        name={portfolioData.name}
        title={portfolioData.title}
        description={portfolioData.description}
        email={portfolioData.email}
        linkedIn={portfolioData.linkedIn}
        github={portfolioData.github}
        avatarUrl={portfolioData.avatarUrl}
        isAvailable={portfolioData.isAvailable}
      />

      <AboutSection description={portfolioData.description} />

      <SkillsSection skills={portfolioData.skills} />

      <ProjectsSection projects={portfolioData.projects} />

      <CertificatesSection certificates={portfolioData.certificates} />

      <EventsSection events={portfolioData.events} />

      <GradesSection
        grades={portfolioData.grades}
        showGrades={portfolioData.showGrades}
      />

      <Footer />
      <ChatBot portfolioData={portfolioData} />
    </div>
  );
};

export default Index;
