"use client"

import React from "react"
import Link from "next/link"
import { Lock, Zap } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

interface FeatureGateProps {
  featureKey: string
  featureName: string
  description: string
  selectedFeatures: string[]
  children: React.ReactNode
}

export function FeatureGate({
  featureKey,
  featureName,
  description,
  selectedFeatures,
  children,
}: FeatureGateProps) {
  const { theme } = useTheme()
  const hasFeature = selectedFeatures.includes(featureKey)

  if (hasFeature) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${theme.primaryColor}15` }}
      >
        <Lock size={28} style={{ color: theme.primaryColor }} />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        {featureName} is not on your plan
      </h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description} Upgrade your subscription to unlock this feature.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
        >
          <Zap size={16} />
          Upgrade plan
        </Link>
        <Link
          href="/dashboard"
          className="py-2.5 px-5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
        >
          Go to dashboard
        </Link>
      </div>

      {/* Feature preview */}
      <div className="mt-8 w-full max-w-lg rounded-xl border border-border overflow-hidden opacity-40 pointer-events-none select-none">
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <div className="h-3 bg-muted rounded w-32" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted rounded w-48" />
                <div className="h-2.5 bg-muted rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}