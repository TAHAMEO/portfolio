# Taha Amin — Cyber Security Portfolio

A single-page, terminal-themed portfolio for **Taha Amin**, Cyber Security Engineer & Penetration Tester (BS Cyber Security at IUB · bug bounty hunter on Bugcrowd · OWASP • PTES • MITRE ATT&CK).

Plain HTML, CSS and JavaScript — no frameworks, no build step, no third-party requests.

## Features

- **Boot sequence** on the first visit of each browser session (skippable with any key or click)
- **Matrix rain** hero with the GitHub profile photo in a "target-lock" frame, and a typing effect for roles
- **Interactive terminal** in the About section — try `help`, `experience`, `projects`, `cv`, `email`, `sound off`, `neofetch`, `cd contact` (plus a few easter eggs), with history (↑/↓), Tab completion and one-click quick commands
- **CV download** — `assets/Taha_Amin_CV.pdf`, linked from the hero, About, Contact and the terminal's `cv` command
- **Send an email** — a form that writes the message and opens it in the visitor's email app or in Gmail, plus a copy-to-clipboard button for the address
- **Subtle 3D** — cards tilt towards the pointer, the hero photo has layered parallax depth, a receding grid floor under the hero, an angled terminal and pressable buttons
- **Sound effects** synthesised with the Web Audio API (no audio files): hover and click blips, typing clicks, terminal and boot beeps, a success chime. They start after the first click or key press (browser rule) and can be muted with the **sfx** button or `sound off` — the choice is remembered
- Sections: About, Experience, Expertise, Skills & tool marquee, PTES methodology timeline, Projects, Contact
- Responsive from 360px phones to wide desktops, keyboard accessible, respects `prefers-reduced-motion`, and still readable with JavaScript disabled
- Strict Content-Security-Policy (no inline scripts or styles) and self-hosted fonts

## Project structure

```
index.html              page content (all sections)
css/style.css           theme and layout (colours are CSS variables at the top)
js/init.js              tiny <head> script: enables JS styles and the boot sequence
js/main.js              interactions, sound effects + PROFILE (contact details)
assets/Taha_Amin_CV.pdf CV offered for download
assets/img/profile.jpg  profile photo (from github.com/TAHAMEO)
assets/fonts/           Inter + JetBrains Mono (SIL OFL 1.1)
assets/favicon.svg      shield favicon
```

## Customising

### Contact details and CV

Contact links (email, LinkedIn, GitHub, Bugcrowd, X) are written directly into `index.html`, so they work without JavaScript. The terminal and the email form read the same details from the `PROFILE` block at the top of `js/main.js`:

```js
const PROFILE = {
  email: '1tahameo@gmail.com',
  cv: 'assets/Taha_Amin_CV.pdf',
  github: 'https://github.com/TAHAMEO',
  linkedin: 'https://www.linkedin.com/in/taha-meo-68a89a376/',
  bugcrowd: 'https://bugcrowd.com/h/tahameo',
  x: 'https://x.com/tahameo5',
};
```

If a link changes, update it in both places. To update the CV, replace `assets/Taha_Amin_CV.pdf` with the new file (keep the same name and every download link keeps working).

### Sound effects

The sounds are defined in the `sounds` object inside `sfx` in `js/main.js` — each is a few lines of pitch, length and volume, so they are easy to tweak or remove. `master.gain.value` sets the overall volume.

### Content

All text lives in `index.html`, one clearly commented block per section (HERO, ABOUT, EXPERIENCE, EXPERTISE, SKILLS, METHODOLOGY, PROJECTS, CONTACT). The terminal's `experience`, `skills`, `projects` and `methodology` commands read from the page, so editing the HTML keeps them in sync.

- **Photo:** replace `assets/img/profile.jpg` (a square image works best).
- **Projects:** copy an `<article class="card project">` block and change the link, title, text, highlights and tags.
- **Experience:** copy an `<li class="card card--hud exp__item">` block in the EXPERIENCE section.
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
