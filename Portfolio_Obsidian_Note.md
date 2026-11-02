---
tags:
  - project
  - portfolio
  - react
  - vite
  - frontend
  - personal
status: active
stack: React · Vite · Framer Motion · Firebase
started: 2026-03-16
last_updated: 2026-11-02
deployed: true
platform: Firebase Hosting
author: Leejaw Chitrakar
---

# 🌐 Portfolio Website — Leejaw Chitrakar

> A personal developer portfolio built with **React + Vite**, showcasing projects, skills, certifications, an animated timeline of milestones, and an events section — deployed on Firebase Hosting.

---

## 📌 Overview

| Field | Detail |
|---|---|
| **Owner** | Leejaw Chitrakar |
| **Type** | Personal Developer Portfolio |
| **Stack** | React 19, Vite 7, Framer Motion, Lucide React, React Router DOM |
| **Styling** | Custom CSS (per-page stylesheets) + CSS Variables design system |
| **Deployment** | Firebase Hosting |
| **Package Manager** | npm |
| **Build Tool** | Vite 7.2.4 |

---

## 🗂️ Project Structure

```
Portfolio/
├── public/
│   ├── projects/          # Project screenshot images
│   └── LeejawChitrakar_Resume.pdf
├── src/
│   ├── App.jsx            # Root: Router + Navbar + CustomCursor + Footer
│   ├── main.jsx           # React DOM entry point
│   ├── components/
│   │   ├── Navbar.jsx         # Scroll-aware glass navbar + mobile drawer
│   │   ├── Footer.jsx
│   │   ├── ProjectCard.jsx    # Reusable project card component
│   │   └── CustomCursor.jsx   # Smoke-trail canvas cursor effect
│   ├── pages/
│   │   ├── Home.jsx           # Hero + Stats + Events grid
│   │   ├── About.jsx          # Bio + Stats + Animated journey timeline
│   │   ├── Projects.jsx       # Projects grid with ProjectCard
│   │   ├── Skills.jsx         # Skill categories with logo grid
│   │   ├── Certifications.jsx # Certificate cards + fullscreen modal
│   │   ├── Contact.jsx        # EmailJS contact form
│   │   ├── Resume.jsx         # Inline resume + PDF download
│   │   └── NotFound.jsx       # 404 page
│   ├── RouteLayout/
│   │   └── routes.jsx         # Centralized React Router v7 routes
│   └── styles/
│       ├── global.css         # CSS variables, reset, glass, gradients
│       ├── About.css
│       ├── Certifications.css
│       ├── Contact.css
│       ├── CustomCursor.css
│       ├── Footer.css
│       ├── Home.css
│       ├── Navbar.css
│       ├── ProjectCard.css
│       ├── Projects.css
│       ├── Resume.css
│       └── Skills.css
```

---

## 🧰 Tech Stack & Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.0 | UI library |
| `react-dom` | ^19.2.0 | DOM renderer |
| `react-router-dom` | ^7.13.0 | Client-side routing |
| `framer-motion` | ^12.29.2 | Scroll animations, spring physics |
| `lucide-react` | ^0.563.0 | Icon library |
| `@emailjs/browser` | ^4.4.1 | Contact form email sending |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `vite` | Build tool & dev server |
| `@vitejs/plugin-react` | React JSX transform |
| `eslint` + plugins | Linting |

---

## 🎨 Design System (`global.css`)

```css
--primary:      #6366f1  /* Indigo */
--secondary:    #ec4899  /* Pink */
--accent:       #f59e0b  /* Amber */
--background:   #0f172a  /* Deep navy */
--surface:      #1e293b
--text:         #f8fafc
--text-muted:   #94a3b8
--glass:        rgba(30, 41, 59, 0.7)
--border:       rgba(255, 255, 255, 0.1)
--grad-primary: linear-gradient(135deg, #6366f1 0%, #ec4899 100%)
```

**Utility classes:** `.glass`, `.gradient-text`, `.btn`, `.btn-primary`, `.btn-outline`, `.container`, `.section`, `.fade-in`

---

## 🖥️ Pages & Features

### `/` — Home
- Typewriter animation for "Full-Stack Web Developer"
- Hero section with animated background blobs (3 blobs, CSS keyframe animation)
- Floating glass cards (Fast Performance, Scalable Architecture)
- Code snippet visual panel
- Stats bar: `8+ Projects` · `MERN` · `2024 BSc.CSIT`
- **Events section** — responsive 3-column card grid with Framer Motion fade-in-up, color-coded tags (`primary`, `secondary`, `accent`), role badge, description, and meta row (date / venue / attendees)

