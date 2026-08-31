import * as React from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

// TEMPORARY: dark mode is disabled (light-only). Restore this helper to
// re-enable dark mode — it is referenced by the keyboard toggle and the
// resolved-theme line inside `applyTheme`.
// function getSystemTheme(): ResolvedTheme {
//   if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
//     return "dark"
//   }

//   return "light"
// }

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

// TEMPORARY: dark mode is disabled (light-only). The keyboard shortcut
// below is commented out along with its helper. To re-enable dark mode,
// restore this function and the `keydown` effect further below.
// function isEditableTarget(target: EventTarget | null) {
//   if (!(target instanceof HTMLElement)) {
//     return false
//   }

//   if (target.isContentEditable) {
//     return true
//   }

//   const editableParent = target.closest(
//     "input, textarea, select, [contenteditable='true']"
//   )
//   if (editableParent) {
//     return true
//   }

//   return false
// }

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey)
    if (isTheme(storedTheme)) {
      return storedTheme
    }

    return defaultTheme
  })

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      // TEMPORARY: `nextTheme` is intentionally ignored while the app is
      // locked to light mode. Delete this line and restore the resolution
      // below to re-enable dark mode.
      void nextTheme
      const root = document.documentElement
      // TEMPORARY: dark mode is disabled (light-only). To re-enable,
      // uncomment the line below and remove the hardcoded "light".
      const resolvedTheme: ResolvedTheme = "light"
      // const resolvedTheme =
      //   nextTheme === "system" ? getSystemTheme() : nextTheme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  React.useEffect(() => {
    applyTheme(theme)

    if (theme !== "system") {
      return undefined
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, applyTheme])

  // TEMPORARY: dark mode is disabled (light-only). Restore this effect
  // (and the `isEditableTarget` helper above) to re-enable the keyboard
  // dark-mode toggle.
  // React.useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.repeat) {
  //       return
  //     }

  //     if (event.metaKey || event.ctrlKey || event.altKey) {
  //       return
  //     }

  //     if (isEditableTarget(event.target)) {
  //       return
  //     }

  //     if (event.key.toLowerCase() !== "d") {
  //       return
  //     }

  //     setThemeState((currentTheme) => {
  //       const nextTheme =
  //         currentTheme === "dark"
  //           ? "light"
  //           : currentTheme === "light"
  //             ? "dark"
  //             : getSystemTheme() === "dark"
  //               ? "light"
  //               : "dark"

  //       localStorage.setItem(storageKey, nextTheme)
  //       return nextTheme
  //     })
  //   }

  //   window.addEventListener("keydown", handleKeyDown)

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown)
  //   }
  // }, [storageKey])

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }

      if (event.key !== storageKey) {
        return
      }

      if (isTheme(event.newValue)) {
        setThemeState(event.newValue)
        return
      }

      setThemeState(defaultTheme)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [defaultTheme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
