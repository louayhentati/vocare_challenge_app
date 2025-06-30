'use client';

import React, {useEffect, useState} from 'react';
import supabase from '@/lib/supabaseClient';
import {Input} from '@/my-app-2/components/ui/input';
import {Textarea} from '@/my-app-3/components/ui/textarea';
import {Button} from '@/my-app/components/ui/button';
import HeaderWithMaskedNavAppointment from "@/app/appointments/HeaderWithMaskedNavAppointment";


/**
 * PatientsPage – Hauptkomponente zur Verwaltung und Übersicht von Patienten.
 *
 * 🚀 Funktionalität:
 * - Laden der Patientendaten aus der Supabase-Datenbank beim Initialisieren (useEffect)
 * - Suchfunktion zur Filterung der Patientenliste nach Vor- und Nachname
 * - Anzeigen von Patientendetails inklusive Foto, E-Mail, Geburtsdatum, Pflegegrad, Pronomen und Aktivstatus
 * - Inline-Notizfeld (Textarea) pro Patient zur Erfassung zusätzlicher Informationen
 * - Upload und Aktualisierung von Patientenfotos via Supabase Storage (Bucket: 'photos')
 * - Formular zum Hinzufügen neuer Patienten mit allen wichtigen Feldern (Vorname, Nachname, Email, Geburtsdatum, Pflegegrad, Pronomen, Aktivstatus, Aktiv seit)
 * - Speicherung von neuen Patienten und Aktualisierung der Liste in Echtzeit
 * - Statusanzeige und Fehlerbehandlung bei Datenbank- und Upload-Operationen
 *
 * 🎨 Design & UX:
 * - Responsive und übersichtliches Layout mit TailwindCSS (Grid-System)
 * - Klare Trennung zwischen Patientenliste und neuem Patientenformular
 * - Verwendung von UI-Komponenten (Input, Textarea, Button) für konsistente Optik
 * - Benutzerfreundliche Schaltflächen mit klaren Icons und Farbfeedback
 * - Dynamisches Ein-/Ausblenden des Formulars zum Hinzufügen neuer Patienten
 *
 * 📌 Hinweise:
 * - 'use client' für clientseitige Interaktivität (useState, useEffect)
 * - Patientenfoto wird nur hochgeladen, wenn eine Datei ausgewählt wurde
 * - Photo-URL wird nach Upload aktualisiert und in der Datenbank gespeichert
 * - Notizen und Fotos werden pro Patient gespeichert und sind editierbar
 * - Neue Patienten werden mit Standardwerten initialisiert, Datum im ISO-Format
 * - Storage-Bucket muss "photos" heißen, um Fotos hochladen zu können
 * - Fehler werden per Konsole ausgegeben und per Alert angezeigt
 */


interface Patient {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    birth_date: string;
    care_level: number;
    pronoun: string;
    active: boolean;
    active_since: string;
    created_at: string;
    notes?: string;
    photo_url?: string;
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [photoFiles, setPhotoFiles] = useState<Record<string, File | null>>({});

