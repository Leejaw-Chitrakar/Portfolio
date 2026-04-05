# Leejaw Chitrakar | High-Fidelity Developer Portfolio
**A cinematic, performance-driven personal portfolio designed to merge architectural aesthetics with deep web interactions.**

This web application deviates from standard, flat templated portfolios by implementing high-end, bespoke **UI/UX interactions natively via React and CSS**, avoiding bulky animation libraries to maintain maximum web-vitals performance. 

---

## 🔥 Key Features & Technical Highlights

### 1. Physics-Based Custom Cursor & Smoke Engine
- **What it is:** A completely custom, mathematical cursor component (`CustomCursor.jsx`). 
- **Tech Used:** HTML5 `<canvas>`, Context 2D API, `requestAnimationFrame`, array manipulation.
- **Why it matters:** Instead of using heavy GSAP libraries or React State (which causes stuttering limit-caps), the physical cursor dot and the colorful, drifting "smoke puff" trails are driven directly by a lerped (Linear Interpolation) 2D Canvas rendering loop, guaranteeing ultra-fluid, 144Hz smoothness while offloading work from the React DOM tree.

### 2. The *Glass-Masonry Fusion* Project Grid
- **What it is:** A deeply immersive 'Featured Projects' layout.
- **Tech Used:** CSS native masonry (`columns`), volumetric `backdrop-filter: blur()`, and dynamically mapping custom `<ProjectCard>`s.
- **Why it matters:** Cards organically nest with staggered architectural heights. On hover, they pull back the dark overlays, ramping from `blur(4px)` to `blur(14px)` to obscure noisy images, casting an ethereal inset-shadow aura and allowing crisp typography to be read clearly over deeply saturated project previews.

### 3. The 3x3 Multi-Stack View & Canvas Credential Viewer
- **What it is:** A clever UX pattern designed to neatly compartmentalize 9+ massive qualification certificates.
- **Tech Used:** CSS 3D Staggering, Flex wrappers, precise `z-index` layering, and multi-teir React Modals.
- **Why it matters:** Instead of a giant pile, credentials fan out along the Y-axis when hovered natively. Navigating deeper triggers a **Fullscreen Canvas Override** which dynamically escapes CSS flex/backdrop-filter containment traps to lock a high-res image immovably to your device screen.

---

## 💻 Tech Stack
* **Framework:** React.js + Vite (for instantaneous HMR and optimized building)
* **Styling:** Native Vanilla CSS + Complex Keyframe Orchestrations
* **Icons:** Lucide React
* **Hosting / Architecture Setup:** Firebase Hosting

## 🚀 Local Setup & Installation

To run this heavily designed interface on your own environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Leejaw-Chitrakar/Portfolio.git
   cd Portfolio
   ```

2. **Install project node dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the Vite Development Server:**
   ```bash
   npm run dev
   ```
   *(Your terminal will reveal a `localhost` URL which you can pop into your browser!)*

4. **Building for Production:**
   ```bash
   npm run build
   ```

---

> *"Focusing extensively on performance architectures via native CSS implementations and vanilla JavaScript rendering loops alongside React's component reusability."*
