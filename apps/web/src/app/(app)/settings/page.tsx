// "use client"

// import React, { useState, useEffect } from "react"
// import { useTheme,} from "@/components/providers/theme-provider"

// interface Branding {
//   primaryColor: string
//   secondaryColor: string
//   accentColor: string
//   location: string
//   phone: string
//   email: string
//   academicYear: string
// }

// interface Tenant {
//   id: string
//   schoolName: string
//   subscriptionStatus: string
//   branding: Branding
// }

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState<"general" | "branding" | "theme" | "subscription">("general")
//   const [saved, setSaved] = useState(false)


//   const { theme, setTheme } = useTheme()          // ← add these
//   const [themeForm, setThemeForm] = useState({    // ← two lines here
//     navbarBg: theme.navbarBg,
//     navbarText: theme.navbarText,
//     sidebarBg: theme.sidebarBg,
//     sidebarText: theme.sidebarText,
//     sidebarActiveBg: theme.sidebarActiveBg,
//     sidebarActiveText: theme.sidebarActiveText,
//     contentBg: theme.contentBg,
//     primaryColor: theme.primaryColor,
//     primaryText: theme.primaryText,
//   })


//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(true)
//   const [error, setError] = useState("")
//   const [tenant, setTenant] = useState<Tenant | null>(null)

//   const [generalForm, setGeneralForm] = useState({
//     schoolName: "",
//     location: "",
//     phone: "",
//     email: "",
//     academicYear: "2025",
//   })

//   const [brandingForm, setBrandingForm] = useState({
//     primaryColor: "#2563eb",
//     secondaryColor: "#64748b",
//     accentColor: "#f59e0b",
//   })

//   useEffect(() => {
//     async function fetchSettings() {
//       try {
//         const res = await fetch("/api/settings")
//         if (!res.ok) return
//         const data = await res.json() as { tenant: Tenant }
//         setTenant(data.tenant)
//         const b = data.tenant.branding
//         setGeneralForm({
//           schoolName: data.tenant.schoolName,
//           location: b.location ?? "",
//           phone: b.phone ?? "",
//           email: b.email ?? "",
//           academicYear: b.academicYear ?? "2025",
//         })
//         setBrandingForm({
//           primaryColor: b.primaryColor ?? "#2563eb",
//           secondaryColor: b.secondaryColor ?? "#64748b",
//           accentColor: b.accentColor ?? "#f59e0b",
//         })
//       } catch {
//         setError("Failed to load settings")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchSettings()
//   }, [])

//   function handleGeneralChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setGeneralForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//     setSaved(false)
//   }

//   function handleBrandingChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setBrandingForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//     setSaved(false)
//   }

//   async function handleSave() {
//     setLoading(true)
//     setError("")
//     try {
//       const res = await fetch("/api/settings", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...generalForm,
//           ...brandingForm,
//         }),
//       })
//       const data = await res.json() as { tenant: Tenant; error?: string }
//       if (!res.ok) {
//         setError(data.error ?? "Failed to save settings")
//         return
//       }
//       setTenant(data.tenant)
//       setSaved(true)
//     } catch {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetching) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <p className="text-sm text-muted-foreground">Loading settings...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">

//       <div>
//         <h2 className="text-2xl font-bold text-foreground">Settings</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Manage your school settings and subscription
//         </p>
//       </div>

