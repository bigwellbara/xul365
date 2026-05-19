"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, Printer, FileText } from "lucide-react"

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
  gender: string
}

interface ExamResult {
  id: string
  marks: number
  grade: string
  comments?: string
  exam: {
    name: string
    term: string
    academicYear: string
    gradeLevel: string
  }
  subject: {
    name: string
    code: string
  }
}

interface AttendanceSummary {
  present: number
  absent: number
  late: number
  excused: number
}

interface ReportCard {
  student: Student
  results: ExamResult[]
  attendanceSummary: AttendanceSummary
}

const GRADE_REMARKS: Record<string, string> = {
  A: "Excellent",
  B: "Very Good",
  C: "Good",
  D: "Satisfactory",
  E: "Needs Improvement",
  U: "Unsatisfactory",
}

const TERMS = ["TERM_1", "TERM_2", "TERM_3"]

export default function ReportCardsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [reportCard, setReportCard] = useState<ReportCard | null>(null)
  const [search, setSearch] = useState("")
  const [term, setTerm] = useState("TERM_1")
  const [academicYear, setAcademicYear] = useState("2025")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/students")
        const data = await res.json() as { students: Student[] }
        setStudents(data.students ?? [])
      } catch {
        setError("Failed to load students")
      } finally {
        setFetching(false)
      }
    }
    void fetchStudents()
  }, [])

  async function generateReportCard(student: Student) {
    setSelectedStudent(student)
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `/api/report-cards?studentId=${student.id}&term=${term}&academicYear=${academicYear}`
      )
      const data = await res.json() as ReportCard & { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Failed to generate report card")
        return
      }
      setReportCard(data)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // Calculate average
  const average =
    reportCard && reportCard.results.length > 0
      ? reportCard.results.reduce((sum, r) => sum + Number(r.marks), 0) /
        reportCard.results.length
      : 0

  const totalDays =
    reportCard
      ? reportCard.attendanceSummary.present +
        reportCard.attendanceSummary.absent +
        reportCard.attendanceSummary.late +
        reportCard.attendanceSummary.excused
      : 0

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-foreground">Report Cards</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and print student report cards
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Student selector */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">
            Select student
          </h3>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label htmlFor="term" className="text-xs text-muted-foreground">
                Term
              </label>
              <select
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {TERMS.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="academicYear" className="text-xs text-muted-foreground">
                Year
              </label>
              <input
                id="academicYear"
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Students list */}
          {fetching ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">No students found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filtered.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => void generateReportCard(student)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedStudent?.id === student.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.gradeLevel.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Report card */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <FileText
                size={40}
                className="mx-auto text-muted-foreground mb-3"
              />
              <p className="text-sm font-medium text-foreground">
                Select a student to generate their report card
              </p>
            </div>
          ) : loading ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Generating report card...
              </p>
            </div>
          ) : reportCard ? (
            <div className="space-y-4">

              {/* Print button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Printer size={16} />
                  Print report card
                </button>
              </div>

              {/* Report card content */}
              <div
                ref={printRef}
                id="report-card-print"
                className="bg-card rounded-lg border border-border p-8 space-y-6 print:shadow-none print:border-none"
              >

                {/* Header */}
                <div className="text-center border-b border-border pb-6">
                  <h1 className="text-2xl font-bold text-foreground">
                    Student Report Card
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {term.replace("_", " ")} — Academic Year {academicYear}
                  </p>
                </div>

                {/* Student info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Student name</p>
                      <p className="text-sm font-semibold text-foreground">
                        {reportCard.student.firstName} {reportCard.student.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Grade level</p>
                      <p className="text-sm font-semibold text-foreground">
                        {reportCard.student.gradeLevel.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm font-semibold text-foreground capitalize">
                        {reportCard.student.gender.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Overall average</p>
                      <p className="text-2xl font-bold text-primary">
                        {average.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results table */}
                {reportCard.results.length === 0 ? (
                  <div className="text-center py-8 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      No exam results found for this term
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Academic results
                    </h3>
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Subject</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Marks</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Grade</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Remarks</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportCard.results.map((result) => (
                          <tr
                            key={result.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-foreground">
                              {result.subject.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {Number(result.marks).toFixed(0)}%
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                result.grade === "A" ? "bg-green-100 text-green-800" :
                                result.grade === "B" ? "bg-blue-100 text-blue-800" :
                                result.grade === "C" ? "bg-amber-100 text-amber-800" :
                                result.grade === "D" ? "bg-orange-100 text-orange-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {result.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {GRADE_REMARKS[result.grade] ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {result.comments ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/30 border-t border-border">
                          <td className="px-4 py-3 text-sm font-semibold text-foreground">
                            Average
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-primary">
                            {average.toFixed(1)}%
                          </td>
                          <td colSpan={3} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Attendance summary */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Attendance summary
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-green-800">
                        {reportCard.attendanceSummary.present}
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">Present</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-red-800">
                        {reportCard.attendanceSummary.absent}
                      </p>
                      <p className="text-xs text-red-700 mt-0.5">Absent</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-amber-800">
                        {reportCard.attendanceSummary.late}
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">Late</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-blue-800">
                        {totalDays}
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5">Total days</p>
                    </div>
                  </div>
                </div>

                {/* Signature lines */}
                <div className="grid grid-cols-3 gap-6 border-t border-border pt-6 mt-6">
                  <div className="text-center">
                    <div className="border-b border-foreground mb-2 h-8" />
                    <p className="text-xs text-muted-foreground">Class teacher</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-foreground mb-2 h-8" />
                    <p className="text-xs text-muted-foreground">Head teacher</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-foreground mb-2 h-8" />
                    <p className="text-xs text-muted-foreground">Parent / Guardian</p>
                  </div>
                </div>

              </div>
            </div>
          ) : null}
        </div>

      </div>

    </div>
  )
}