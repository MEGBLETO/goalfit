import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req) {
  const token = req.cookies.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const { payload } = await jwtVerify(token.value, secret)

    return NextResponse.next()
  } catch (error) {
    console.error('JWT verification error:', error.message)

    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/home',
    '/profile',
    '/account',
    '/workoutplan',
    '/mealplan',
    '/subscription',
  ],
}