//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
//         {(["general", "branding", "theme","subscription"] as const).map((tab) => (
//           <button
//             key={tab}
//             type="button"
//             onClick={() => { setActiveTab(tab); setSaved(false) }}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
//               activeTab === tab
//                 ? "bg-background text-foreground shadow-sm"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* General */}
//       {activeTab === "general" && (
//         <div className="bg-card rounded-lg border border-border p-6 space-y-4">
//           <h3 className="text-base font-semibold text-foreground">
//             General information
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="schoolName" className="text-sm font-medium text-foreground">
//                 School name
//               </label>
//               <input
//                 id="schoolName"
//                 type="text"
//                 value={generalForm.schoolName}
//                 onChange={handleGeneralChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="location" className="text-sm font-medium text-foreground">
//                 Location
//               </label>
//               <input
//                 id="location"
//                 type="text"
//                 value={generalForm.location}
//                 onChange={handleGeneralChange}
//                 placeholder="e.g. Harare, Zimbabwe"
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="phone" className="text-sm font-medium text-foreground">
//                 Phone number
//               </label>
//               <input
//                 id="phone"
//                 type="tel"
//                 value={generalForm.phone}
//                 onChange={handleGeneralChange}
//                 placeholder="07X XXX XXXX"
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="email" className="text-sm font-medium text-foreground">
//                 School email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={generalForm.email}
//                 onChange={handleGeneralChange}
//                 placeholder="info@yourschool.com"
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="academicYear" className="text-sm font-medium text-foreground">
//                 Current academic year
//               </label>
//               <input
//                 id="academicYear"
//                 type="text"
//                 value={generalForm.academicYear}
//                 onChange={handleGeneralChange}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-4 pt-2">
//             <button
//               type="button"
//               onClick={() => void handleSave()}
//               disabled={loading}
//               className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Save changes"}
//             </button>
//             {saved && (
//               <p className="text-sm text-green-600">Settings saved successfully ✓</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Branding */}
//       {activeTab === "branding" && (
//         <div className="bg-card rounded-lg border border-border p-6 space-y-4">
//           <h3 className="text-base font-semibold text-foreground">
//             Branding & appearance
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Customize your school colors applied across the entire system.
//           </p>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-foreground">School logo</label>
//             <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
//               <p className="text-4xl mb-2">🏫</p>
//               <p className="text-sm text-muted-foreground">Click to upload your school logo</p>
//               <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
//               <button
//                 type="button"
//                 className="mt-3 py-1.5 px-4 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors"
//               >
//                 Upload logo
//               </button>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <label className="text-sm font-medium text-foreground">School colors</label>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <label htmlFor="primaryColor" className="text-xs text-muted-foreground">
//                   Primary color
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     id="primaryColor"
//                     type="color"
//                     value={brandingForm.primaryColor}
//                     onChange={handleBrandingChange}
//                     className="w-10 h-10 rounded cursor-pointer border border-input"
//                   />
//                   <span className="text-sm text-foreground font-mono">
//                     {brandingForm.primaryColor}
//                   </span>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="secondaryColor" className="text-xs text-muted-foreground">
//                   Secondary color
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     id="secondaryColor"
//                     type="color"
//                     value={brandingForm.secondaryColor}
//                     onChange={handleBrandingChange}
//                     className="w-10 h-10 rounded cursor-pointer border border-input"
//                   />
//                   <span className="text-sm text-foreground font-mono">
//                     {brandingForm.secondaryColor}
//                   </span>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="accentColor" className="text-xs text-muted-foreground">
//                   Accent color
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     id="accentColor"
//                     type="color"
//                     value={brandingForm.accentColor}
//                     onChange={handleBrandingChange}
//                     className="w-10 h-10 rounded cursor-pointer border border-input"
//                   />
//                   <span className="text-sm text-foreground font-mono">
//                     {brandingForm.accentColor}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Preview */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-foreground">Preview</label>
//             <div
//               className="rounded-lg p-4 flex items-center gap-3"
//               style={{ backgroundColor: brandingForm.primaryColor }}
//             >
//               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
//                 S
//               </div>
//               <div>
//                 <p className="text-white font-semibold text-sm">
//                   {generalForm.schoolName || "Your School"}
//                 </p>
//                 <p className="text-white/70 text-xs">School Management System</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 pt-2">
//             <button
//               type="button"
//               onClick={() => void handleSave()}
//               disabled={loading}
//               className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Save branding"}
//             </button>
//             {saved && (
//               <p className="text-sm text-green-600">Branding saved successfully ✓</p>
//             )}
//           </div>
//         </div>
//       )}


//       {/* Theme */}
// {activeTab === "theme" && (
//   <div className="bg-card rounded-lg border border-border p-6 space-y-6">
//     <h3 className="text-base font-semibold text-foreground">
//       Layout theme
//     </h3>
//     <p className="text-sm text-muted-foreground">
//       Customize the colors of your navbar, sidebar and content area.
//       Changes apply instantly across the entire system.
//     </p>

//     <div className="grid grid-cols-2 gap-6">

//       {/* Navbar */}
//       <div className="space-y-3">
//         <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
//           Navbar
//         </h4>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Background</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.navbarBg}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, navbarBg: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.navbarBg}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Text color</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.navbarText}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, navbarText: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.navbarText}</span>
//           </div>
//         </div>
//       </div>

