
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    GraduationCap,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Sparkles,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

function Login() {
    const navigate = useNavigate()
    const { signIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setLoading(true)

        try {
            await signIn(email.trim(), password)
            navigate('/dashboard', { replace: true })
        } catch (err) {
            setError(err.message || 'Unable to sign in.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-dvh items-center justify-center bg-[#EFF2F8] p-4 font-['DM_Sans',sans-serif] sm:p-6">

            <div className="grid w-full max-w-262.5 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(35,45,75,0.09)] lg:min-h-[640px] lg:grid-cols-[1fr_1fr]">

                {/* --------------------------------
            Left: Brand panel
        -------------------------------- */}

                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#E6F3F7] p-10 lg:flex xl:p-12">

                    {/* Decorative circles */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border-65 border-white/30"
                    />

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-36 -left-28 h-80 w-80 rounded-full bg-[#B9E6EA]/40"
                    />

                    {/* Brand */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#202027] text-white">
                            <GraduationCap size={24} strokeWidth={2.2} />
                        </div>

                        <span className="font-['Space_Grotesk',sans-serif] text-[25px] font-bold tracking-[-0.06em] text-[#202027]">
                            Stud<span className="text-[#5687CC]">ORA</span>
                        </span>
                    </div>

                    {/* Main illustration */}
                    <div className="relative z-10 my-12">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C5DCE5] bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-[#4D7A90]">
                            <Sparkles size={14} />
                            YOUR STUDENT WORKSPACE
                        </div>

                        <h1 className="max-w-100 font-['Space_Grotesk',sans-serif] text-[39px] font-bold leading-[1.13] tracking-[-0.055em] text-[#202027] xl:text-[44px]">
                            Your space to
                            <br />
                            learn, plan
                            <br />
                            <span className="text-[#5687CC]">& grow.</span>
                        </h1>

                        <p className="mt-5 max-w-87.5 text-sm leading-7 text-[#617B8A]">
                            Keep your courses, schedules, assignments
                            and tasks together in one beautiful workspace.
                        </p>

                        {/* Decorative productivity cards */}
                        <div className="relative mt-10 max-w-95">

                            <div className="-rotate-3 rounded-[20px] border border-white/70 bg-white/90 p-4 shadow-[0_12px_35px_rgba(48,91,110,0.08)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DFF5F1] text-[#378D82]">
                                            <BookOpen size={19} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-[#202027]">
                                                My Courses
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-[#949AA5]">
                                                Your learning journey
                                            </p>
                                        </div>
                                    </div>

                                    <CheckCircle2
                                        size={19}
                                        className="text-[#65BCA5]"
                                    />
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <div className="h-2 flex-5 rounded-full bg-[#9DDDD8]" />
                                    <div className="h-2 flex-3 rounded-full bg-[#B9C9FA]" />
                                    <div className="h-2 flex-2 rounded-full bg-[#E4D3F5]" />
                                </div>
                            </div>

                            <div className="relative ml-12 -mt-1 rotate-3 rounded-[17px] border border-white/70 bg-[#B9C9FA] p-4 shadow-[0_12px_30px_rgba(48,91,110,0.07)]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-[#526BC6]">
                                        <CalendarDays size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-[#202027]">
                                            Stay on schedule
                                        </p>
                                        <p className="mt-1 text-[11px] text-[#53658E]">
                                            Every class. Every deadline.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-[#75909F]">
                        A little progress every day adds up.
                    </p>
                </div>

                {/* --------------------------------
            Right: Login form
        -------------------------------- */}

                <div className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-16">

                    {/* Mobile brand */}
                    <div className="mb-10 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202027] text-white">
                            <GraduationCap size={22} />
                        </div>

                        <span className="font-['Space_Grotesk',sans-serif] text-[23px] font-bold tracking-tight">
                            Stud<span className="text-[#5687CC]">ORA</span>
                        </span>
                    </div>

                    <div className="mb-8">
                        <div className="mb-4 inline-flex rounded-full bg-[#EAF1FF] px-3 py-1.5 text-[11px] font-semibold text-[#5575B6]">
                            WELCOME BACK
                        </div>

                        <h2 className="font-['Space_Grotesk',sans-serif] text-[32px] font-bold tracking-tighter text-[#202027] sm:text-[36px]">
                            Sign in to StudORA.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#969BA8]">
                            Pick up where you left off.
                            Your study workspace is waiting.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-[13px] font-semibold text-[#353846]"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A8B5]"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-[13px] border border-[#E4E8EF] bg-[#FBFCFE] py-3.5 pl-12 pr-4 text-sm text-[#202027] outline-none transition focus:border-[#688DE8] focus:ring-4 focus:ring-[#688DE8]/10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="password"
                                    className="text-[13px] font-semibold text-[#353846]"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-[#567ACB] transition hover:text-[#3858A4] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A8B5]"
                                />

                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full rounded-[13px] border border-[#E4E8EF] bg-[#FBFCFE] py-3.5 pl-12 pr-12 text-sm text-[#202027] outline-none transition focus:border-[#688DE8] focus:ring-4 focus:ring-[#688DE8]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    aria-pressed={showPassword}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9DA3AF] transition hover:text-[#526BC6]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-[13px] bg-[#202027] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#383844] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="mt-7 text-center text-[13px] text-[#9297A3]">
                        New to StudORA?{' '}
                        <Link
                            to="/register"
                            className="font-bold text-[#526BC6] hover:underline"
                        >
                            Create an account
                        </Link>
                    </p>

                    <div className="mt-10 border-t border-[#EEF0F4] pt-6">
                        <p className="text-center text-[11px] text-[#B0B4BE]">
                            StudORA — Your personal learning workspace
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
