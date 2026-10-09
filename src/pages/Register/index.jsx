
import { useState } from 'react'
import { Link } from 'react-router-dom'
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

function Register() {
    const { signUp } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setMessage('')

        if (password.length < 8) {
            setError('Password must contain at least 8 characters.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            const data = await signUp(email.trim(), password)

            if (data?.session) {
                setMessage(
                    'Your account is ready to use.'
                )
            } else {
                setMessage(
                    'If this email is new, you will receive a confirmation link. Already have an account? You can sign in or reset your password.'
                )
            }

            setPassword('')
            setConfirmPassword('')
        } catch (err) {
            setError(err.message || 'Unable to create account.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-dvh items-center justify-center bg-[#EFF2F8] p-4 font-['DM_Sans',sans-serif] sm:p-6">
            <div className="grid w-full max-w-262.5 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(35,45,75,0.09)] lg:min-h-170 lg:grid-cols-2">

                {/* Left Brand Panel */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#E6F3F7] p-10 lg:flex xl:p-12">

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border-65 border-white/30"
                    />

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-36 -left-28 h-80 w-80 rounded-full bg-[#B9E6EA]/40"
                    />

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#202027] text-white">
                            <GraduationCap size={24} />
                        </div>

                        <span className="font-['Space_Grotesk',sans-serif] text-[25px] font-bold tracking-tight text-[#202027]">
                            Stud<span className="text-[#5687CC]">ORA</span>
                        </span>
                    </div>

                    <div className="relative z-10 my-12">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C5DCE5] bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-[#4D7A90]">
                            <Sparkles size={14} />
                            YOUR STUDENT WORKSPACE
                        </div>

                        <h1 className="max-w-100 font-['Space_Grotesk',sans-serif] text-[39px] font-bold leading-[1.13] tracking-[-0.055em] text-[#202027] xl:text-[44px]">
                            Make room for
                            <br />
                            your <span className="text-[#5687CC]">best work.</span>
                        </h1>

                        <p className="mt-5 max-w-87.5 text-sm leading-7 text-[#617B8A]">
                            Build better study habits, stay on top of
                            deadlines, and bring all your academic plans
                            into one space.
                        </p>

                        {/* Feature Cards */}
                        <div className="mt-10 max-w-95 space-y-3">

                            <div className="flex -rotate-2 items-center gap-3 rounded-[18px] border border-white/80 bg-white/90 p-4 shadow-[0_10px_30px_rgba(48,91,110,0.08)]">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DFF5F1] text-[#378D82]">
                                    <BookOpen size={20} />
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs font-bold text-[#202027]">
                                        Organize your courses
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#949AA5]">
                                        Everything in one workspace
                                    </p>
                                </div>

                                <CheckCircle2 size={19} className="text-[#65BCA5]" />
                            </div>

                            <div className="ml-8 flex rotate-2 items-center gap-3 rounded-[18px] bg-[#B9C9FA] p-4 shadow-[0_10px_30px_rgba(48,91,110,0.06)]">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#526BC6]">
                                    <CalendarDays size={20} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-[#202027]">
                                        Never miss a deadline
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#53658E]">
                                        Stay focused and prepared
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-[#75909F]">
                        A little progress every day adds up.
                    </p>
                </div>

                {/* Right Registration Form */}
                <div className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-16">

                    {/* Mobile Brand */}
                    <div className="mb-10 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202027] text-white">
                            <GraduationCap size={22} />
                        </div>

                        <span className="font-['Space_Grotesk',sans-serif] text-[23px] font-bold tracking-tight text-[#202027]">
                            Stud<span className="text-[#5687CC]">ORA</span>
                        </span>
                    </div>

                    <div className="mb-7">
                        <div className="mb-4 inline-flex rounded-full bg-[#EAF1FF] px-3 py-1.5 text-[11px] font-semibold text-[#5575B6]">
                            GET STARTED
                        </div>

                        <h2 className="font-['Space_Grotesk',sans-serif] text-[32px] font-bold tracking-tighter text-[#202027] sm:text-[36px]">
                            Create your account.
                        </h2>

                        <p className="mt-2 text-sm text-[#969BA8]">
                            Start planning your academic life with StudORA.
                        </p>
                    </div>

                    {message ? (
                        <div role="status" className="rounded-2xl border border-[#CFE9DE] bg-[#EDF8F2] p-5">
                            <CheckCircle2 size={28} className="text-[#43A782]" />

                            <h3 className="mt-3 font-bold text-[#202027]">
                                Registration submitted
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#47725F]">
                                {message}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-5">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#526BC6] hover:underline"
                                >
                                    Go to Login
                                    <ArrowRight size={16} />
                                </Link>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-[#526BC6] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-[#353846]">
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A8B5]" />

                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-[13px] border border-[#E4E8EF] bg-[#FBFCFE] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#688DE8] focus:ring-4 focus:ring-[#688DE8]/10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-[#353846]">
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A8B5]" />

                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        className="w-full rounded-[13px] border border-[#E4E8EF] bg-[#FBFCFE] py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-[#688DE8] focus:ring-4 focus:ring-[#688DE8]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9DA3AF] hover:text-[#526BC6]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="mb-2 block text-[13px] font-semibold text-[#353846]">
                                    Confirm password
                                </label>

                                <div className="relative">
                                    <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A8B5]" />

                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className="w-full rounded-[13px] border border-[#E4E8EF] bg-[#FBFCFE] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#688DE8] focus:ring-4 focus:ring-[#688DE8]/10"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[13px] bg-[#202027] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#383844] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}

                    <p className="mt-7 text-center text-[13px] text-[#9297A3]">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-[#526BC6] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-9 border-t border-[#EEF0F4] pt-5">
                        <p className="text-center text-[11px] text-[#B0B4BE]">
                            StudORA — Your personal learning workspace
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
