'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Program {
  id: string
  name: string
}

interface UserProgram {
  program: Program
}

interface User {
  id: string
  email: string
  role: string
  createdAt: string
  programs: UserProgram[]
}

export default function UsersManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'STUDENT',
    programIds: [] as string[],
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchUsers()
    fetchPrograms()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const res = await fetch('/api/programs')
      const data = await res.json()
      setPrograms(data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        email: user.email,
        password: '',
        role: user.role,
        programIds: user.programs.map((up) => up.program.id),
      })
    } else {
      setEditingUser(null)
      setFormData({
        email: '',
        password: '',
        role: 'STUDENT',
        programIds: [],
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      email: '',
      password: '',
      role: 'STUDENT',
      programIds: [],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingUser) {
        // Update user
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij bijwerken gebruiker')
          return
        }
      } else {
        // Create user
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij aanmaken gebruiker')
          return
        }
      }

      await fetchUsers()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Fout bij verwijderen gebruiker')
        return
      }

      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleProgramToggle = (programId: string) => {
    setFormData((prev) => ({
      ...prev,
      programIds: prev.programIds.includes(programId)
        ? prev.programIds.filter((id) => id !== programId)
        : [...prev.programIds, programId],
    }))
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

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Terug naar dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Gebruikersbeheer</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nieuwe gebruiker
          </button>
        </div>

        {loading && users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Laden...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opleidingen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getRoleLabel(user.role)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.programs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.programs.map((up) => (
                            <span
                              key={up.program.id}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {up.program.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Geen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Verwijderen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingUser ? 'Gebruiker bewerken' : 'Nieuwe gebruiker'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wachtwoord {editingUser && '(laat leeg om niet te wijzigen)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editingUser}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="DOCENT">Docent</option>
                      <option value="ADMIN">Beheerder</option>
                    </select>
                  </div>

                  {formData.role === 'DOCENT' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Toegewezen opleidingen
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {programs.map((program) => (
                          <label key={program.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.programIds.includes(program.id)}
                              onChange={() => handleProgramToggle(program.id)}
                              className="mr-2"
                            />
                            <span className="text-sm">{program.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Opslaan...' : 'Opslaan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
