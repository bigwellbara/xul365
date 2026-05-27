// ============================================
// ROOT LAYOUT
// Wraps every page in the app
// Handles tenant branding via CSS variables
// ============================================

import type { Metadata } from "next"
import { Inter } from "next/font/google"
//import "@/styles/app.css"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"

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
         <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}