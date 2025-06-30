'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import {motion} from 'framer-motion'


/**
 * LoginPage – Hauptkomponente für Login und Registrierung.
 *
 * 🚀 Funktionalität:
 * - Verwaltung von Login- und Registrierungs-States mit useState (Benutzername, Passwort, Registrierungsdaten)
 * - Login-Formular mit Validierung und Fehleranzeige
 * - Registrierung-Formular mit erweiterten Validierungen (Passwort-Regeln, Geburtsdatum, Passwortbestätigung)
 * - Umschalten zwischen Passwortanzeige (show/hide) für Login und Registrierung
 * - Automatisches Anzeigen des Registrierungsformulars bei fehlgeschlagenem Login
 * - Nutzung von fetch API zum Senden der Daten an `/api/login` und `/api/register`
 * - Nach erfolgreichem Login oder Registrierung Weiterleitung zur Startseite mit Next.js useRouter
 *
 * 🎨 Design & UX:
 * - Elegantes, responsives Layout mit TailwindCSS
 * - Sanfte Animationen für Einblenden mit Framer Motion (Fade-In, Slide-Up)
 * - Visuelles Feedback bei Fehlern (roter Text)
 * - Icon-basierte Sichtbarkeitsschalter für Passwörter mit Font Awesome
 * - Formularelemente mit klaren, modernen Styles und Fokuszuständen
 * - Hintergrund mit SVG-Radialverlauf und animiertem Fade-In-Effekt
 *
 * 📌 Hinweise:
 * - 'use client' für clientseitige Interaktivität (useState, Router)
 * - `registerData` hält alle Registrierungsfelder zentral zusammen
 * - Passwortvalidierung erfordert mind. 8 Zeichen, Zahl und Sonderzeichen
 * - Geburtstagsfeld erwartet Format TT.MM.JJJJ und prüft auf gültiges Datum
 * - Fehler werden dynamisch angezeigt und können das Formular blockieren
 * - Registrierung und Login senden JSON an eigene API-Routen
 * - Nach erfolgreicher Registrierung/Anmeldung erfolgt Redirect zur Hauptseite
 */


export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const router = useRouter()

    const [registerData, setRegisterData] = useState({
        sex: 'Herr',
        username: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        const data = await res.json()

        if (res.ok) {
            router.push('/')
        } else {
            setLoginError(data.message || 'Login fehlgeschlagen')
            setShowRegister(true) //
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
        if (!passwordRegex.test(registerData.password)) {
            setRegisterError('❗ Passwort muss mindestens 8 Zeichen, eine Zahl und ein Sonderzeichen enthalten.')
            return
        }

        const birthdateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!birthdateRegex.test(registerData.birthdate)) {
            setRegisterError('❗ Bitte gib dein Geburtsdatum im Format TT.MM.JJJJ ein.');
            return;
        }

        const parts = registerData.birthdate.split('.');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Monate sind 0-basiert
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);

        if (
            date.getDate() !== day ||
            date.getMonth() !== month ||
            date.getFullYear() !== year
        ) {
            setRegisterError('❗ Das eingegebene Datum ist ungültig.');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setRegisterError('❗ Passwörter stimmen nicht überein.')
            return
        }

        // 🔐 Registrierung logik (z. B. Supabase)
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
        })

        if (res.ok) {
            router.push('/') // Nach erfolgreicher Registrierung weiterleiten
        } else {
            const data = await res.json()
            setRegisterError(data.message || 'Registrierung fehlgeschlagen')
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white-100 overflow-hidden">

            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />

            {/* Hintergrund */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
                className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-100 via-green-100 to-white"
            >
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1024 768"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <radialGradient id="bg-gradient" cx="50%" cy="50%" r="75%">
                            <stop offset="0%" stopColor="#c8f4ff"/>
                            <stop offset="60%" stopColor="#b0e8d4"/>
                            <stop offset="100%" stopColor="#f0fff0"/>
                        </radialGradient>
                    </defs>
                    <rect width="1024" height="768" fill="url(#bg-gradient)"/>
                </svg>
            </motion.div>

            {/* Login Box */}
            <motion.div
                initial={{y: 40, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{type: 'spring', stiffness: 60}}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm z-10 mb-4"
            >
                <div className="h-48 flex items-center justify-center mb-4">
                    <Image
                        src="/logo.png"
                        alt="App Logo"
                        width={80}
                        height={80}
                        className="rounded-full object-contain"
                    />
                </div>

                <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1 text-sm font-medium text-gray-700"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <span
                                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
                        </div>
                    </div>

                    {loginError && <p className="text-red-600 text-sm mb-3">{loginError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </motion.div>

            {/* Registrierung */}
            {showRegister && (
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{type: 'spring', stiffness: 60}}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md z-10"
                >

                    <h2 className="text-center text-xl font-bold mb-4 text-gray-800">
                        Registrierung
                    </h2>
                    <form onSubmit={handleRegister}>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <select
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                value={registerData.sex}
                                onChange={(e) => setRegisterData({...registerData, sex: e.target.value})}
                            >
                                <option value="Herr">Herr</option>
                                <option value="Frau">Frau</option>
                                <option value="Divers">Divers</option>
                            </select>
                            <input
                                placeholder="username"
                                value={registerData.username}
                                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <input
                                placeholder="Vorname"
                                value={registerData.firstname}
                                onChange={(e) => setRegisterData({...registerData, firstname: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <input
                                placeholder="Nachname"
                                value={registerData.lastname}
                                onChange={(e) => setRegisterData({...registerData, lastname: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <input
                                type="text"
                                placeholder="GD (TT.MM.JJJJ)"
                                value={registerData.birthdate}
                                onChange={(e) =>
                                    setRegisterData({...registerData, birthdate: e.target.value})
                                }
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <input
                                placeholder="Adresse"
                                value={registerData.address}
                                onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <input
                                placeholder="E-Mail"
                                type="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                required
                            />
                            <div className="relative">
                                <input
                                    placeholder="Passwort"
                                    type={showPassword ? 'text' : 'password'}
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                            </div>

                            <div className="relative">
                                <input
                                    placeholder="Passwort bestätigen"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({
                                        ...registerData,
                                        confirmPassword: e.target.value
                                    })}
                                    className="w-full px-4 py-2 border rounded-md pr-10 text-sm font-medium text-gray-700"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                            </div>
                        </div>

                        {registerError && <p className="text-red-600 text-sm mb-3">{registerError}</p>}

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                        >
                            Registrieren
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    )
}