### `/about` — About
- Typewriter paragraph animation (character-by-character with Framer Motion `staggerChildren`)
- Bio, contact info (email, phone, location)
- Role & Education stat cards
- **Journey So Far Timeline** — scroll-driven animated vertical timeline:
  - `useScroll` + `useSpring` from Framer Motion tracks scroll progress through the `timelineRef`
  - `scaleY` spring animates a glowing `timeline-progress-bar` from top to bottom as you scroll
  - Background track (faint white) + animated gradient progress bar (neon glow)
  - Dots with `z-index: 10` sit above the bar with a border knockout ring

#### Timeline Entries (chronological order)
| Entry | Date |
|---|---|
| Interactive Games — Quiz & Hangman | Discovery Phase |
| BSc.CSIT — Tribhuvan University | 2024 |
| Kaaputale (Kaputali) — React E-Commerce Platform | April 2026 · Public |
| VibeCouture — Interactive Fashion Showcase | April 2026 · Team Project |
| Chiya Jivan — Offline-First SaaS POS Platform | August – October 2026 |
| LifeDrop — Digital Standby Blood Donor Registry | July – August 2026 · Completed |
| Industry Visit — Leapfrog Connect | 21st July 2026 · Dillibazar |
| SITC INIT SafeSurf — AI Literacy & Responsible AI | 18th Sept · Himchuli Academy |
| SITC INIT SafeSurf — AI Exploration & Prompting | 9th Oct · Arniko Int'l School |
| SITC INIT SafeSurf — Cybersecurity 101 | 30th Oct · Vidhya Sagar School |

### `/projects` — Projects
Rendered via `ProjectCard` component. Current project list:

| Project | Stack | Status |
|---|---|---|
| Chiya Jivan — Tea Café App | React, Vite, Firebase, Firestore | Live |
| LifeDrop — Blood Donation Network | React, Vite, Firebase, GSAP | Live |
| VibeCouture Fashion Store | MERN + Firebase | Live |
| Kaaputale E-Commerce | ReactJS, CSS3 | Live |
| Quiz Game | HTML, CSS, JS | Live |
| Snake Game | HTML, CSS, JS | Live |
| Hult Prize at Samriddhi | React, Firebase | Live |
| Hangman Game | C (Console) | GitHub |
| LC Pixel Art | React, Vite, CSS | Live |
| Student Management System | React, Vite, Firebase | Live |

### `/skills` — Skills
Four categories with devicon logo grid:
- **Frontend**: HTML5, CSS3, JavaScript, React
- **Backend**: Node.js, Express.js
- **Database & Tools**: MongoDB, Git, GitHub, Firebase
- **Languages**: C, C++, Python

### `/certifications` — Certifications
Clickable card grid. Click opens a fullscreen modal with the certificate image. ESC closes it. Cards use rotating themes (`theme-blue`, `theme-purple`, `theme-emerald`).

| Certificate | Issuer | Date |
|---|---|---|
| Web Development Bootcamp | Samriddhi IT Club | July 2025 |
| Hult Prize Participation | Hult Prize Foundation | Feb 2025 |
| Web & Tech Team - Hult Prize | Hult Prize Samriddhi | Feb 2026 |
| Certificate of Appreciation – Lakshayrambha | CSIT Association of Nepal | June 2025 |
| Project Management Certificate | Skill Lab | Oct 2025 |
| Linux Fundamentals (RH104) | Red Hat Academy | March 2025 |
| AI and Prompt Engineering | Skill Lab | Dec 2025 |
| Leadership Basic Course | Skill Lab | Dec 2025 |
| Portfolio Website Essentials | CSIT Association of Nepal | 2026 |

### `/contact` — Contact
EmailJS-powered contact form.

### `/resume` — Resume
Inline resume with Professional Summary, Projects, and Certifications sections. PDF download button (`/LeejawChitrakar_Resume.pdf`).

---

## 🎬 Key Animation Patterns

### Custom Smoke Cursor (`CustomCursor.jsx`)
- Canvas-based smoke particle system
- Disabled on touch devices (`pointer: coarse`)
- White dot follows cursor via `transform: translate3d` with lerp smoothing
- Smoke particles: random size, speed, opacity decay, indigo/pink colors

