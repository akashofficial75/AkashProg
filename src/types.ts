export type Project = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  liveLink: string;
  githubLink: string;
  techStack: string[];
  createdAt: any;
  order?: number;
};

export type AppItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  liveLink: string;
  githubLink: string;
  techStack: string[];
  createdAt?: any;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  createdAt: any;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  progress: number;
  order?: number;
};

export type Social = {
  id: string;
  platform: string;
  url: string;
  order?: number;
};
