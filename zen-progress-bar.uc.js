(() => {
  if (window.__zpbLoaded) {
    return;
  }
  window.__zpbLoaded = true;

  const ROOT = document.documentElement;
  const ATTR = "zpb-active";
  const BAR_ID = "zpb-bar";

  function selectedTab() {
    try {
      return gBrowser?.selectedTab ?? null;
    } catch {
      return null;
    }
  }

  function isLoading() {
    if (ROOT.hasAttribute("zia-loading")) {
      return true;
    }
    const tab = selectedTab();
    if (!tab) {
      return false;
    }
    return tab.hasAttribute("busy") || tab.hasAttribute("progress");
  }

  function ensureBar() {
    let bar = document.getElementById(BAR_ID);
    if (!bar) {
      bar = document.createXULElement("hbox");
      bar.id = BAR_ID;
      bar.setAttribute("layer", "true");
    }

    const panel =
      gBrowser?.selectedBrowser?.closest?.(".browserSidebarContainer") ||
      document.querySelector(".browserSidebarContainer.deck-selected");

    if (panel && bar.parentElement !== panel) {
      panel.insertBefore(bar, panel.firstChild);
    }
    return bar;
  }

  function sync() {
    const on = isLoading();
    if (on) {
      ROOT.setAttribute(ATTR, "true");
      ensureBar();
    } else {
      ROOT.removeAttribute(ATTR);
    }
  }

  new MutationObserver(sync).observe(ROOT, {
    attributes: true,
    attributeFilter: ["zia-loading"],
  });

  window.addEventListener("TabSelect", () => {
    ensureBar();
    sync();
  });

  const tabContainer = gBrowser?.tabContainer;
  if (tabContainer) {
    tabContainer.addEventListener("TabAttrModified", (event) => {
      const changed = event.detail?.changed;
      if (
        !changed ||
        changed.includes("busy") ||
        changed.includes("progress") ||
        changed.includes("pendingicon")
      ) {
        sync();
      }
    });
  }

  try {
    gBrowser.addTabsProgressListener({
      onStateChange(browser, webProgress) {
        if (webProgress?.isTopLevel) {
          sync();
        }
      },
      onProgressChange(browser, webProgress) {
        if (webProgress?.isTopLevel) {
          sync();
        }
      },
      onLocationChange(browser, webProgress) {
        if (webProgress?.isTopLevel) {
          sync();
        }
      },
    });
  } catch {
    /* older / restricted hosts */
  }

  // ponytail: cheap backup if an event is missed (Zia/Zen attr races)
  window.setInterval(sync, 200);

  if (document.readyState === "complete") {
    ensureBar();
    sync();
  } else {
    window.addEventListener(
      "load",
      () => {
        ensureBar();
        sync();
      },
      { once: true }
    );
  }
})();
