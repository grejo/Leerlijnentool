export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/docent/:path*',
    '/student/:path*',
  ],
}
