"use client";

import { createContext, useContext } from "react";

const PageThemeContext = createContext("default");
const CompactSectionsContext = createContext(false);

/**
 * Scopes a colour theme to everything rendered inside it, so a landing page can
 * restyle shared components (currently just button colours) without
 * affecting the rest of the site. Currently supports "pink" (biology decoders).
 */
export function PageThemeProvider({ variant = "default", compactSections = false, children }) {
  return (
    <PageThemeContext.Provider value={variant}>
      <CompactSectionsContext.Provider value={compactSections}>
        {children}
      </CompactSectionsContext.Provider>
    </PageThemeContext.Provider>
  );
}

/**
 * True when the page asked for tighter vertical section padding
 * (~15% less than the site default). Components pick their own reduced
 * padding classes when this is on.
 */
export function useCompactSections() {
  return useContext(CompactSectionsContext);
}

export function usePageTheme() {
  return useContext(PageThemeContext);
}

// Full class strings so Tailwind can detect them at build time.
const BUTTON_CLASSES = {
  default: "bg-lightblue hover:bg-darkblue",
  pink: "bg-pink hover:bg-pink-dark",
};

export function getButtonColourClasses(theme) {
  return BUTTON_CLASSES[theme] ?? BUTTON_CLASSES.default;
}
