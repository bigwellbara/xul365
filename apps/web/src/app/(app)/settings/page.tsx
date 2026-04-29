"use client"

import React, { useState } from "react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "branding" | "subscription">("general")
  const [saved, setSaved] = useState(false)
  const [generalForm, setGeneralForm] = useState({
    schoolName: "My School",
    location: "Harare, Zimbabwe",
    phone: "",
    email: "",
    academicYear: "2025",
  })
  const [brandingForm, setBrandingForm] = useState({
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    accentColor: "#f59e0b",
  })

  function handleGeneralChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGeneralForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    setSaved(false)
  }

  function handleBrandingChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBrandingForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    setSaved(false)
  }

  function handleSave() {
    setTimeout(() => setSaved(true), 400)
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your school settings and subscription
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["general", "branding", "subscription"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(tab); setSaved(false) }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">General information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="schoolName" className="text-sm font-medium text-foreground">School name</label>
              <input
                id="schoolName"
                type="text"
                value={generalForm.schoolName}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-foreground">Location</label>
              <input
                id="location"
                type="text"
                value={generalForm.location}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone number</label>
              <input
                id="phone"
                type="tel"
                value={generalForm.phone}
                onChange={handleGeneralChange}
                placeholder="07X XXX XXXX"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">School email</label>
              <input
                id="email"
                type="email"
                value={generalForm.email}
                onChange={handleGeneralChange}
                placeholder="info@yourschool.com"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="academicYear" className="text-sm font-medium text-foreground">Academic year</label>
              <input
                id="academicYear"
                type="text"
                value={generalForm.academicYear}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Save changes
            </button>
            {saved && <p className="text-sm text-green-600">Settings saved successfully ✓</p>}
          </div>
        </div>
      )}

      {/* Branding */}
      {activeTab === "branding" && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Branding & appearance</h3>
          <p className="text-sm text-muted-foreground">
            Customize your school colors. These will be applied across the entire system.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">School logo</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-4xl mb-2">🏫</p>
              <p className="text-sm text-muted-foreground">Click to upload your school logo</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              <button
                type="button"
                className="mt-3 py-1.5 px-4 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors"
              >
                Upload logo
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">School colors</label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="primaryColor" className="text-xs text-muted-foreground">Primary color</label>
                <div className="flex items-center gap-2">
                  <input
                    id="primaryColor"
                    type="color"
                    value={brandingForm.primaryColor}
                    onChange={handleBrandingChange}
                    className="w-10 h-10 rounded cursor-pointer border border-input"
                  />
                  <span className="text-sm text-foreground font-mono">{brandingForm.primaryColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="secondaryColor" className="text-xs text-muted-foreground">Secondary color</label>
                <div className="flex items-center gap-2">
                  <input
                    id="secondaryColor"
                    type="color"
                    value={brandingForm.secondaryColor}
                    onChange={handleBrandingChange}
                    className="w-10 h-10 rounded cursor-pointer border border-input"
                  />
                  <span className="text-sm text-foreground font-mono">{brandingForm.secondaryColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="accentColor" className="text-xs text-muted-foreground">Accent color</label>
                <div className="flex items-center gap-2">
                  <input
                    id="accentColor"
                    type="color"
                    value={brandingForm.accentColor}
                    onChange={handleBrandingChange}
                    className="w-10 h-10 rounded cursor-pointer border border-input"
                  />
                  <span className="text-sm text-foreground font-mono">{brandingForm.accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Preview</label>
            <div
              className="rounded-lg p-4 flex items-center gap-3"
              style={{ backgroundColor: brandingForm.primaryColor }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{generalForm.schoolName}</p>
                <p className="text-white/70 text-xs">School Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Save branding
            </button>
            {saved && <p className="text-sm text-green-600">Branding saved successfully ✓</p>}
          </div>
        </div>
      )}

      {/* Subscription */}
      {activeTab === "subscription" && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Current plan</h3>
            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">Trial plan</p>
                <p className="text-xs text-muted-foreground mt-0.5">14 days remaining</p>
              </div>
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                Trial
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Active features</p>
              <div className="grid grid-cols-2 gap-2">
                {["Student Management", "Teacher Management", "Attendance", "Fees & Billing"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Upgrade plan
            </button>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Billing history</h3>
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No billing history yet</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}