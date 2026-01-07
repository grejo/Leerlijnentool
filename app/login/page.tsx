'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pxl-white">
      <div className="w-full max-w-md px-4">
        {/* PXL Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-pxl-black rounded-full w-20 h-20 flex items-center justify-center mb-6">
            <span className="text-pxl-white text-3xl font-heading font-black">PXL</span>
          </div>
          <h1 className="text-4xl font-heading font-black text-pxl-black mb-2">
            Leerlijnentool
          </h1>
          <div className="w-16 h-1 bg-pxl-gold mx-auto mb-4"></div>
          <p className="text-pxl-black font-light">
            Log in met uw gegevens
          </p>
        </div>

        {/* Login Card */}
        <div className="card-pxl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Fout</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="label-pxl">
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-pxl"
                placeholder="naam@voorbeeld.nl"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-pxl">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-pxl"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-pxl-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Bezig met inloggen...' : 'Inloggen'}
              </button>
            </div>
          </form>
        </div>

        {/* Admin Credentials Info */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-pxl-black mb-2">
              Standaard admin login:
            </p>
            <p className="text-sm font-mono text-gray-600">
              admin@leerlijnentool.nl
            </p>
            <p className="text-sm font-mono text-gray-600">
              admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Hogeschool PXL</p>
        </div>
      </div>
    </div>
  )
}
