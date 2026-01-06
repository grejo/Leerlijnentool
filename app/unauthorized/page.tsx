import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Geen toegang
        </h2>
        <p className="text-gray-600 mb-8">
          U heeft geen toegang tot deze pagina.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Terug naar dashboard
        </Link>
      </div>
    </div>
  )
}
