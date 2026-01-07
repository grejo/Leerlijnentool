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
    <nav className="bg-pxl-black shadow-pxl-card border-b-4 border-pxl-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href={getDashboardLink()} className="flex items-center space-x-3">
              <div className="bg-pxl-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-pxl-black text-lg font-heading font-black">PXL</span>
              </div>
              <span className="text-xl font-heading font-black text-pxl-white">
                Leerlijnentool
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {viewAsRole && (
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-pxl-gold text-pxl-black px-3 py-1 rounded-full font-medium">
                  Weergave als: {getRoleLabel(viewAsRole)}
                </span>
                <button
                  onClick={onClearViewAs}
                  className="text-sm text-pxl-gold hover:text-pxl-white transition-colors duration-200 underline"
                >
                  Wissen
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-pxl-white">
              <span className="font-medium">{userName}</span>
              <span className="text-pxl-gold">|</span>
              <span className="text-gray-300">{getRoleLabel(userRole)}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-pxl-primary"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
