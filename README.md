# Interview.AI - Smart Interview Assistant Mock Simulator

Interview.AI is a modern, high-fidelity mock simulator application built using **React + Vite + Tailwind CSS** and **React Router**. The platform is designed from a human-centered UI/UX perspective to assist candidates in preparing for technical and behavioral interviews, focusing on anxiety mitigation, clean status cues, and contextual metrics evaluation.

---

## 🎨 UI/UX Design System Specification

### 1. Color Palette (Calming & Professional)
*   **Trust Indigo (`#4F46E5`):** Used for primary CTAs, brand highlights, and active states. Represents intelligence and stability.
*   **Growth Emerald (`#10B981`):** Applied to success feedback, high scores, and active input cues. Represents advancement and progress.
*   **Alert Amber (`#F59E0B`):** Warns of low timer margins, low microphone signals, and intermediate scores.
*   **Slate Charcoal (`#0F172A`):** Anchors headings, text copy, and structural dividers.
*   **Cool Alabaster (`#F8FAFC`):** Offers a clean page background.

### 2. Typography Hierarchy
*   **Headings:** **Outfit** (Geometric, modern, friendly sans-serif).
*   **Interface & Copy:** **Inter** (Neutral, highly legible text optimized for screen sizes).

---

## 📂 Core Router Map

The application maps out 5 distinct user scenarios using client-side routing:
1.  **`/login` (Standalone landing screen):** Clean credentials login card with Google and GitHub single-sign-on integration.
2.  **`/dashboard`:** Welcome metrics view, performance trend graphs, skills categories radar chart, and historical reports index.
3.  **`/upload`**: A step-by-step wizard to upload resumes, trigger simulated text extraction, and customize target job profiles.
4.  **`/interview`**: Split interviewer console displaying active audio waves, camera feeds, 60s ticking progress rings, and speech typing simulators.
5.  **`/results`**: Overview dashboard rendering aggregate scores, itemized feedback grids, and transcript highlight tooltips.

---

## ⚙️ How to Setup and Run Locally

### 1. Installation
Navigate to your project root folder and install npm packages:
```powershell
npm install
```

### 2. Development Execution
Launch the local Vite server:
```powershell
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

### 3. Production Build Compilation
Compile optimized production static assets:
```powershell
npm run build
```
Preview the compiled build locally:
```powershell
npm run preview
```
