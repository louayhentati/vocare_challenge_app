'use client';

import { useEffect, useState } from 'react';
import  supabase  from '@/lib/supabaseClient';

/**
 * RelativesPage – Übersichtskomponente zur Anzeige von Angehörigen.
 *
 * 🚀 Funktionalität:
 * - Laden der Angehörigendaten aus der Supabase-Datenbank beim Initialisieren (useEffect)
 * - Anzeige einer Liste mit Vorname, Nachname und Notizen zu jedem Angehörigen
 * - Fehlerbehandlung beim Laden der Daten mit Konsolenausgabe
 *
 * 🎨 Design & UX:
 * - Einfaches, klares Layout mit TailwindCSS
 * - Abstand und Rahmen um Listeneinträge für bessere Lesbarkeit
 *
 * 📌 Hinweise:
 * - 'use client' für clientseitige Interaktivität (useState, useEffect)
 * - Die Supabase-Abfrage zur Tabelle 'relatives' ist implementiert,
 *   aber da bisher keine passende Tabelle oder Struktur in der Datenbank existiert,
 *   ist die Funktionalität noch nicht vollständig getestet oder im Einsatz.
 * - Fehlermeldung wird momentan nur in der Konsole ausgegeben; visuelles Fehlerhandling ist minimal.
 * - Erweiterungen (z.B. Bearbeiten, Hinzufügen von Angehörigen) sind aktuell nicht implementiert.
 */


type Relative = {
    id: string;
    firstname: string;
    lastname: string;
    notes: string;
};

export default function RelativesPage() {
    const [relatives, setRelatives] = useState<Relative[]>([]);

    useEffect(() => {
        const fetchRelatives = async () => {
            const { data, error } = await supabase.from('relatives').select('*');
            if (error) {
                console.error('Fehler beim Laden:', JSON.stringify(error, null, 2));
                return <p className="text-red-500">Fehler beim Laden der Termine</p>;
            } else {
                setRelatives(data);
            }
        };

        fetchRelatives();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Angehörige</h1>
            <ul className="space-y-2">
                {relatives.map((r) => (
                    <li key={r.id} className="p-3 border rounded">
                        {r.firstname} {r.lastname} – {r.notes}
                    </li>
                ))}
            </ul>
        </div>
    );
}
