'use client'


import '../globals.css'
import Link from "next/link";

/**
 * HeaderWithMaskedNav – Navigationsleiste mit Maskierungseffekt
 *
 * 🧭 Funktionalität:
 * - Stellt eine horizontale Navigationsleiste bereit, die durch das CSS-Layout `masked-nav` gestaltet ist
 * - Enthält verschiedene Navigationspunkte (z. B. Info, News, Kontakte, Login)
 * - Verwendet `Link` von `next/link` für schnelle Client-Side-Navigation
 * - Zusätzlich sind zwei Buttons am rechten Rand vorhanden (aktuell: „Search“ und „Menu“ – noch ohne Funktion)
 *
 * 🎨 Design & Struktur:
 * - `masked-nav`: eigene CSS-Klasse mit individuellen Stilen aus `globals.css`
 * - Navigation ist semantisch korrekt mit `<nav>`, `<ul>` und `<li>` aufgebaut
 * - Responsive-fähig und erweiterbar durch Flexbox-Layout (`flex`, `gap-4`, `items-center`)
 * - Dient als zentrales Element für die globale Navigation der Web-App
 *
 * 📌 Hinweise:
 * - Die Navigationspunkte kombinieren statische Links (`<a>`) und Next.js Routing (`<Link>`)
 *   → Besser wäre: **einheitlich `Link` verwenden** für konsistentes Verhalten
 * - `Search`- und `Menu`-Buttons sind vorbereitet, können später mit Popups, Suchfeld oder Menüanimation verbunden werden
 *
 * ✅ Ziel:
 * Diese Komponente liefert eine moderne, saubere und visuell fokussierte Navigationsleiste,
 * ideal für Single-Page-Applications mit klarer Struktur und Raum für Erweiterungen.
 */

export default function HeaderWithMaskedNav() {

    return (
        <>
            {/* Masked Nav */}
            <nav className="masked-nav">
                <Link href="/">Menü</Link>
                <ul className="list">
                    <li><a href="/info">Info</a></li>
                    <li><Link href="/news">News</Link></li>
                    <li><Link href="/Kontakten">Kontakte</Link></li>
                    <li><a href="#">Hilfe & Support</a></li>
                    <li><Link href="/login">Login</Link></li>
                </ul>
                <div className="flex gap-4 items-center">
                </div>

                <button className="search">Search</button>
                <button className="menu">Menu</button>
            </nav>



        </>
    )
}
