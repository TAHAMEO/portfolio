# Taha Amin — Cyber Security Portfolio

A single-page, terminal-themed portfolio for **Taha Amin** — Cyber Security Engineer & Penetration Tester, BS Cyber Security student at IUB and bug bounty hunter on Bugcrowd.

Plain HTML, CSS and JavaScript — no frameworks, no build step, no third-party requests.

## Features

- **Boot sequence** on the first visit of each browser session (skippable with any key or click)
- **3D touches:** a perspective grid floor under the hero, a profile photo that leans towards the pointer with layers at different depths, cards that tilt in 3D, and a terminal that straightens up when you use it
- **Matrix rain** hero with the GitHub profile photo in a "target-lock" frame, and a typing effect for roles
- **Interactive terminal** in the About section — try `help`, `experience`, `projects`, `cv`, `neofetch`, `cd contact` (plus a few easter eggs), with history (↑/↓), Tab completion and one-click quick commands
- **CV download** in the nav, hero, experience section, contact section and terminal
- **Send email:** a contact form that opens the visitor's mail app (or Gmail) with the message filled in, plus a copy-address button
- Sections: About, Experience, What I Do, Projects, Skills & tool marquee, PTES methodology timeline, Contact
- Responsive from 360px phones to wide desktops, keyboard accessible, respects `prefers-reduced-motion`, and still readable with JavaScript disabled
- Strict Content-Security-Policy (no inline scripts or styles) and self-hosted fonts

## Project structure

```
index.html                page content (all sections)
css/style.css             theme and layout (colours are CSS variables at the top)
js/init.js                tiny <head> script: enables JS styles and the boot sequence
js/main.js                interactions, terminal commands, email + links
assets/Taha-Amin-CV.pdf   the downloadable CV
assets/img/profile.jpg    profile photo (from github.com/TAHAMEO)
assets/fonts/             Inter + JetBrains Mono (SIL OFL 1.1)
assets/favicon.svg        shield favicon
```

## Customising

### Email and links

The email address lives only in `js/main.js` (`EMAIL`, near the top). It is put together when the page loads, so simple spam bots that scan the HTML can't pick it up. The other profile links (GitHub, LinkedIn, Bugcrowd, X) are written in `index.html` and repeated in the `LINKS` object in `js/main.js` for the terminal — update both if one changes.

### CV

Replace `assets/Taha-Amin-CV.pdf` with the new PDF, keeping the same file name, and every CV button picks it up. Remember that anything in the PDF (phone number included) is public once the site is online.

### Content

All text lives in `index.html`, one clearly commented block per section. The terminal's `experience`, `skills`, `projects` and `methodology` commands read from the page, so editing the HTML keeps them in sync.

- **Photo:** replace `assets/img/profile.jpg` (a square image works best).
- **Projects:** copy an `<article class="card tilt project">` block and change the link, title, text and tags.
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
