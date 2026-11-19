import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase/config";

// Default fallback data
export const defaultProjects = [
  {
    title: "Chiya Jivan — Tea Café App",
    description: "A full-stack boutique tea café web app for a Thamel café. Features a dynamic menu, immersive social gallery, QR-code ordering, and a protected admin dashboard with Firebase Auth & Firestore for real-time order and content management.",
    tech: ["React JS", "Vite", "Firebase", "Firestore", "CSS3"],
    image: "/projects/chiyajivan.png",
    liveUrl: "http://chiyajivan.web.app/",
    githubUrl: "https://github.com/leejaw-Chitrakar/Chiyajivan",
    order: 1
  },
  {
    title: "LifeDrop — Blood Donation Network",
    description: "A civic-tech blood donation platform designed to instantly connect active donors with patients in urgent need. Features rapid donor registration, a real-time admin management portal with role-based Firebase Auth, GSAP scroll-triggered transitions, and integrated Nepali date conversion libraries.",
    tech: ["React JS", "Vite", "Firebase", "Firestore", "GSAP", "CSS3"],
    image: "/projects/lifedrop.png",
    liveUrl: "https://lifedrop-network.web.app/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/lifedrop",
    order: 2
  },
  {
    title: "VibeCouture Fashion Store",
    description: "A premium MERN stack fashion e-commerce platform featuring high-end aesthetics, robust state management, and a seamless shopping experience.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Firebase"],
    image: "/projects/vibecouture.png",
    liveUrl: "https://vibecouture.web.app",
    githubUrl: "https://github.com/Leejaw-Chitrakar/VibeCouture",
    order: 3
  },
  {
    title: "Kaaputale E-Commerce Site",
    description: "An e-commerce platform with a focus on delivering optimized user experience (UX) and a clean, responsive design across mobile, tablet, and desktop.",
    tech: ["ReactJS", "CSS3", "Responsive Design"],
    image: "https://i.postimg.cc/htsg4YZd/IMG-20260207-WA0000.jpg",
    liveUrl: "https://kaaputale.web.app",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Kaaputale",
    order: 4
  },
  {
    title: "Quiz Game",
    description: "An interactive browser-based quiz game showcasing dynamic JavaScript logic, DOM manipulation, and engaging user interaction flows.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "https://i.postimg.cc/rwPn9CKY/quiz_Game.png",
    liveUrl: "https://leejaw-chitrakar.github.io/Quiz-Game/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Quiz-Game",
    order: 5
  },
  {
    title: "Snake Game",
    description: "A modern, high-performance implementation of the classic Snake game featuring smooth animations, responsive controls, and a sleek, minimalist UI.",
    tech: ["HTML", "CSS", "JavaScript", "Animation"],
    image: "/projects/snake-game.png",
    liveUrl: "https://leejaw-chitrakar.github.io/Snake-Game/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Snake-Game",
    order: 6
  },
  {
    title: "Hult Prize at Samriddhi",
    description: "An official web platform for Hult Prize at Samriddhi College — empowering students to tackle the world's pressing social challenges through entrepreneurship and innovation.",
    tech: ["React", "Firebase", "CSS3", "Responsive Design"],
    image: "/projects/hultprize.png",
    liveUrl: "https://hultprizeatsamriddhi.web.app/",
    githubUrl: "#",
    order: 7
  },
  {
    title: "Hangman Game",
    description: "A classic Hangman game built in C, demonstrating core programming concepts such as arrays, loops, string handling, and game logic implementation in a console environment.",
    tech: ["C", "Console Application"],
    image: "https://images.unsplash.com/photo-1753285310764-54c9571eff70?q=80&w=665&auto=format&fit=crop",
    liveUrl: "#",
    githubUrl: "https://github.com/Leejaw-Chitrakar/Hangman",
    order: 8
  },
  {
    title: "LC Pixel Art",
    description: "A creative web-based pixel art drawing application, allowing users to paint, design, and export pixel-perfect artworks directly from their browser.",
    tech: ["React", "Vite", "CSS"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=665&auto=format&fit=crop",
    liveUrl: "https://lc-pixel-art.web.app/",
    githubUrl: "https://github.com/Leejaw-Chitrakar/pixel-art",
    order: 9
  },
  {
    title: "Student Management System",
    description: "A robust third-semester React project designed for tracking, managing, and organizing student records and institutional data seamlessly.",
    tech: ["React", "Vite", "Firebase"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=665&auto=format&fit=crop",
    liveUrl: "https://lc-studentmanagementsys.web.app/",
    githubUrl: "https://github.com/Leejaw-Chitrakar",
    order: 10
  }
];

export const defaultEvents = [
  {
    title: "SITC INIT SafeSurf — AI Literacy",
    role: "Speaker / Facilitator",
    date: "18th September 2026",
    venue: "Himchuli Academy, Bode",
    attendees: "Grade 8–10 Students",
    tag: "Workshop",
    tagColor: "primary",
    desc: "Introduced AI fundamentals and prompt engineering basics to secondary school students under the theme 'Explore • Prompt • Think', helping them think critically about how AI shapes everyday life.",
    polaroidNote: "Inspiring Grade 8 minds on AI & Prompting! 💡",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
    fallback: "https://placehold.co/800x600/1e293b/fbbf24?text=AI+Literacy+Workshop",
    rotation: "-rotate-2",
    visible: true,
    order: 1
  },
  {
    title: "SITC INIT SafeSurf — AI Exploration & Prompting",
    role: "Speaker / Facilitator",
    date: "9th October 2026",
    venue: "Arniko International Secondary School",
    attendees: "Secondary School Students",
    tag: "Workshop",
    tagColor: "primary",
    desc: "Led interactive prompt-engineering demonstrations and explored the boundary between AI assistance and human creativity while promoting safe, ethical digital habits in academic settings.",
    polaroidNote: "Prompting live demos & human creativity! 🤖",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    fallback: "https://placehold.co/800x600/1e293b/fbbf24?text=AI+Exploration+Session",
    rotation: "rotate-2",
    visible: true,
    order: 2
  },
  {
    title: "SITC INIT SafeSurf — Cybersecurity 101",
    role: "Speaker / Facilitator",
    date: "30th October 2026",
    venue: "Vidhya Sagar English Secondary School",
    attendees: "Secondary School Students",
    tag: "Workshop",
    tagColor: "secondary",
    desc: "Delivered a foundational cybersecurity awareness session under the theme 'Think • Test • Score', equipping students with threat-detection skills, password hygiene, and safe online browsing routines.",
    polaroidNote: "Think • Test • Score — Cybersecurity 101 🛡️",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    fallback: "https://placehold.co/800x600/1e293b/fbbf24?text=Cybersecurity+101",
    rotation: "-rotate-1",
    visible: true,
    order: 3
  },
  {
    title: "Leapfrog Connect — Industry Visit",
    role: "Participant",
    date: "21st July 2026",
    venue: "Leapfrog Technology, Dillibazar",
    attendees: "Samriddhi IT Club Members",
    tag: "Industry Visit",
    tagColor: "accent",
    desc: "Visited Leapfrog Technology to observe production-grade software engineering in action. Engaged in open Q&A with industry professionals and gained deeper insight into real-world development workflows and career paths.",
    polaroidNote: "Inside Leapfrog's engineering culture 🚀",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    fallback: "https://placehold.co/800x600/1e293b/fbbf24?text=Leapfrog+Industry+Visit",
    rotation: "rotate-3",
    visible: true,
    order: 4
  },
  {
    title: "Hult Prize at Samriddhi — Web & Tech Team",
    role: "Volunteer (Web & Tech)",
    date: "February 2026",
    venue: "Samriddhi College, Kathmandu",
    attendees: "Student Innovators",
    tag: "Volunteer",
    tagColor: "secondary",
    desc: "Contributed as part of the Web & Tech Team for the Hult Prize On-Campus Program, designing and developing the official event platform to support student teams pursuing social innovation.",
    polaroidNote: "Designing the platform for student innovators ✨",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
    fallback: "https://placehold.co/800x600/1e293b/fbbf24?text=Hult+Prize+Samriddhi",
    rotation: "-rotate-2",
    visible: true,
    order: 5
  },
  {
    title: "Web Development Bootcamp",
    role: "Participant",
    date: "July 2025",
    venue: "Samriddhi IT Club",
    attendees: "Club Members",
    tag: "Bootcamp",
    tagColor: "accent",
    desc: "Completed an intensive web development bootcamp organized by Samriddhi IT Club covering modern web technologies, hands-on projects, and industry-grade development practices.",
    polaroidNote: "Sprint coding & building full-stack projects 💻",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    fallback: "https://placehold.co/800x600/1e293b/fbbf24?text=Web+Dev+Bootcamp",
    rotation: "rotate-1",
    visible: true,
    order: 6
  }
];

export const defaultMilestones = [
  {
    title: "Interactive Games — Quiz & Hangman",
    date: "Discovery Phase",
    desc: "Created interactive browser games showcasing core JavaScript logic, programming concepts, and user engagement.",
    order: 1
  },
  {
    title: "BSc.CSIT — Tribhuvan University",
    date: "2024",
    desc: "Started Bachelor of Science in Computer Science and Information Technology at Kathmandu, Ason Ward 25, Bagmati Province.",
    order: 2
  },
  {
    title: "Kaaputale (Kaputali) — React E-Commerce Platform",
    date: "April 2026 | Public",
    desc: "Developed a responsive React + Vite e-commerce platform focused on optimized UX and clean design across all devices. Built with JavaScript, React, and Vite as a publicly available repository.",
    order: 3
  },
  {
    title: "VibeCouture — Interactive Fashion Showcase",
    date: "April 2026 | Team Project",
    desc: "Collaborated on a private-team JavaScript fashion showcase prototype, delivering an interactive and visually engaging frontend experience for a modern fashion brand concept.",
    order: 4
  },
  {
    title: "Chiya Jivan — Offline-First SaaS POS Platform",
    date: "August – October 2026",
    desc: "Built a full-stack MERN + Firebase SaaS POS and management platform for tea shops, cafes, and multi-branch eateries. Features a Kitchen Display System with real-time order routing (drinks → bar, food → kitchen), Waiter UI with live grid modifications, split billing engine (equal, itemized, custom), Digital Khata credit tracking, and multi-tenant data isolation via Firestore Security Rules, TLS 1.3, and AES-256.",
    order: 5
  },
  {
    title: "LifeDrop — Digital Standby Blood Donor Registry",
    date: "July – August 2026 | Completed",
    desc: "Designed and deployed a full-stack blood donor registry platform connecting standby donors with emergency medical requests. Built for reliable, rapid-access donor lookup during urgent healthcare needs, with role-based Firebase Authentication, GSAP scroll animations, and integrated Nepali date utilities.",
    order: 6
  },
  {
    title: "Industry Visit — Leapfrog Connect",
    date: "21st July 2026 | Leapfrog Technology, Dillibazar",
    desc: "Participated in an exclusive tech ecosystem exposure visit to Leapfrog Technology organized by Samriddhi IT Club. Explored production-grade engineering workflows, modern company culture, and gained valuable career insights through interactive Q&A sessions with industry professionals.",
    order: 7
  },
  {
    title: "SITC INIT SafeSurf — AI Literacy & Responsible AI",
    date: "18th September | Himchuli Academy, Bode",
    desc: "Conducted Session 01 (\"AI हो कि म?\") under the theme 'Explore • Prompt • Think' for Grade 8–10 students. Introduced AI fundamentals, practical prompt engineering basics, and critical thinking to evaluate AI outputs responsibly.",
    order: 8
  },
  {
    title: "SITC INIT SafeSurf — AI Exploration & Effective Prompting",
    date: "9th October | Arniko International Secondary School",
    desc: "Led Session 02 (\"AI हो कि म?\") engaging secondary school students in interactive prompt engineering demonstrations, exploring the boundary between AI assistance and human creativity, and practicing safe digital habits in academia.",
    order: 9
  },
  {
    title: "SITC INIT SafeSurf — Cybersecurity 101",
    date: "30th October | Vidhya Sagar English Secondary School",
    desc: "Conducted Session 03 under the theme 'Think • Test • Score', equipping secondary school students with foundational cybersecurity awareness, threat & phishing detection skills, password security, and safe online navigation routines.",
    order: 10
  }
];

export const defaultCertifications = [
  {
    title: "Web Development Bootcamp",
    issuer: "Samriddhi IT Club",
    date: "July 2025",
    credentialUrl: "https://i.postimg.cc/LXNbsRvP/Bootcamp.png",
    logo: "https://i.postimg.cc/T2QBQjVT/Samriddhi-Logo.png",
    order: 1
  },
  {
    title: "Hult Prize Participation",
    issuer: "Hult Prize Foundation",
    date: "Feb 2025",
    credentialUrl: "https://i.postimg.cc/j5ZFjKvw/Hult_Participation.png",
    logo: "https://i.postimg.cc/cCXqnwmY/Hult-Logo.png",
    order: 2
  },
  {
    title: "Web & Tech Team - Hult Prize",
    issuer: "Hult Prize Samriddhi",
    date: "Feb 2026",
    credentialUrl: "https://i.postimg.cc/1XXYnTYV/Hult_Web_Tech.png",
    logo: "https://i.postimg.cc/cCXqnwmY/Hult-Logo.png",
    order: 3
  },
  {
    title: "Certificate of Appreciation – Lakshayrambha",
    issuer: "CSIT Association of Nepal",
    date: "June 2025",
    credentialUrl: "https://i.postimg.cc/0jjHM3HG/Lakshyaarambha.png",
    logo: "https://i.postimg.cc/pL0NTfTM/CSITAN.png",
    order: 4
  },
  {
    title: "Project Management Certificate",
    issuer: "Skill Lab",
    date: "Oct 2025",
    credentialUrl: "https://i.postimg.cc/qqqZhYZh/Project_Management.jpg",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
    order: 5
  },
  {
    title: "Linux Fundamentals (RH104)",
    issuer: "Red Hat Academy",
    date: "March 2025",
    credentialUrl: "https://i.postimg.cc/qRj570Q2/Redhat.jpg",
    logo: "https://i.postimg.cc/Xvcsq3xN/Red-Hat.png",
    order: 6
  },
  {
    title: "AI and Prompt Engineering",
    issuer: "Skill Lab",
    date: "Dec 2025",
    credentialUrl: "https://i.postimg.cc/yxMG63rg/AI-Prompting.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
    order: 7
  },
  {
    title: "Leadership Basic Course",
    issuer: "Skill Lab",
    date: "Dec 2025",
    credentialUrl: "https://i.postimg.cc/1XnTZrM9/Leadership-Basic.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
    order: 8
  },
  {
    title: "Portfolio Website Essentials",
    issuer: "CSIT Association of Nepal",
    date: "2026",
    credentialUrl: "https://i.postimg.cc/s22M8y1m/portfolio-website-essentials-2026.png",
    logo: "https://i.postimg.cc/pL0NTfTM/CSITAN.png",
    order: 9
  }
];

// Helper to subscribe to any collection in real time
export const subscribeCollection = (collectionName, callback, defaultData = []) => {
  if (!db) {
    callback(defaultData);
    return () => {};
  }

  try {
    const q = query(collection(db, collectionName), orderBy("order", "asc"));
    return onSnapshot(
      q, 
      (snapshot) => {
        if (snapshot.empty) {
          callback(defaultData);
        } else {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(items);
        }
      },
      (error) => {
        console.warn(`Firestore subscription fallback for ${collectionName}:`, error);
        callback(defaultData);
      }
    );
  } catch (err) {
    console.warn(`Firestore error for ${collectionName}:`, err);
    callback(defaultData);
    return () => {};
  }
};

// CRUD Operations for Projects
export const addProject = async (projectData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "projects"), {
    ...projectData,
    order: Number(projectData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateProject = async (id, projectData) => {
  if (!db) throw new Error("Database not connected");
  const projectRef = doc(db, "projects", id);
  return await updateDoc(projectRef, {
    ...projectData,
    updatedAt: serverTimestamp()
  });
};

export const deleteProject = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "projects", id));
};

