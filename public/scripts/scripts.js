// Theme switcher and menu logic for Astro

function setupThemeAndMenu() {
  const themeSwitch = document.getElementById("theme-switch");
  const html = document.documentElement;
  if (!themeSwitch) {
    return;
  }

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark-theme");
    themeSwitch.checked = true;
  } else if (localStorage.getItem("theme") === "light") {
    html.classList.remove("dark-theme");
    themeSwitch.checked = false;
  } else {
    // Hvis intet valgt, brug systemets farveskema
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      html.classList.add("dark-theme");
      themeSwitch.checked = true;
    } else {
      html.classList.remove("dark-theme");
      themeSwitch.checked = false;
    }
  }

  themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
      html.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
    console.log("Theme toggled:", themeSwitch.checked ? "dark" : "light");
  });

  const burger = document.getElementById("burger");
  const menuOverlay = document.getElementById("menu-overlay");
  const closeMenu = document.getElementById("close-menu");
  burger?.addEventListener("click", () => {
    menuOverlay?.classList.add("open");
  });
  closeMenu?.addEventListener("click", () => {
    menuOverlay?.classList.remove("open");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupThemeAndMenu();
  function onVisible(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }
  const fadeEls = document.querySelectorAll(".fade-in-section, .fade-in-left");
  // Threshold 0: fade-in starter straks elementet rammer viewporten
  const observer = new IntersectionObserver(onVisible, { threshold: 0 });
  fadeEls.forEach((el) => observer.observe(el));
});
document.addEventListener("astro:after-swap", setupThemeAndMenu);
