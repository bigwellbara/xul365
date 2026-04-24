"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

// ---- FEATURE DEFINITIONS ----
const FEATURES = [
  {
    key: "student_management",
    name: "Student Management",
    description: "Enroll students, manage profiles, track grade levels from ECD to Form 6",
    price: 10,
    icon: "🎓",
    required: true,
  },
  {
    key: "teacher_management",
    name: "Teacher Management",
    description: "Manage teacher profiles, assign subjects and classes",
    price: 8,
    icon: "👨‍🏫",
    required: true,
  },
  {
    key: "attendance",
    name: "Attendance Tracking",
    description: "Record and monitor daily student attendance per class",
    price: 5,
    icon: "✅",
    required: false,
  },
  {
    key: "exams_grading",
    name: "Exams & Grading",
    description: "Manage ZIMSEC exams, O-Level, A-Level results and report cards",
    price: 10,
    icon: "📝",
    required: false,
  },
  {
    key: "timetable",
    name: "Timetable",
    description: "Create and manage class timetables and subject schedules",
    price: 5,
    icon: "📅",
    required: false,
  },
  {
    key: "fees_billing",
    name: "Fees & Billing",
    description: "Generate invoices, track payments in USD and ZiG",
    price: 12,
    icon: "💰",
    required: false,
  },
  {
    key: "parent_portal",
    name: "Parent Portal",
    description: "Give parents access to view their child's progress and fees",
    price: 8,
    icon: "👨‍👩‍👧",
    required: false,
  },
  {
    key: "sms_notifications",
    name: "SMS Notifications",
    description: "Send automated SMS alerts to parents for attendance and fees",
    price: 15,
    icon: "📱",
    required: false,
  },
]

// ---- BUNDLES ----
const BUNDLES = [
  {
    name: "Starter",
    description: "Perfect for small schools just getting started",
    features: ["student_management", "teacher_management", "attendance"],
  },
  {
    name: "Advanced",
    description: "Everything you need to run a full school",
    features: [
      "student_management",
      "teacher_management",
      "attendance",
      "exams_grading",
      "timetable",
      "fees_billing",
    ],
  },
  {
    name: "Complete",
    description: "The full Xul365 experience with parent portal and SMS",
    features: FEATURES.map((f) => f.key),
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "student_management",
    "teacher_management",
  ])
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [loading, setLoading] = useState(false)

  // Toggle a feature on or off
  function toggleFeature(key: string) {
    const feature = FEATURES.find((f) => f.key === key)
    if (feature?.required) return // Cannot deselect required features

    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  // Apply a bundle
  function applyBundle(features: string[]) {
    setSelectedFeatures(features)
  }

  // Calculate total price
  const monthlyTotal = FEATURES.filter((f) =>
    selectedFeatures.includes(f.key)
  ).reduce((sum, f) => sum + f.price, 0)

  const totalPrice =
    billingCycle === "annual"
      ? monthlyTotal * 12 * 0.8
      : monthlyTotal

  async function handleContinue() {
    setLoading(true)
    // We will connect this to the API later
    // For now just redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="space-y-8">

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <span className="text-sm text-muted-foreground">School Info</span>
        </div>
        <div className="w-8 h-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="text-sm font-medium text-foreground">Features</span>
        </div>
        <div className="w-8 h-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="text-sm text-muted-foreground">Payment</span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Choose your features
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select only what your school needs. You can add more later.
        </p>
      </div>

      {/* Bundles */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Quick select a bundle</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUNDLES.map((bundle) => (
            <button
              key={bundle.name}
              type="button"
              onClick={() => applyBundle(bundle.features)}
              className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-muted transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{bundle.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{bundle.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Or pick features individually
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.key)
            return (
              <button
                key={feature.key}
                type="button"
                onClick={() => toggleFeature(feature.key)}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } ${feature.required ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {feature.name}
                        {feature.required && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (required)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-foreground">
                      ${feature.price}
                    </p>
                    <p className="text-xs text-muted-foreground">/mo</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Billing cycle + summary */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Billing cycle</h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors ${
              billingCycle === "monthly"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors ${
              billingCycle === "annual"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            }`}
          >
            Annual
            <span className="ml-2 text-xs opacity-80">Save 20%</span>
          </button>
        </div>

        {/* Price summary */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedFeatures.length} features selected
            </p>
            <p className="text-sm text-muted-foreground">
              ${monthlyTotal}/mo
            </p>
          </div>
          {billingCycle === "annual" && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Annual discount (20%)</p>
              <p className="text-sm text-green-600">
                -${(monthlyTotal * 12 * 0.2).toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-2">
            <p className="text-base font-semibold text-foreground">Total</p>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {billingCycle === "annual" ? "per year" : "per month"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Continue to payment"}
        </button>
      </div>

    </div>
  )
}