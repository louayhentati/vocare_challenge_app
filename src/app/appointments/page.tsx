'use client'

/**
 * Appointment Page – Übersicht & Darstellung von Terminen
 *
 * 🧠 Funktionalität:
 * - Lädt alle Termine aus der Datenbank (z. B. Supabase)
 * - Zeigt diese dynamisch in einem Kalender-Layout (Wochen- oder Monatsansicht)
 * - Nutzer kann neue Termine per Popup-Formular hinzufügen
 * - Jeder Termin wird visuell dargestellt mit:
 *    - Uhrzeit (Start–Ende)
 *    - Ort (Location)
 *    - Notizen (Notes)
 *
 * 🎨 Design & Usability:
 * - Termine erscheinen als farblich kodierte Blöcke, basierend auf ihrer ID
 *   → Farben kommen aus dem Array `colorClasses` und machen die Termine visuell unterscheidbar
 * - Dynamische Höhe je nach Dauer des Termins (`height`)
 *   → Kurze Events (<70px) erhalten kleinere Schriftgrößen (`text-xs`) für bessere Lesbarkeit
 * - Icons aus `lucide-react` (z. B. `Clock`, `MapPin`, `StickyNote`) ersetzen Standard-Emojis
 *   → Sorgt für ein professionelles und einheitliches UI
 * - Alle Informationen wie Uhrzeit, Ort und Notiz werden horizontal mit Icons angezeigt
 *   → Verwendung von `flex`-Layout, um Icons direkt neben dem Text darzustellen
 *
 * 💡 Zusätzliche UI-Details:
 * - Leicht transparenter Hintergrund (`bg-white/20`) mit Blur (`backdrop-blur-md`) für modernen Look
 * - Hover-Effekt mit hellerem Blau (`hover:bg-blue-200/30`) sorgt für interaktive Rückmeldung
 * - Termin hinzufügen erfolgt über zentrierten Button („+ Termin hinzufügen“) mit Modal
 *
 * 📌 Dynamische Klassen:
 * - Jede Event-Karte verwendet dynamisch berechnete Klassen:
 *   → `const color = colorClasses[parseInt(app.id) % colorClasses.length]`
 *   → `const isShortEvent = height < 70`
 *   → Diese fließen in die Hauptklasse via Template Literal:
 *     className={`event absolute left-0 right-0 ${color} ${isShortEvent ? 'text-xs' : ''}`}
 *
 * ✅ Ziel:
 * Die Seite bietet eine übersichtliche, nutzerfreundliche und visuell ansprechende Möglichkeit,
 * Termine zu verwalten, darzustellen und neue hinzuzufügen — ideal für medizinische Anwendungen.
 */

import React, {useEffect, useState} from 'react'
import 'react-calendar/dist/Calendar.css'
import  supabase  from '@/lib/supabaseClient'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';


import moment from 'moment';
import 'moment/locale/de';
import HeaderWithMaskedNavAppointment from './HeaderWithMaskedNavAppointment';
import { Clock, MapPin, StickyNote } from 'lucide-react';




const SLOT_HEIGHT = 100  ;
const START_HOUR =0    ;



type FilterView = 'week' | 'month' | 'all'


interface Appointment {
    id: string
    title: string
    start: string
    end: string
    location: string
    notes?: string
    patient?: string
    category?: string
}


