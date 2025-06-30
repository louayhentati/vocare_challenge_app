
'use client';

import Link from "next/link";
import {FaFacebookF, FaInstagram, FaLinkedin, FaTiktok} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import HeaderWithMaskedNav from './HeaderWithMaskedNav';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/my-app/lib/utils';
import React from "react";

/**
 * Home – Startseite der VoCare Kalender App.
 *
 * 🚀 Funktionalität:
 * - Zeigt eine großflächige, visuell ansprechende Willkommensseite mit Hintergrundbild
 * - Animierte Glitzereffekte (Sparkles) und ein leuchtender 3D-Text mit Framer Motion
 * - Übersichtliche Navigation über große Buttons zu den wichtigsten Unterseiten (Termine, Kategorien, Patienten)
 * - Social-Media-Icons im Footer mit Links zu Instagram, Facebook, Twitter (X), TikTok und LinkedIn
 *
 * 🎨 Design & UX:
 * - Responsive Layout mit flexbox und TailwindCSS
 * - Farbverlaufshintergrund und transparent-schwarzer Overlay für gute Lesbarkeit
 * - Animationen verbessern das Nutzererlebnis und wirken modern & dynamisch
 * - Buttons mit Hover-Effekten und sanften Skalierungen für Interaktivität
 *
 * 📌 Hinweise:
 * - 'use client' sorgt für clientseitiges Rendering und Interaktivität
 * - Link zu "/relatives" ist vorbereitet, aber aktuell auskommentiert, da diese Funktionalität evtl. noch nicht fertig oder Daten fehlen
 * - Die Komponente nutzt diverse externe Icons (react-icons und lucide-react)
 * - Utility-Funktion 'cn' wird für zusammengesetzte Tailwind-Klassen verwendet
 * - Footer bietet schnelle Links zu Social Media Plattformen für erhöhte Sichtbarkeit
 */


export default function Home() {

    return (
        <main
            className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-green-50 font-sans text-gray-800">
            <HeaderWithMaskedNav/>
            {/* Menu Section */}
            <section className="w-full h-screen bg-cover bg-center"
                     style={{backgroundImage: "url('https://i.pinimg.com/736x/23/03/44/23034473f6e9a7269dfb92b548198394.jpg')"}}>
                <div className="flex flex-col items-center justify-center h-full gap-8 bg-black/50">
                    <h2 className="mb-20"></h2>
                    <section className="relative bg-transparent text-white py-24 overflow-visible">
                        {/* Sparkles animation icon */}
                        <motion.div
                            className="absolute top-10 left-10 text-blue-500 opacity-30"
                            initial={{scale: 0}}
                            animate={{scale: [1, 1.5, 1], rotate: [0, 20, -20, 0]}}
                            transition={{duration: 3, repeat: Infinity}}
                        >
                            <Sparkles className="w-10 h-10"/>
                        </motion.div>

                        {/* Glowing, 3D Text */}
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
                            Willkommen beim VoCare Kalender
                        </motion.h1>

                        {/* Subline */}
                        <motion.p
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.3, duration: 1}}
                            className="text-center mt-6 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto"
                        >
                            Intelligente Pflegeplanung .
                            <span className="text-blue-400 font-semibold"> Digital . Einfach . Echt . </span>
                        </motion.p>
                    </section>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/appointments"
                              className="px-6 py-3 text-3xl font-bold  bg-white border border-gray-300 rounded-xl shadow hover:scale-105 hover:bg-blue-100 transition-all duration-300">
                            Termin
                        </Link>
                        <Link href="/categories"
                              className="px-6 py-3 text-3xl font-bold bg-white border border-gray-300 rounded-xl shadow hover:scale-105 hover:bg-blue-100 transition-all duration-300">
                            Kategorien
                        </Link>
                        <Link href="/patients"
                              className="px-6 py-3 text-3xl font-bold bg-white border border-gray-300 rounded-xl shadow hover:scale-105 hover:bg-blue-100 transition-all duration-300">
                            Patient
                        </Link>
                        {/* das ist für relatives falles funktioniert
                        <Link href="/relatives"
                              className="px-6 py-3 text-3xl font-bold bg-white border border-gray-300 rounded-xl shadow hover:scale-105 hover:bg-blue-100 transition-all duration-300">
                            Relatives
                        </Link> */ }
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-white shadow-inner p-4 mt-auto">
                <div className="flex justify-center gap-6 text-blue-600">
                    <Link href="https://instagram.com" target="_blank"><FaInstagram
                        className="w-6 h-6 hover:text-pink-500 transition"/></Link>
                    <Link href="https://facebook.com" target="_blank"><FaFacebookF
                        className="w-6 h-6 hover:text-blue-700 transition"/></Link>
                    <Link href="https://twitter.com" target="_blank"><FaXTwitter
                        className="w-6 h-6 hover:text-black transition"/></Link>
                    <Link href="https://tiktok.com" target="_blank"><FaTiktok
                        className="w-6 h-6 hover:text-black transition"/></Link>
                    <Link href="https://Linkedin.com" target="_blank"><FaLinkedin
                        className="w-6 h-6 hover:text-black transition"/></Link>
                </div>
            </footer>
        </main>
    );
}


