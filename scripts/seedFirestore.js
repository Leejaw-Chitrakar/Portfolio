import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp,
  collection,
  getDocs
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read & parse .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found at', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("Missing VITE_FIREBASE_API_KEY in .env");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 2. Structured & Scalable Schema Data
const projects = [
  {
    slug: "chiya-jivan",
    title: "Chiya Jivan — Tea Café App",
    description: "A full-stack boutique tea café web app for a Thamel café. Features a dynamic menu, immersive social gallery, QR-code ordering, and a protected admin dashboard with Firebase Auth & Firestore for real-time order and content management.",
    tech: ["React JS", "Vite", "Firebase", "Firestore", "CSS3"],
    category: "Full Stack",
    image: "/projects/chiyajivan.png",
    liveUrl: "http://chiyajivan.web.app/",
    githubUrl: "https://github.com/leejaw-Chitrakar/Chiyajivan",
    featured: true,
    status: "Live",
    order: 1
  },
  {
    slug: "lifedrop",
    title: "LifeDrop — Blood Donation Network",
    description: "A civic-tech blood donation platform designed to instantly connect active donors with patients in urgent need. Features rapid donor registration, a real-time admin management portal with role-based Firebase Auth, GSAP scroll-triggered transitions, and integrated Nepali date conversion libraries.",
    tech: ["React JS", "Vite", "Firebase", "Firestore", "GSAP", "CSS3"],
    category: "Civic Tech",
    image: "/projects/lifedrop.png",
    liveUrl: "https://lifedrop-network.web.app/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/lifedrop",
    featured: true,
    status: "Completed",
    order: 2
  },
  {
    slug: "vibecouture",
    title: "VibeCouture Fashion Store",
    description: "A premium MERN stack fashion e-commerce platform featuring high-end aesthetics, robust state management, and a seamless shopping experience.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Firebase"],
    category: "Full Stack",
    image: "/projects/vibecouture.png",
    liveUrl: "https://vibecouture.web.app",
    githubUrl: "https://github.com/Leejaw-Chitrakar/VibeCouture",
    featured: true,
    status: "Prototype",
    order: 3
  },
  {
    slug: "kaaputale",
    title: "Kaaputale E-Commerce Site",
    description: "An e-commerce platform with a focus on delivering optimized user experience (UX) and a clean, responsive design across mobile, tablet, and desktop.",
    tech: ["ReactJS", "CSS3", "Responsive Design"],
    category: "Frontend",
    image: "https://i.postimg.cc/htsg4YZd/IMG-20260207-WA0000.jpg",
    liveUrl: "https://kaaputale.web.app",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Kaaputale",
    featured: false,
    status: "Public",
    order: 4
  },
  {
    slug: "quiz-game",
    title: "Quiz Game",
    description: "An interactive browser-based quiz game showcasing dynamic JavaScript logic, DOM manipulation, and engaging user interaction flows.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "Game / Logic",
    image: "https://i.postimg.cc/rwPn9CKY/quiz_Game.png",
    liveUrl: "https://leejaw-chitrakar.github.io/Quiz-Game/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Quiz-Game",
    featured: false,
    status: "Live",
    order: 5
  },
  {
    slug: "snake-game",
    title: "Snake Game",
    description: "A modern, high-performance implementation of the classic Snake game featuring smooth animations, responsive controls, and a sleek, minimalist UI.",
    tech: ["HTML", "CSS", "JavaScript", "Animation"],
    category: "Game / Animation",
    image: "/projects/snake-game.png",
    liveUrl: "https://leejaw-chitrakar.github.io/Snake-Game/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Snake-Game",
    featured: false,
    status: "Live",
    order: 6
  },
  {
    slug: "hult-prize",
    title: "Hult Prize at Samriddhi",
    description: "An official web platform for Hult Prize at Samriddhi College — empowering students to tackle the world's pressing social challenges through entrepreneurship and innovation.",
    tech: ["React", "Firebase", "CSS3", "Responsive Design"],
    category: "Platform",
    image: "/projects/hultprize.png",
    liveUrl: "https://hultprizeatsamriddhi.web.app/",
    githubUrl: "#",
    featured: false,
    status: "Live",
    order: 7
  },
  {
    slug: "hangman-game",
    title: "Hangman Game",
    description: "A classic Hangman game built in C, demonstrating core programming concepts such as arrays, loops, string handling, and game logic implementation in a console environment.",
    tech: ["C", "Console Application"],
    category: "CLI / Systems",
    image: "https://images.unsplash.com/photo-1753285310764-54c9571eff70?q=80&w=665&auto=format&fit=crop",
    liveUrl: "#",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Hangman",
    featured: false,
    status: "Completed",
    order: 8
  },
  {
    slug: "pixel-art",
    title: "LC Pixel Art",
    description: "A creative web-based pixel art drawing application, allowing users to paint, design, and export pixel-perfect artworks directly from their browser.",
    tech: ["React", "Vite", "CSS"],
    category: "Creative Tool",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=665&auto=format&fit=crop",
    liveUrl: "https://lc-pixel-art.web.app/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/pixel-art",
    featured: false,
    status: "Live",
    order: 9
  },
  {
    slug: "student-management-system",
    title: "Student Management System",
    description: "A robust third-semester React project designed for tracking, managing, and organizing student records and institutional data seamlessly.",
    tech: ["React", "Vite", "Firebase"],
    category: "Enterprise / Portal",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=665&auto=format&fit=crop",
    liveUrl: "https://lc-studentmanagementsys.web.app/",
    githubUrl: "https://github.com/Leejaw-Chitrakar",
    featured: false,
    status: "Live",
    order: 10
  }
];

