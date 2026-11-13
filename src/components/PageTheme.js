"use client";

import { createContext, useContext } from "react";

const PageThemeContext = createContext("default");

/**
 * Scopes a colour theme to everything rendered inside it, so a landing page can
 * restyle shared components (currently just button colours) without
 * affecting the rest of the site. Currently supports "pink" (biology decoders).
 */
export function PageThemeProvider({ variant = "default", children }) {
  return (
    <PageThemeContext.Provider value={variant}>
      {children}
    </PageThemeContext.Provider>
  );
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