// CRUD Operations for Events
export const addEvent = async (eventData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "events"), {
    ...eventData,
    order: Number(eventData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateEvent = async (id, eventData) => {
  if (!db) throw new Error("Database not connected");
  const eventRef = doc(db, "events", id);
  return await updateDoc(eventRef, {
    ...eventData,
    updatedAt: serverTimestamp()
  });
};

export const deleteEvent = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "events", id));
};

export const reorderEvents = async (orderedEvents) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedEvents.forEach((item, index) => {
    if (item.id) {
      const eventRef = doc(db, "events", item.id);
      batch.update(eventRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

export const reorderProjects = async (orderedProjects) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedProjects.forEach((item, index) => {
    if (item.id) {
      const pRef = doc(db, "projects", item.id);
      batch.update(pRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

export const reorderMilestones = async (orderedMilestones) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedMilestones.forEach((item, index) => {
    if (item.id) {
      const mRef = doc(db, "milestones", item.id);
      batch.update(mRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

export const reorderCertifications = async (orderedCertifications) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedCertifications.forEach((item, index) => {
    if (item.id) {
      const cRef = doc(db, "certifications", item.id);
      batch.update(cRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

// Smart date parser converting varied formats into epoch milliseconds for accurate sorting
export const parseDateString = (itemOrDate) => {
  if (!itemOrDate) return 0;
  if (typeof itemOrDate === "object") {
    if (itemOrDate.isoDate) {
      const t = new Date(itemOrDate.isoDate).getTime();
      if (!isNaN(t)) return t;
    }
    if (itemOrDate.createdAt?.seconds) {
      return itemOrDate.createdAt.seconds * 1000;
    }
  }

  const rawStr = typeof itemOrDate === "string" 
    ? itemOrDate 
    : (itemOrDate.date || itemOrDate.createdAt || "");

  if (!rawStr || typeof rawStr !== "string") return 0;

  // Remove ordinal endings like 18th -> 18
  const cleaned = rawStr.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  // Extract 4-digit year
  const yearMatch = cleaned.match(/\b(20\d{2}|19\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 2024;

  const months = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };

  const lower = cleaned.toLowerCase();
  let month = 0;
  let foundMonth = false;
  for (const [mName, mIdx] of Object.entries(months)) {
    if (lower.includes(mName)) {
      month = mIdx;
      foundMonth = true;
    }
  }

  const dayMatch = cleaned.match(/\b([1-9]|[12]\d|3[01])\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

  if (!yearMatch && !foundMonth) {
    if (lower.includes("discovery")) return new Date(2023, 0, 1).getTime();
    return 0;
  }

  const result = new Date(year, month, day).getTime();
  return isNaN(result) ? 0 : result;
};

export const toggleEventVisibility = async (id, isVisible) => {
  if (!db) throw new Error("Database not connected");
  const eventRef = doc(db, "events", id);
  return await updateDoc(eventRef, {
    visible: isVisible,
    updatedAt: serverTimestamp()
  });
};

export const setEventsSectionSetting = async (showSection) => {
  if (!db) throw new Error("Database not connected");
  const configRef = doc(db, "events", "_settings");
  return await setDoc(configRef, {
    showEventsSection: showSection,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// CRUD Operations for Milestones
export const addMilestone = async (milestoneData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "milestones"), {
    ...milestoneData,
    order: Number(milestoneData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateMilestone = async (id, milestoneData) => {
  if (!db) throw new Error("Database not connected");
  const milestoneRef = doc(db, "milestones", id);
  return await updateDoc(milestoneRef, {
    ...milestoneData,
    updatedAt: serverTimestamp()
  });
};

export const deleteMilestone = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "milestones", id));
};

// CRUD Operations for Certifications
export const addCertification = async (certData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "certifications"), {
    ...certData,
    order: Number(certData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateCertification = async (id, certData) => {
  if (!db) throw new Error("Database not connected");
  const certRef = doc(db, "certifications", id);
  return await updateDoc(certRef, {
    ...certData,
    updatedAt: serverTimestamp()
  });
};

export const deleteCertification = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "certifications", id));
};

// Seed Firestore with initial portfolio data
export const seedInitialPortfolioData = async () => {
  if (!db) throw new Error("Database not connected");

  // Check if projects exist
  const projectsSnap = await getDocs(collection(db, "projects"));
  if (projectsSnap.empty) {
    for (const proj of defaultProjects) {
      await addDoc(collection(db, "projects"), {
        ...proj,
        createdAt: serverTimestamp()
      });
    }
  }

  // Check if events exist
  const eventsSnap = await getDocs(collection(db, "events"));
  if (eventsSnap.empty) {
    for (const evt of defaultEvents) {
      await addDoc(collection(db, "events"), {
        ...evt,
        createdAt: serverTimestamp()
      });
    }
  }

  // Check if milestones exist
  const milestonesSnap = await getDocs(collection(db, "milestones"));
  if (milestonesSnap.empty) {
    for (const ms of defaultMilestones) {
      await addDoc(collection(db, "milestones"), {
        ...ms,
        createdAt: serverTimestamp()
      });
    }
  }

  return true;
};
