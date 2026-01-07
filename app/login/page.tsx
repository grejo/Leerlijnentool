'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

type Role = 'ADMIN' | 'DOCENT' | 'STUDENT'

interface RoleOption {
  role: Role
  title: string
  description: string
  icon: string
  color: string
  redirectTo: string
}

const roleOptions: RoleOption[] = [
  {
    role: 'ADMIN',
    title: 'Beheerder',
    description: 'Beheer gebruikers, opleidingen en alle inhoud',
    icon: '⚙️',
    color: 'bg-pxl-black hover:bg-gray-800',
    redirectTo: '/admin',
  },
  {
    role: 'DOCENT',
    title: 'Docent',
    description: 'Maak en beheer leerinhoud voor je vakken',
    icon: '📚',
    color: 'bg-pxl-green hover:bg-green-700',
    redirectTo: '/docent',
  },
  {
    role: 'STUDENT',
    title: 'Student',
    description: 'Bekijk leerlijnen en leerinhoud',
    icon: '🎓',
    color: 'bg-pxl-gold hover:bg-yellow-600',
    redirectTo: '/student',
  },
]

export default function LoginPage() {
  const [loading, setLoading] = useState<Role | null>(null)
  const [error, setError] = useState('')

  const handleRoleSelect = async (option: RoleOption) => {
    setError('')
    setLoading(option.role)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        role: option.role,
      })

      if (result?.error) {
        setError(`Login fout: ${result.error}`)
        setLoading(null)
      } else if (result?.ok) {
        // Use window.location for full page reload to avoid router issues
        window.location.href = option.redirectTo
      } else {
        setError('Onverwachte fout bij inloggen')
        setLoading(null)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pxl-white to-gray-100">
      <div className="w-full max-w-2xl px-4 py-8">
        {/* PXL Logo/Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-pxl-black rounded-2xl w-24 h-24 mb-6 shadow-lg">
            <span className="text-pxl-white text-4xl font-heading font-black">PXL</span>
          </div>
          <h1 className="text-5xl font-heading font-black text-pxl-black mb-3">
            Leerlijnentool
          </h1>
          <div className="w-20 h-1.5 bg-pxl-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 font-light">
            Selecteer je rol om verder te gaan
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 max-w-md mx-auto">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roleOptions.map((option) => (
            <button
              key={option.role}
              onClick={() => handleRoleSelect(option)}
              disabled={loading !== null}
              type="button"
              className={`
                group relative overflow-hidden rounded-2xl p-8 text-white text-left
                transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                ${option.color}
              `}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>

              <div className="relative z-10">
                <div className="text-5xl mb-4">{option.icon}</div>
                <h2 className="text-2xl font-heading font-bold mb-2">
                  {option.title}
                </h2>
                <p className="text-sm opacity-90 font-light">
                  {option.description}
                </p>

                {loading === option.role ? (
                  <div className="mt-6 flex items-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm">Laden...</span>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Klik om in te loggen →</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2026 Hogeschool PXL</p>
          <p className="mt-1 text-xs">Healthcare & Education Technology</p>
        </div>
      </div>
    </div>
  )
}
