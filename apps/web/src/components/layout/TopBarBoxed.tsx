"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Bell,
  Search,
  User,
  Lock,
  HelpCircle,
  ToggleRight,
  Edit,
} from "lucide-react"

export default function TopBarBoxed() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="top-bar-boxed h-[70px] md:h-[65px] z-[51]
      border-b border-white/[0.08]
      mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0
      relative md:fixed md:inset-x-0 md:top-0
      sm:px-8 md:px-10 md:pt-10
      md:bg-gradient-to-b md:from-slate-100 md:to-transparent
      dark:md:from-darkmode-700"
    >
      <div className="h-full flex items-center justify-between">

        {/* ================= LOGO (FIXED COLOR) ================= */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={24}
            height={24}
          />

          <span className="text-slate-800 dark:text-white text-lg font-semibold">
            Xul365
          </span>
        </Link>

        {/* ================= SEARCH ================= */}
        <div className="hidden sm:flex relative mr-6">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-3 py-1 text-sm bg-transparent"
          />
          <Search className="absolute right-2 top-2 w-4 h-4 text-slate-400" />
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button className="relative">
            <Bell className="w-5 h-5 text-slate-700 dark:text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border">
            <Image
              src="/images/profile-5.jpg"
              alt="Profile"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>

          {/* Dropdown wrapper */}
          <div className="relative">

            {/* Trigger */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <User className="w-5 h-5 text-slate-700 dark:text-white" />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-darkmode-600
                border rounded-md shadow-lg p-2 z-[999]"
              >
                <div className="p-2 border-b">
                  <div className="font-medium text-sm">User Name</div>
                  <div className="text-xs text-slate-500">
                    user@email.com
                  </div>
                </div>

                <DropdownItem icon={<User size={14} />} label="Profile" />
                <DropdownItem icon={<Edit size={14} />} label="Add Account" />
                <DropdownItem icon={<Lock size={14} />} label="Reset Password" />
                <DropdownItem icon={<HelpCircle size={14} />} label="Help" />

                <hr className="my-2" />

                <DropdownItem icon={<ToggleRight size={14} />} label="Logout" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= Helper ================= */
function DropdownItem({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded cursor-pointer">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  )
}