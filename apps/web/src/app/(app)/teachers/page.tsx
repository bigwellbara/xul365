// ============================================
// TEACHERS PAGE
// List of all teachers with search and filter
// ============================================

import React, { useState } from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teachers",
}

// Placeholder data — will be replaced with real DB data later
const placeholderTeachers = [
  {
    id: "1",
    firstName: "Tendai",
    lastName: "Chirwa",
    email: "t.chirwa@school.com",
    phone: "+263 77 111 2222",
    subjects: ["Mathematics", "Physics"],
    status: "active",
  },
  {
    id: "2",
    firstName: "Rudo",
    lastName: "Sithole",
    email: "r.sithole@school.com",
    phone: "+263 71 333 4444",
    subjects: ["English", "History"],
    status: "active",
  },
  {
    id: "3",
    firstName: "Blessing",
    lastName: "Gumbo",
    email: "b.gumbo@school.com",
    phone: "+263 78 555 6666",
    subjects: ["Biology", "Chemistry"],
    status: "inactive",
  },
]

export default function TeachersPage() {
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all teaching staff
          </p>
        </div>
        
        <Link 
        href="/teachers/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add Teacher
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search teachers..."
          className="flex-1 max-w-sm px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Teachers grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {placeholderTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-card border border-border rounded-lg p-5 space-y-4"
          >
            {/* Teacher header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{teacher.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  teacher.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {teacher.status}
              </span>
            </div>

            {/* Subjects */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>📞</span>
              <span>{teacher.phone}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link 
                href={`/teachers/${teacher.id}`}
                className="flex-1 text-center py-1.5 border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                View Profile
              </Link>
              
               <Link href={`/teachers/${teacher.id}/edit`}
                className="flex-1 text-center py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {placeholderTeachers.length === 0 && (
        <div className="bg-card border border-border rounded-lg py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No teachers yet. Add your first teacher to get started.
          </p>
        </div>
      )}

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        Showing {placeholderTeachers.length} teachers
      </p>

    </div>
  )
}