// "use client"

// import React, { useState, useEffect, useRef } from "react"
// import { Search, Plus, ChevronRight, Receipt, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"

// interface Student {
//   id: string
//   firstName: string
//   lastName: string
//   gradeLevel: string
// }

// interface InvoiceItem {
//   description: string
//   amountUsd: number
// }

// interface Invoice {
//   id: string
//   studentId: string
//   term: string
//   academicYear: string
//   items: InvoiceItem[]
//   totalAmountUsd: number
//   status: "UNPAID" | "PARTIAL" | "PAID"
//   dueDate: string
//   studentName?: string
//   gradeLevel?: string
// }

// const emptyForm = {
//   studentId: "",
//   studentName: "",
//   gradeLevel: "",
//   term: "TERM_1",
//   academicYear: "2025",
//   dueDate: "",
//   tuitionFee: "",
//   examFee: "",
//   developmentFee: "",
//   sportsFee: "",
// }

// const STATUS_STYLES = {
//   UNPAID: "bg-red-100 text-red-800",
//   PARTIAL: "bg-amber-100 text-amber-800",
//   PAID: "bg-green-100 text-green-800",
// }

// const STATUS_ICONS = {
//   UNPAID: AlertCircle,
//   PARTIAL: Clock,
//   PAID: CheckCircle,
// }



// function FeeStatCard({
//   label,
//   value,
//   icon: Icon,
//   iconBg,
//   iconColor,
//   shadowColor,
// }: {
//   label: string
//   value: string
//   icon: React.ElementType
//   iconBg: string
//   iconColor: string
//   shadowColor: string
// }) {
//   const [hovered, setHovered] = useState(false)

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Stacked shadow layers */}
//       <div
//         className="absolute rounded-xl"
//         style={{
//           bottom: "-8px", left: "8px", right: "-8px",
//           top: 0, zIndex: 0,
//           background: `rgba(${shadowColor},0.10)`,
//           borderRadius: "14px",
//         }}
//       />
//       <div
//         className="absolute rounded-xl"
//         style={{
//           bottom: "-4px", left: "4px", right: "-4px",
//           top: 0, zIndex: 1,
//           background: `rgba(${shadowColor},0.07)`,
//           borderRadius: "13px",
//         }}
//       />
//       {/* Glass card */}
//       <div
//         className="relative space-y-3 p-5 transition-all duration-300"
//         style={{
//           zIndex: 2,
//           background: hovered
//             ? "radial-gradient(ellipse at 60% 0%, rgba(56,189,248,0.18) 0%, rgba(255,255,255,0.82) 60%)"
//             : "rgba(255,255,255,0.72)",
//           backdropFilter: "blur(12px)",
//           WebkitBackdropFilter: "blur(12px)",
//           border: hovered
//             ? "0.5px solid rgba(56,189,248,0.45)"
//             : "0.5px solid rgba(255,255,255,0.6)",
//           borderRadius: "14px",
//           boxShadow: hovered
//             ? "0 4px 24px rgba(56,189,248,0.18), 0 1px 6px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
//             : "0 2px 16px rgba(15,76,92,0.08), 0 1px 4px rgba(15,76,92,0.06)",
//         }}
//       >
//         <div
//           className="w-9 h-9 rounded-xl flex items-center justify-center"
//           style={{ backgroundColor: iconBg }}
//         >
//           <Icon size={18} style={{ color: iconColor }} />
//         </div>
//         <div>
//           <p className="text-xs text-muted-foreground mb-1">{label}</p>
//           <p className="text-2xl font-semibold text-foreground">{value}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function FeesPage() {
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [selected, setSelected] = useState<Invoice | null>(null)
//   const [showForm, setShowForm] = useState(false)
//   const [search, setSearch] = useState("")
//   const [form, setForm] = useState(emptyForm)
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(true)
//   const [error, setError] = useState("")
//   const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all")

//   const [studentQuery, setStudentQuery] = useState("")
//   const [studentResults, setStudentResults] = useState<Student[]>([])
//   const [searchingStudents, setSearchingStudents] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     async function fetchInvoices() {
//       try {
//         const res = await fetch("/api/invoices")
//         const data = await res.json() as { invoices: Invoice[] }
//         setInvoices(data.invoices ?? [])
//       } catch {
//         setError("Failed to load invoices")
//       } finally {
//         setFetching(false)
//       }
//     }
//     void fetchInvoices()
//   }, [])

