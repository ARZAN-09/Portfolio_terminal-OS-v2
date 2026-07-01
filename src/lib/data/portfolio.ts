/**
 * Portfolio data source for Arzan S. S.
 * Single source of truth consumed by commands + virtual filesystem.
 */

export const profile = {
  name: "Arzan S. S.",
  username: "arzan",
  host: "portfolio",
  role: "Developer",
  tagline: "Building fast, secure, and human-friendly software at the edge of AI, cybersecurity, and the web.",
  location: "Karnataka, India",
  status: "Open to internships & collaboration",
  focus: ["AI", "Cybersecurity", "Web"],
  os: "PortfolioOS",
  shell: "portfolio-cli",
  email: "arzan.portfolio@gmail.com",
  phone: "+91 (available on request)",
  githubUsername: "arzan-portfolio",
  instagram: "arzan.dev",
  twitter: "arzan_dev",
};

export const about = `# About Me

I'm **Arzan S. S.**, a Computer Science diploma student and developer who treats the
terminal as a second language. I build things that are fast, deliberate, and a little
bit playful — from AI-assisted tools to motion-rich web experiences.

I care about **three things**:

- **AI** — making machines genuinely useful, not just impressive.
- **Cybersecurity** — defending systems before they need rescuing.
- **Web** — interfaces that feel alive and respond instantly.

When I'm not shipping, I'm reading novels, reverse-engineering how things work, or
rewriting my dotfiles for the fifth time this week.

> "The best interface is the one that gets out of the way — until you want it to shine."
`;

export const skills = {
  Programming: ["Python", "Java", "SQL", "JavaScript", "HTML", "CSS"],
  Frameworks: ["React", "Next.js", "Tailwind"],
  Backend: ["Node.js"],
  Databases: ["SQL"],
  Tools: ["Git", "GitHub", "VS Code", "Figma", "Photoshop"],
  "Security & Infra": ["Cybersecurity", "Networking"],
  Emerging: ["AI"],
} as const;

/** Proficiency percentages for the `tech` command's animated bars. */
export const techProficiency: { name: string; level: number; category: string }[] = [
  { name: "Python", level: 88, category: "Programming" },
  { name: "JavaScript", level: 84, category: "Programming" },
  { name: "Java", level: 72, category: "Programming" },
  { name: "SQL", level: 78, category: "Programming" },
  { name: "HTML", level: 92, category: "Programming" },
  { name: "CSS", level: 86, category: "Programming" },
  { name: "React", level: 85, category: "Frameworks" },
  { name: "Next.js", level: 80, category: "Frameworks" },
  { name: "Tailwind", level: 88, category: "Frameworks" },
  { name: "Node.js", level: 74, category: "Backend" },
  { name: "Git", level: 90, category: "Tools" },
  { name: "VS Code", level: 94, category: "Tools" },
  { name: "Figma", level: 70, category: "Tools" },
  { name: "Photoshop", level: 65, category: "Tools" },
  { name: "Cybersecurity", level: 76, category: "Security & Infra" },
  { name: "Networking", level: 72, category: "Security & Infra" },
  { name: "AI", level: 82, category: "Emerging" },
];

export const education = [
  {
    school: "Benson's English Medium School",
    period: "2010 – 2020",
    qualification: "Secondary Education",
    detail: "Foundation years — first encounter with computers, logic, and curiosity that never left.",
  },
  {
    school: "MLBP Bharatesh Polytechnic",
    period: "2023 – 2026",
    qualification: "Diploma in Computer Science",
    detail:
      "Currently pursuing. Focus on programming fundamentals, data structures, networking, and applied AI/security projects.",
  },
];

export const experience = [
  {
    role: "Independent Developer",
    period: "2023 – Present",
    org: "Self-driven projects",
    detail:
      "Designing and shipping full-stack web apps, AI experiments, and accessibility tools. Owning the whole loop — idea, design, code, deploy.",
    tags: ["React", "Next.js", "AI", "Node.js"],
  },
  {
    role: "CS Diploma Student",
    period: "2023 – 2026",
    org: "MLBP Bharatesh Polytechnic",
    detail:
      "Building a rigorous foundation in algorithms, databases, networking, and software engineering practice through coursework and projects.",
    tags: ["Java", "Python", "SQL", "Networking"],
  },
];

export const certifications: { name: string; issuer: string; year: string }[] = [
  { name: "Networking Fundamentals", issuer: "Coursework / Self-study", year: "2024" },
  { name: "Web Development", issuer: "Self-directed", year: "2024" },
  { name: "Intro to Cybersecurity", issuer: "Self-directed", year: "2025" },
];

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  description: string;
  features: string[];
  technologies: string[];
  challenges: string;
  lessons: string;
  github: string;
  status: "Shipped" | "In Progress" | "Prototype";
}

