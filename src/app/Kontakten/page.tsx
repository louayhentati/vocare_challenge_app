'use client';

import React, { useState } from 'react';
import { Input } from '@/my-app-2/components/ui/input';
import { Textarea } from '@/my-app-3/components/ui/textarea';
import { Button } from '@/my-app/components/ui/button';
import Link from 'next/link';
import HeaderWithMaskedNavAppointment from "@/app/appointments/HeaderWithMaskedNavAppointment";
import {FaFacebookF, FaInstagram, FaLinkedin, FaTiktok} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import {motion} from "framer-motion";
import {cn} from "@/my-app/lib/utils";
import { Mail } from 'lucide-react';
import { MdPhone } from 'react-icons/md';


/**
 * Kontakten – Hauptkomponente für die Kontaktseite von VoCare Health.
 *
 * 🚀 Funktionalität:
 * - Verwaltung eines Kontaktformular-States mit useState (Vorname, Nachname, E-Mail, Telefon, Nachricht)
 * - handleChange aktualisiert den State bei Eingaben in Input- und Textarea-Feldern
 * - handleSubmit simuliert das Abschicken des Formulars (aktuell nur console.log und Alert)
 *
 * 🎨 Design & UX:
 * - Moderne, klare Formularelemente mit TailwindCSS und vorgefertigten UI-Komponenten (Input, Textarea, Button)
 * - Framer Motion für sanfte Animation des Titels beim Laden
 * - Farbiger Gradient-Text mit Glow-Effekt im Haupttitel
 * - Kontaktinformationen (E-Mail, Telefon) mit Icons und klickbaren Links im Footer-Bereich
 * - Social Media Icons mit Hover-Animationen und externen Links zu den jeweiligen Plattformen
 *
 * 📌 Hinweise:
 * - HeaderWithMaskedNavAppointment wird als Header eingebunden
 * - Formular ist noch ohne echte Backend-Anbindung (Kommentar bei handleSubmit)
 * - Verwendung von Next.js Link-Komponente für clientseitige Navigation zu Social-Media-Links
 * - Utility-Funktion `cn` zur besseren Verwaltung der Tailwind-Klassen
 * - Komponente als Client-Komponente (‚use client‘), um Formularinteraktion und Animationen zu ermöglichen
 */


export default function Kontakten() {
    const [form, setForm] = useState({
        vorname: '',
        nachname: '',
        email: '',
        telefon: '',
        nachricht: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        // Hier formular zu subase senden
        console.log('Formular abgeschickt:', form);
        alert('Vielen Dank für deine Nachricht!');
    };

    return (
        <div className="p-8 max-w-3xl mx-auto text-black bg-white min-h-screen">
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
                Kontaktieren Sie VoCare Health
            </motion.h1>
            <h2 className="mb-20"></h2>

            <p className="text-gray-700 mb-8 text-center">
                VoCare Health ist ein modernes Gesundheitsunternehmen, das sich auf digitale Lösungen für Pflege,
                Diagnostik und Patientenkommunikation spezialisiert hat.
                Unser Ziel ist es, Technologie und Menschlichkeit zu verbinden – für eine bessere Gesundheitsversorgung
                von morgen.
            </p>

            <div className="mb-6 space-y-4">
                <Input
                    placeholder="Vorname"
                    name="vorname"
                    value={form.vorname}
                    onChange={handleChange}
                />
                <Input
                    placeholder="Nachname"
                    name="nachname"
                    value={form.nachname}
                    onChange={handleChange}
                />
                <Input
                    placeholder="E-Mail"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <Input
                    placeholder="Telefonnummer"
                    name="telefon"
                    value={form.telefon}
                    onChange={handleChange}
                />
                <Textarea
                    placeholder="Ihre Frage oder Nachricht..."
                    name="nachricht"
                    value={form.nachricht}
                    onChange={handleChange}
                />
                <Button onClick={handleSubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                     Abschicken
                </Button>
            </div>

            <div className="border-t pt-6 mt-10 text-center text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600"/>
                    E-Mail:
                    <a href="mailto:info@vocare-health.de" className="text-blue-600 hover:underline">
                        info@vocare-health.de
                    </a>
                </p>
                <p className="flex items-center gap-2">
                    <MdPhone className="text-blue-600 w-5 h-5"/>
                    Telefon:
                    <a href="tel:+491234567890" className="text-blue-600 hover:underline">
                        +49 123 456 7890
                    </a>
                </p>
                <h2 className="mb-5"></h2>
            </div>
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
        </div>
    );
}