const events = [
  {
    slug: "safesurf-himchuli-2026",
    title: "SITC INIT SafeSurf — AI Literacy",
    role: "Speaker / Facilitator",
    date: "18th September 2026",
    isoDate: "2026-09-18",
    venue: "Himchuli Academy, Bode",
    attendees: "Grade 8–10 Students",
    tag: "Workshop",
    tagColor: "primary",
    desc: "Introduced AI fundamentals and prompt engineering basics to secondary school students under the theme 'Explore • Prompt • Think', helping them think critically about how AI shapes everyday life.",
    order: 1
  },
  {
    slug: "safesurf-arniko-2026",
    title: "SITC INIT SafeSurf — AI Exploration & Prompting",
    role: "Speaker / Facilitator",
    date: "9th October 2026",
    isoDate: "2026-10-09",
    venue: "Arniko International Secondary School",
    attendees: "Secondary School Students",
    tag: "Workshop",
    tagColor: "primary",
    desc: "Led interactive prompt-engineering demonstrations and explored the boundary between AI assistance and human creativity while promoting safe, ethical digital habits in academic settings.",
    order: 2
  },
  {
    slug: "safesurf-vidhya-sagar-2026",
    title: "SITC INIT SafeSurf — Cybersecurity 101",
    role: "Speaker / Facilitator",
    date: "30th October 2026",
    isoDate: "2026-10-30",
    venue: "Vidhya Sagar English Secondary School",
    attendees: "Secondary School Students",
    tag: "Workshop",
    tagColor: "secondary",
    desc: "Delivered a foundational cybersecurity awareness session under the theme 'Think • Test • Score', equipping students with threat-detection skills, password hygiene, and safe online browsing routines.",
    order: 3
  },
  {
    slug: "leapfrog-connect-2026",
    title: "Leapfrog Connect — Industry Visit",
    role: "Participant",
    date: "21st July 2026",
    isoDate: "2026-07-21",
    venue: "Leapfrog Technology, Dillibazar",
    attendees: "Samriddhi IT Club Members",
    tag: "Industry Visit",
    tagColor: "accent",
    desc: "Visited Leapfrog Technology to observe production-grade software engineering in action. Engaged in open Q&A with industry professionals and gained deeper insight into real-world development workflows and career paths.",
    order: 4
  },
  {
    slug: "hult-prize-volunteer-2026",
    title: "Hult Prize at Samriddhi — Web & Tech Team",
    role: "Volunteer (Web & Tech)",
    date: "February 2026",
    isoDate: "2026-02-01",
    venue: "Samriddhi College, Kathmandu",
    attendees: "Student Innovators",
    tag: "Volunteer",
    tagColor: "secondary",
    desc: "Contributed as part of the Web & Tech Team for the Hult Prize On-Campus Program, designing and developing the official event platform to support student teams pursuing social innovation.",
    order: 5
  },
  {
    slug: "bootcamp-samriddhi-2025",
    title: "Web Development Bootcamp",
    role: "Participant",
    date: "July 2025",
    isoDate: "2025-07-01",
    venue: "Samriddhi IT Club",
    attendees: "Club Members",
    tag: "Bootcamp",
    tagColor: "accent",
    desc: "Completed an intensive web development bootcamp organized by Samriddhi IT Club covering modern web technologies, hands-on projects, and industry-grade development practices.",
    order: 6
  }
];

