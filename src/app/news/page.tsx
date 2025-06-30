'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import HeaderWithMaskedNavAppointment from "@/app/appointments/HeaderWithMaskedNavAppointment";
import {cn} from "@/my-app/lib/utils";


/**
 * NewsPage – Hauptkomponente zur Anzeige aktueller Neuigkeiten von VoCare Health.
 *
 * 🚀 Funktionalität:
 * - Darstellung einer statischen Liste von News-Items mit Titel, Text und optionalem Bild
 * - Animationen für Einblenden von Überschrift und einzelnen News-Karten mit Framer Motion
 * - Responsive Grid-Layout mit TailwindCSS für verschiedene Bildschirmgrößen
 * - Nutzung der Next.js Image-Komponente für optimierte Bilddarstellung
 * - Integration des Header-Komponenten HeaderWithMaskedNavAppointment
 *
 * 🎨 Design & UX:
 * - Große, auffällige Überschrift mit Farbverlauf, Schatten und Glow-Effekt
 * - Hover-Effekt auf News-Karten für visuelles Feedback (Schattenvergrößerung)
 * - Sanfte Fade-In und Slide-Up Animationen für News-Karten mit gestaffeltem Delay
 * - Angenehmes Farbschema mit klarer Lesbarkeit und ausreichend Weißraum
 *
 * 📌 Hinweise:
 * - 'use client' aktiviert Client-Side Rendering für Interaktivität und Animationen
 * - News-Daten sind aktuell statisch definiert, können aber einfach dynamisch gemacht werden
 * - Leere Bild-URLs in newsItems verhindern Bildanzeige, können mit echten URLs ersetzt werden
 * - ACHTUNG: hier gibt nur ein error wegen die image form sollte man einfach image aussuchen dann kann man diese error besser handlen
 */



const newsItems = [
    {
        title: '🚀 Neue Funktionen veröffentlicht',
        content:
            'VoCare hat eine neue Funktion eingeführt, mit der Patienten direkt über die App mit Pflegepersonal chatten können. Kommunikation war noch nie so einfach! 💬',
        image: '',
    },
    {
        title: '🌍 Neuer Standort in München eröffnet',
        content:
            'Wir expandieren! VoCare ist jetzt auch mit einem modernen Büro in München vertreten. Willkommen im Süden! 🏢',
        image: '',
    },
    {
        title: '🤝 Partnerschaft mit MediCare AG',
        content:
            'VoCare arbeitet nun offiziell mit MediCare AG zusammen, um gemeinsam digitale Gesundheitslösungen auf die nächste Stufe zu bringen. 🔗',
        image: '',
    },
];

export default function NewsPage() {
    return (
        <div className="bg-gray-100 min-h-screen py-12 px-6">
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
                Aktuelles von VoCare Health
            </motion.h1>
            <h2 className="mb-20"></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {newsItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: index * 0.2}}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    >
                        <div className="h-48 relative">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-blue-800 mb-2">{item.title}</h2>
                            <p className="text-gray-700 text-sm">{item.content}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
