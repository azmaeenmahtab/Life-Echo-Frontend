import { NextResponse } from 'next/server'

// Edge-runtime safe: only uses fetch + request headers, no Node/Mongo imports.
export async function proxy(request) {
    console.log("request in the proxy :", request.nextUrl.pathname)

    const cookieHeader = request.headers.get('cookie') ?? ''
    const baseUrl = process.env.BETTER_AUTH_URL || request.nextUrl.origin

    const res = await fetch(`${baseUrl}/api/auth/get-session`, {
        headers: { cookie: cookieHeader },
        cache: 'no-store',
    })

    const session = res.ok ? await res.json() : null

    if (!session) {
        console.log("no session, directing to log in")
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    console.log("proxy passed")
    return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request) { ... }
 
export const config = {
  matcher: 
  [
    '/dashboard/add-lesson',
    '/dashboard/my-lessons',
    '/pricing'

  ],
}