//   useEffect(() => {
//     if (form.studentId) return
//     if (studentQuery.length < 1) {
//       setStudentResults([])
//       setShowDropdown(false)
//       return
//     }
//     const timeout = setTimeout(async () => {
//       setSearchingStudents(true)
//       try {
//         const res = await fetch(`/api/students/search?q=${encodeURIComponent(studentQuery)}`)
//         const data = await res.json() as { students: Student[] }
//         setStudentResults(data.students ?? [])
//         setShowDropdown(true)
//       } catch {
//         setStudentResults([])
//       } finally {
//         setSearchingStudents(false)
//       }
//     }, 300)
//     return () => clearTimeout(timeout)
//   }, [studentQuery, form.studentId])

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setShowDropdown(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   function selectStudent(student: Student) {
//     setForm((prev) => ({
//       ...prev,
//       studentId: student.id,
//       studentName: `${student.firstName} ${student.lastName}`,
//       gradeLevel: student.gradeLevel,
//     }))
//     setStudentQuery(`${student.firstName} ${student.lastName}`)
//     setStudentResults([])
//     setShowDropdown(false)
//   }

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
//     setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   async function handleSubmit() {
//     if (!form.studentId) { setError("Please select a student"); return }
//     setLoading(true)
//     setError("")
//     const items = [
//       form.tuitionFee && { description: "Tuition Fee", amountUsd: parseFloat(form.tuitionFee) },
//       form.examFee && { description: "Examination Fee", amountUsd: parseFloat(form.examFee) },
//       form.developmentFee && { description: "Development Fee", amountUsd: parseFloat(form.developmentFee) },
//       form.sportsFee && { description: "Sports Fee", amountUsd: parseFloat(form.sportsFee) },
//     ].filter(Boolean) as InvoiceItem[]
//     const totalAmountUsd = items.reduce((sum, i) => sum + i.amountUsd, 0)
//     try {
//       const res = await fetch("/api/invoices", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           studentId: form.studentId,
//           studentName: form.studentName,
//           gradeLevel: form.gradeLevel,
//           term: form.term,
//           academicYear: form.academicYear,
//           dueDate: form.dueDate,
//           items,
//           totalAmountUsd,
//         }),
//       })
//       const data = await res.json() as { invoice: Invoice; error?: string }
//       if (!res.ok) { setError(data.error ?? "Failed to create invoice"); return }
//       const newInvoice = { ...data.invoice, studentName: form.studentName, gradeLevel: form.gradeLevel }
//       setInvoices((prev) => [newInvoice, ...prev])
//       setForm(emptyForm)
//       setStudentQuery("")
//       setShowForm(false)
//       setSelected(newInvoice)
//     } catch {
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function markAsPaid(invoiceId: string) {
//     try {
//       const res = await fetch("/api/invoices", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ invoiceId }),
//       })
//       if (!res.ok) return
//       setInvoices((prev) =>
//         prev.map((inv) => inv.id === invoiceId ? { ...inv, status: "PAID" } : inv)
//       )
//       if (selected?.id === invoiceId) setSelected((prev) => prev ? { ...prev, status: "PAID" } : prev)
//     } catch {
//       setError("Failed to update invoice")
//     }
//   }

//   const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.totalAmountUsd), 0)
//   const totalPaid = invoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + Number(inv.totalAmountUsd), 0)
//   const totalOutstanding = totalBilled - totalPaid

//   const filtered = invoices
//     .filter((inv) => (inv.studentName ?? "").toLowerCase().includes(search.toLowerCase()))
//     .filter((inv) => {
//       if (activeTab === "unpaid") return inv.status === "UNPAID" || inv.status === "PARTIAL"
//       if (activeTab === "paid") return inv.status === "PAID"
//       return true
//     })

//   return (
//     <div className="space-y-4">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Fees & Billing</h2>
//           <p className="text-sm text-muted-foreground mt-1">Manage student invoices and payments</p>
//         </div>
//         <button
//           type="button"
//           onClick={() => { setShowForm(true); setSelected(null) }}
//           className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
//         >
//           <Plus size={15} />
//           Create invoice
//         </button>
//       </div>

//      {/* Summary cards */}
// <div className="grid grid-cols-3 gap-6 pb-3">
//   {[
//     {
//       label: "Total billed",
//       value: `$${totalBilled.toFixed(2)}`,
//       icon: DollarSign,
//       iconBg: "#e6f1fb",
//       iconColor: "#185fa5",
//       shadowColor: "15,76,92",
//     },
//     {
//       label: "Total collected",
//       value: `$${totalPaid.toFixed(2)}`,
//       icon: CheckCircle,
//       iconBg: "#eaf3de",
//       iconColor: "#3b6d11",
//       shadowColor: "22,101,52",
//     },
//     {
//       label: "Outstanding",
//       value: `$${totalOutstanding.toFixed(2)}`,
//       icon: AlertCircle,
//       iconBg: "#fcebeb",
//       iconColor: "#a32d2d",
//       shadowColor: "153,27,27",
//     },
//   ].map(({ label, value, icon: Icon, iconBg, iconColor, shadowColor }) => (
//     <FeeStatCard
//       key={label}
//       label={label}
//       value={value}
//       icon={Icon}
//       iconBg={iconBg}
//       iconColor={iconColor}
//       shadowColor={shadowColor}
//     />
//   ))}
// </div>

//       {error && (
//         <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       )}

//       {/* Split layout */}
//       <div className="flex gap-4 h-[calc(100vh-280px)]">

//         {/* LEFT — invoice list */}
//         <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">

//           {/* Tabs + search */}
//           <div className="p-3 border-b border-border space-y-2">
//             <div className="flex gap-1 bg-muted rounded-lg p-1">
//               {(["all", "unpaid", "paid"] as const).map((tab) => (
//                 <button
//                   key={tab}
//                   type="button"
//                   onClick={() => { setActiveTab(tab); setSelected(null) }}
//                   className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
//                     activeTab === tab
//                       ? "bg-background text-foreground shadow-sm"
//                       : "text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             <div className="relative">
//               <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-8 pr-3 py-1.5 border border-input rounded-md bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>
//           </div>

//           {/* List */}
//           <div className="flex-1 overflow-y-auto">
//             {fetching ? (
//               <div className="p-4 space-y-2">
//                 {[1,2,3,4].map(i => (
//                   <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
//                     <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
//                     <div className="flex-1 space-y-1.5">
//                       <div className="h-3 bg-muted rounded w-28" />
//                       <div className="h-2.5 bg-muted rounded w-20" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="p-6 text-center">
//                 <Receipt size={26} className="mx-auto text-muted-foreground mb-2" />
//                 <p className="text-sm text-muted-foreground">No invoices found</p>
//               </div>
//             ) : (
//               filtered.map((invoice) => {
//                 const StatusIcon = STATUS_ICONS[invoice.status]
//                 return (
//                   <button
//                     key={invoice.id}
//                     type="button"
//                     onClick={() => { setSelected(invoice); setShowForm(false) }}
//                     className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
//                       selected?.id === invoice.id
//                         ? "bg-primary/10 border-l-2 border-l-primary"
//                         : "hover:bg-muted/50"
//                     }`}
//                   >
//                     <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
//                       <Receipt size={15} className="text-primary" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-foreground truncate">
//                         {invoice.studentName ?? "Unknown"}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         #{invoice.id.slice(0, 8).toUpperCase()}
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end gap-1 shrink-0">
//                       <StatusIcon
//                         size={13}
//                         className={
//                           invoice.status === "PAID" ? "text-green-500" :
//                           invoice.status === "PARTIAL" ? "text-amber-500" : "text-red-500"
//                         }
//                       />
//                       <ChevronRight size={12} className="text-muted-foreground" />
//                     </div>
//                   </button>
//                 )
//               })
//             )}
//           </div>
//         </div>

//         {/* RIGHT — detail / form panel */}
//         <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

//           {/* Create invoice form */}
//           {showForm && (
//             <div className="p-6">
//               <h3 className="text-base font-semibold text-foreground mb-5">Create new invoice</h3>
//               <div className="space-y-4">
//                 {/* Student search */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-foreground">Student</label>
//                   <div className="relative" ref={dropdownRef}>
//                     <input
//                       type="text"
//                       value={studentQuery}
//                       onChange={(e) => {
//                         setStudentQuery(e.target.value)
//                         setForm((prev) => ({ ...prev, studentId: "", studentName: "", gradeLevel: "" }))
//                       }}
//                       placeholder="Search student by name..."
//                       className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                     />
//                     {searchingStudents && <p className="text-xs text-muted-foreground mt-1">Searching...</p>}
//                     {showDropdown && studentResults.length > 0 && (
//                       <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden">
//                         {studentResults.map((student) => (
//                           <button key={student.id} type="button" onClick={() => selectStudent(student)}
//                             className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0">
//                             <p className="text-sm font-medium text-foreground">{student.firstName} {student.lastName}</p>
//                             <p className="text-xs text-muted-foreground">{student.gradeLevel.replace(/_/g, " ")}</p>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                     {showDropdown && studentResults.length === 0 && !searchingStudents && (
//                       <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4 text-center">
//                         <p className="text-sm text-muted-foreground">No students found</p>
//                       </div>
//                     )}
//                   </div>
//                   {form.studentId && (
//                     <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-md">
//                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
//                         {form.studentName.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-foreground">{form.studentName}</p>
//                         <p className="text-xs text-muted-foreground">{form.gradeLevel.replace(/_/g, " ")}</p>
//                       </div>
//                       <button type="button" onClick={() => { setForm((prev) => ({ ...prev, studentId: "", studentName: "", gradeLevel: "" })); setStudentQuery("") }}
//                         className="ml-auto text-xs text-muted-foreground hover:text-foreground">
//                         ✕ Clear
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <label htmlFor="term" className="text-sm font-medium text-foreground">Term</label>
//                     <select id="term" value={form.term} onChange={handleChange}
//                       className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
//                       <option value="TERM_1">Term 1</option>
//                       <option value="TERM_2">Term 2</option>
//                       <option value="TERM_3">Term 3</option>
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="academicYear" className="text-sm font-medium text-foreground">Academic year</label>
//                     <input id="academicYear" type="text" value={form.academicYear} onChange={handleChange}
//                       className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="dueDate" className="text-sm font-medium text-foreground">Due date</label>
//                     <input id="dueDate" type="date" value={form.dueDate} onChange={handleChange} required
//                       className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-4 space-y-3">
//                   <h4 className="text-sm font-medium text-foreground">Fee items (USD)</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     {[
//                       { id: "tuitionFee", label: "Tuition fee" },
//                       { id: "examFee", label: "Examination fee" },
//                       { id: "developmentFee", label: "Development fee" },
//                       { id: "sportsFee", label: "Sports fee" },
//                     ].map(({ id, label }) => (
//                       <div key={id} className="space-y-2">
//                         <label htmlFor={id} className="text-sm text-muted-foreground">{label}</label>
//                         <input id={id} type="number" value={form[id as keyof typeof form]} onChange={handleChange}
//                           placeholder="0.00" min="0" step="0.01"
//                           className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex items-center justify-between bg-muted rounded-md px-4 py-3">
//                     <p className="text-sm font-medium text-foreground">Total amount</p>
//                     <p className="text-lg font-bold text-foreground">
//                       ${(
//                         parseFloat(form.tuitionFee || "0") +
//                         parseFloat(form.examFee || "0") +
//                         parseFloat(form.developmentFee || "0") +
//                         parseFloat(form.sportsFee || "0")
//                       ).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                   <button type="button" onClick={() => void handleSubmit()} disabled={loading || !form.studentId}
//                     className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
//                     {loading ? "Creating..." : "Create invoice"}
//                   </button>
//                   <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setStudentQuery("") }}
//                     className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Invoice detail */}
//           {!showForm && selected && (
//             <div className="p-6 space-y-6">

//               {/* Header */}
//               <div className="flex items-start justify-between pb-5 border-b border-border">
//                 <div className="flex items-center gap-4">
//                   <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Receipt size={24} className="text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-foreground">
//                       Invoice #{selected.id.slice(0, 8).toUpperCase()}
//                     </h3>
//                     <p className="text-sm text-muted-foreground mt-0.5">
//                       {selected.studentName ?? "Unknown"} · {selected.gradeLevel?.replace(/_/g, " ")}
//                     </p>
//                     <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${STATUS_STYLES[selected.status]}`}>
//                       {React.createElement(STATUS_ICONS[selected.status], { size: 11 })}
//                       {selected.status.charAt(0) + selected.status.slice(1).toLowerCase()}
//                     </span>
//                   </div>
//                 </div>
//                 {selected.status !== "PAID" && (
//                   <button
//                     type="button"
//                     onClick={() => void markAsPaid(selected.id)}
//                     className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors"
//                   >
//                     <CheckCircle size={14} />
//                     Mark as paid
//                   </button>
//                 )}
//               </div>

//               {/* Invoice info */}
//               <div className="grid grid-cols-3 gap-4">
//                 {[
//                   { label: "Term", value: selected.term.replace("_", " ") },
//                   { label: "Academic year", value: selected.academicYear },
//                   { label: "Due date", value: new Date(selected.dueDate).toLocaleDateString() },
//                 ].map(({ label, value }) => (
//                   <div key={label} className="bg-muted/40 rounded-lg p-3">
//                     <p className="text-xs text-muted-foreground mb-1">{label}</p>
//                     <p className="text-sm font-medium text-foreground">{value}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Fee breakdown */}
//               <div className="rounded-lg border border-border overflow-hidden">
//                 <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
//                   <h4 className="text-sm font-semibold text-foreground">Fee breakdown</h4>
//                 </div>
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-border">
//                       <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Description</th>
//                       <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount (USD)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(selected.items as InvoiceItem[]).map((item, i) => (
//                       <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
//                         <td className="px-4 py-3 text-sm text-foreground">{item.description}</td>
//                         <td className="px-4 py-3 text-sm font-medium text-foreground text-right">
//                           ${Number(item.amountUsd).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-muted/40 border-t border-border">
//                       <td className="px-4 py-3 text-sm font-semibold text-foreground">Total</td>
//                       <td className="px-4 py-3 text-base font-bold text-foreground text-right">
//                         ${Number(selected.totalAmountUsd).toFixed(2)}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//             </div>
//           )}

//           {/* Empty state */}
//           {!showForm && !selected && (
//             <div className="h-full flex flex-col items-center justify-center text-center p-8">
//               <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
//                 <Receipt size={24} className="text-muted-foreground" />
//               </div>
//               <p className="text-base font-medium text-foreground">Select an invoice</p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Click any invoice on the left to view its details
//               </p>
//             </div>
//           )}

//         </div>
//       </div>

//     </div>
//   )
// }


"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, Plus, ChevronRight, Receipt, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { FeatureGate } from "@/components/ui/feature-gate"
import {PostPaymentModal} from "@/components/ui/payment-modal"
import { useFeatures } from "@/hooks/use-features"



//invoice detail
type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY" | "CHEQUE"
type Currency = "USD" | "ZIG"

interface Payment {
  id: string
  invoiceId: string
  amountPaid: number
  currency: string
  method: string
  reference: string
  status: string
  paidAt: string
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  MOBILE_MONEY: "Mobile Money",
  CHEQUE: "Cheque",
}

function InvoiceDetail({
  invoice,
  theme,
  onStatusChange,
}: {
  invoice: Invoice
  theme: { primaryColor: string; primaryText: string }
  onStatusChange: (id: string, status: Invoice["status"]) => void
}) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  useEffect(() => {
    setLoadingPayments(true)
    setPayments([])
    setTotalPaid(0)
    setShowPaymentModal(false)
    setPaymentError("")

    fetch(`/api/invoices/${invoice.id}/payments`)
      .then((r) => r.json())
      .then((data: { payments: Payment[]; totalPaid: number }) => {
        setPayments(data.payments ?? [])
        setTotalPaid(data.totalPaid ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoadingPayments(false))
  }, [invoice.id])

  const balance = Number(invoice.totalAmountUsd) - totalPaid

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between pb-5 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Receipt size={24} style={{ color: theme.primaryColor }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Invoice #{invoice.id.slice(0, 8).toUpperCase()}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {invoice.studentName ?? "Unknown"} · {invoice.gradeLevel?.replace(/_/g, " ")}
            </p>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border mt-2 ${STATUS_STYLES[invoice.status]}`}>
              {React.createElement(STATUS_ICONS[invoice.status], { size: 11 })}
              {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
        {invoice.status !== "PAID" && (
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
          >
            <Plus size={14} />
            Post payment
          </button>
        )}
      </div>

      {/* Balance summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total billed", value: `$${Number(invoice.totalAmountUsd).toFixed(2)}` },
          { label: "Total paid", value: `$${totalPaid.toFixed(2)}`, color: "#3b6d11" },
          { label: "Balance due", value: `$${balance.toFixed(2)}`, color: balance > 0 ? "#a32d2d" : "#3b6d11" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-muted/40 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-base font-bold" style={color ? { color } : undefined}>{value}</p>
          </div>
        ))}
      </div>

      {/* Invoice meta */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Term", value: invoice.term.replace("_", " ") },
          { label: "Academic year", value: invoice.academicYear },
          { label: "Due date", value: new Date(invoice.dueDate).toLocaleDateString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/40 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Fee breakdown */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Fee breakdown</h4>
          <span className="text-xs text-muted-foreground">
            {(invoice.items as InvoiceItem[]).length} item{(invoice.items as InvoiceItem[]).length !== 1 ? "s" : ""}
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items as InvoiceItem[]).map((item, i) => (
              <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                <td className="px-4 py-3 text-sm text-foreground">{item.description}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground text-right">
                  ${Number(item.amountUsd).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/40 border-t border-border">
              <td className="px-4 py-3 text-sm font-semibold text-foreground">Total</td>
              <td className="px-4 py-3 text-base font-bold text-right" style={{ color: theme.primaryColor }}>
                ${Number(invoice.totalAmountUsd).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment history */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Payment history</h4>
        </div>
        {loadingPayments ? (
          <div className="p-4 space-y-2 animate-pulse">
            {[1, 2].map((i) => <div key={i} className="h-10 bg-muted rounded" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No payments recorded yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Reference</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Method</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {new Date(p.paidAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-mono">{p.reference}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {METHOD_LABELS[p.method as PaymentMethod] ?? p.method}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">
                    {p.currency} {Number(p.amountPaid).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment modal — rendered HERE at the bottom of InvoiceDetail */}
      {showPaymentModal && (
        <PostPaymentModal
          invoice={invoice}
          totalPaid={totalPaid}
          onClose={() => setShowPaymentModal(false)}
          onPaymentPosted={(payment, newStatus, newTotal) => {
            setPayments((prev) => [payment, ...prev])
            setTotalPaid(newTotal)
            onStatusChange(invoice.id, newStatus as Invoice["status"])
            setShowPaymentModal(false)
          }}
        />
      )}

    </div>
  )
}

//end of invoice detail

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
}

interface InvoiceItem {
  description: string
  amountUsd: number
}

interface Invoice {
  id: string
  studentId: string
  term: string
  academicYear: string
  items: InvoiceItem[]
  totalAmountUsd: number
  status: "UNPAID" | "PARTIAL" | "PAID"
  dueDate: string
  studentName?: string
  gradeLevel?: string
}

const emptyForm = {
  studentId: "",
  studentName: "",
  gradeLevel: "",
  term: "TERM_1",
  academicYear: "2025",
  dueDate: "",
  tuitionFee: "",
  examFee: "",
  developmentFee: "",
  sportsFee: "",
}

const STATUS_STYLES = {
  UNPAID: "bg-red-100 text-red-800 border-red-200",
  PARTIAL: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
}

const STATUS_ICONS = {
  UNPAID: AlertCircle,
  PARTIAL: Clock,
  PAID: CheckCircle,
}

function FeeStatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  shadowColor,
}: {
  label: string
  value: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  shadowColor: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute rounded-xl"
        style={{
          bottom: "-8px", left: "8px", right: "-8px",
          top: 0, zIndex: 0,
          background: `rgba(${shadowColor},0.10)`,
          borderRadius: "14px",
        }}
      />
      <div
        className="absolute rounded-xl"
        style={{
          bottom: "-4px", left: "4px", right: "-4px",
          top: 0, zIndex: 1,
          background: `rgba(${shadowColor},0.07)`,
          borderRadius: "13px",
        }}
      />
      <div
        className="relative space-y-3 p-5 transition-all duration-300"
        style={{
          zIndex: 2,
          background: hovered
            ? "radial-gradient(ellipse at 60% 0%, rgba(56,189,248,0.18) 0%, rgba(255,255,255,0.82) 60%)"
            : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: hovered
            ? "0.5px solid rgba(56,189,248,0.45)"
            : "0.5px solid rgba(255,255,255,0.6)",
          borderRadius: "14px",
          boxShadow: hovered
            ? "0 4px 24px rgba(56,189,248,0.18), 0 1px 6px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "0 2px 16px rgba(15,76,92,0.08), 0 1px 4px rgba(15,76,92,0.06)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
      </div>




    </div>
  )
}

export default function FeesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all")
  const [focused, setFocused] = useState(false)
  const { theme } = useTheme()
  const { selectedFeatures } = useFeatures()

  const [studentQuery, setStudentQuery] = useState("")
  const [studentResults, setStudentResults] = useState<Student[]>([])
  const [searchingStudents, setSearchingStudents] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices")
        const data = await res.json() as { invoices: Invoice[] }
        setInvoices(data.invoices ?? [])
      } catch {
        setError("Failed to load invoices")
      } finally {
        setFetching(false)
      }
    }
    void fetchInvoices()
  }, [])

  useEffect(() => {
    if (form.studentId) return
    if (studentQuery.length < 1) {
      setStudentResults([])
      setShowDropdown(false)
      return
    }
    const timeout = setTimeout(async () => {
      setSearchingStudents(true)
      try {
        const res = await fetch(`/api/students/search?q=${encodeURIComponent(studentQuery)}`)
        const data = await res.json() as { students: Student[] }
        setStudentResults(data.students ?? [])
        setShowDropdown(true)
      } catch {
        setStudentResults([])
      } finally {
        setSearchingStudents(false)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [studentQuery, form.studentId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function selectStudent(student: Student) {
    setForm((prev) => ({
      ...prev,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      gradeLevel: student.gradeLevel,
    }))
    setStudentQuery(`${student.firstName} ${student.lastName}`)
    setStudentResults([])
    setShowDropdown(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit() {
    if (!form.studentId) { setError("Please select a student"); return }
    setLoading(true)
    setError("")
    const items = [
      form.tuitionFee && { description: "Tuition Fee", amountUsd: parseFloat(form.tuitionFee) },
      form.examFee && { description: "Examination Fee", amountUsd: parseFloat(form.examFee) },
      form.developmentFee && { description: "Development Fee", amountUsd: parseFloat(form.developmentFee) },
      form.sportsFee && { description: "Sports Fee", amountUsd: parseFloat(form.sportsFee) },
    ].filter(Boolean) as InvoiceItem[]
    const totalAmountUsd = items.reduce((sum, i) => sum + i.amountUsd, 0)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId,
          studentName: form.studentName,
          gradeLevel: form.gradeLevel,
          term: form.term,
          academicYear: form.academicYear,
          dueDate: form.dueDate,
          items,
          totalAmountUsd,
        }),
      })
      const data = await res.json() as { invoice: Invoice; error?: string }
      if (!res.ok) { setError(data.error ?? "Failed to create invoice"); return }
      const newInvoice = { ...data.invoice, studentName: form.studentName, gradeLevel: form.gradeLevel }
      setInvoices((prev) => [newInvoice, ...prev])
      setForm(emptyForm)
      setStudentQuery("")
      setShowForm(false)
      setSelected(newInvoice)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function markAsPaid(invoiceId: string) {
    try {
      const res = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      })
      if (!res.ok) return
      setInvoices((prev) =>
        prev.map((inv) => inv.id === invoiceId ? { ...inv, status: "PAID" } : inv)
      )
      if (selected?.id === invoiceId) setSelected((prev) => prev ? { ...prev, status: "PAID" } : prev)
    } catch {
      setError("Failed to update invoice")
    }
  }

  const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.totalAmountUsd), 0)
  const totalPaid = invoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + Number(inv.totalAmountUsd), 0)
  const totalOutstanding = totalBilled - totalPaid

  const filtered = invoices
    .filter((inv) => (inv.studentName ?? "").toLowerCase().includes(search.toLowerCase()))
    .filter((inv) => {
      if (activeTab === "unpaid") return inv.status === "UNPAID" || inv.status === "PARTIAL"
      if (activeTab === "paid") return inv.status === "PAID"
      return true
    })

  const inputStyle = {
    border: `1px solid ${focused ? theme.primaryColor : "#d1d5db"}`,
    boxShadow: focused ? `0 0 0 2px ${theme.primaryColor}33` : "none",
  }

  return (

       <FeatureGate
            featureKey="fees_billing"
            featureName="Fees and Billing"
            description="Billing students and tracking their fees payment"
            selectedFeatures={selectedFeatures}
          >
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fees & Billing</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage student invoices and payments</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setSelected(null) }}
          className="flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
        >
          <Plus size={15} />
          Create invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-6 pb-3">
        {[
          { label: "Total billed", value: `$${totalBilled.toFixed(2)}`, icon: DollarSign, iconBg: "#e6f1fb", iconColor: "#185fa5", shadowColor: "15,76,92" },
          { label: "Total collected", value: `$${totalPaid.toFixed(2)}`, icon: CheckCircle, iconBg: "#eaf3de", iconColor: "#3b6d11", shadowColor: "22,101,52" },
          { label: "Outstanding", value: `$${totalOutstanding.toFixed(2)}`, icon: AlertCircle, iconBg: "#fcebeb", iconColor: "#a32d2d", shadowColor: "153,27,27" },
        ].map(({ label, value, icon, iconBg, iconColor, shadowColor }) => (
          <FeeStatCard key={label} label={label} value={value} icon={icon} iconBg={iconBg} iconColor={iconColor} shadowColor={shadowColor} />
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Split layout */}
      <div className="flex gap-4 h-[calc(100vh-280px)]">

        {/* LEFT — invoice list */}
        <div className="w-72 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(["all", "unpaid", "paid"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setSelected(null) }}
                  className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {fetching ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded w-28" />
                      <div className="h-2.5 bg-muted rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <Receipt size={26} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No invoices found</p>
              </div>
            ) : (
              filtered.map((invoice) => {
                const StatusIcon = STATUS_ICONS[invoice.status]
                return (
                  <button
                    key={invoice.id}
                    type="button"
                    onClick={() => { setSelected(invoice); setShowForm(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 last:border-0 ${
                      selected?.id === invoice.id
                        ? "bg-primary/10 border-l-2 border-l-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Receipt size={15} style={{ color: theme.primaryColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {invoice.studentName ?? "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{invoice.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusIcon
                        size={13}
                        className={
                          invoice.status === "PAID" ? "text-green-500" :
                          invoice.status === "PARTIAL" ? "text-amber-500" : "text-red-500"
                        }
                      />
                      <ChevronRight size={12} className="text-muted-foreground" />
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT — detail / form panel */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-y-auto">

          {/* Create invoice form */}
          {showForm && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Create new invoice</h3>
              <div className="space-y-4">

                {/* Student search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Student</label>
                  <div className="relative" ref={dropdownRef}>
                    <input
                      type="text"
                      value={studentQuery}
                      onChange={(e) => {
                        setStudentQuery(e.target.value)
                        setForm((prev) => ({ ...prev, studentId: "", studentName: "", gradeLevel: "" }))
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Search student by name..."
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                    {searchingStudents && (
                      <p className="text-xs text-muted-foreground mt-1">Searching...</p>
                    )}
                    {showDropdown && studentResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden">
                        {studentResults.map((student) => (
                          <button key={student.id} type="button" onClick={() => selectStudent(student)}
                            className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0">
                            <p className="text-sm font-medium text-foreground">{student.firstName} {student.lastName}</p>
                            <p className="text-xs text-muted-foreground">{student.gradeLevel.replace(/_/g, " ")}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {showDropdown && studentResults.length === 0 && !searchingStudents && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground">No students found</p>
                      </div>
                    )}
                  </div>
                  {form.studentId && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-md border"
                      style={{ backgroundColor: `${theme.primaryColor}0d`, borderColor: `${theme.primaryColor}33` }}
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold"
                        style={{ color: theme.primaryColor }}
                      >
                        {form.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{form.studentName}</p>
                        <p className="text-xs text-muted-foreground">{form.gradeLevel.replace(/_/g, " ")}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setForm((prev) => ({ ...prev, studentId: "", studentName: "", gradeLevel: "" })); setStudentQuery("") }}
                        className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                      >
                        ✕ Clear
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "term", label: "Term", type: "select", options: [{ value: "TERM_1", label: "Term 1" }, { value: "TERM_2", label: "Term 2" }, { value: "TERM_3", label: "Term 3" }] },
                  ].map(({ id, label, options }) => (
                    <div key={id} className="space-y-2">
                      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
                      <select id={id} value={form[id as keyof typeof form]} onChange={handleChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                        style={inputStyle}
                      >
                        {options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label htmlFor="academicYear" className="text-sm font-medium text-foreground">Academic year</label>
                    <input id="academicYear" type="text" value={form.academicYear} onChange={handleChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dueDate" className="text-sm font-medium text-foreground">Due date</label>
                    <input id="dueDate" type="date" value={form.dueDate} onChange={handleChange}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Fee items (USD)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "tuitionFee", label: "Tuition fee" },
                      { id: "examFee", label: "Examination fee" },
                      { id: "developmentFee", label: "Development fee" },
                      { id: "sportsFee", label: "Sports fee" },
                    ].map(({ id, label }) => (
                      <div key={id} className="space-y-2">
                        <label htmlFor={id} className="text-sm text-muted-foreground">{label}</label>
                        <input id={id} type="number" value={form[id as keyof typeof form]} onChange={handleChange}
                          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                          placeholder="0.00" min="0" step="0.01"
                          className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none"
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-muted rounded-md px-4 py-3">
                    <p className="text-sm font-medium text-foreground">Total amount</p>
                    <p className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                      ${(
                        parseFloat(form.tuitionFee || "0") +
                        parseFloat(form.examFee || "0") +
                        parseFloat(form.developmentFee || "0") +
                        parseFloat(form.sportsFee || "0")
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => void handleSubmit()} disabled={loading || !form.studentId}
                    className="py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: theme.primaryColor, color: theme.primaryText }}
                  >
                    {loading ? "Creating..." : "Create invoice"}
                  </button>
                  <button type="button"
                    onClick={() => { setShowForm(false); setForm(emptyForm); setStudentQuery("") }}
                    className="py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Invoice detail */}
       {!showForm && selected && (
  <InvoiceDetail
    invoice={selected}
    theme={theme}
    onStatusChange={(id, status) => {
      setInvoices((prev) =>
        prev.map((inv) => inv.id === id ? { ...inv, status } : inv)
      )
      setSelected((prev) => prev ? { ...prev, status } : prev)
    }}
  />
)}

          {/* Empty state */}
          {!showForm && !selected && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Receipt size={24} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Select an invoice</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click any invoice on the left to view its details
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
    </FeatureGate>
  )
}
