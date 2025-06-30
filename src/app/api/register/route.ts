// app/api/register/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()
    const {
        sex, firstname, lastname, birthdate,
        address, email, password
    } = body

    // → Hier kannst du später in Supabase speichern
    console.log('Neuer Benutzer:', body)

    // Testweise Antwort
    return NextResponse.json({ success: true, message: 'Registrierung erfolgreich' })
}
