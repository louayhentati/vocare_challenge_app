'use client';
import React, {JSX, useEffect, useState} from 'react';
import supabase from '@/lib/supabaseClient';
import { CalendarDays, HeartPulse, Users } from 'lucide-react';
import HeaderWithMaskedNavAppointment from "@/app/appointments/HeaderWithMaskedNavAppointment";
import {motion} from "framer-motion";
import {cn} from "@/my-app/lib/utils";

type Category = {
    id: string;
    label: string;
    description: string;
    color: string;
    icon: string;
    created_at: string;
    updated_at: string;
};

const iconMap: Record<string, JSX.Element> = {
    arzt: <HeartPulse className="text-red-600" />,
    apotheke: <CalendarDays className="text-blue-600" />,
    angehörige: <Users className="text-green-600" />,
};

/**
 * CategoriesPage – Hauptkomponente für die Anzeige der Kategorienübersicht.
 *
 * 🚀 Funktionalität:
 * - Lädt Kategorien aus der Supabase-Datenbank via useEffect beim Initial-Render
 * - Speichert die geladenen Kategorien im State
 * - Zeigt eine responsive Grid-Liste der Kategorien mit dynamischen Icons, Farben und Daten an
 *
 * 🎨 Design & UX:
 * - Nutzt TailwindCSS für modernes, klares Styling
 * - Animation mit Framer Motion beim Titel (sanftes Einblenden und Hochfahren)
 * - Farbiger Rand und Punkt zur Hervorhebung der Kategorie-Farbe
 * - Übersichtlich mit Datum für Erstellungs- und Änderungszeitpunkt
 *
 * 📌 Hinweise:
 * - iconMap kann bei neuen Kategorien erweitert werden
 * - Fallback-Icon als Emoji, falls kein Icon definiert ist
 * - Error Handling bei Datenbank-Fehlern (console.error)
 */

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) {
                console.error('Fehler beim Laden:', error.message);
                return;
            }
            setCategories(data);
        };
        fetchCategories();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
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
                Kategorienübersicht
            </motion.h1>
            <h2 className="mb-20"></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-white shadow-md rounded-2xl p-5 border-l-4"
                        style={{borderColor: cat.color}}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Dynamisches Icon */}
                                <div className="text-2xl">
                                    {iconMap[cat.icon?.toLowerCase?.()] ?? '📁'}
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">{cat.label}</h2>
                            </div>
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{backgroundColor: cat.color}}
                                title={cat.color}
                            ></span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
                        <p className="text-xs text-gray-400">
                            Erstellt: {new Date(cat.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                            Geändert: {new Date(cat.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