### Timeline Scroll Animation (`About.jsx`)
```js
const timelineRef = useRef(null);
const { scrollYProgress } = useScroll({
  target: timelineRef,
  offset: ["start 75%", "end 70%"],
});
const scaleY = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
});
// Rendered as:
<motion.div className="timeline-progress-bar" style={{ scaleY }} />
```

### Timeline Item Entry
```js
initial={{ opacity: 0, x: -30 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true, margin: "-60px" }}
transition={{ duration: 0.5, delay: 0.08 }}
```

### Events Cards Entry
```js
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-40px" }}
transition={{ duration: 0.5, delay: i * 0.08 }}
```

---

## 📅 Events Section Data (Homepage)

| Event | Role | Tag | Date | Venue |
|---|---|---|---|---|
| SITC INIT SafeSurf — AI Literacy | Speaker / Facilitator | Workshop | 18 Sep 2026 | Himchuli Academy, Bode |
| SITC INIT SafeSurf — AI Exploration | Speaker / Facilitator | Workshop | 9 Oct 2026 | Arniko Int'l Secondary School |
| SITC INIT SafeSurf — Cybersecurity 101 | Speaker / Facilitator | Workshop | 30 Oct 2026 | Vidhya Sagar English Sec. School |
| Leapfrog Connect — Industry Visit | Participant | Industry Visit | 21 Jul 2026 | Leapfrog Technology, Dillibazar |
| Hult Prize at Samriddhi | Volunteer (Web & Tech) | Volunteer | Feb 2026 | Samriddhi College, Kathmandu |
| Web Development Bootcamp | Participant | Bootcamp | Jul 2025 | Samriddhi IT Club |

---

## 🚀 Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Lint
npm run lint
```

> **Note:** Running scripts may require `cmd.exe /c "npm run build"` on Windows due to PowerShell execution policy restrictions.

---

## 🌍 Navigation Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Hero, Stats, Events |
| `/about` | `About` | Bio, Journey Timeline |
| `/projects` | `Projects` | Project grid |
| `/skills` | `Skills` | Skill logo grid |
| `/certifications` | `Certifications` | Certificate cards + modal |
| `/contact` | `Contact` | EmailJS form |
| `/resume` | `Resume` | Inline resume + PDF |
| `*` | `NotFound` | 404 page |

---

## 🔗 Key External Links

- **Live Site:** Firebase Hosting
- **GitHub:** [github.com/Leejaw-Chitrakar](https://github.com/Leejaw-Chitrakar)
- **Email:** leejaw.chitrakar10@gmail.com
- **Phone:** +977 9841996363
- **Location:** Kathmandu, Nepal

---

## 📝 Development Notes & Decisions

> [!NOTE]
> CSS files use CRLF line endings (Windows). When making surgical edits via scripts, normalize to LF first with `content.replace(/\r\n/g, '\n')` before string-replacing, then restore.

> [!TIP]
> When adding new timeline entries, insert them into the array in `About.jsx` in chronological order (oldest → newest top to bottom). The scroll-driven `scaleY` animation will naturally cover them as the user scrolls.

> [!IMPORTANT]
> The `timeline-dot` uses `z-index: 10` and `border: 2px solid var(--background)` to create a knockout ring so it visually sits **above** the animated `timeline-progress-bar` (z-index: 1). The parent `.timeline-item` is set to `z-index: 2` to establish its own stacking context.

> [!NOTE]
> PowerShell blocks `npm` scripts due to execution policy. Always use `cmd.exe /c "npm run build"` for build commands.

---

## 🔄 Changelog (Session — Nov 2, 2026)

- ✅ Added 3 SITC INIT SafeSurf sessions to Journey So Far timeline
- ✅ Added Leapfrog Connect Industry Visit to timeline
- ✅ Updated Chiya Jivan entry to reflect full SaaS POS architecture
- ✅ Updated LifeDrop entry to reflect completed registry platform
- ✅ Renamed MERN project → `VibeCouture — Interactive Fashion Showcase`
- ✅ Renamed Kaaputale entry with correct name `Kaaputale (Kaputali)`
- ✅ Implemented scroll-driven timeline progress bar using `useScroll` + `useSpring`
- ✅ Fixed timeline dot z-index to render above the animated progress bar with knockout border ring
- ✅ Added **Events section** to homepage with Framer Motion animations and color-coded tag system
