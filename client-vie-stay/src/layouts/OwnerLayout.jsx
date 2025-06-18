"use client"

import { Outlet, Link, useLocation } from "react-router-dom"
import { Building2, Home, Plus, BarChart3, Settings, User, Bell, Menu, X } from "lucide-react"
import { useState } from "react"

function OwnerLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/owner", icon: Home, current: location.pathname === "/owner" },
    {
      name: "Nhà trọ",
      href: "/owner/accommodations",
      icon: Building2,
      current: location.pathname.includes("/accommodations"),
    },
    { name: "Tạo mới", href: "/owner/create", icon: Plus, current: location.pathname.includes("/create") },
    { name: "Thống kê", href: "/owner/analytics", icon: BarChart3, current: location.pathname.includes("/analytics") },
    { name: "Cài đặt", href: "/owner/settings", icon: Settings, current: location.pathname.includes("/settings") },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">VieStay</h1>
              <p className="text-xs text-gray-500">Owner Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.current
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${item.current ? "text-blue-600" : "text-gray-400"}`} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">VieStay</h1>
              <p className="text-xs text-gray-500">Owner Portal</p>
            </div>
          </div>

          <nav className="flex-1 mt-6 px-3">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        item.current
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${item.current ? "text-blue-600" : "text-gray-400"}`} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Chủ nhà</p>
                <p className="text-xs text-gray-500">owner@viestay.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Chủ nhà</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OwnerLayout
