# Age Calculator — Every Second Tells a Story

A premium, interactive **Age Calculator** built with **HTML, CSS, and Vanilla JavaScript**. Enter your **Date of Birth** (and optional **Time of Birth**) to get a live breakdown of your age—**updated every second**—plus fun extras like **next birthday countdown**, **zodiac profile**, **milestones**, and **personalized fun facts**.

> Clean UI, glassmorphism styling, animated background, and responsive design.

---

## Live Demo

- [Add your GitHub Pages / hosted link here]

---

## Features

- **DOB required** + **TOB optional** (time-based effects)
- **Live age statistics**: Years, Months, Weeks, Days, Hours, Minutes, Seconds
- **Live milestones**: Heartbeats, Breaths, Hours slept, Sunrises, Moon cycles
- **Next birthday countdown** (Days / Hours / Minutes / Seconds)
- **Zodiac profile** (sign, element, keyword, date range)
- **Dynamic fun facts** generated from your calculated timeline
- **Dark / Light theme toggle** (persisted using `localStorage`)
- **Interactive visuals**:
  - Animated aurora + particle canvas background
  - Tilt/parallax effect on supported devices
  - Scroll reveal animations (IntersectionObserver)
- **Accessibility-friendly**:
  - Semantic sections
  - `aria-live` for results updates
  - Keyboard focus styles and reduced-motion support

---

## Tech Stack

- **HTML5**
- **CSS3** (glassmorphism, gradients, responsive layout, animations)
- **Vanilla JavaScript** (date math, live updates, DOM rendering)

---

## How to Run

This project is static.

1. Open `ASSIGNMENT-2/index.html` in your browser.
2. (Optional) Use any local static server if you prefer:
   - `npx serve ASSIGNMENT-2` (or similar)

---

## Usage

1. Select your **Date of Birth**.
2. (Optional) Provide your **Time of Birth** (24-hour format).
3. Click **Calculate My Age**.
4. Results will appear instantly and update **every second**.
5. Use **Clear** to reset and calculate again.

---

## Project Structure

- `ASSIGNMENT-2/index.html` — UI + semantic structure
- `ASSIGNMENT-2/style.css` — styling, themes, animations, responsive layout
- `ASSIGNMENT-2/script.js` — age calculation logic, live timers, UI updates

---

## How It Works (Brief)

- The app converts your DOB into a JavaScript `Date` object.
- It computes:
  - **Human-readable age** (years/months/days)
  - **Total elapsed time** (seconds, minutes, hours, days, weeks)
- A timer runs every **1000ms** to refresh live counters.
- Zodiac and fun facts are derived from birth date and the computed timeline.

---

## Accessibility & Performance Notes

- Background animations are skipped when **reduced motion** is enabled.
- Particle animation pauses when the tab is hidden (`document.hidden`).
- UI updates use semantic attributes and focus management to improve usability.

---

## License

MIT (or replace with your preferred license).

---

### Credits

Built as **Assignment 2** using only frontend technologies (no external frameworks). 

---

*Tip for GitHub:* consider adding a screenshot/gif under **Live Demo** or at the top of this README to make your repo look even more complete.
