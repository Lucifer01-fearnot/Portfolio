export interface Skill {
  id: string;
  name: string;
  level?: number; // Optional: 0-100
  category: string; // e.g., "Proficient", "Comfortable", "Learning"
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  imageUrl?: string;
  pdfUrl?: string;
}

export interface VolunteerEvent {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface Grade {
  id: string;
  subject: string;
  grade: string;
  semester?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  description: string;
  email?: string;
  linkedIn?: string;
  github?: string;
  avatarUrl?: string;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  events: VolunteerEvent[];
  grades: Grade[];
  showGrades: boolean;
  isAvailable: boolean;
}