//       {/* Sidebar */}
//       <div className="space-y-3">
//         <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
//           Sidebar
//         </h4>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Background</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.sidebarBg}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, sidebarBg: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.sidebarBg}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Text color</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.sidebarText}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, sidebarText: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.sidebarText}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Active item bg</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.sidebarActiveBg}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, sidebarActiveBg: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.sidebarActiveBg}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Active item text</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.sidebarActiveText}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, sidebarActiveText: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.sidebarActiveText}</span>
//           </div>
//         </div>
//       </div>

//       {/* Content area */}
//       <div className="space-y-3">
//         <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
//           Content area
//         </h4>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Background</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.contentBg}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, contentBg: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.contentBg}</span>
//           </div>
//         </div>
//       </div>

//       {/* Primary color */}
//       <div className="space-y-3">
//         <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
//           Primary color
//         </h4>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Color</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.primaryColor}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.primaryColor}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label className="text-sm text-muted-foreground">Text on primary</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="color"
//               value={themeForm.primaryText}
//               onChange={(e) => setThemeForm((prev) => ({ ...prev, primaryText: e.target.value }))}
//               className="w-8 h-8 rounded cursor-pointer border border-input"
//             />
//             <span className="text-xs font-mono text-muted-foreground">{themeForm.primaryText}</span>
//           </div>
//         </div>
//       </div>

//     </div>

//     {/* Preview */}
//     <div className="space-y-2">
//       <h4 className="text-sm font-semibold text-foreground">Preview</h4>
//       <div className="rounded-xl overflow-hidden border border-border">
//         {/* Navbar preview */}
//         <div
//           className="h-10 flex items-center px-4 gap-3"
//           style={{ backgroundColor: themeForm.navbarBg }}
//         >
//           <div
//             className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
//             style={{ backgroundColor: themeForm.primaryColor, color: themeForm.primaryText }}
//           >
//             X
//           </div>
//           <span
//             className="text-sm font-semibold"
//             style={{ color: themeForm.navbarText }}
//           >
//             Xul365
//           </span>
//           <div className="flex-1" />
//           <div
//             className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//             style={{ backgroundColor: `${themeForm.navbarText}20`, color: themeForm.navbarText }}
//           >
//             A
//           </div>
//         </div>
//         {/* Content preview */}
//         <div
//           className="flex h-20"
//           style={{ backgroundColor: themeForm.contentBg }}
//         >
//           {/* Sidebar preview */}
//           <div
//             className="w-24 flex flex-col gap-1 p-2"
//             style={{ backgroundColor: themeForm.sidebarBg }}
//           >
//             <div
//               className="h-6 rounded-lg flex items-center px-2"
//               style={{
//                 backgroundColor: themeForm.sidebarActiveBg,
//                 color: themeForm.sidebarActiveText,
//               }}
//             >
//               <span className="text-xs">Dashboard</span>
//             </div>
//             <div
//               className="h-6 rounded-lg flex items-center px-2"
//               style={{ color: themeForm.sidebarText }}
//             >
//               <span className="text-xs">Students</span>
//             </div>
//           </div>
//           {/* Main content preview */}
//           <div className="flex-1 p-3 flex items-center justify-center">
//             <div
//               className="px-3 py-1.5 rounded-lg text-xs font-medium"
//               style={{
//                 backgroundColor: themeForm.primaryColor,
//                 color: themeForm.primaryText,
//               }}
//             >
//               Primary button
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Preset themes */}
//     <div className="space-y-3">
//       <h4 className="text-sm font-semibold text-foreground">Quick presets</h4>
//       <div className="flex gap-3 flex-wrap">
//         {[
//           { name: "Teal", navbarBg: "#0f4c5c", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#0f4c5c", sidebarActiveText: "#ffffff", contentBg: "#eef1f6", primaryColor: "#0f4c5c", primaryText: "#ffffff" },
//           { name: "Purple", navbarBg: "#4f46e5", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#4f46e5", sidebarActiveText: "#ffffff", contentBg: "#f1f0ff", primaryColor: "#4f46e5", primaryText: "#ffffff" },
//           { name: "Dark", navbarBg: "#1e293b", navbarText: "#ffffff", sidebarBg: "#0f172a", sidebarText: "#94a3b8", sidebarActiveBg: "#3b82f6", sidebarActiveText: "#ffffff", contentBg: "#1e293b", primaryColor: "#3b82f6", primaryText: "#ffffff" },
//           { name: "Green", navbarBg: "#166534", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#166534", sidebarActiveText: "#ffffff", contentBg: "#f0fdf4", primaryColor: "#166534", primaryText: "#ffffff" },
//           { name: "Red", navbarBg: "#991b1b", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#991b1b", sidebarActiveText: "#ffffff", contentBg: "#fff1f2", primaryColor: "#991b1b", primaryText: "#ffffff" },
//           { name: "Orange", navbarBg: "#9a3412", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#9a3412", sidebarActiveText: "#ffffff", contentBg: "#fff7ed", primaryColor: "#ea580c", primaryText: "#ffffff" },
//         ].map((preset) => (
//           <button
//             key={preset.name}
//             type="button"
//             onClick={() => setThemeForm(preset)}
//             className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors"
//           >
//             <div
//               className="w-5 h-5 rounded-full"
//               style={{ backgroundColor: preset.navbarBg }}
//             />
//             <span className="text-sm text-foreground">{preset.name}</span>
//           </button>
//         ))}
//       </div>
//     </div>

