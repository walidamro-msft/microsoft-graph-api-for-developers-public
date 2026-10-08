import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

/* =====================================================================================
   WORKSHOP CONFIGURATION — the only block you normally edit in this file.
   Every page registers itself by setting <body data-active="<key>"> to a key below.
   ===================================================================================== */
const WORKSHOP = {
  title: "Microsoft Graph API for Developers",
  tagline: "Developer Workshop",
  brandIcon: "images/brand/microsoft-graph.svg",
  copyright: "Created by Walid Amro (CSA at Microsoft).",
  lastUpdated: "2026-10-06",
  showTrainerLink: true,
  footerLinks: [
    { label: "Home", href: "index.html" },
    { label: "Overview", href: "topics/overview.html" },
    { label: "Labs", href: "labs/index.html" },
    { label: "License", href: "license.html" }
  ],
  learnLink: { label: "Microsoft Graph Dev Center", href: "https://developer.microsoft.com/graph" }
};

// Dot colors: dot-blue, dot-green, dot-orange, dot-red, dot-purple. Use `children` for sub-topics.
const TOPICS = [
  { key: "overview", label: "What Is Microsoft Graph", href: "topics/overview.html", dot: "dot-blue" },
  { key: "setup-environment", label: "Set Up Your Environment", href: "topics/setup-environment.html", dot: "dot-orange" },
  { key: "auth-permissions", label: "Authentication and Permissions", href: "topics/auth-permissions.html", dot: "dot-purple" },
  { key: "graph-explorer", label: "Graph Explorer", href: "topics/graph-explorer.html", dot: "dot-blue" },
  { key: "making-requests", label: "Making Requests", href: "topics/making-requests.html", dot: "dot-green" },
  { key: "errors-throttling", label: "Errors and Throttling", href: "topics/errors-throttling.html", dot: "dot-orange" },
  { key: "sdks", label: "Microsoft Graph SDKs", href: "topics/sdks.html", dot: "dot-green" },
  { key: "security-best-practices", label: "Security Best Practices", href: "topics/security-best-practices.html", dot: "dot-red" },
  { key: "resources", label: "Summary and Resources", href: "topics/resources.html", dot: "dot-purple" }
];

const LABS = [
  { key: "labs", label: "Labs Overview", href: "labs/index.html", dot: "dot-blue" },
  { key: "lab01-graph-explorer", label: "Lab 01: Graph Explorer", href: "labs/lab01-graph-explorer.html", dot: "dot-green" },
  { key: "lab02-register-app", label: "Lab 02: Register Apps", href: "labs/lab02-register-app-portal.html", dot: "dot-purple" },
  { key: "lab03-powershell", label: "Lab 03: Graph PowerShell", href: "labs/lab03-powershell.html", dot: "dot-blue" },
  { key: "lab04-dotnet", label: "Lab 04: C# Console App", href: "labs/lab04-dotnet-vscode.html", dot: "dot-green" },
  { key: "lab05-python", label: "Lab 05: Python Daemon", href: "labs/lab05-python-vscode.html", dot: "dot-orange" },
  { key: "lab06-java", label: "Lab 06: Java Daemon", href: "labs/lab06-java-vscode.html", dot: "dot-red" }
];

/* ===================================================================================== */

// Shared with the inline pre-paint script in every page <head>; keep both in sync.
const STORAGE_KEY = "workshop-theme";

const MOON_SUN = `
  <span class="theme-icon theme-icon-moon" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5z"></path><path d="M16.5 5.2v2.1"></path><path d="M15.45 6.25h2.1"></path></svg>
  </span>
  <span class="theme-icon theme-icon-sun" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.8v2.1"></path><path d="M12 19.1v2.1"></path><path d="M2.8 12h2.1"></path><path d="M19.1 12h2.1"></path><path d="M5.5 5.5l1.5 1.5"></path><path d="M17 17l1.5 1.5"></path><path d="M17 7l1.5-1.5"></path><path d="M5.5 18.5L7 17"></path></svg>
  </span>`;

