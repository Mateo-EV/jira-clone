"use client"

import { useEffect, useState } from "react"

export default function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState<boolean>(defaultValue)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQueryList.matches)

    setMatches(mediaQueryList.matches)

    mediaQueryList.addEventListener("change", handleChange)

    return () => mediaQueryList.removeEventListener("change", handleChange)
  }, [query])

  return matches
}
