# Countdown Timer Web App

> A minimalist, zero-gimmick countdown timer with dynamic SVG progress visualization and dual input modes.

[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)

## Key Features

- **Dual Input System**
  - Quick duration setup using Hours, Minutes, and Seconds inputs.
  - Optional datetime-local target date selection for countdowns anchored to a future moment.
- **Visual Progress Ring**
  - Smooth SVG circular progress ring updated via dynamic `stroke-dashoffset` calculation.
  - Progress scales cleanly with the remaining time ratio.
- **Minimalist Aesthetic**
  - Off-white design system rooted in `#FBF9F5` with high-contrast charcoal text.
  - Fluid typography, accessible focus states, and restrained motion.
- **Zero Dependencies**
  - Pure, vanilla HTML5, CSS3, and modern ES6 JavaScript.
  - No frameworks, no build step, no external assets.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5, semantic structure, accessible controls |
| Style | CSS3 custom properties, Flexbox, SVG styling, fluid typography |
| Logic | JavaScript (Vanilla ES6, strict mode, modular functions) |

## Project Structure

```text
02-countdown-timer/
├── index.html    # Core semantic structure & controls
├── style.css     # Design tokens, layout & progress ring animations
└── script.js     # Timer state logic, interval handlers & DOM updates
```

## Getting Started

### Run Locally

1. Open `02-countdown-timer/index.html` directly in a modern browser.
2. If preferred, serve the folder locally:
   - `python3 -m http.server --directory 02-countdown-timer`
   - `php -S localhost:8000 -t 02-countdown-timer`
   - `npx serve 02-countdown-timer`

No build step is required.

### Host on GitHub Pages

1. Push the `02-countdown-timer` folder into a repository.
2. In repository settings, enable GitHub Pages for the desired branch/folder.
3. Load the published URL to use the timer online.

## Usage

- Set a duration with the Hours / Minutes / Seconds fields, then choose **Set Timer**.
- Use **Start**, **Pause**, and **Reset** to control the countdown.
- The circular progress ring depletes as time runs down.
- When the timer reaches `00:00:00`, a visual pulse and a gentle Web Audio chime alert you.

## Design Notes

- Primary background: `#FBF9F5`
- Card surface: warm cream tone with soft diffusion shadow
- Text: high-contrast dark charcoal for readability
- Motion: subtle ring transitions and a restrained completion pulse

## Browser Support

Works in modern evergreen browsers with ES6 and SVG support. The audio alert uses the Web Audio API and degrades gracefully if unavailable.
