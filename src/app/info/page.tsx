// src/app/info/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaUsers, FaQuestionCircle, FaBriefcase } from 'react-icons/fa';
import HeaderWithMaskedNavAppointment from "@/app/appointments/HeaderWithMaskedNavAppointment";
import {motion} from "framer-motion";
import {cn} from "@/my-app/lib/utils";


/**
 * InfoPage – Hauptkomponente für die Informationsseite von VoCare Health.
 *
 * 🚀 Funktionalität:
 * - Zeigt wichtige Infos zu VoCare wie Standorte, Karriere, Über uns und FAQ an
 * - Nutzt Framer Motion für eine sanfte Animation des Titels beim Laden
 * - Verwendet React Icons für aussagekräftige Symbole zu jedem Abschnitt
 * - Enthält interne Links mit Next.js Link-Komponente für clientseitige Navigation
 *
 * 🎨 Design & UX:
 * - Klare, moderne Gestaltung mit TailwindCSS (Farbverläufe, Abstände, Schriftgrößen)
 * - Farbiger Gradient-Text mit Glow-Animation im Haupttitel
 * - Strukturierte Sektionen mit Icon-Überschriften und gut lesbarem Text
 * - Responsive Gestaltung dank flexibler Schriftgrößen und Layout
 *
 * 📌 Hinweise:
 * - HeaderWithMaskedNavAppointment wird als spezieller Header eingebunden
 * - Externe Links öffnen in neuem Tab mit sicherem noreferrer-Attribut
 * - Utility-Funktion `cn` kombiniert Tailwind-Klassen für bessere Wartbarkeit
 * - Die Komponente ist als Client-Komponente markiert (‚use client‘), um Animationen und Interaktionen zu ermöglichen
 */


export default function InfoPage() {
    return (
        <div className="bg-white min-h-screen p-8 text-gray-800">
            <HeaderWithMaskedNavAppointment/>
            <h2 className="mb-20"></h2>
            <motion.h1
                initial={{opacity: 0, y: 60}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                className={cn(
                    "text-center text-4xl md:text-6xl font-extrabold uppercase tracking-wide",
                    "bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500",
                    "text-transparent bg-clip-text drop-shadow-[0_5px_10px_rgba(0,255,255,0.6)]",
                    "animate-glow-text"
                )}
            >
                Infos & Einblicke in VoCare Health
            </motion.h1>
            <h2 className="mb-20"></h2>
            <section className="mb-12">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-blue-600"/> Standorte
                </h2>
                <p>
                    Unser Hauptsitz befindet sich in Frankfurt am Main, mit weiteren Büros in München und Berlin.
                    <br/>
                    📍 <a
                    href="https://goo.gl/maps/example"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >VoCare Frankfurt – Kaiserstraße 45, 60329 Frankfurt</a>
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <FaBriefcase className="text-blue-600"/> Karriere bei VoCare
                </h2>
                <p>
                    Wir sind immer auf der Suche nach engagierten Mitarbeitenden in den Bereichen Pflege, IT und
                    Kommunikation.
                    <br/>
                    👉 <Link href="/karriere" className="text-blue-600 hover:underline">Hier bewerben</Link>
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <FaUsers className="text-blue-600"/> Über VoCare
                </h2>
                <p>
                    VoCare Health steht für Innovation, Empathie und digitale Stärke im Gesundheitsbereich. Mit einem
                    Team aus
                    über 150 Spezialist:innen arbeiten wir an Lösungen, die den Alltag von Pflegepersonal und
                    Patient:innen
                    einfacher machen.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <FaQuestionCircle className="text-blue-600"/> Häufige Fragen (FAQ)
                </h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Wie kann ich einen Termin buchen? – Über unsere App oder telefonisch unter +49 123 456 7890.
                    </li>
                    <li>Ist VoCare für Privat- und Kassenpatient:innen? – Ja, wir arbeiten mit allen Kassen.</li>
                    <li>Wie sicher sind meine Daten? – Unsere Plattform ist DSGVO-konform und mehrfach zertifiziert.
                    </li>
                </ul>
            </section>
        </div>
    );
}
