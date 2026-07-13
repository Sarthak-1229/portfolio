export interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resume: string;
}

export interface Experience {
  role: string;
  org: string;
  date: string;
  current?: boolean;
  points: string[];
}

export interface Education {
  degree: string;
  school: string;
  date: string;
}

export interface Project {
  name: string;
  tagline: string;
  tags: string[];
  github?: string;
  points: string[];
  achievement?: string;
  hasResearchPaper?: boolean;
  researchPaperNote?: string;
  image: string;
}

export interface SpokenLanguage {
  name: string;
  level: string;
}

export interface Certification {
  date: string;
  name: string;
}

export interface Skills {
  languages: string[];
  ai_ml: string[];
  web_fullstack: string[];
  cybersecurity: string[];
  iot: string[];
  tools: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  location: string;
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
  languages_spoken: SpokenLanguage[];
  accomplishments: string[];
  certifications: Certification[];
}
