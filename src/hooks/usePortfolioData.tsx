import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { PortfolioData, Skill, Project, Certificate, VolunteerEvent, Grade } from "@/types/portfolio";
import { portfolioData as defaultData } from "@/data/portfolioData";

export const usePortfolioData = () => {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
  }, [user?.id]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // Fetch the first profile (single user portfolio)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        setIsOwner(user?.id === profile.user_id);

        // Fetch all related data
        const [skillsRes, projectsRes, certificatesRes, eventsRes, gradesRes] = await Promise.all([
          supabase.from("skills").select("*").eq("user_id", profile.user_id).order("sort_order"),
          supabase.from("projects").select("*").eq("user_id", profile.user_id).order("sort_order"),
          supabase.from("certificates").select("*").eq("user_id", profile.user_id),
          supabase.from("events").select("*").eq("user_id", profile.user_id),
          supabase.from("grades").select("*").eq("user_id", profile.user_id),
        ]);

        const skills: Skill[] = (skillsRes.data || []).map((s) => ({
          id: s.id,
          name: s.name,
          level: s.level ?? undefined,
          category: s.category,
        }));

        const projects: Project[] = (projectsRes.data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          technologies: p.technologies || [],
          imageUrl: p.image_url || undefined,
          liveUrl: p.live_url || undefined,
          githubUrl: p.github_url || undefined,
          featured: p.featured,
        }));

        const certificates: Certificate[] = (certificatesRes.data || []).map((c) => ({
          id: c.id,
          title: c.title,
          issuer: c.issuer,
          date: c.date,
          description: c.description || undefined,
          imageUrl: c.image_url || undefined,
          pdfUrl: c.pdf_url || undefined,
        }));

        const events: VolunteerEvent[] = (eventsRes.data || []).map((e) => ({
          id: e.id,
          title: e.title,
          organization: e.organization,
          date: e.date,
          description: e.description,
          imageUrl: e.image_url || undefined,
        }));

        const grades: Grade[] = (gradesRes.data || []).map((g) => ({
          id: g.id,
          subject: g.subject,
          grade: g.grade,
          semester: g.semester || undefined,
        }));

        setPortfolioData({
          name: profile.name,
          title: profile.title,
          description: profile.description,
          email: profile.email || undefined,
          linkedIn: profile.linkedin || undefined,
          github: profile.github || undefined,
          avatarUrl: profile.avatar_url || undefined,
          skills: skills.length > 0 ? skills : defaultData.skills,
          projects: projects.length > 0 ? projects : defaultData.projects,
          certificates: certificates.length > 0 ? certificates : defaultData.certificates,
          events: events.length > 0 ? events : defaultData.events,
          grades: grades.length > 0 ? grades : defaultData.grades,
          showGrades: profile.show_grades,
          isAvailable: profile.is_available ?? true,
        });
      } else {
        // No profile yet, use default data
        setIsOwner(!!user);
        setPortfolioData(defaultData);
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { portfolioData, loading, isOwner, refetch: fetchPortfolioData };
};