const milestones = [
  {
    slug: "interactive-games",
    title: "Interactive Games — Quiz & Hangman",
    date: "Discovery Phase",
    desc: "Created interactive browser games showcasing core JavaScript logic, programming concepts, and user engagement.",
    order: 1
  },
  {
    slug: "bsc-csit",
    title: "BSc.CSIT — Tribhuvan University",
    date: "2024",
    desc: "Started Bachelor of Science in Computer Science and Information Technology at Kathmandu, Ason Ward 25, Bagmati Province.",
    order: 2
  },
  {
    slug: "kaaputale-milestone",
    title: "Kaaputale (Kaputali) — React E-Commerce Platform",
    date: "April 2026 | Public",
    desc: "Developed a responsive React + Vite e-commerce platform focused on optimized UX and clean design across all devices. Built with JavaScript, React, and Vite as a publicly available repository.",
    order: 3
  },
  {
    slug: "vibecouture-milestone",
    title: "VibeCouture — Interactive Fashion Showcase",
    date: "April 2026 | Team Project",
    desc: "Collaborated on a private-team JavaScript fashion showcase prototype, delivering an interactive and visually engaging frontend experience for a modern fashion brand concept.",
    order: 4
  },
  {
    slug: "chiya-jivan-milestone",
    title: "Chiya Jivan — Offline-First SaaS POS Platform",
    date: "August – October 2026",
    desc: "Built a full-stack MERN + Firebase SaaS POS and management platform for tea shops, cafes, and multi-branch eateries. Features a Kitchen Display System with real-time order routing, Waiter UI with live grid modifications, split billing engine, Digital Khata credit tracking, and multi-tenant data isolation.",
    order: 5
  },
  {
    slug: "lifedrop-milestone",
    title: "LifeDrop — Digital Standby Blood Donor Registry",
    date: "July – August 2026 | Completed",
    desc: "Designed and deployed a full-stack blood donor registry platform connecting standby donors with emergency medical requests. Built for reliable, rapid-access donor lookup during urgent healthcare needs, with role-based Firebase Authentication and GSAP scroll animations.",
    order: 6
  },
  {
    slug: "leapfrog-visit-milestone",
    title: "Industry Visit — Leapfrog Connect",
    date: "21st July 2026 | Leapfrog Technology, Dillibazar",
    desc: "Participated in an exclusive tech ecosystem exposure visit to Leapfrog Technology organized by Samriddhi IT Club. Explored production-grade engineering workflows, modern company culture, and gained valuable career insights through interactive Q&A sessions.",
    order: 7
  },
  {
    slug: "safesurf-ai-literacy-milestone",
    title: "SITC INIT SafeSurf — AI Literacy & Responsible AI",
    date: "18th September | Himchuli Academy, Bode",
    desc: "Conducted Session 01 (\"AI हो कि म?\") under the theme 'Explore • Prompt • Think' for Grade 8–10 students. Introduced AI fundamentals, practical prompt engineering basics, and critical thinking to evaluate AI outputs responsibly.",
    order: 8
  },
  {
    slug: "safesurf-ai-prompting-milestone",
    title: "SITC INIT SafeSurf — AI Exploration & Effective Prompting",
    date: "9th October | Arniko International Secondary School",
    desc: "Led Session 02 (\"AI हो कि म?\") engaging secondary school students in interactive prompt engineering demonstrations, exploring the boundary between AI assistance and human creativity.",
    order: 9
  },
  {
    slug: "safesurf-cybersecurity-milestone",
    title: "SITC INIT SafeSurf — Cybersecurity 101",
    date: "30th October | Vidhya Sagar English Secondary School",
    desc: "Conducted Session 03 under the theme 'Think • Test • Score', equipping secondary school students with foundational cybersecurity awareness, threat & phishing detection skills, password security, and safe online navigation routines.",
    order: 10
  }
];

