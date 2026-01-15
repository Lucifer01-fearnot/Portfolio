import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Plus, X, Trash2, Camera, Loader2, FileText, ExternalLink, Image, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { CodeBackground } from "@/components/portfolio/CodeBackground";

interface FormSkill {
  id?: string;
  name: string;
  category: "Proficient" | "Comfortable" | "Learning" | string;
}

interface FormProject {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  imageUrl?: string;
}

interface FormCertificate {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  pdfUrl?: string;
  imageUrl?: string;
}

interface FormEvent {
  id?: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

interface FormGrade {
  id?: string;
  subject: string;
  grade: string;
  semester: string;
}

const EditPortfolio = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // Profile state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Collections state
  const [skills, setSkills] = useState<FormSkill[]>([]);
  const [projects, setProjects] = useState<FormProject[]>([]);
  const [certificates, setCertificates] = useState<FormCertificate[]>([]);
  const [events, setEvents] = useState<FormEvent[]>([]);
  const [grades, setGrades] = useState<FormGrade[]>([]);

  // New item forms
  const [newTech, setNewTech] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setName(profile.name);
      setTitle(profile.title);
      setDescription(profile.description);
      setEmail(profile.email || "");
      setLinkedin(profile.linkedin || "");
      setGithub(profile.github || "");
      setAvatarUrl(profile.avatar_url || null);
      setShowGrades(profile.show_grades);
      setIsAvailable(profile.is_available ?? true);
    }

    const [skillsRes, projectsRes, certsRes, eventsRes, gradesRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", user.id),
      supabase.from("projects").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("certificates").select("*").eq("user_id", user.id),
      supabase.from("events").select("*").eq("user_id", user.id),
      supabase.from("grades").select("*").eq("user_id", user.id),
    ]);

    if (skillsRes.data) {
      setSkills(skillsRes.data.map(s => ({ id: s.id, name: s.name, category: s.category })));
    }
    if (projectsRes.data) {
      setProjects(projectsRes.data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        technologies: p.technologies || [],
        liveUrl: p.live_url || "",
        githubUrl: p.github_url || "",
        featured: p.featured,
        imageUrl: p.image_url || "",
      })));
    }
    if (certsRes.data) {
      setCertificates(certsRes.data.map(c => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        date: c.date,
        description: c.description || "",
        pdfUrl: c.pdf_url || "",
        imageUrl: c.image_url || "",
      })));
    }
    if (eventsRes.data) {
      setEvents(eventsRes.data.map(e => ({
        id: e.id,
        title: e.title,
        organization: e.organization,
        date: e.date,
        description: e.description,
      })));
    }
    if (gradesRes.data) {
      setGrades(gradesRes.data.map(g => ({
        id: g.id,
        subject: g.subject,
        grade: g.grade,
        semester: g.semester || "",
      })));
    }
  };

  const handleProjectImageUpload = async (file: File, index: number) => {
    try {
      setSaving(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `projects/${user?.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const updated = [...projects];
      updated[index].imageUrl = publicUrl;
      setProjects(updated);
      toast.success("Project Preview Image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      console.log("No user found, returning");
      return;
    }
    console.log("Saving portfolio for user:", user.id);
    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          name,
          title,
          description,
          email: email || null,
          linkedin: linkedin || null,
          github: github || null,
          avatar_url: avatarUrl,
          show_grades: showGrades,
          is_available: isAvailable,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      // Sync skills
      const { error: deleteSkillsError } = await supabase.from("skills").delete().eq("user_id", user.id);
      if (deleteSkillsError) throw deleteSkillsError;

      if (skills.length > 0) {
        const { error: insertSkillsError } = await supabase.from("skills").insert(
          skills.map((s, i) => ({ user_id: user.id, name: s.name, level: 0, category: s.category, sort_order: i }))
        );
        if (insertSkillsError) throw insertSkillsError;
      }

      // Sync projects
      const { error: deleteProjectsError } = await supabase.from("projects").delete().eq("user_id", user.id);
      if (deleteProjectsError) throw deleteProjectsError;

      if (projects.length > 0) {
        const { error: insertProjectsError } = await supabase.from("projects").insert(
          projects.map((p, i) => ({
            user_id: user.id,
            title: p.title,
            description: p.description,
            technologies: p.technologies,
            live_url: p.liveUrl || null,
            github_url: p.githubUrl || null,
            featured: p.featured,
            image_url: p.imageUrl || null,
            sort_order: i,
          }))
        );
        if (insertProjectsError) throw insertProjectsError;
      }

      // Sync certificates
      const { error: deleteCertsError } = await supabase.from("certificates").delete().eq("user_id", user.id);
      if (deleteCertsError) throw deleteCertsError;

      if (certificates.length > 0) {
        const { error: insertCertsError } = await supabase.from("certificates").insert(
          certificates.map(c => ({
            user_id: user.id,
            title: c.title,
            issuer: c.issuer,
            date: c.date,
            description: c.description || null,
            pdf_url: c.pdfUrl || null,
            image_url: c.imageUrl || null,
          }))
        );
        if (insertCertsError) throw insertCertsError;
      }

      // Sync events
      const { error: deleteEventsError } = await supabase.from("events").delete().eq("user_id", user.id);
      if (deleteEventsError) throw deleteEventsError;

      if (events.length > 0) {
        const { error: insertEventsError } = await supabase.from("events").insert(
          events.map(e => ({
            user_id: user.id,
            title: e.title,
            organization: e.organization,
            date: e.date,
            description: e.description,
          }))
        );
        if (insertEventsError) throw insertEventsError;
      }

      // Sync grades
      const { error: deleteGradesError } = await supabase.from("grades").delete().eq("user_id", user.id);
      if (deleteGradesError) throw deleteGradesError;

      if (grades.length > 0) {
        const { error: insertGradesError } = await supabase.from("grades").insert(
          grades.map(g => ({
            user_id: user.id,
            subject: g.subject,
            grade: g.grade,
            semester: g.semester || null,
          }))
        );
        if (insertGradesError) throw insertGradesError;
      }

      console.log("Portfolio saved correctly");
      toast.success("Portfolio saved successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Detailed error saving portfolio:", error);
      toast.error(`Failed to save: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCertificateImageUpload = async (file: File, index: number) => {
    try {
      setSaving(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `certificates/${user?.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const updated = [...certificates];
      updated[index].imageUrl = publicUrl;
      setCertificates(updated);
      toast.success("Certificate Preview Image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setSaving(false);
    }
  };

  const handleCertificateUpload = async (file: File, index: number) => {
    try {
      setSaving(true);
      const fileExt = file.name.split(".").pop();
      if (fileExt?.toLowerCase() !== "pdf") {
        throw new Error("Only PDF files are allowed for certificates.");
      }

      const filePath = `certificates/${user?.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars") // Using avatars bucket as it is confirmed to exist
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const updated = [...certificates];
      updated[index].pdfUrl = publicUrl;
      setCertificates(updated);
      toast.success("Certificate PDF uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading certificate");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  // Add handlers
  // Move handlers
  const moveItem = (list: any[], setList: (items: any[]) => void, index: number, direction: 'up' | 'down') => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setList(newList);
  };

  const addSkill = () => setSkills([...skills, { name: "", category: "Proficient" }]);
  const addProject = () => setProjects([...projects, { title: "", description: "", technologies: [], liveUrl: "", githubUrl: "", featured: false, imageUrl: "" }]);
  const addCertificate = () => setCertificates([...certificates, { title: "", issuer: "", date: "", description: "" }]);
  const addEvent = () => setEvents([...events, { title: "", organization: "", date: "", description: "" }]);
  const addGrade = () => setGrades([...grades, { subject: "", grade: "", semester: "" }]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-6 relative">
      <CodeBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="hero" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Section */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Developer" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about yourself..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={showGrades} onCheckedChange={setShowGrades} />
                <Label>Show grades publicly</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
                <Label>Show as "Available for Projects"</Label>
              </div>
              <div className="space-y-4 md:col-span-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted group">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Skills</h2>
              <Button variant="subtle" size="sm" onClick={addSkill}>
                <Plus className="w-4 h-4 mr-1" /> Add Skill
              </Button>
            </div>
            <div className="space-y-4">
              {skills.map((skill, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Input
                    value={skill.name}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[i].name = e.target.value;
                      setSkills(updated);
                    }}
                    placeholder="Skill name"
                    className="flex-1"
                  />
                  <select
                    value={skill.category}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[i].category = e.target.value;
                      setSkills(updated);
                    }}
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Proficient">Proficient</option>
                    <option value="Comfortable">Comfortable</option>
                    <option value="Learning">Learning</option>
                  </select>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItem(skills, setSkills, i, 'up')}
                      disabled={i === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItem(skills, setSkills, i, 'down')}
                      disabled={i === skills.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSkills(skills.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Projects</h2>
              <Button variant="subtle" size="sm" onClick={addProject}>
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </div>
            <div className="space-y-6">
              {projects.map((project, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={project.featured}
                        onCheckedChange={(checked) => {
                          const updated = [...projects];
                          updated[i].featured = checked;
                          setProjects(updated);
                        }}
                      />
                      <Label>Featured</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(projects, setProjects, i, 'up')}
                        disabled={i === 0}
                        className="h-8 w-8"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(projects, setProjects, i, 'down')}
                        disabled={i === projects.length - 1}
                        className="h-8 w-8"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setProjects(projects.filter((_, j) => j !== i))}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      value={project.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[i].title = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Project title"
                    />
                    <Input
                      value={project.liveUrl}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[i].liveUrl = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Live URL"
                    />
                  </div>
                  <Textarea
                    value={project.description}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[i].description = e.target.value;
                      setProjects(updated);
                    }}
                    placeholder="Project description"
                    rows={2}
                  />
                  <Input
                    value={project.githubUrl}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[i].githubUrl = e.target.value;
                      setProjects(updated);
                    }}
                    placeholder="GitHub URL"
                  />
                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, j) => (
                        <Badge key={j} variant="secondary" className="gap-1">
                          {tech}
                          <button onClick={() => {
                            const updated = [...projects];
                            updated[i].technologies = updated[i].technologies.filter((_, k) => k !== j);
                            setProjects(updated);
                          }}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add technology"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value) {
                            const updated = [...projects];
                            updated[i].technologies = [...updated[i].technologies, e.currentTarget.value];
                            setProjects(updated);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Project Preview Image
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProjectImageUpload(file, i);
                        }}
                        className="flex-1"
                      />
                      {project.imageUrl && (
                        <div className="w-16 h-10 rounded border border-border overflow-hidden bg-muted">
                          <img src={project.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certificates Section */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Certificates</h2>
              <Button variant="subtle" size="sm" onClick={addCertificate}>
                <Plus className="w-4 h-4 mr-1" /> Add Certificate
              </Button>
            </div>
            <div className="space-y-4">
              {certificates.map((cert, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-4">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => setCertificates(certificates.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input value={cert.title} onChange={(e) => { const u = [...certificates]; u[i].title = e.target.value; setCertificates(u); }} placeholder="Certificate title" />
                    <Input value={cert.issuer} onChange={(e) => { const u = [...certificates]; u[i].issuer = e.target.value; setCertificates(u); }} placeholder="Issuer" />
                    <Input value={cert.date} onChange={(e) => { const u = [...certificates]; u[i].date = e.target.value; setCertificates(u); }} placeholder="Date (e.g., 2024)" />
                  </div>
                  <Textarea value={cert.description} onChange={(e) => { const u = [...certificates]; u[i].description = e.target.value; setCertificates(u); }} placeholder="Description" rows={2} />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Card Preview Image
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCertificateImageUpload(file, i);
                          }}
                          className="flex-1"
                        />
                        {cert.imageUrl && (
                          <div className="w-12 h-12 rounded border border-border overflow-hidden bg-muted">
                            <img src={cert.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Full Certificate PDF
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCertificateUpload(file, i);
                          }}
                          className="flex-1"
                        />
                        {cert.pdfUrl && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <ExternalLink className="w-4 h-4" />
                            <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              View PDF
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Events Section */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Volunteer Events</h2>
              <Button variant="subtle" size="sm" onClick={addEvent}>
                <Plus className="w-4 h-4 mr-1" /> Add Event
              </Button>
            </div>
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-4">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => setEvents(events.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input value={event.title} onChange={(e) => { const u = [...events]; u[i].title = e.target.value; setEvents(u); }} placeholder="Event title" />
                    <Input value={event.organization} onChange={(e) => { const u = [...events]; u[i].organization = e.target.value; setEvents(u); }} placeholder="Organization" />
                    <Input value={event.date} onChange={(e) => { const u = [...events]; u[i].date = e.target.value; setEvents(u); }} placeholder="Date" />
                  </div>
                  <Textarea value={event.description} onChange={(e) => { const u = [...events]; u[i].description = e.target.value; setEvents(u); }} placeholder="Description" rows={2} />
                </div>
              ))}
            </div>
          </section>

          {/* Grades Section */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Grades</h2>
              <Button variant="subtle" size="sm" onClick={addGrade}>
                <Plus className="w-4 h-4 mr-1" /> Add Grade
              </Button>
            </div>
            <div className="space-y-4">
              {grades.map((grade, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Input value={grade.subject} onChange={(e) => { const u = [...grades]; u[i].subject = e.target.value; setGrades(u); }} placeholder="Subject" className="flex-1" />
                  <Input value={grade.grade} onChange={(e) => { const u = [...grades]; u[i].grade = e.target.value; setGrades(u); }} placeholder="Grade" className="w-20" />
                  <Input value={grade.semester} onChange={(e) => { const u = [...grades]; u[i].semester = e.target.value; setGrades(u); }} placeholder="Semester" className="w-32" />
                  <Button variant="ghost" size="icon" onClick={() => setGrades(grades.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPortfolio;
