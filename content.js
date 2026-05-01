const OCTOCAT_LOGO_CLASS = "fixgithub-octocat-logo";
const CYBER_KITTEN_CLASS = "fixgithub-cyber-kitten-logo";
const MAIN_COPILOT_LOGO_CLASS = "fixgithub-main-copilot-logo";
const NYA_SUFFIX = " ~nya";

const cyberKittenSvg = `
<svg viewBox="0 0 64 64" role="img" aria-label="Cyber kitten" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fixgithub-cyber" x1="8" x2="56" y1="8" y2="56">
      <stop stop-color="#00e5ff"/>
      <stop offset="1" stop-color="#ff3df2"/>
    </linearGradient>
  </defs>
  <path d="M14 25 9 8l16 9a27 27 0 0 1 14 0l16-9-5 17c4 5 6 11 6 18 0 14-11 21-24 21S8 57 8 43c0-7 2-13 6-18Z" fill="url(#fixgithub-cyber)" stroke="#0b1020" stroke-width="4" stroke-linejoin="round"/>
  <path d="M17 36h13v8H17zm17 0h13v8H34z" fill="#0b1020"/>
  <path d="M20 40h7m10 0h7" stroke="#00fff0" stroke-width="2" stroke-linecap="round"/>
  <path d="M30 47h4l-2 3-2-3Z" fill="#fff"/>
  <path d="M20 53c4 3 8 3 12 0 4 3 8 3 12 0" fill="none" stroke="#0b1020" stroke-width="3" stroke-linecap="round"/>
  <path d="M10 31H2m60 0h-8M9 40H1m62 0h-8M14 50 6 55m44-5 8 5" stroke="#00fff0" stroke-width="3" stroke-linecap="round"/>
</svg>`;

function svgElement(svg) {
  const template = document.createElement("template");
  template.innerHTML = svg.trim();
  return template.content.firstElementChild;
}

function replaceElementWithIcon(element, svg, ...classNames) {
  if (!element || element.dataset.fixgithubReplaced === "true") return;

  const icon = svgElement(svg);
  icon.classList.add(...classNames);
  element.replaceWith(icon);
  icon.dataset.fixgithubReplaced = "true";
}

function replaceElementWithImage(element, src, alt, ...classNames) {
  if (!element || element.dataset.fixgithubReplaced === "true") return;

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.classList.add(...classNames);
  element.replaceWith(image);
  image.dataset.fixgithubReplaced = "true";
}

function replaceGitHubLogo() {
  document.querySelectorAll(
    "header .octicon-mark-github, .AppHeader-logo .octicon-mark-github, a[aria-label='GitHub homepage'] .octicon-mark-github"
  ).forEach((logo) => {
    replaceElementWithImage(logo, chrome.runtime.getURL("assets/octocat.png"), "Original GitHub Octocat", OCTOCAT_LOGO_CLASS);
  });
}

function replaceCopilotLogos() {
  document.querySelectorAll(".octicon-copilot, svg[aria-label*='Copilot' i], img[alt*='Copilot' i]").forEach((logo) => {
    replaceElementWithIcon(logo, cyberKittenSvg, CYBER_KITTEN_CLASS);
  });
}

function replaceMainCopilotLogo() {
  const textarea = document.querySelector("#copilot-chat-textarea");
  const chatInputContainer = textarea?.closest("[class*='Layout-module__chatInputContainer']");
  const logoContainer = chatInputContainer?.previousElementSibling;
  const logo = logoContainer?.querySelector("svg:not([data-fixgithub-replaced='true'])");

  replaceElementWithIcon(logo, cyberKittenSvg, CYBER_KITTEN_CLASS, MAIN_COPILOT_LOGO_CLASS);
}

function appendNyaToUsernames() {
  const selectors = [
    "[data-hovercard-type='user']",
    "[data-login]",
    ".author",
    ".js-user-profile-link",
    ".vcard-fullname",
    ".js-profile-editable-area .p-name",
    ".user-mention"
  ];

  document.querySelectorAll(selectors.join(",")).forEach((element) => {
    if (element.dataset.fixgithubNya === "true") return;

    const label = element.textContent.trim();
    if (!label || label.endsWith(NYA_SUFFIX.trim())) return;

    const directTextNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

    if (directTextNode) {
      directTextNode.textContent = `${directTextNode.textContent}${NYA_SUFFIX}`;
    } else {
      element.append(document.createTextNode(NYA_SUFFIX));
    }

    element.dataset.fixgithubNya = "true";
  });
}

function fixGitHub() {
  replaceGitHubLogo();
  replaceCopilotLogos();
  replaceMainCopilotLogo();
  appendNyaToUsernames();
}

const observer = new MutationObserver(() => {
  window.requestAnimationFrame(fixGitHub);
});

fixGitHub();
observer.observe(document.documentElement, { childList: true, subtree: true });