const certifications = [
  {
    slug: "web-dev-bootcamp",
    title: "Web Development Bootcamp",
    issuer: "Samriddhi IT Club",
    date: "July 2025",
    credentialUrl: "https://i.postimg.cc/LXNbsRvP/Bootcamp.png",
    logo: "https://i.postimg.cc/T2QBQjVT/Samriddhi-Logo.png",
    order: 1
  },
  {
    slug: "hult-prize-participation",
    title: "Hult Prize Participation",
    issuer: "Hult Prize Foundation",
    date: "Feb 2025",
    credentialUrl: "https://i.postimg.cc/j5ZFjKvw/Hult_Participation.png",
    logo: "https://i.postimg.cc/cCXqnwmY/Hult-Logo.png",
    order: 2
  },
  {
    slug: "hult-prize-web-tech-team",
    title: "Web & Tech Team - Hult Prize",
    issuer: "Hult Prize Samriddhi",
    date: "Feb 2026",
    credentialUrl: "https://i.postimg.cc/1XXYnTYV/Hult_Web_Tech.png",
    logo: "https://i.postimg.cc/cCXqnwmY/Hult-Logo.png",
    order: 3
  },
  {
    slug: "appreciation-lakshyaarambha",
    title: "Certificate of Appreciation – Lakshayrambha",
    issuer: "CSIT Association of Nepal",
    date: "June 2025",
    credentialUrl: "https://i.postimg.cc/0jjHM3HG/Lakshyaarambha.png",
    logo: "https://i.postimg.cc/pL0NTfTM/CSITAN.png",
    order: 4
  },
  {
    slug: "project-management-cert",
    title: "Project Management Certificate",
    issuer: "Skill Lab",
    date: "Oct 2025",
    credentialUrl: "https://i.postimg.cc/qqqZhYZh/Project_Management.jpg",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
    order: 5
  },
  {
    slug: "linux-fundamentals-rh104",
    title: "Linux Fundamentals (RH104)",
    issuer: "Red Hat Academy",
    date: "March 2025",
    credentialUrl: "https://i.postimg.cc/qRj570Q2/Redhat.jpg",
    logo: "https://i.postimg.cc/Xvcsq3xN/Red-Hat.png",
    order: 6
  },
  {
    slug: "ai-prompt-engineering",
    title: "AI and Prompt Engineering",
    issuer: "Skill Lab",
    date: "Dec 2025",
    credentialUrl: "https://i.postimg.cc/yxMG63rg/AI-Prompting.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
    order: 7
  },
  {
    slug: "leadership-basic-course",
    title: "Leadership Basic Course",
    issuer: "Skill Lab",
    date: "Dec 2025",
    credentialUrl: "https://i.postimg.cc/1XnTZrM9/Leadership-Basic.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
    order: 8
  },
  {
    slug: "portfolio-website-essentials",
    title: "Portfolio Website Essentials",
    issuer: "CSIT Association of Nepal",
    date: "2026",
    credentialUrl: "https://i.postimg.cc/s22M8y1m/portfolio-website-essentials-2026.png",
    logo: "https://i.postimg.cc/pL0NTfTM/CSITAN.png",
    order: 9
  }
];

async function seed() {
  console.log("==========================================");
  console.log("🚀 Starting Firestore Database Seeding...");
  console.log("Project ID:", firebaseConfig.projectId);
  console.log("==========================================\n");

  // Optional: If email/password are provided via CLI arguments, authenticate first
  // Usage: node scripts/seedFirestore.js admin@example.com myPassword
  const email = process.argv[2];
  const password = process.argv[3];

  if (email && password) {
    try {
      console.log(`🔑 Authenticating as ${email}...`);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Authenticated successfully!\n");
    } catch (authErr) {
      console.warn("⚠️ Authentication failed:", authErr.message);
      console.warn("Attempting unauthenticated seed (will work if read/write rules allow)...\n");
    }
  } else {
    console.log("ℹ️ No admin credentials passed as args. Running unauthenticated.");
    console.log("   (If writes fail due to permissions, run: npm run seed -- your@email.com yourpassword)\n");
  }

  // 1. Seed Projects
  console.log(`📦 Seeding 'projects' collection (${projects.length} documents)...`);
  for (const item of projects) {
    const docId = item.slug;
    const docRef = doc(db, "projects", docId);
    await setDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log(`   ✓ [projects/${docId}] ${item.title}`);
  }

  // 2. Seed Events
  console.log(`\n📅 Seeding 'events' collection (${events.length} documents)...`);
  for (const item of events) {
    const docId = item.slug;
    const docRef = doc(db, "events", docId);
    await setDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log(`   ✓ [events/${docId}] ${item.title}`);
  }

  // 3. Seed Milestones
  console.log(`\n🏆 Seeding 'milestones' collection (${milestones.length} documents)...`);
  for (const item of milestones) {
    const docId = item.slug;
    const docRef = doc(db, "milestones", docId);
    await setDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log(`   ✓ [milestones/${docId}] ${item.title}`);
  }

  // 4. Seed Certifications
  console.log(`\n📜 Seeding 'certifications' collection (${certifications.length} documents)...`);
  for (const item of certifications) {
    const docId = item.slug;
    const docRef = doc(db, "certifications", docId);
    await setDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log(`   ✓ [certifications/${docId}] ${item.title}`);
  }

  console.log("\n==========================================");
  console.log("🎉 Firestore database seeded successfully!");
  console.log("==========================================");
  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌ Fatal Error during seeding:", err);
  if (err.code === "permission-denied") {
    console.error("\n💡 Solution: Either allow write rules in Firebase Console during seed,");
    console.error("   or run the script with your admin credentials:");
    console.error("   node scripts/seedFirestore.js <email> <password>");
  }
  process.exit(1);
});
