"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

interface Stats {
  totalStudents: number
  totalTeachers: number
  totalBilled: number
  totalCollected: number
  outstanding: number
  attendanceRate: number
  totalAttendanceRecords: number
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground shrink-0">{time}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats")
        const data = await res.json() as Stats
        setStats(data)
      } catch {
        console.error("Failed to fetch stats")
      } finally {
        setLoading(false)
      }
    }
    void fetchStats()
  }, [])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {greeting()} 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here is what is happening at your school today
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card rounded-lg border border-border p-6 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-24 mb-4" />
              <div className="h-8 bg-muted rounded w-16 mb-2" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents.toString() ?? "0"}
            description="Active enrolled students"
            icon="🎓"
          />
          <StatCard
            title="Total Teachers"
            value={stats?.totalTeachers.toString() ?? "0"}
            description="Active teaching staff"
            icon="👨‍🏫"
          />
          <StatCard
            title="Attendance Today"
            value={
              stats?.totalAttendanceRecords === 0
                ? "N/A"
                : `${stats?.attendanceRate ?? 0}%`
            }
            description={
              stats?.totalAttendanceRecords === 0
                ? "No attendance recorded today"
                : `${stats?.totalAttendanceRecords} records today`
            }
            icon="✅"
          />
          <StatCard
            title="Fees Collected"
            value={`$${(stats?.totalCollected ?? 0).toFixed(2)}`}
            description={`$${(stats?.outstanding ?? 0).toFixed(2)} outstanding`}
            icon="💰"
          />
        </div>
      )}

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="space-y-0">
            {stats?.totalStudents === 0 && stats?.totalTeachers === 0 ? (
              <ActivityItem
                title="System ready"
                description="Your school management system is set up and ready to use"
                time="Just now"
              />
            ) : (
              <>
                {(stats?.totalStudents ?? 0) > 0 && (
                  <ActivityItem
                    title="Students enrolled"
                    description={`${stats?.totalStudents} active students in the system`}
                    time="Today"
                  />
                )}
                {(stats?.totalTeachers ?? 0) > 0 && (
                  <ActivityItem
                    title="Teachers registered"
                    description={`${stats?.totalTeachers} active teachers on staff`}
                    time="Today"
                  />
                )}
                {(stats?.totalBilled ?? 0) > 0 && (
                  <ActivityItem
                    title="Invoices created"
                    description={`$${(stats?.totalBilled ?? 0).toFixed(2)} total billed to students`}
                    time="Today"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="/students"
              className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <span className="text-xl">🎓</span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Add a student
                </p>
                <p className="text-xs text-muted-foreground">
                  Enroll a new student
                </p>
              </div>
            </Link>
            <Link
              href="/teachers"
              className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <span className="text-xl">👨‍🏫</span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Add a teacher
                </p>
                <p className="text-xs text-muted-foreground">
                  Register a new teacher
                </p>
              </div>
            </Link>
            <Link
              href="/attendance"
              className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <span className="text-xl">✅</span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Record attendance
                </p>
                <p className="text-xs text-muted-foreground">
                  Mark today's attendance
                </p>
              </div>
            </Link>
            <Link
              href="/fees"
              className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <span className="text-xl">💰</span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Create an invoice
                </p>
                <p className="text-xs text-muted-foreground">
                  Bill a student for fees
                </p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}