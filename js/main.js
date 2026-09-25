/*
 * Taha Amin — portfolio interactions.
 * Everything here is progressive enhancement: the page is fully readable without JavaScript.
 */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
   * CONFIG — fill these in to show extra contact options.
   * Leave a value empty ('') and that link/button stays hidden.
   * ------------------------------------------------------------------ */
  const CONFIG = {
    email: '', //    e.g. 'you@example.com' — adds Email links and the contact form
    linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
    resume: '', //   e.g. 'assets/Taha-Amin-Resume.pdf' — adds a "Resume" download button
  };

  const LINKS = {
    github: 'https://github.com/TAHAMEO',
    x: 'https://x.com/tahameo5',
  };

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  /* ---------- Optional links from CONFIG ---------- */
  function applyConfig() {
    $$('[data-config]').forEach((el) => {
      const key = el.dataset.config;
      const value = (CONFIG[key] || '').trim();
      if (!value) return;

      const link = el.matches('a') ? el : $('a', el);
      if (link) link.href = key === 'email' ? `mailto:${value}` : value;
      $$('[data-config-text]', el).forEach((node) => {
        node.textContent = key === 'email' ? value : stripProtocol(value);
      });
      el.hidden = false;
    });
  }

  /* ---------- Boot sequence (first visit per browser session) ---------- */
  function runBoot() {
    const boot = $('#boot');
    if (!boot) return Promise.resolve();
    if (!root.classList.contains('booting')) {
      boot.remove();
      return Promise.resolve();
    }

    const log = $('#boot-log', boot);
    const bar = $('#boot-bar', boot);
    const labels = { ok: '  OK  ', skip: ' SKIP ', done: ' DONE ' };
    const steps = [
      ['ok', 'Initializing secure environment'],
      ['ok', 'Loading modules: recon, exploit, report'],
      ['ok', 'Establishing encrypted tunnel (TLS 1.3)'],
      ['ok', 'Verifying rules of engagement'],
      ['skip', 'Bypassing firewall ... just kidding'],
      ['done', 'Access granted. Welcome, visitor.'],
    ];

    return new Promise((resolve) => {
      let finished = false;
      const block = (event) => event.preventDefault();

      const finish = () => {
        if (finished) return;
        finished = true;
        window.removeEventListener('keydown', finish);
        boot.removeEventListener('pointerdown', finish);
        boot.removeEventListener('wheel', block);
        boot.removeEventListener('touchmove', block);
        try {
          sessionStorage.setItem('booted', '1');
        } catch {
          /* storage unavailable — the boot simply runs again next time */
        }
        boot.classList.add('is-leaving');
        root.classList.remove('booting');
        setTimeout(() => boot.remove(), 600);
        resolve();
      };

      window.addEventListener('keydown', finish);
      boot.addEventListener('pointerdown', finish);
      boot.addEventListener('wheel', block, { passive: false });
      boot.addEventListener('touchmove', block, { passive: false });

      (async () => {
        for (let i = 0; i < steps.length && !finished; i += 1) {
          const [status, text] = steps[i];
          const line = document.createElement('div');
          const tag = document.createElement('span');
          line.className = 'boot__line';
          tag.className = `boot__status boot__status--${status}`;
          tag.textContent = `[${labels[status]}]`;
          line.append(tag, ` ${text}`);
          log.append(line);
          bar.style.width = `${((i + 1) / steps.length) * 100}%`;
          await sleep(i === steps.length - 1 ? 500 : 240);
        }
        finish();
      })();
    });
  }

  /* ---------- Matrix rain behind the hero ---------- */
  function initMatrix() {
    const canvas = $('#matrix');
    if (!canvas || reduceMotion || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const glyphs = '0101010123456789ABCDEF<>/{}[]$#%&*+=;:'.split('');
    const size = 16;
    let width = 0;
    let height = 0;
    let drops = [];
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${size - 2}px "JetBrains Mono", monospace`;
      const columns = Math.ceil(width / size);
      drops = Array.from({ length: columns }, (_, i) => drops[i] ?? Math.random() * -50);
    };

    const draw = (time) => {
      frame = requestAnimationFrame(draw);
      if (time - last < 55) return; // ~18 fps is plenty for this effect
      last = time;

      // Fade the previous frame towards transparent so the page background shows through.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      for (let i = 0; i < drops.length; i += 1) {
        const y = drops[i] * size;
        const roll = Math.random();
        if (roll > 0.985) ctx.fillStyle = '#eafff5';
        else if (i % 7 === 0) ctx.fillStyle = 'rgba(0, 212, 255, 0.75)';
        else ctx.fillStyle = 'rgba(0, 255, 156, 0.7)';
        ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y);

        if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -20;
        drops[i] += 1;
      }
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    new ResizeObserver(resize).observe(canvas);
    // Only animate while the hero is on screen.
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(canvas);
  }

  /* ---------- Typing roles in the hero ---------- */
  function initTyping() {
    const el = $('#typed');
    if (!el || reduceMotion) return;
    const words = (el.dataset.words || '').split('|').map((word) => word.trim()).filter(Boolean);
    if (words.length < 2) return;

    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    const tick = () => {
      const word = words[wordIndex];

      if (deleting) {
        charIndex -= 1;
        el.textContent = word.slice(0, charIndex);
        if (charIndex > 0) {
          setTimeout(tick, 35);
        } else {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 350);
        }
        return;
      }

      charIndex += 1;
      el.textContent = word.slice(0, charIndex);
      if (charIndex < word.length) {
        setTimeout(tick, 65 + Math.random() * 60);
      } else {
        deleting = true;
        setTimeout(tick, 1900);
      }
    };

    setTimeout(tick, 2200);
  }

  /* ---------- Section titles "decrypt" as they scroll into view ---------- */
  function initScramble() {
    const titles = $$('[data-scramble]');
    if (!titles.length || reduceMotion || !('IntersectionObserver' in window)) return;
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*';

    const scramble = (el) => {
      const text = el.textContent;
      const duration = 600 + text.length * 25;
      const start = performance.now();
      el.setAttribute('aria-label', text); // screen readers get the real title meanwhile

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const revealed = Math.floor(progress * text.length);
        let out = '';
        for (let i = 0; i < text.length; i += 1) {
          out += i < revealed || text[i] === ' ' ? text[i] : glyphs[(Math.random() * glyphs.length) | 0];
        }
        el.textContent = out;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = text;
          el.removeAttribute('aria-label');
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        scramble(entry.target);
      });
    }, { threshold: 0.6 });
    titles.forEach((title) => observer.observe(title));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length || !('IntersectionObserver' in window)) return;
    root.classList.add('reveal-ready');

    const observer = new IntersectionObserver((entries) => {
      let batch = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Stagger items that enter together (e.g. a row of cards).
        entry.target.style.setProperty('--delay', `${batch * 90}ms`);
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        batch += 1;
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Navigation: mobile menu + active section ---------- */
  function initNav() {
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    const links = $$('.nav__link');
    if (!toggle || !menu) return;
    const label = $('.sr-only', toggle);

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close menu' : 'Open menu';
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    };
    const isOpen = () => menu.classList.contains('is-open');

    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (isOpen() && !event.target.closest('.nav')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 981px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });

    if (!('IntersectionObserver' in window)) return;
    const sections = ['home', ...links.map((link) => link.hash.slice(1))]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Header state, progress bar, back-to-top ---------- */
  function initScrollEffects() {
    const header = $('#header');
    const progress = $('#progress');
    const toTop = $('#to-top');
    let queued = false;

    const update = () => {
      queued = false;
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      header?.classList.toggle('is-scrolled', y > 16);
      progress?.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : '0');
      toTop?.classList.toggle('is-visible', y > window.innerHeight * 0.9);
    };

    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Pointer spotlight on cards ---------- */
  function initSpotlight() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.addEventListener('pointermove', (event) => {
      const card = event.target instanceof Element ? event.target.closest('.card') : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }, { passive: true });
  }

  /* ---------- Interactive terminal ---------- */
  function initTerminal() {
    const form = $('#terminal-form');
    const input = $('#terminal-input');
    const output = $('#terminal-output');
    const body = $('#terminal-body');
    if (!form || !input || !output || !body) return;

    const commandHistory = [];
    let historyIndex = 0;

    const span = (text, className) => {
      const node = document.createElement('span');
      node.className = className;
      node.textContent = text;
      return node;
    };

    const link = (text, href) => {
      const node = document.createElement('a');
      node.href = href;
      node.textContent = text;
      if (/^https?:/.test(href)) {
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
      }
      return node;
    };

    // print('plain text', ['coloured text', 't-ok'], someNode, ...)
    const print = (...parts) => {
      const line = document.createElement('div');
      line.className = 'terminal__line';
      parts.forEach((part) => {
        if (part instanceof Node) line.append(part);
        else if (Array.isArray(part)) line.append(span(part[0], part[1]));
        else line.append(String(part));
      });
      output.append(line);
    };

    const printPrompt = (command) => {
      print(span('taha@kali', 't-prompt'), ':', span('~', 't-path'), '$ ', span(command, 't-cmd'));
    };

    const textOf = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

    const sections = {
      home: 'home',
      about: 'about',
      expertise: 'expertise',
      skills: 'skills',
      methodology: 'methodology',
      projects: 'projects',
      contact: 'contact',
    };

    const commands = {
      help: {
        desc: 'list available commands',
        run() {
          print(['Available commands:', 't-head']);
          Object.entries(commands).forEach(([name, command]) => {
            if (!command.hidden) print('  ', [name.padEnd(13), 't-ok'], [command.desc, 't-dim']);
          });
          print(['Tip: use ↑/↓ for history and Tab to autocomplete.', 't-dim']);
        },
      },
      whoami: {
        desc: 'who is Taha?',
        run: () => print('taha_amin — Penetration Tester | Web App & Network Security'),
      },
      about: {
        desc: 'short bio',
        run() {
          print('Penetration tester with an academic foundation in Cyber Security (BS).');
          print(['focus     ', 't-ok'], 'web application & network security');
          print(['standards ', 't-ok'], 'OWASP · PTES · MITRE ATT&CK');
          print(['builds    ', 't-ok'], 'security tooling in Python — OSINT automation, Tor scrapers, AI agents');
        },
      },
      skills: {
        desc: 'technical arsenal',
        run() {
          $$('.skill-group').forEach((group) => {
            print(['[+] ', 't-ok'], [textOf($('.skill-group__title', group)), 't-head']);
            print(['    ' + $$('.chips li', group).map(textOf).join(', '), 't-dim']);
          });
        },
      },
      projects: {
        desc: 'featured projects',
        run() {
          $$('.project').forEach((project) => {
            const anchor = $('.project__title a', project);
            if (!anchor) return;
            print(['[+] ', 't-ok'], link(textOf(anchor), anchor.href));
            print(['    ' + textOf($('.project__text', project)), 't-dim']);
          });
          print(['more → ', 't-dim'], link('github.com/TAHAMEO', `${LINKS.github}?tab=repositories`));
        },
      },
      methodology: {
        desc: 'how I run an engagement',
        run() {
          $$('.timeline__title').forEach((title, i) => {
            print([`phase_${String(i + 1).padStart(2, '0')}  `, 't-ok'], textOf(title));
          });
        },
      },
      socials: {
        desc: 'where to find me',
        run() {
          print(['github    ', 't-ok'], link(stripProtocol(LINKS.github), LINKS.github));
          print(['x         ', 't-ok'], link(stripProtocol(LINKS.x), LINKS.x));
          if (CONFIG.linkedin) print(['linkedin  ', 't-ok'], link(stripProtocol(CONFIG.linkedin), CONFIG.linkedin));
        },
      },
      contact: {
        desc: 'how to reach me',
        run() {
          if (CONFIG.email) print(['email     ', 't-ok'], link(CONFIG.email, `mailto:${CONFIG.email}`));
          commands.socials.run();
          print(['Or run ', 't-dim'], ['cd contact', 't-cmd'], [' to jump to the contact section.', 't-dim']);
        },
      },
      cd: {
        desc: 'jump to a section, e.g. cd projects',
        run(args) {
          const target = (args[0] || '~').toLowerCase().replace(/^[~./#]+/, '') || 'home';
          const id = Object.hasOwn(sections, target) ? sections[target] : null;
          if (!id) {
            print([`cd: no such section: ${args[0]}`, 't-err']);
            print(['try: ' + Object.keys(sections).join(', '), 't-dim']);
            return;
          }
          print(['navigating to ', 't-dim'], [`#${id}`, 't-path']);
          document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        },
      },
      ls: {
        desc: 'list files',
        run: () => print(['about.txt  skills.txt  contact.txt  projects/  ', 't-path'], ['secret.txt', 't-warn']),
      },
      cat: {
        desc: 'read a file, e.g. cat about.txt',
        run(args) {
          const file = (args[0] || '').toLowerCase();
          const files = { 'about.txt': 'about', 'skills.txt': 'skills', 'contact.txt': 'contact' };
          if (!file) print(['cat: missing file operand', 't-err']);
          else if (file === 'secret.txt') print(['cat: secret.txt: Permission denied', 't-err'], [' — nice try, that is exactly what I would do ;)', 't-dim']);
          else if (file.startsWith('projects')) print(['cat: projects/: Is a directory — try ', 't-err'], ['projects', 't-cmd']);
          else if (Object.hasOwn(files, file)) commands[files[file]].run([]);
          else print([`cat: ${args[0]}: No such file or directory`, 't-err']);
        },
      },
      neofetch: {
        desc: 'system info',
        run() {
          const art = [
            '  __________  ',
            ' |          | ',
            ' |   >_     | ',
            ' |          | ',
            '  \\        /  ',
            '   \\      /   ',
            "    '.__.'    ",
            '              ',
          ];
          const info = [
            [['taha', 't-ok'], '@', ['kali', 't-ok']],
            [['----------', 't-dim']],
            [['role      ', 't-path'], 'Penetration Tester'],
            [['focus     ', 't-path'], 'Web App & Network Security'],
            [['standards ', 't-path'], 'OWASP, PTES, MITRE ATT&CK'],
            [['education ', 't-path'], 'BS Cyber Security'],
            [['languages ', 't-path'], 'Python'],
            [['shell     ', 't-path'], 'portfolio-zsh 1.0'],
          ];
          // Side by side when there is room, stacked on narrow screens.
          if (body.clientWidth >= 520) {
            art.forEach((row, i) => print([row, 't-ok'], '  ', ...(info[i] || [])));
          } else {
            art.slice(0, -1).forEach((row) => print([row, 't-ok']));
            info.forEach((row) => print(...row));
          }
        },
      },
      date: { desc: 'print the date', run: () => print(new Date().toString()) },
      echo: { desc: 'print text', run: (args) => print(args.join(' ')) },
      history: {
        desc: 'command history',
        run: () => commandHistory.forEach((command, i) => print([`${String(i + 1).padStart(4)}  `, 't-dim'], command)),
      },
      clear: { desc: 'clear the screen', run: () => output.replaceChildren() },

      // Easter eggs (not listed in help)
      sudo: { hidden: true, run: () => print(['visitor is not in the sudoers file. This incident will be reported.', 't-err']) },
      hack: { hidden: true, run: () => print(['Access denied: ', 't-err'], 'I only hack with written permission. ;)') },
      rm: { hidden: true, run: () => print(['rm: permission denied', 't-err'], [' — this box is hardened.', 't-dim']) },
      exit: { hidden: true, run: () => print(['There is no escape. ', 't-warn'], 'Try ', ['cd contact', 't-cmd'], ' instead.') },
    };

    const run = (raw) => {
      printPrompt(raw);
      if (!raw) return;
      commandHistory.push(raw);
      historyIndex = commandHistory.length;

      const [name, ...args] = raw.split(/\s+/);
      const key = name.toLowerCase();
      const command = Object.hasOwn(commands, key) ? commands[key] : null;
      if (command) command.run(args);
      else print([`command not found: ${name}`, 't-err'], [' — type ', 't-dim'], ['help', 't-cmd'], [' for a list of commands', 't-dim']);

      // Keep the scrollback bounded.
      while (output.childElementCount > 300) output.firstElementChild.remove();
    };

    const scrollToBottom = () => {
      body.scrollTop = body.scrollHeight;
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const raw = input.value.trim();
      input.value = '';
      run(raw);
      scrollToBottom();
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (!commandHistory.length) return;
        event.preventDefault();
        historyIndex = event.key === 'ArrowUp'
          ? Math.max(0, historyIndex - 1)
          : Math.min(commandHistory.length, historyIndex + 1);
        input.value = commandHistory[historyIndex] ?? '';
        return;
      }

      if (event.key === 'l' && event.ctrlKey) {
        event.preventDefault();
        output.replaceChildren();
        return;
      }

      // Tab autocompletes; with nothing to complete it still moves focus as usual.
      if (event.key !== 'Tab' || event.shiftKey) return;
      const value = input.value.trimStart();
      if (!value) return;
      const [name, ...rest] = value.split(/\s+/);
      const completingCommand = rest.length === 0;
      let pool = [];
      if (completingCommand) pool = Object.keys(commands).filter((key) => !commands[key].hidden);
      else if (name === 'cd' && rest.length === 1) pool = Object.keys(sections);
      const partial = (completingCommand ? name : rest[0]).toLowerCase();
      const matches = pool.filter((option) => option.startsWith(partial));
      if (!matches.length) return;

      event.preventDefault();
      if (matches.length === 1) {
        input.value = completingCommand ? `${matches[0]} ` : `cd ${matches[0]}`;
      } else {
        printPrompt(value);
        print([matches.join('  '), 't-dim']);
        scrollToBottom();
      }
    });

    // Clicking anywhere in the terminal focuses the prompt (unless selecting text or following a link).
    body.addEventListener('click', (event) => {
      if (event.target.closest('a') || String(window.getSelection())) return;
      input.focus({ preventScroll: true });
    });

    // Quick-run buttons for visitors who'd rather not type (especially on phones).
    const hints = $('#terminal-hints');
    if (hints) {
      hints.hidden = false;
      hints.addEventListener('click', (event) => {
        const button = event.target.closest('[data-cmd]');
        if (!button) return;
        run(button.dataset.cmd);
        scrollToBottom();
      });
    }
  }

  /* ---------- Contact form → visitor's mail app ---------- */
  function initContactForm() {
    const form = $('#contact-form');
    const status = $('#contact-status');
    if (!form || !CONFIG.email) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();
      const subject = `Portfolio enquiry from ${name}`;
      const body = `${message}\n\n— ${name} <${email}>`;
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (status) status.textContent = 'Opening your email app…';
    });
  }

  applyConfig();
  initReveal();
  initNav();
  initScrollEffects();
  initSpotlight();
  initTerminal();
  initContactForm();
  initScramble();

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  runBoot().then(() => {
    initTyping();
    initMatrix();
  });
})();