//     <div className="flex items-center gap-4 pt-2">
//       <button
//         type="button"
//         onClick={() => {
//           setTheme(themeForm)
//           setSaved(true)
//         }}
//         className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//       >
//         Apply theme
//       </button>
//       <button
//         type="button"
//         onClick={() => {
//           const defaultT = {
//             navbarBg: "#0f4c5c",
//             navbarText: "#ffffff",
//             sidebarBg: "#ffffff",
//             sidebarText: "#64748b",
//             sidebarActiveBg: "#0f4c5c",
//             sidebarActiveText: "#ffffff",
//             contentBg: "#eef1f6",
//             primaryColor: "#0f4c5c",
//             primaryText: "#ffffff",
//           }
//           setThemeForm(defaultT)
//           setTheme(defaultT)
//         }}
//         className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
//       >
//         Reset to default
//       </button>
//       {saved && (
//         <p className="text-sm text-green-600">Theme applied ✓</p>
//       )}
//     </div>
//   </div>
// )}

//       {/* Subscription */}
//       {activeTab === "subscription" && (
//         <div className="space-y-4">
//           <div className="bg-card rounded-lg border border-border p-6 space-y-4">
//             <h3 className="text-base font-semibold text-foreground">Current plan</h3>
//             <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
//               <div>
//                 <p className="text-sm font-semibold text-foreground">
//                   {tenant?.subscriptionStatus === "ACTIVE" ? "Active plan" : "Trial plan"}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-0.5">
//                   {tenant?.subscriptionStatus === "ACTIVE"
//                     ? "Your subscription is active"
//                     : "14 days remaining"}
//                 </p>
//               </div>
//               <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
//                 {tenant?.subscriptionStatus ?? "Trial"}
//               </span>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm font-medium text-foreground">Active features</p>
//               <div className="grid grid-cols-2 gap-2">
//                 {[
//                   "Student Management",
//                   "Teacher Management",
//                   "Attendance",
//                   "Fees & Billing",
//                   "Exams & Results",
//                   "Report Cards",
//                   "Timetable",
//                 ].map((feature) => (
//                   <div
//                     key={feature}
//                     className="flex items-center gap-2 text-sm text-foreground"
//                   >
//                     <span className="text-green-500">✓</span>
//                     {feature}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <button
//               type="button"
//               className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//             >
//               Upgrade plan
//             </button>
//           </div>

//           <div className="bg-card rounded-lg border border-border p-6">
//             <h3 className="text-base font-semibold text-foreground mb-4">
//               Billing history
//             </h3>
//             <div className="text-center py-8">
//               <p className="text-sm text-muted-foreground">No billing history yet</p>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }


"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import { Settings, Palette, Layout, CreditCard, CheckCircle2, Save } from "lucide-react"

interface Branding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  location: string
  phone: string
  email: string
  academicYear: string
  // theme fields persisted to DB
  navbarBg?: string
  navbarText?: string
  sidebarBg?: string
  sidebarText?: string
  sidebarActiveBg?: string
  sidebarActiveText?: string
  contentBg?: string
  themePrimaryColor?: string
  themePrimaryText?: string
}

interface Tenant {
  id: string
  schoolName: string
  subscriptionStatus: string
  branding: Branding
}

type TabKey = "general" | "branding" | "theme" | "subscription"

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "theme", label: "Theme", icon: Layout },
  { key: "subscription", label: "Subscription", icon: CreditCard },
]

