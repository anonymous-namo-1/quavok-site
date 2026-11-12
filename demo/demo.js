(function () {
  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.querySelector("#mobile-menu");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-demo]"));

  function onScroll() {
    if (!header) return;
    header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", open ? "false" : "true");
      menuBtn.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      if (open) menu.setAttribute("hidden", "");
      else menu.removeAttribute("hidden");
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menu.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });
  }

  function play(tile) {
    if (!tile || reduce) return;
    tile.classList.add("is-ready");
    tile.classList.remove("is-playing");
    void tile.offsetWidth;
    tile.classList.add("is-playing");
  }

  if (!reduce && "IntersectionObserver" in window) {
    var seen = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        play(entry.target);
      });
    }, { threshold: 0.45 });
    tiles.forEach(function (tile) { observer.observe(tile); });
  }

  document.addEventListener("click", function (event) {
    var replay = event.target.closest("[data-replay]");
    if (replay) {
      play(replay.closest("[data-demo]"));
      return;
    }
    if (event.target.closest("#replay-all")) {
      tiles.forEach(play);
      return;
    }
    var jump = event.target.closest(".demo-jump a");
    if (!jump) return;
    var id = jump.getAttribute("href");
    if (!id || id.charAt(0) !== "#") return;
    document.querySelectorAll(".demo-jump a").forEach(function (link) {
      link.removeAttribute("aria-current");
    });
    jump.setAttribute("aria-current", "true");
    play(document.querySelector(id));
  });
})();
