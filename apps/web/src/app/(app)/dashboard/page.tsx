// ============================================
// DASHBOARD PAGE
// Overview of the school's key metrics
// ============================================

import React, { useState } from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

// Stat card component
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

// Recent activity item
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
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Good morning 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here is what is happening at your school today
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="0"
          description="No students enrolled yet"
          icon="🎓"
        />
        <StatCard
          title="Total Teachers"
          value="0"
          description="No teachers added yet"
          icon="👨‍🏫"
        />
        <StatCard
          title="Attendance Today"
          value="0%"
          description="No attendance recorded yet"
          icon="✅"
        />
        <StatCard
          title="Fees Collected"
          value="$0"
          description="No payments received yet"
          icon="💰"
        />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="space-y-0">
            <ActivityItem
              title="System ready"
              description="Your school management system is set up and ready to use"
              time="Just now"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            
              <Link href="/students"
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
            
              <Link href="/teachers"
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
            
            <Link href="/fees"
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