    useEffect(() => {
        const fetchPatients = async () => {
            const {data, error} = await supabase.from('patients').select('*');
            if (error) {
                console.error('Fehler beim Laden:', error);
                return;
            }
            setPatients(data);
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((p) =>
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(search.toLowerCase())
    );
    const handleSave = async (p: Patient) => {
        const photoFile = photoFiles[p.id];
        const note = notes[p.id];

        let photoUrl = p.photo_url;

        // Bild hochladen (wenn vorhanden)
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${p.id}.${fileExt}`;
            const filePath = `patient-photos/${fileName}`;

            const {error: uploadError} = await supabase.storage
                .from('photos') // ⚠️ Storage-Bucket muss "photos" heißen
                .upload(filePath, photoFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) {
                console.error('Fehler beim Hochladen:', uploadError);
                return;
            }

            const {data: publicUrlData} = supabase
                .storage
                .from('photos')
                .getPublicUrl(filePath);

            photoUrl = publicUrlData.publicUrl;
        }

        // Datenbankeintrag aktualisieren
        const {error: updateError} = await supabase
            .from('patients')
            .update({
                notes: note,
                photo_url: photoUrl,
            })
            .eq('id', p.id);

        if (updateError) {
            console.error('Fehler beim Speichern:', updateError);
            return;
        }

        alert('✅ Änderungen gespeichert!');
    };

    const [newPatient, setNewPatient] = useState<Partial<Patient>>({
        firstname: '',
        lastname: '',
        email: '',
        birth_date: '',
        care_level: 1,
        pronoun: '',
        active: true,
        active_since: new Date().toISOString().slice(0, 10),
    });
    const [showForm, setShowForm] = useState(false);


    return (

        <div className="p-6 bg-black-100 min-h-screen">
            <HeaderWithMaskedNavAppointment/>
            <h2 className="mb-20"></h2>
            <h1 className="text-2xl text-white font-bold mb-6 text-center">⚕️ Patientenübersicht</h1>
            <div className="mb-4 max-w-md mx-auto">
                <div className="text-center mb-6">
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        ➕ Neuen Patienten hinzufügen
                    </Button>
                </div>
                {showForm && (
                    <div className="bg-white p-4 rounded-lg shadow max-w-xl mx-auto mb-8">
                        <h2 className="text-black text-lg font-semibold mb-4">📝 Neuer Patient</h2>
                        <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Vorname"
                                value={newPatient.firstname}
                                onChange={(e) => setNewPatient({...newPatient, firstname: e.target.value})}
                            />
                            <Input
                                placeholder="Nachname"
                                value={newPatient.lastname}
                                onChange={(e) => setNewPatient({...newPatient, lastname: e.target.value})}
                            />
                            <Input
                                placeholder="Email"
                                value={newPatient.email}
                                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                            />
                            <Input
                                type="date"
                                placeholder="Geburtsdatum"
                                value={newPatient.birth_date}
                                onChange={(e) => setNewPatient({...newPatient, birth_date: e.target.value})}
                            />
                            <select
                                className="w-full p-2 border border-gray-300 rounded text-black "
                                value={newPatient.pronoun}
                                onChange={(e) => setNewPatient({...newPatient, pronoun: e.target.value})}
                            >
                                <option value="">Pronomen wählen</option>
                                <option value="Herr">Herr</option>
                                <option value="Frau">Frau</option>
                                <option value="Divers">Divers</option>
                            </select>

                            <Input
                                type="number"
                                placeholder="Pflegegrad"
                                value={newPatient.care_level?.toString() || ''}
                                onChange={(e) => setNewPatient({...newPatient, care_level: parseInt(e.target.value)})}
                            />
                            <Input
                                type="date"
                                placeholder="Aktiv seit :"
                                value={newPatient.active_since?.toString() || ''}
                                onChange={(e) => {
                                    const dateStr = e.target.value;
                                    const isoDate = new Date(dateStr).toISOString().slice(0, 10); // 'YYYY-MM-DD'
                                    setNewPatient({...newPatient, active_since: isoDate});
                                }}
                            />


                        </div>
                        <div className="text-right mt-4">
                            <Button
                                onClick={async () => {
                                    const {error} = await supabase.from('patients').insert([newPatient]);
                                    if (error) {
                                        alert('❌ Fehler beim Speichern: ' + error.message);

                                        //add type of error her
                                        // extra task

                                        return;
                                    }
                                    alert('✅ Patient erfolgreich hinzugefügt!');
                                    setShowForm(false);
                                    setNewPatient({
                                        firstname: '',
                                        lastname: '',
                                        email: '',
                                        birth_date: '',
                                        care_level: 1,
                                        pronoun: '',
                                        active: true,
                                        active_since: new Date().toISOString().slice(0, 10),
                                    });

                                    //  Liste neu laden
                                    const {data, error: reloadError} = await supabase.from('patients').select('*');
                                    if (!reloadError) setPatients(data || []);
                                }}
                                className="  bg-blue-600 text-white hover:bg-blue-700"
                            >
                                📥 Patient speichern
                            </Button>
                        </div>
                    </div>
                )}

                <Input
                    placeholder="🔍 Patient nach Name suchen..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>
            <ul className="grid grid-cols-1 bg-black md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((p) => (
                    <li key={p.id} className="bg-white rounded-lg shadow p-4 space-y-2">
                        <div className="flex items-center gap-4">
                            {p.photo_url ? (
                                <img
                                    src={p.photo_url}
                                    alt="Patient"
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                            ) : (
                                <div
                                    className="w-16 h-16 bg-black-300 rounded-full flex items-center justify-center text-white">
                                    👤
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg  text-black font-semibold">
                                    {p.firstname} {p.lastname}
                                </h2>
                                <p className="text-sm text-gray-600">📧 {p.email}</p>
                                <p className="text-sm text-gray-600">🎂 {new Date(p.birth_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">🧬 Pflegegrad: {p.care_level}</p>
                                <p className="text-sm text-gray-600">👤 Pronomen: {p.pronoun}</p>
                                <p className="text-sm text-gray-600">
                                    {p.active ? '✅ Aktiv' : '❌ Inaktiv'} seit {new Date(p.active_since).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <Textarea
                            placeholder="📝 Notizen zum Patienten..."
                            value={notes[p.id] || ''}
                            onChange={(e) => setNotes({...notes, [p.id]: e.target.value})}
                            className="w-full mt-2 text-sm text-gray-600"
                        />
                        <div className="flex items-center justify-between mt-2 bg-white text-black hover:bg-gray-100 ">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhotoFiles({...photoFiles, [p.id]: e.target.files?.[0] || null})}
                            />
                            {/* Hier wird die Notiz und Datei gespeichert (Spalten: note, datei) */}
                            {/*ich will in subase ein splate note und datei hinzufügen dann kann man mehr info eintragen*/}
                            <Button
                                size="sm"
                                className="bg-white text-black hover:bg-gray-100 border border-black"
                                onClick={() => handleSave(p)}
                            >
                                💾 Speichern
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
