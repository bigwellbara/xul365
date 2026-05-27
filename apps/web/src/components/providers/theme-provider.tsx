"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface Theme {
  navbarBg: string
  navbarText: string
  sidebarBg: string
  sidebarText: string
  sidebarActiveBg: string
  sidebarActiveText: string
  contentBg: string
  primaryColor: string
  primaryText: string
}

const defaultTheme: Theme = {
  navbarBg: "#0f4c5c",
  navbarText: "#ffffff",
  sidebarBg: "#ffffff",
  sidebarText: "#64748b",
  sidebarActiveBg: "#0f4c5c",
  sidebarActiveText: "#ffffff",
  contentBg: "#eef1f6",
  primaryColor: "#0f4c5c",
  primaryText: "#ffffff",
}

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
  applyTheme: (theme: Theme) => void
}>({
  theme: defaultTheme,
  setTheme: () => {},
  applyTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty("--navbar-bg", theme.navbarBg)
  root.style.setProperty("--navbar-text", theme.navbarText)
  root.style.setProperty("--sidebar-bg", theme.sidebarBg)
  root.style.setProperty("--sidebar-text", theme.sidebarText)
  root.style.setProperty("--sidebar-active-bg", theme.sidebarActiveBg)
  root.style.setProperty("--sidebar-active-text", theme.sidebarActiveText)
  root.style.setProperty("--content-bg", theme.contentBg)
  root.style.setProperty("--primary-color", theme.primaryColor)
  root.style.setProperty("--primary-text", theme.primaryText)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // ✅ themeForm belongs in whatever component needs it, not here
  //    If you need it in ThemeProvider, declare it here like this:
  const [themeForm, setThemeForm] = useState({ ...theme })

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme)
    applyThemeToDOM(newTheme)
    localStorage.setItem("xul365-theme", JSON.stringify(newTheme))
  }

  function applyTheme(newTheme: Theme) {
    setTheme(newTheme)
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem("xul365-theme")
      if (saved) {
        const parsed = JSON.parse(saved) as Theme
        setThemeState(parsed)
        applyThemeToDOM(parsed)
      } else {
        applyThemeToDOM(defaultTheme)
      }
    } catch {
      applyThemeToDOM(defaultTheme)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}