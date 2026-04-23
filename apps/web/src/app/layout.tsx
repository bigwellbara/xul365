// ============================================
// ROOT LAYOUT
// Wraps every page in the app
// Handles tenant branding via CSS variables
// ============================================

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Xul365 - School Management System",
    template: "%s | Xul365",
  },
  description: "Modern school management system for Zimbabwe",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}