export default function AppointmentPage() {
    const [view, setView] = useState<FilterView>('week')
    const [date, setDate] = useState<Date>(new Date())
    const [appointments, setAppointments] = useState<Appointment[]>([])

    const [modalOpen, setModalOpen] = useState(false)

    const [form, setForm] = useState({
        date: '',
        title: '',
        startTime: '',
        endTime: '',
        location: '',
        notes: '',
        category: '',
    })

    useEffect(() => {
        const fetchAppointments = async () => {
            const { data, error } = await supabase.from("appointments").select("*")

            if (error) {
                console.error("Fehler beim Laden der Termine:", error.message)
            } else {
                setAppointments(data)
            }
        }

        fetchAppointments()
    }, [])

    function parseGermanDate(dateString: string): Date | null {
        const [dayStr, monthStr, yearStr] = dateString.split('.');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10) - 1; // JS-Monate 0-basiert
        const year = parseInt(yearStr, 10);

        const date = new Date(year, month, day);
        // Validierung
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return date;
        }
        return null;
    }

    const [error, setError] = useState("");
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

        function handleAddAppointment() {
        setError("");
        const { date, title, startTime, endTime, location, notes } = form



        if (!date || !startTime || !endTime || !title || !location) {
            alert('Bitte alle Pflichtfelder ausfüllen!')
            return
        }



            const parsedDate = parseGermanDate(date);
            if (!parsedDate) {
                setError("❗Bitte gib das Datum im Format TT.MM.JJJJ ein.      " +
                            " Das eingegebene Datum ist ungültig");
                return;
            }


            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

            if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
                setError('❗ Bitte gib die Uhrzeit im Format HH:mm ein.');
                return;
            }
            const startDateTime = new Date(parsedDate);
            startDateTime.setHours(startHour, startMinute, 0, 0);

            const endDateTime = new Date(parsedDate);
            endDateTime.setHours(endHour, endMinute, 0, 0);

            const startISO = startDateTime.toISOString();
            const endISO = endDateTime.toISOString();

            if (startDateTime >= endDateTime) {
                setError('❗ Die eingegebene Uhrzeit ist ungültig. Die Startzeit muss vor der Endzeit liegen.');
                return;
            }

        const newAppointment: Appointment = {
            id: (appointments.length + 1).toString(),
            title,
            start: startISO,
            end: endISO,
            location,
            notes,
        }

        setAppointments((prev) => [...prev, newAppointment])
        setModalOpen(false)
        setForm({
            date: '',
            title: '',
            startTime: '',
            endTime: '',
            location: '',
            notes: '',
            category: '',
        })


    }

    function changeWeek(offset: number) {
        setDate((prevDate) => {
            const newDate = new Date(prevDate)
            newDate.setDate(prevDate.getDate() + offset * 7)
            return newDate
        })
    }

    const getFilteredAppointments = () => {
        const selectedDate = date
        let filtered: Appointment[] = []

        switch (view) {
            case 'week': {
                const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()
                const startOfWeek = new Date(selectedDate)
                startOfWeek.setDate(selectedDate.getDate() - (dayOfWeek - 1))
                startOfWeek.setHours(0, 0, 0, 0)

                const endOfWeek = new Date(startOfWeek)
                endOfWeek.setDate(startOfWeek.getDate() + 6)
                endOfWeek.setHours(23, 59, 59, 999)

                filtered = appointments.filter((app) => {
                    const appDate = new Date(app.start)
                    return appDate >= startOfWeek && appDate <= endOfWeek
                })
                break
            }
            case 'month': {
                const month = selectedDate.getMonth()
                const year = selectedDate.getFullYear()

                filtered = appointments.filter((app) => {
                    const appDate = new Date(app.start)
                    return appDate.getMonth() === month && appDate.getFullYear() === year
                })
                break
            }
            case 'all':
            default:
                filtered = appointments
        }

        return filtered.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    }

    const [filterTerm, setFilterTerm] = useState("");
    const [category, setCategory] = useState('');
    const [client, setClient] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeRange, setTimeRange] = useState('');

    const filter = appointments.filter((app) => {
        const appDate = new Date(app.start);

        //  Basis für den Monatsvergleich ist nicht "jetzt", sondern das state-gesteuerte Datum!
        const selectedMonth = date.getMonth();
        const selectedYear = date.getFullYear();

        //  Zeige nur Termine im angezeigten Monat
        if (
            view === 'month' &&
            (appDate.getMonth() !== selectedMonth || appDate.getFullYear() !== selectedYear)
        ) {
            return false;
        }

        // 🔍 Filterlogik wie gehabt
        const matchesTerm =
            app.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
            (app.notes && app.notes.toLowerCase().includes(filterTerm.toLowerCase()));

        const matchesCategory = category === '' || app.category === category;
        const matchesClient = client === '' || (app.patient && app.patient.toLowerCase().includes(client.toLowerCase()));

        const matchesStartDate = !startDate || appDate >= new Date(startDate);
        const matchesEndDate = !endDate || appDate <= new Date(endDate);

        const hour = appDate.getHours();
        const matchesTimeRange =
            timeRange === '' ||
            (timeRange === 'morning' && hour < 12) ||
            (timeRange === 'afternoon' && hour >= 12);

        return (
            matchesTerm &&
            matchesCategory &&
            matchesClient &&
            matchesStartDate &&
            matchesEndDate &&
            matchesTimeRange
        );
    });

    const filteredAppointments = getFilteredAppointments()






    return (

        <div className="min-h-screen bg-gray-100 flex flex-col">
            <HeaderWithMaskedNavAppointment/>
            <h2 className="mb-20"></h2>
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Übersicht</h1>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-xl font-semibold text-gray-600">
                    {new Date(date).toLocaleDateString('de-DE', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 rounded font-semibold ${
                            view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setView('week')}
                    >
                        Woche
                    </button>
                    <button
                        className={`px-4 py-2 rounded font-semibold ${
                            view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setView('month')}
                    >
                        Monat
                    </button>
                    <button
                        className={`px-4 py-2 rounded font-semibold ${
                            view === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setView('all')}
                    >
                        Alle
                    </button>
                </div>
            </header>

            {/* Wochen-Navigation und "Termin hinzufügen"-Button */}
            {view === 'week' && (

                <div className="p-4 flex justify-center gap-4 bg-white shadow">
                    <button
                        onClick={() => changeWeek(-1)}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        ← Vorherige Woche
                    </button>
                    <button
                        onClick={() => changeWeek(1)}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Nächste Woche →
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                        + Termin hinzufügen
                    </button>
                </div>
            )}

            {view === 'month' && (

                <div className="p-4 flex justify-center gap-4 bg-white shadow">
                    <button
                        onClick={() => changeWeek(-4)}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        ← Vorherige Monat
                    </button>
                    <button
                        onClick={() => changeWeek(4)}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Nächste Monat →
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                        + Termin hinzufügen
                    </button>
                </div>
            )}


            {view === 'all' && (
                <div className="w-full flex justify-center items-center p-4 bg-white shadow">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                        + Termin hinzufügen
                    </button>
                </div>
            )}

            {/* Modal für neuen Termin */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-black">Neuen Termin hinzufügen</h2>
                        <div className="flex flex-col gap-3">
                            <label>
                                <h2 className="text-black">Datum*:</h2>
                                <input
                                    type="text"
                                    placeholder="Termin Datum (TT.MM.JJJJ)"
                                    name="date"
                                    value={form.date}
                                    onChange={handleInputChange}
                                    className="border rounded w-full px-2 py-1 text-black"
                                />
                            </label>
                            <label>
                                <h2 className="text-black">Titel*:</h2>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleInputChange}
                                    className="border rounded w-full px-2 py-1 text-black"
                                />
                            </label>
                            <label>
                                <h2 className="text-black">Startzeit*:</h2>
                                <input
                                    type="text"
                                    placeholder="von (std:min)"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleInputChange}
                                    className="border rounded w-full px-2 py-1 text-black"
                                />
                            </label>
                            <label>
                                <h2 className="text-black">Endzeit*:</h2>
                                <input
                                    type="text"
                                    placeholder="bis (std:min)"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleInputChange}
                                    className="border rounded w-full px-2 py-1 text-black"
                                />
                            </label>
                            <label>
                                <h2 className="text-black">Ort*:</h2>
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleInputChange}
                                    className="border rounded w-full px-2 py-1 text-black"
                                />
                            </label>
                            <label>
                                <h2 className="text-black">Notizen:</h2>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleInputChange}
                                    className="border rounded w-full px-2 py-1 text-black"
                                />
                            </label>
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleAddAppointment}
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 p-6 flex flex-col md:flex-row gap-8">
                {view === 'week' ? (
                    <section className="w-full overflow-auto">
                        <div className="calendar">

                            <div className="timeline" style={{paddingTop: '50px'}}>
                                {Array.from({length: 25}, (_, i) => {
                                    const hour = 0 + i;
                                    const displayHour = hour === 24 ? '00:00' : `${hour}:00`;
                                    return (
                                        <div className="time-marker" key={i}>
                                            {displayHour} Uhr
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="days">
                                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, dayIndex) => {
                                    const dayDate = new Date(date)
                                    const currentDay = dayDate.getDay() === 0 ? 7 : dayDate.getDay()
                                    const diff = dayIndex + 1 - currentDay
                                    const thisDay = new Date(dayDate)
                                    thisDay.setDate(date.getDate() + diff)

                                    const dayAppointments = filteredAppointments.filter((app) => {
                                        const appDate = new Date(app.start)
                                        return (
                                            appDate.getDate() === thisDay.getDate() &&
                                            appDate.getMonth() === thisDay.getMonth() &&
                                            appDate.getFullYear() === thisDay.getFullYear()
                                        )
                                    })

                                    return (
                                        <div className={`day ${day.toLowerCase()}`} key={day}
                                             style={{background: 'mistyrose'}}>
                                            <div className="date">
                                                <p className="date-num">{thisDay.getDate()}</p>
                                                <p className="date-day">{day}</p>
                                            </div>
                                            <div className="events relative">
                                                {Array.from({length: 24}, (_, i) => (
                                                    <div
                                                        className="time-slot border-t border-gray-300 h-20"
                                                        key={`slot-${i}`}
                                                        style={{height: '100px'}}
                                                    ></div>
                                                ))}

                                                {dayAppointments.map((app) => {
                                                    const start = new Date(app.start)
                                                    const end = new Date(app.end)

                                                    const startHour = start.getHours() + start.getMinutes() / 60
                                                    const endHour = end.getHours() + end.getMinutes() / 60

                                                    const top = (startHour - START_HOUR) * SLOT_HEIGHT
                                                    const height = (endHour - startHour) * SLOT_HEIGHT

                                                    const colorClasses = ['corp-fi', 'ent-law', 'writing', 'securities']
                                                    const color = colorClasses[parseInt(app.id) % colorClasses.length]
                                                    const isShortEvent = height < 70

                                                    return (
                                                        <div
                                                            key={app.id}
                                                            style={{
                                                                top: `${top}px`,
                                                                height: `${height}px`,
                                                                minHeight: '60px',
                                                            }}
                                                            className={`event absolute left-0 right-0 
                                                                          ${color} 
                                                                          backdrop-blur-md  text-white 
                                                                          border border-white/30 rounded-xl px-3 py-2 shadow-md
                                                                          hover:bg-blue-300 hover:shadow-lg transition duration-200
                                                                          ${isShortEvent ? 'text-xs' : ''}`}
                                                        >
                                                            <p className="font-semibold text-white truncate">{app.title}</p>

                                                            <div className="flex items-center gap-2 text-sm mt-1">
                                                                <Clock className="w-4 h-4 text-white/80"/>
                                                                <span className="text-white">
                                                                          {start.toLocaleTimeString('de-DE', {
                                                                              hour: '2-digit',
                                                                              minute: '2-digit',
                                                                          })}{' '}
                                                                    –{' '}
                                                                    {end.toLocaleTimeString('de-DE', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </span>
                                                            </div>

                                                            {app.location && (
                                                                <div className="flex items-center gap-2 text-sm mt-1">
                                                                    <MapPin className="w-4 h-4 text-white/80"/>
                                                                    <span className="text-white">{app.location}</span>
                                                                </div>
                                                            )}

                                                            {!isShortEvent && app.notes && (
                                                                <div
                                                                    className="flex items-start gap-2 text-sm italic mt-1">
                                                                    <StickyNote
                                                                        className="w-4 h-4 text-white/80 mt-0.5"/>
                                                                    <span className="text-white/90">{app.notes}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                ) : (

                    <>
                        <div className="bg-black grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            <div className="bg-black rounded shadow p-4">
                                <h2 className="mb-10"></h2>
                                <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    locale="de"
                                    events={filteredAppointments.map(app => ({
                                        title: app.title,
                                        date: moment(app.start).format('YYYY-MM-DD'), // nur Datum
                                    }))}
                                    height="auto"
                                />
                            </div>

                            <section
                                className="text-black w-full overflow-auto bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
                                <h2 className="text-2xl font-bold text-blue-800 mb-6 tracking-tight drop-shadow-sm">
                                    {view === 'month' ? '🩺 Termine im Monat' : '📅 Alle Termine'}
                                </h2>

                                {/* Filterfeld oben */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="🔍 Nach Titel oder Notiz filtern..."
                                        className="w-full p-3 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filterTerm}
                                        onChange={(e) => setFilterTerm(e.target.value)}
                                    />
                                </div>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-blue-50 p-4 rounded-xl shadow-md">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="text-black p-2 border border-blue-300 rounded"
                                    >
                                        <option value="">Alle Kategorien</option>
                                        <option value="Arztbesuch">Arztbesuch</option>
                                        <option value="MDK-Besuch">MDK-Besuch</option>
                                        <option value="Erstgespräch">Erstgespräch</option>
                                        <option value="Default Category">Default Category</option>

                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Klient:in suchen..."
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                        className=" text-black p-2 border border-blue-300 rounded"
                                    />

                                    <select
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                        className=" text-black p-2 border border-blue-300 rounded"
                                    >
                                        <option value="">Alle Uhrzeiten</option>
                                        <option value="morning">Vormittag (00–12 Uhr)</option>
                                        <option value="afternoon">Nachmittag (12–24 Uhr)</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className=" text-black p-2 border border-blue-300 rounded"
                                    />

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className=" text-black p-2 border border-blue-300 rounded"
                                    />

                                    <button
                                        onClick={() => {
                                            setCategory('');
                                            setClient('');
                                            setStartDate('');
                                            setEndDate('');
                                            setTimeRange('');
                                        }}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                    >
                                        Filter zurücksetzen
                                    </button>
                                </div>


                                <ul className="space-y-6">
                                    {filter.length === 0 && (
                                        <p className="text-gray-500 italic">Keine Termine gefunden.</p>
                                    )}

                                    {filter.map((app) => (
                                        <li
                                            key={app.id}
                                            className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition transform hover:scale-[1.01] shadow-md border-l-8 border-blue-400"
                                        >
                                            <p className="text-xl font-bold text-blue-900 mb-1 tracking-wide uppercase">
                                                {app.title}
                                            </p>
                                            <p className="text-sm text-gray-700 mb-1">
                                                📆{' '}
                                                {new Date(app.start).toLocaleString('de-DE', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                            {app.location && (
                                                <div className="flex items-center gap-1 text-sm text-blue-700 mb-1">
                                                    <MapPin className="w-4 h-4"/>
                                                    <span>{app.location}</span>
                                                </div>
                                            )}

                                            {app.notes && (
                                                <div className="flex items-start gap-1 text-sm text-gray-800 leading-relaxed">
                                                    <StickyNote className="w-4 h-4 mt-0.5" />
                                                    <span>{app.notes}</span>
                                                </div>
                                            )}
                                </li>
                                ))}
                            </ul>
                            </section>

                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
