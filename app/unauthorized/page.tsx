import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pxl-white">
      <div className="max-w-md w-full text-center px-4">
        <div className="card-pxl">
          <h1 className="text-6xl font-heading font-black text-pxl-black mb-4">403</h1>
          <h2 className="text-2xl font-heading font-bold text-pxl-black mb-4">
            Geen toegang
          </h2>
          <p className="text-gray-600 mb-8">
            U heeft geen toegang tot deze pagina.
          </p>
          <Link
            href="/"
            className="btn-pxl-primary"
          >
            Terug naar dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
