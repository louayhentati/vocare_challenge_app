'use client'


import './globals.css'
import Link from 'next/link';

/**
 * HeaderWithMaskedNav – Navigationsleiste mit Maskierungseffekt.
 *
 * 🧭 Funktionalität:
 * - Einfaches Navigationsmenü mit Links zu wichtigen Seiten: Info, News, Kontakte, Hilfe & Support, Login
 * - Mischung aus normalen <a>-Tags und Next.js Link-Komponenten für clientseitiges Routing
 * - Zwei Buttons: "Search" und "Menu" (derzeit ohne Funktion, Platzhalter für zukünftige Features)
 *
 * 🎨 Design & UX:
 * - Nutzt CSS-Klasse "masked-nav" für speziellen Maskierungseffekt (Stil in globals.css definiert)
 * - Liste mit Navigationspunkten als horizontale/vertikale Liste (abhängig vom Styling)
 * - Klare und simple Struktur für schnelle Orientierung im Header
 *
 * 📌 Hinweise:
 * - 'use client' ist gesetzt für Client-Side Interaktivität (z.B. bei Erweiterung mit Button-Events)
 * - Verwendet sowohl klassische Links als auch Next.js Link für Routing, evtl. zur Vereinheitlichung anpassen
 * - Buttons sind aktuell nur visuelle Platzhalter ohne Logik (können später für Suche oder mobiles Menü erweitert werden)
 */

export default function HeaderWithMaskedNav() {
    return (
        <>
            {/* Masked Nav */}
            <nav className="masked-nav">
                <a href="#">Menü</a>
                <ul className="list">
                    <li><a href="/info">Info</a></li>
                    <li><Link href="/news">News</Link></li>
                    <li><Link href="/Kontakten">Kontakte</Link></li>
                    <li><a href="#">Hilfe & Support</a></li>
                    <li><Link href="/login">Login</Link></li>
                </ul>

                <button className="search">Search</button>
                <button className="menu">Menu</button>
            </nav>


        </>


    )
}