export const projects: Project[] = [
  {
    slug: "webnovel",
    name: "Webnovel Website",
    tagline: "A clean reading platform for serialized fiction.",
    year: "2024",
    description:
      "A web platform for reading and browsing web novels with chapter navigation, bookmarking, and a distraction-free reader mode. Built to feel fast even on slow connections.",
    features: [
      "Chapter-by-chapter reader with persistent progress",
      "Search & genre filtering with Fuse.js fuzzy matching",
      "Bookmark & reading history",
      "Responsive typography with dark mode",
    ],
    technologies: ["React", "Next.js", "Tailwind", "Node.js", "SQL"],
    challenges:
      "Keeping long-form reading smooth across devices while preserving scroll position per chapter without jank.",
    lessons:
      "Reading apps live or die by perceived performance — optimistic UI and careful scroll restoration matter more than raw feature count.",
    github: `https://github.com/${profile.githubUsername}/webnovel`,
    status: "Shipped",
  },
  {
    slug: "animated-webpage",
    name: "Animated Webpage",
    tagline: "A motion-heavy landing experience with scroll choreography.",
    year: "2024",
    description:
      "An experimental landing page that choreographs Framer Motion sequences to scroll, hover, and load events. A playground for learning advanced animation timing.",
    features: [
      "Scroll-linked reveal sequences",
      "Staggered hero entrance",
      "Interactive hover micro-interactions",
      "Reduced-motion aware fallbacks",
    ],
    technologies: ["React", "Framer Motion", "Tailwind", "TypeScript"],
    challenges:
      "Coordinating multiple animations without frame drops on mid-range mobile hardware.",
    lessons:
      "Animation is communication. Every transition should answer 'what just changed?' — if it doesn't, cut it.",
    github: `https://github.com/${profile.githubUsername}/animated-webpage`,
    status: "Shipped",
  },
  {
    slug: "schedule-buddy",
    name: "Schedule Buddy",
    tagline: "A smart study scheduler that adapts to your week.",
    year: "2025",
    description:
      "A scheduling assistant that helps students plan study sessions around classes, deadlines, and energy levels. Suggests time blocks and reschedules automatically when you slip.",
    features: [
      "Adaptive time-block suggestions",
      "Deadline-aware prioritization",
      "Drag-to-reschedule calendar",
      "Weekly review & streak tracking",
    ],
    technologies: ["React", "Next.js", "Tailwind", "Node.js", "SQL"],
    challenges:
      "Designing a rescheduling algorithm that feels helpful rather than naggy when plans change.",
    lessons:
      "Productivity tools fail when they demand too much input. The best default is the one the user never has to set.",
    github: `https://github.com/${profile.githubUsername}/schedule-buddy`,
    status: "In Progress",
  },
  {
    slug: "to-read-list",
    name: "To-Read List",
    tagline: "A minimalist reading list that actually gets read.",
    year: "2024",
    description:
      "A no-frills reading tracker for books, articles, and papers. Tags, priorities, and a 'currently reading' shelf that stays honest about what's stalled.",
    features: [
      "Tag & priority-based organization",
      "'Currently reading' shelf",
      "Progress tracking per item",
      "Keyboard-first navigation",
    ],
    technologies: ["React", "Tailwind", "SQL"],
    challenges:
      "Resisting feature creep — every 'helpful' addition threatened the minimalist core.",
    lessons:
      "Constraints are a feature. Saying no to scope is how a tool stays loved.",
    github: `https://github.com/${profile.githubUsername}/to-read-list`,
    status: "Shipped",
  },
  {
    slug: "exercise-app",
    name: "Exercises App",
    tagline: "A workout companion with form cues and progression.",
    year: "2025",
    description:
      "A fitness app that tracks workouts, suggests progressions, and gives form cues. Built around a clean set/rep logging flow you can use mid-workout.",
    features: [
      "Fast set/rep logging",
      "Progressive overload suggestions",
      "Exercise library with form cues",
      "Workout history & PRs",
    ],
    technologies: ["React", "Next.js", "Tailwind", "Node.js"],
    challenges:
      "Making logging fast enough to use between sets without breaking flow.",
    lessons:
      "In-the-moment apps win on speed and low interaction cost above all else.",
    github: `https://github.com/${profile.githubUsername}/exercise-app`,
    status: "Prototype",
  },
  {
    slug: "hand-mouse",
    name: "Hand Mouse",
    tagline: "Control your cursor with your hand via webcam.",
    year: "2025",
    description:
      "A computer-vision experiment that turns a webcam into a touchless mouse — track your index finger to move the pointer, pinch to click. An accessibility-first prototype.",
    features: [
      "Real-time hand landmark tracking",
      "Pinch-to-click gesture",
      "Smoothing for stable cursor motion",
      "Adjustable sensitivity",
    ],
    technologies: ["Python", "OpenCV", "MediaPipe"],
    challenges:
      "Filtering jitter so the cursor is usable without lagging behind the hand.",
    lessons:
      "Accessibility-driven constraints produce the most creative engineering solutions.",
    github: `https://github.com/${profile.githubUsername}/hand-mouse`,
    status: "Prototype",
  },
];

export const contacts = {
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  github: `https://github.com/${profile.githubUsername}`,
  instagram: `https://instagram.com/${profile.instagram}`,
  twitter: `https://x.com/${profile.twitter}`,
};

export const socials = [
  { label: "GitHub", handle: `@${profile.githubUsername}`, url: contacts.github },
  { label: "Instagram", handle: `@${profile.instagram}`, url: contacts.instagram },
  { label: "Twitter / X", handle: `@${profile.twitter}`, url: contacts.twitter },
  { label: "Email", handle: profile.email, url: `mailto:${profile.email}` },
];

/** ASCII banner used by the `banner` and boot commands. */
export const banner = String.raw`
┌─────────────────┐
│  PORTFOLIO OS   │
│     A10305      │
└─────────────────┘

  arzan@portfolio  ·  PortfolioOS  ·  type "help" to begin
`;
