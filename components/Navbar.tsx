'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface NavbarProps {
  userName: string
  userRole: string
  viewAsRole?: string
  onClearViewAs?: () => void
}

export default function Navbar({ userName, userRole, viewAsRole, onClearViewAs }: NavbarProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Beheerder'
      case 'DOCENT':
        return 'Docent'
      case 'STUDENT':
        return 'Student'
      default:
        return role
    }
  }

  const getDashboardLink = () => {
    const role = viewAsRole || userRole
    switch (role) {
      case 'ADMIN':
        return '/admin'
      case 'DOCENT':
        return '/docent'
      case 'STUDENT':
        return '/student'
      default:
        return '/'
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={getDashboardLink()} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Leerlijnentool</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {viewAsRole && (
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  Weergave als: {getRoleLabel(viewAsRole)}
                </span>
                <button
                  onClick={onClearViewAs}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Wissen
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span className="font-medium">{userName}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{getRoleLabel(userRole)}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