const DEFAULT_THEME = {
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

const PRESETS = [
  { name: "Teal", navbarBg: "#0f4c5c", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#0f4c5c", sidebarActiveText: "#ffffff", contentBg: "#eef1f6", primaryColor: "#0f4c5c", primaryText: "#ffffff" },
  { name: "Purple", navbarBg: "#4f46e5", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#4f46e5", sidebarActiveText: "#ffffff", contentBg: "#f1f0ff", primaryColor: "#4f46e5", primaryText: "#ffffff" },
  { name: "Dark", navbarBg: "#1e293b", navbarText: "#ffffff", sidebarBg: "#0f172a", sidebarText: "#94a3b8", sidebarActiveBg: "#3b82f6", sidebarActiveText: "#ffffff", contentBg: "#1e293b", primaryColor: "#3b82f6", primaryText: "#ffffff" },
  { name: "Green", navbarBg: "#166534", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#166534", sidebarActiveText: "#ffffff", contentBg: "#f0fdf4", primaryColor: "#166534", primaryText: "#ffffff" },
  { name: "Red", navbarBg: "#991b1b", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#991b1b", sidebarActiveText: "#ffffff", contentBg: "#fff1f2", primaryColor: "#991b1b", primaryText: "#ffffff" },
  { name: "Orange", navbarBg: "#9a3412", navbarText: "#ffffff", sidebarBg: "#ffffff", sidebarText: "#64748b", sidebarActiveBg: "#9a3412", sidebarActiveText: "#ffffff", contentBg: "#fff7ed", primaryColor: "#ea580c", primaryText: "#ffffff" },
]



const ALL_FEATURES = [
  { key: "student_management", name: "Student Management", description: "Enroll and manage students from ECD to Form 6", price: 10, required: true },
  { key: "teacher_management", name: "Teacher Management", description: "Manage teacher profiles and assignments", price: 8, required: true },
  { key: "attendance", name: "Attendance Tracking", description: "Record and monitor daily attendance", price: 5, required: false },
  { key: "exams_grading", name: "Exams & Grading", description: "Manage exams, results and report cards", price: 10, required: false },
  { key: "timetable", name: "Timetable", description: "Create and manage class timetables", price: 5, required: false },
  { key: "fees_billing", name: "Fees & Billing", description: "Generate invoices and track payments", price: 12, required: false },
  { key: "parent_portal", name: "Parent Portal", description: "Give parents access to view their child", price: 8, required: false },
  { key: "sms_notifications", name: "SMS Notifications", description: "Send automated SMS alerts to parents", price: 15, required: false },
]

function SubscriptionTab({
  theme,
  tenant,
}: {
  theme: { primaryColor: string; primaryText: string }
  tenant: { subscriptionStatus: string } | null
}) {
  const [subscription, setSubscription] = useState<{
    selectedFeatures: string[]
    billingCycle: string
    priceUsd: number
    status: string
  } | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "student_management", "teacher_management",
  ])
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/subscription")
        const data = await res.json() as { subscription: typeof subscription }
        if (data.subscription) {
          setSubscription(data.subscription)
          setSelectedFeatures(data.subscription.selectedFeatures as string[])
          setBillingCycle(data.subscription.billingCycle as "monthly" | "annual")
        }
      } catch {
        setError("Failed to load subscription")
      } finally {
        setFetching(false)
      }
    }
    void fetchSubscription()
  }, [])

  function toggleFeature(key: string) {
    const feature = ALL_FEATURES.find((f) => f.key === key)
    if (feature?.required) return
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
    setSaved(false)
  }

  const monthlyTotal = ALL_FEATURES
    .filter((f) => selectedFeatures.includes(f.key))
    .reduce((sum, f) => sum + f.price, 0)

  const totalPrice = billingCycle === "annual"
    ? monthlyTotal * 12 * 0.8
    : monthlyTotal

  async function handleSave() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedFeatures,
          billingCycle,
          priceUsd: totalPrice,
        }),
      })
      const data = await res.json() as { subscription: typeof subscription; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to save"); return }
      setSubscription(data.subscription)
      setSaved(true)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading subscription...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Subscription</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add or remove features from your plan. Changes apply immediately.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Current status */}
      <div
        className="flex items-center justify-between p-4 rounded-lg border"
        style={{
          backgroundColor: `${theme.primaryColor}0d`,
          borderColor: `${theme.primaryColor}33`,
        }}
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            {subscription?.status === "ACTIVE" ? "Active plan" : "Trial plan"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {selectedFeatures.length} features active · ${monthlyTotal}/mo
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
        >
          {subscription?.status ?? tenant?.subscriptionStatus ?? "Trial"}
        </span>
      </div>

      {/* Billing cycle */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Billing cycle</h4>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className="flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors"
            style={billingCycle === "monthly"
              ? { backgroundColor: theme.primaryColor, color: theme.primaryText, borderColor: theme.primaryColor }
              : {}}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className="flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors"
            style={billingCycle === "annual"
              ? { backgroundColor: theme.primaryColor, color: theme.primaryText, borderColor: theme.primaryColor }
              : {}}
          >
            Annual <span className="text-xs opacity-80 ml-1">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Feature list */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Features</h4>
        <div className="grid grid-cols-1 gap-2">
          {ALL_FEATURES.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.key)
            return (
              <div
                key={feature.key}
                onClick={() => toggleFeature(feature.key)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  feature.required ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  borderColor: isSelected ? theme.primaryColor : undefined,
                  backgroundColor: isSelected ? `${theme.primaryColor}08` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Toggle */}
                  <div
                    className="w-10 h-5 rounded-full transition-all relative shrink-0"
                    style={{
                      backgroundColor: isSelected ? theme.primaryColor : "#d1d5db",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                      style={{ left: isSelected ? "calc(100% - 18px)" : "2px" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {feature.name}
                      {feature.required && (
                        <span className="ml-2 text-xs text-muted-foreground">(required)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-medium text-foreground">${feature.price}</p>
                  <p className="text-xs text-muted-foreground">/mo</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price summary */}
      <div className="border border-border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{selectedFeatures.length} features</p>
          <p className="text-sm text-muted-foreground">${monthlyTotal}/mo</p>
        </div>
        {billingCycle === "annual" && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Annual discount (20%)</p>
            <p className="text-sm text-green-600">-${(monthlyTotal * 12 * 0.2).toFixed(2)}</p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2">
          <p className="text-base font-semibold text-foreground">Total</p>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">${totalPrice.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {billingCycle === "annual" ? "per year" : "per month"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={loading}
          className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
        >
          <Save size={15} />
          {loading ? "Saving..." : "Save subscription"}
        </button>
        {saved && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 size={14} /> Subscription updated
          </p>
        )}
      </div>

      {/* Billing history */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Billing history</h4>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No billing history yet</p>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [focused, setFocused] = useState(false)

  const { theme, setTheme } = useTheme()

  const [themeForm, setThemeForm] = useState({ ...DEFAULT_THEME })

  const [generalForm, setGeneralForm] = useState({
    schoolName: "",
    location: "",
    phone: "",
    email: "",
    academicYear: "2025",
  })

  const [brandingForm, setBrandingForm] = useState({
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    accentColor: "#f59e0b",
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (!res.ok) return
        const data = await res.json() as { tenant: Tenant }
        setTenant(data.tenant)
        const b = data.tenant.branding
        setGeneralForm({
          schoolName: data.tenant.schoolName,
          location: b.location ?? "",
          phone: b.phone ?? "",
          email: b.email ?? "",
          academicYear: b.academicYear ?? "2025",
        })
        setBrandingForm({
          primaryColor: b.primaryColor ?? "#2563eb",
          secondaryColor: b.secondaryColor ?? "#64748b",
          accentColor: b.accentColor ?? "#f59e0b",
        })
        // Restore saved theme from DB if present
        if (b.navbarBg) {
          const savedTheme = {
            navbarBg: b.navbarBg,
            navbarText: b.navbarText ?? DEFAULT_THEME.navbarText,
            sidebarBg: b.sidebarBg ?? DEFAULT_THEME.sidebarBg,
            sidebarText: b.sidebarText ?? DEFAULT_THEME.sidebarText,
            sidebarActiveBg: b.sidebarActiveBg ?? DEFAULT_THEME.sidebarActiveBg,
            sidebarActiveText: b.sidebarActiveText ?? DEFAULT_THEME.sidebarActiveText,
            contentBg: b.contentBg ?? DEFAULT_THEME.contentBg,
            primaryColor: b.themePrimaryColor ?? DEFAULT_THEME.primaryColor,
            primaryText: b.themePrimaryText ?? DEFAULT_THEME.primaryText,
          }
          setThemeForm(savedTheme)
          setTheme(savedTheme)
        }
      } catch {
        setError("Failed to load settings")
      } finally {
        setFetching(false)
      }
    }
    void fetchSettings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleGeneralChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGeneralForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    setSaved(false)
  }

  function handleBrandingChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBrandingForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    setSaved(false)
  }

  async function handleSave() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...generalForm, ...brandingForm }),
      })
      const data = await res.json() as { tenant: Tenant; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to save settings"); return }
      setTenant(data.tenant)
      setSaved(true)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleApplyTheme() {
    setLoading(true)
    setError("")
    try {
      // Apply immediately to the UI
      setTheme(themeForm)

      // Persist to DB alongside existing branding fields
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...generalForm,
          ...brandingForm,
          // store theme fields under distinct keys
          navbarBg: themeForm.navbarBg,
          navbarText: themeForm.navbarText,
          sidebarBg: themeForm.sidebarBg,
          sidebarText: themeForm.sidebarText,
          sidebarActiveBg: themeForm.sidebarActiveBg,
          sidebarActiveText: themeForm.sidebarActiveText,
          contentBg: themeForm.contentBg,
          themePrimaryColor: themeForm.primaryColor,
          themePrimaryText: themeForm.primaryText,
        }),
      })
      const data = await res.json() as { tenant: Tenant; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to save theme"); return }
      setTenant(data.tenant)
      setSaved(true)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
    boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your school settings and subscription
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-160px)]">

        {/* LEFT — tab nav */}
        <div className="w-56 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
              Settings
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setActiveTab(key); setSaved(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                  activeTab === key
                    ? "border-l-2"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                style={activeTab === key ? {
                  backgroundColor: `${theme.primaryColor}15`,
                  color: theme.primaryColor,
                  borderLeftColor: theme.primaryColor,
                } : {}}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* School info summary */}
          {tenant && (
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                >
                  {tenant.schoolName?.[0] ?? "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{tenant.schoolName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{tenant.subscriptionStatus.toLowerCase()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — content panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* ── GENERAL ── */}
          {activeTab === "general" && (
            <div className="p-6 space-y-5">
              <div className="pb-4 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">General information</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Basic details about your school</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "schoolName", label: "School name", placeholder: "Your school name", type: "text" },
                  { id: "location", label: "Location", placeholder: "e.g. Harare, Zimbabwe", type: "text" },
                  { id: "phone", label: "Phone number", placeholder: "07X XXX XXXX", type: "tel" },
                  { id: "email", label: "School email", placeholder: "info@yourschool.com", type: "email" },
                  { id: "academicYear", label: "Current academic year", placeholder: "2025", type: "text" },
                ].map(({ id, label, placeholder, type }) => (
                  <div key={id} className="space-y-2">
                    <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
                    <input
                      id={id}
                      type={type}
                      value={generalForm[id as keyof typeof generalForm]}
                      onChange={handleGeneralChange}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={loading}
                  className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                >
                  <Save size={15} />
                  {loading ? "Saving..." : "Save changes"}
                </button>
                {saved && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 size={14} /> Saved successfully</p>}
              </div>
            </div>
          )}

          {/* ── BRANDING ── */}
          {activeTab === "branding" && (
            <div className="p-6 space-y-5">
              <div className="pb-4 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">Branding & appearance</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Customize your school colors</p>
              </div>

              {/* Logo upload */}
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

              {/* Colors */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">School colors</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "primaryColor", label: "Primary color" },
                    { id: "secondaryColor", label: "Secondary color" },
                    { id: "accentColor", label: "Accent color" },
                  ].map(({ id, label }) => (
                    <div key={id} className="space-y-2">
                      <label htmlFor={id} className="text-xs text-muted-foreground">{label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          id={id}
                          type="color"
                          value={brandingForm[id as keyof typeof brandingForm]}
                          onChange={handleBrandingChange}
                          className="w-10 h-10 rounded cursor-pointer border border-input"
                        />
                        <span className="text-sm font-mono text-foreground">
                          {brandingForm[id as keyof typeof brandingForm]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
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
                    <p className="text-white font-semibold text-sm">
                      {generalForm.schoolName || "Your School"}
                    </p>
                    <p className="text-white/70 text-xs">School Management System</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={loading}
                  className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                >
                  <Save size={15} />
                  {loading ? "Saving..." : "Save branding"}
                </button>
                {saved && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 size={14} /> Saved successfully</p>}
              </div>
            </div>
          )}

          {/* ── THEME ── */}
          {activeTab === "theme" && (
            <div className="p-6 space-y-6">
              <div className="pb-4 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">Layout theme</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Customize navbar, sidebar, and content colors. Changes apply instantly and are saved to your account.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">

                {/* Navbar */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Navbar</h4>
                  {[
                    { key: "navbarBg", label: "Background" },
                    { key: "navbarText", label: "Text color" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">{label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeForm[key as keyof typeof themeForm]}
                          onChange={(e) => setThemeForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-8 h-8 rounded cursor-pointer border border-input"
                        />
                        <span className="text-xs font-mono text-muted-foreground w-16">
                          {themeForm[key as keyof typeof themeForm]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Sidebar</h4>
                  {[
                    { key: "sidebarBg", label: "Background" },
                    { key: "sidebarText", label: "Text color" },
                    { key: "sidebarActiveBg", label: "Active item bg" },
                    { key: "sidebarActiveText", label: "Active item text" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">{label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeForm[key as keyof typeof themeForm]}
                          onChange={(e) => setThemeForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-8 h-8 rounded cursor-pointer border border-input"
                        />
                        <span className="text-xs font-mono text-muted-foreground w-16">
                          {themeForm[key as keyof typeof themeForm]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Content area</h4>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeForm.contentBg}
                        onChange={(e) => setThemeForm((prev) => ({ ...prev, contentBg: e.target.value }))}
                        className="w-8 h-8 rounded cursor-pointer border border-input"
                      />
                      <span className="text-xs font-mono text-muted-foreground w-16">{themeForm.contentBg}</span>
                    </div>
                  </div>
                </div>

                {/* Primary */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Primary color</h4>
                  {[
                    { key: "primaryColor", label: "Color" },
                    { key: "primaryText", label: "Text on primary" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">{label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeForm[key as keyof typeof themeForm]}
                          onChange={(e) => setThemeForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-8 h-8 rounded cursor-pointer border border-input"
                        />
                        <span className="text-xs font-mono text-muted-foreground w-16">
                          {themeForm[key as keyof typeof themeForm]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Preview</h4>
                <div className="rounded-xl overflow-hidden border border-border">
                  <div className="h-10 flex items-center px-4 gap-3" style={{ backgroundColor: themeForm.navbarBg }}>
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: themeForm.primaryColor, color: themeForm.primaryText }}
                    >
                      X
                    </div>
                    <span className="text-sm font-semibold" style={{ color: themeForm.navbarText }}>
                      {generalForm.schoolName || "Your School"}
                    </span>
                    <div className="flex-1" />
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${themeForm.navbarText}20`, color: themeForm.navbarText }}
                    >
                      A
                    </div>
                  </div>
                  <div className="flex h-20" style={{ backgroundColor: themeForm.contentBg }}>
                    <div className="w-24 flex flex-col gap-1 p-2" style={{ backgroundColor: themeForm.sidebarBg }}>
                      <div
                        className="h-6 rounded-lg flex items-center px-2"
                        style={{ backgroundColor: themeForm.sidebarActiveBg, color: themeForm.sidebarActiveText }}
                      >
                        <span className="text-xs">Dashboard</span>
                      </div>
                      <div className="h-6 rounded-lg flex items-center px-2" style={{ color: themeForm.sidebarText }}>
                        <span className="text-xs">Students</span>
                      </div>
                    </div>
                    <div className="flex-1 p-3 flex items-center justify-center">
                      <div
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: themeForm.primaryColor, color: themeForm.primaryText }}
                      >
                        Primary button
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Quick presets</h4>
                <div className="flex gap-3 flex-wrap">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setThemeForm(preset)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.navbarBg }} />
                      <span className="text-sm text-foreground">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => void handleApplyTheme()}
                  disabled={loading}
                  className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                >
                  <Save size={15} />
                  {loading ? "Saving..." : "Apply & save theme"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThemeForm(DEFAULT_THEME)
                    setTheme(DEFAULT_THEME)
                  }}
                  className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Reset to default
                </button>
                {saved && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Theme saved
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── SUBSCRIPTION ── */}
       {/* ── SUBSCRIPTION ── */}
{activeTab === "subscription" && (
  <SubscriptionTab theme={theme} tenant={tenant} />
)}

        </div>
      </div>

    </div>
  )
}