function rootPrefix() {
  const root = document.body.getAttribute("data-root") || ".";
  return root.replace(/\/+$/, "");
}

function url(href) {
  return /^https?:\/\//.test(href) ? href : `${rootPrefix()}/${href}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function flattenTopics(items) {
  return items.flatMap((item) => (item.children ? [item, ...item.children] : [item]));
}

function menuMarkup(items, active) {
  return items
    .map((item) => {
      const childActive = item.children && item.children.some((child) => child.key === active);
      const activeClass = item.key === active || childActive ? "is-active" : "";
      let html = `<a class="${activeClass}" href="${url(item.href)}"><span class="nav-dot ${item.dot}"></span>${escapeHtml(item.label)}</a>`;

      if (item.children && item.children.length) {
        const children = item.children
          .map((child) => `<a class="nav-subitem${child.key === active ? " is-active" : ""}" href="${url(child.href)}"><span class="nav-dot ${child.dot}"></span>${escapeHtml(child.label)}</a>`)
          .join("");
        html += `<div class="nav-submenu${childActive ? " is-active" : ""}">${children}</div>`;
      }

      return html;
    })
    .join("");
}

function buildNav() {
  const active = document.body.getAttribute("data-active") || "";
  const topicsActive = flattenTopics(TOPICS).some((topic) => topic.key === active);
  const labsActive = LABS.some((lab) => lab.key === active);
  const trainerLink = WORKSHOP.showTrainerLink
    ? `<a href="${url("trainer/index.html")}" class="${active === "trainer" ? "is-active" : ""}">Trainer</a>`
    : "";

  const nav = document.createElement("header");
  nav.className = "site-nav";
  nav.innerHTML = `
    <a class="brand" href="${url("index.html")}">
      <span class="brand-mark" aria-hidden="true">
        <img src="${url(WORKSHOP.brandIcon)}" alt="" loading="eager" decoding="async" />
      </span>
      <span class="brand-text"><strong>${escapeHtml(WORKSHOP.title)}</strong><small>${escapeHtml(WORKSHOP.tagline)}</small></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="${url("index.html")}" class="${active === "home" ? "is-active" : ""}">Home</a>
      <details class="nav-dropdown ${topicsActive ? "is-active" : ""}">
        <summary>Topics</summary>
        <div class="nav-menu">${menuMarkup(TOPICS, active)}</div>
      </details>
      <details class="nav-dropdown ${labsActive ? "is-active" : ""}">
        <summary>Labs</summary>
        <div class="nav-menu">${menuMarkup(LABS, active)}</div>
      </details>
      ${trainerLink}
      <button id="theme-toggle" class="nav-toggle" type="button" aria-pressed="false" aria-label="Switch theme" title="Switch theme">
        ${MOON_SUN}
        <span id="theme-toggle-text" class="sr-only">Switch theme</span>
      </button>
    </nav>`;
  document.body.insertBefore(nav, document.body.firstChild);

  document.addEventListener("click", (event) => {
    nav.querySelectorAll("details.nav-dropdown[open]").forEach((detail) => {
      if (!detail.contains(event.target)) detail.removeAttribute("open");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") nav.querySelectorAll("details.nav-dropdown[open]").forEach((detail) => detail.removeAttribute("open"));
  });
}

function buildFooter() {
  const [y, m, d] = WORKSHOP.lastUpdated.split("-").map(Number);
  const links = WORKSHOP.footerLinks
    .map((link) => `<a href="${url(link.href)}">${escapeHtml(link.label)}</a>`)
    .join("");
  const learn = WORKSHOP.learnLink
    ? `<a href="${WORKSHOP.learnLink.href}" target="_blank" rel="noopener">${escapeHtml(WORKSHOP.learnLink.label)} &#8599;</a>`
    : "";

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <span>&copy; <span id="footer-year"></span> ${escapeHtml(WORKSHOP.copyright)}</span>
      <span>Last updated: <time datetime="${WORKSHOP.lastUpdated}">${m}/${d}/${y}</time></span>
      <span class="footer-links">${links}${learn}</span>
    </div>`;
  document.body.appendChild(footer);
  footer.querySelector("#footer-year").textContent = String(new Date().getFullYear());
}

/* ---------------------------------- Theme ---------------------------------- */

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme, persist) {
  const isDark = theme === "dark";
  const changed = currentTheme() !== (isDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  if (persist) localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");

  const toggle = document.getElementById("theme-toggle");
  const toggleText = document.getElementById("theme-toggle-text");
  const next = isDark ? "Switch to light mode" : "Switch to dark mode";
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", next);
    toggle.setAttribute("title", next);
  }
  if (toggleText) toggleText.textContent = next;
  if (changed) renderMermaid();
}

function wireToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  applyTheme(getPreferredTheme(), false);
  toggle.addEventListener("click", () => applyTheme(currentTheme() === "dark" ? "light" : "dark", true));
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(event.matches ? "dark" : "light", false);
  });
}

/* ------------------------------ Page enhancers ------------------------------ */

function enhanceTocWithPageTitle() {
  const toc = document.querySelector(".toc");
  const pageTitle = document.querySelector("h1");
  if (!toc || !pageTitle) return;

  const pageIndicator = document.createElement("div");
  pageIndicator.className = "toc-page-title";
  pageIndicator.innerHTML = `<p class="toc-page-label"><strong>${escapeHtml(pageTitle.textContent.trim())}</strong></p>`;
  toc.insertBefore(pageIndicator, toc.firstChild);
}

function enhanceCodeBlocks() {
  document.querySelectorAll("pre.code").forEach((pre) => {
    if (pre.closest(".code-block")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement("button");
    button.className = "code-copy-btn";
    button.type = "button";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        button.textContent = "Copied";
        button.classList.add("copied");
      } catch {
        button.textContent = "Copy failed";
      }
      window.setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("copied");
      }, 1500);
    });

    wrapper.appendChild(button);
  });
}

/* ------------------------------ Syntax highlight ----------------------------- */

const PRISM_BASE = "https://cdn.jsdelivr.net/npm/prismjs@1/components";
const PRISM_ALIASES = {
  sh: "bash", shell: "bash", ps1: "powershell", pwsh: "powershell", js: "javascript", ts: "typescript",
  html: "markup", xml: "markup", yml: "yaml", cs: "csharp", py: "python", tf: "hcl", azcli: "bash"
};
const PRISM_LANGS = new Set(["bash", "powershell", "json", "yaml", "csharp", "python", "typescript", "sql", "bicep", "hcl", "java", "go", "docker", "http"]);
const PRISM_PRELOADED = new Set(["markup", "clike", "javascript"]);

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => { script.dataset.loaded = "true"; resolve(); }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function loadStyle(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function normalizeCodeIndent(raw) {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  if (lines.length < 2) return raw;
  const firstIndent = (lines[0].match(/^[\t ]*/) || [""])[0].length;
  const candidates = lines.slice(1).filter((line) => line.trim().length > 0);
  if (!candidates.length) return raw;
  const minIndent = Math.min(...candidates.map((line) => (line.match(/^[\t ]*/) || [""])[0].length));
  if (firstIndent === 0 && minIndent > 0) {
    return [lines[0], ...lines.slice(1).map((line) => line.slice(Math.min(minIndent, line.length)))].join("\n");
  }
  return raw;
}

async function initPrismHighlighting() {
  const blocks = Array.from(document.querySelectorAll("pre.code[data-lang]"));
  if (!blocks.length) return;

  const codes = [];
  const needed = new Set();
  blocks.forEach((pre) => {
    const raw = (pre.getAttribute("data-lang") || "").trim().toLowerCase();
    if (!raw) return;
    const lang = PRISM_ALIASES[raw] || raw;

    let code = pre.querySelector("code");
    if (!code) {
      code = document.createElement("code");
      code.textContent = normalizeCodeIndent(pre.textContent);
      pre.textContent = "";
      pre.appendChild(code);
    } else {
      code.textContent = normalizeCodeIndent(code.textContent);
    }

    pre.classList.add(`language-${lang}`);
    code.classList.add(`language-${lang}`);
    codes.push(code);
    if (PRISM_LANGS.has(lang)) needed.add(lang);
  });
  if (!codes.length) return;

  window.Prism = window.Prism || {};
  window.Prism.manual = true;
  loadStyle("https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css");

  try {
    await loadScript(`${PRISM_BASE}/prism-core.min.js`);
    for (const base of PRISM_PRELOADED) await loadScript(`${PRISM_BASE}/prism-${base}.min.js`);
    await Promise.all([...needed].map((lang) => loadScript(`${PRISM_BASE}/prism-${lang}.min.js`)));
    codes.forEach((code) => window.Prism.highlightElement(code));
  } catch {
    // Keep plain code blocks if syntax-highlighting assets fail to load.
  }
}

/* ---------------------------------- Mermaid ---------------------------------- */

// Semantic node classes available in every flowchart. Authors write `class A,B azure;` or `A:::success`.
const MERMAID_CLASSES = {
  light: {
    azure:   "fill:#e6f2fb,stroke:#0078d4,stroke-width:2px,color:#0f1722",
    success: "fill:#e7f5e7,stroke:#107c10,stroke-width:2px,color:#103010",
    warning: "fill:#fff3e3,stroke:#ff8c00,stroke-width:2px,color:#4b2a05",
    danger:  "fill:#fdebe9,stroke:#d83b01,stroke-width:2px,color:#4a1405",
    accent:  "fill:#f1ecf7,stroke:#8e44ad,stroke-width:2px,color:#2e1440",
    neutral: "fill:#f0f4f8,stroke:#7f8a99,stroke-width:2px,color:#1f2937",
    data:    "fill:#e3f6f4,stroke:#0b8d80,stroke-width:2px,color:#063a35",
    external:"fill:#ffffff,stroke:#7f8a99,stroke-width:2px,stroke-dasharray:5 4,color:#1f2937"
  },
  dark: {
    azure:   "fill:#16314b,stroke:#6ac0ff,stroke-width:2px,color:#e8f2ff",
    success: "fill:#1d4a2b,stroke:#7add98,stroke-width:2px,color:#e9fff0",
    warning: "fill:#3f2d18,stroke:#ffbe73,stroke-width:2px,color:#fff1dd",
    danger:  "fill:#4e2326,stroke:#ff8e95,stroke-width:2px,color:#ffe9ea",
    accent:  "fill:#34234a,stroke:#c89be8,stroke-width:2px,color:#f5ebff",
    neutral: "fill:#1b2636,stroke:#8b9bb0,stroke-width:2px,color:#e5e7eb",
    data:    "fill:#123b37,stroke:#4fd1c0,stroke-width:2px,color:#e3fffb",
    external:"fill:#111a27,stroke:#8b9bb0,stroke-width:2px,stroke-dasharray:5 4,color:#e5e7eb"
  }
};

const MERMAID_THEME_VARIABLES = {
  light: {
    background: "transparent",
    primaryColor: "#e6f2fb", primaryTextColor: "#0f1722", primaryBorderColor: "#0078d4",
    lineColor: "#0078d4", textColor: "#1f2937", titleColor: "#0f1722",
    secondaryColor: "#fff3e3", tertiaryColor: "#e7f5e7",
    clusterBkg: "#f5f9fd", clusterBorder: "#9cc3e6", edgeLabelBackground: "transparent",
    actorBkg: "#e6f2fb", actorBorder: "#0078d4", actorTextColor: "#0f1722", actorLineColor: "#7f8a99",
    signalColor: "#0078d4", signalTextColor: "#0f1722", labelBoxBkgColor: "#e6f2fb", labelBoxBorderColor: "#0078d4",
    noteBkgColor: "#fff3e3", noteTextColor: "#4a2a0a", noteBorderColor: "#ff8c00",
    activationBkgColor: "#e7f5e7", activationBorderColor: "#107c10",
    pie1: "#0078d4", pie2: "#107c10", pie3: "#ff8c00", pie4: "#8e44ad", pie5: "#d83b01", pie6: "#0b8d80",
    pieTitleTextColor: "#0f1722", pieSectionTextColor: "#ffffff", pieLegendTextColor: "#1f2937",
    git0: "#0078d4", git1: "#107c10", git2: "#ff8c00", git3: "#8e44ad"
  },
  dark: {
    background: "transparent",
    primaryColor: "#16314b", primaryTextColor: "#e8f2ff", primaryBorderColor: "#6ac0ff",
    lineColor: "#79c1ff", textColor: "#e5e7eb", titleColor: "#e8f2ff",
    secondaryColor: "#3f2d18", tertiaryColor: "#1d4a2b",
    clusterBkg: "#0f1b2b", clusterBorder: "#2f4f75", edgeLabelBackground: "transparent",
    actorBkg: "#16314b", actorBorder: "#6ac0ff", actorTextColor: "#e8f2ff", actorLineColor: "#8b9bb0",
    signalColor: "#79c1ff", signalTextColor: "#e8f2ff", labelBoxBkgColor: "#16314b", labelBoxBorderColor: "#6ac0ff",
    noteBkgColor: "#3b2918", noteTextColor: "#fff1dd", noteBorderColor: "#ffbf73",
    activationBkgColor: "#1d4a2b", activationBorderColor: "#7add98",
    pie1: "#4eb0ff", pie2: "#7add98", pie3: "#ffbe73", pie4: "#c89be8", pie5: "#ff8e95", pie6: "#4fd1c0",
    pieTitleTextColor: "#e8f2ff", pieSectionTextColor: "#06121f", pieLegendTextColor: "#e5e7eb",
    git0: "#4eb0ff", git1: "#7add98", git2: "#ffbe73", git3: "#c89be8"
  }
};

function withSemanticClasses(source, theme) {
  const firstLine = source.split("\n").map((line) => line.trim()).find((line) => line && !line.startsWith("%%")) || "";
  if (!/^(flowchart|graph|stateDiagram)/i.test(firstLine)) return source;
  const defs = Object.entries(MERMAID_CLASSES[theme])
    .filter(([name]) => !new RegExp(`^\\s*classDef\\s+${name}\\b`, "m").test(source))
    .map(([name, style]) => `  classDef ${name} ${style};`)
    .join("\n");
  return `${source}\n${defs}`;
}

let mermaidNodes = [];
let mermaidQueue = Promise.resolve();

// Serialize renders so rapid theme toggles never overlap.
function renderMermaid() {
  mermaidQueue = mermaidQueue.then(renderMermaidNow);
  return mermaidQueue;
}

async function renderMermaidNow() {
  if (!mermaidNodes.length) return;
  const theme = currentTheme();
  mermaid.initialize({
    startOnLoad: false,
    // "antiscript" allows <img> icons in node labels but strips scripts and event handlers.
    securityLevel: "antiscript",
    theme: "base",
    themeVariables: MERMAID_THEME_VARIABLES[theme],
    flowchart: { curve: "basis", htmlLabels: true, padding: 12 },
    sequence: { mirrorActors: false },
    fontFamily: "Segoe UI, Segoe UI Variable, Tahoma, sans-serif"
  });
  mermaidNodes.forEach((node) => {
    node.removeAttribute("data-processed");
    node.innerHTML = withSemanticClasses(node.dataset.source, theme);
  });
  try {
    await mermaid.run({ nodes: mermaidNodes });
  } catch (error) {
    console.error("Mermaid render failed", error);
  }
}

function initMermaid() {
  mermaidNodes = Array.from(document.querySelectorAll("pre.mermaid"));
  // innerHTML (not textContent) keeps <img> icons that the browser parsed inside node labels.
  mermaidNodes.forEach((node) => { node.dataset.source = node.innerHTML.replace(/^\s*\n/, ""); });
  renderMermaid();
}

/* ----------------------------------- Boot ------------------------------------ */

function boot() {
  buildNav();
  buildFooter();
  initMermaid();
  wireToggle();
  enhanceTocWithPageTitle();
  enhanceCodeBlocks();
  initPrismHighlighting();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
