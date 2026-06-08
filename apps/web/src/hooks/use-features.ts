"use client"

import { useState, useEffect } from "react"

export function useFeatures() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const res = await fetch("/api/subscription")
        const data = await res.json() as {
          subscription: { selectedFeatures: string[] } | null
        }
        if (data.subscription?.selectedFeatures) {
          setSelectedFeatures(data.subscription.selectedFeatures)
        }
      } catch {
        // Default to empty if error
      } finally {
        setLoading(false)
      }
    }
    void fetchFeatures()
  }, [])

  function hasFeature(key: string) {
    return selectedFeatures.includes(key)
  }

  return { selectedFeatures, hasFeature, loading }
}