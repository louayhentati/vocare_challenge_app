// app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()
    const { username, password } = body

    // Admin-Test-Login
    if (username === 'admin' && password === '1234') {
        return NextResponse.json({ success: true })
    }

    // TODO: hier die Userdaten mit Supabase  validieren
    return NextResponse.json({ success: false, message: 'Benutzer nicht gefunden oder falsches Passwort.' }, { status: 401 })
}
