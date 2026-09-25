# Taha Amin — Cyber Security Portfolio

A single-page, terminal-themed portfolio for **Taha Amin**, Penetration Tester (Web App & Network Security · BS Cyber Security · OWASP • PTES • MITRE ATT&CK).

Plain HTML, CSS and JavaScript — no frameworks, no build step, no third-party requests.

## Features

- **Boot sequence** on the first visit of each browser session (skippable with any key or click)
- **Matrix rain** hero with the GitHub profile photo in a "target-lock" frame, and a typing effect for roles
- **Interactive terminal** in the About section — try `help`, `skills`, `projects`, `neofetch`, `cd contact` (plus a few easter eggs), with history (↑/↓), Tab completion and one-click quick commands
- Sections: About, Expertise, Skills & tool marquee, PTES methodology timeline, Projects, Contact
- Responsive from 360px phones to wide desktops, keyboard accessible, respects `prefers-reduced-motion`, and still readable with JavaScript disabled
- Strict Content-Security-Policy (no inline scripts or styles) and self-hosted fonts

## Project structure

```
index.html              page content (all sections)
css/style.css           theme and layout (colours are CSS variables at the top)
js/init.js              tiny <head> script: enables JS styles and the boot sequence
js/main.js              interactions + CONFIG for optional contact links
assets/img/profile.jpg  profile photo (from github.com/TAHAMEO)
assets/fonts/           Inter + JetBrains Mono (SIL OFL 1.1)
assets/favicon.svg      shield favicon
```

## Customising

### Email, LinkedIn and resume

Open `js/main.js` and fill in the `CONFIG` block at the top:

```js
const CONFIG = {
  email: 'you@example.com',                          // shows Email links + a contact form
  linkedin: 'https://www.linkedin.com/in/your-handle', // shows LinkedIn links
  resume: 'assets/Taha-Amin-Resume.pdf',             // shows a "Resume" download button
};
```

Anything left as `''` stays hidden, so the site never shows a broken link. For the resume, put the PDF in `assets/` first.

### Content

All text lives in `index.html`, one clearly commented block per section (HERO, ABOUT, EXPERTISE, SKILLS, METHODOLOGY, PROJECTS, CONTACT). The terminal's `skills`, `projects` and `methodology` commands read from the page, so editing the HTML keeps them in sync.

- **Photo:** replace `assets/img/profile.jpg` (a square image works best).
- **Projects:** copy an `<article class="card project">` block and change the link, title, text and tags.
- **Colours:** change `--accent` / `--cyan` (and their `-rgb` versions) in `:root` at the top of `css/style.css`.

### Content-Security-Policy

The CSP `<meta>` tag in `index.html` only allows files from this site. If you later add something external (analytics, an embedded video, an image from another domain), add that origin to the matching directive or the browser will block it.

## Preview locally

Run a small web server from the project folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly works too, but browsers refuse to load web fonts from `file://`, so it falls back to system fonts.

## Publish with GitHub Pages

1. On GitHub open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch that holds this site and the **/ (root)** folder, then **Save**.
4. After a minute the site is live at **https://tahameo.github.io/portfolio/**.

## Credits

- Fonts: [Inter](https://github.com/rsms/inter) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), SIL Open Font License 1.1 (see `assets/fonts/LICENSE.txt`)
- Icons: [Lucide](https://lucide.dev) (ISC License); X logo from [Simple Icons](https://simpleicons.org) (CC0)
