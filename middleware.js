import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/auth/login' || path === '/auth/forgot-password' || path === '/auth/sign-up'
  const isProtectedPath = path === '/dashboard' || path.startsWith('/dashboard/')

  const token = request.cookies.get('accessToken')?.value

  console.log('Middleware executing for path:', path)
  console.log('Token present:', !!token)

  if (isPublicPath && token) {
    console.log('Redirecting authenticated user to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedPath && !token) {
    console.log('Redirecting unauthenticated user to login')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
