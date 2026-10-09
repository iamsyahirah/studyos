import { useEffect, useState } from 'react'
import { Plus, Clock3, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

function Timetable() {
    const { user } = useAuth()

    const [entries, setEntries] = useState([])
    const [courses, setCourses] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [showForm, setShowForm] = useState(false)

    const [form, setForm] = useState({
        course_id: '',
        day_of_week: 1,
        start_time: '',
        end_time: '',
        location: '',
    })

    useEffect(() => {
        if (user?.id) {
            loadTimetable()
            loadCourses()
        }
    }, [user?.id])

    async function loadCourses() {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                id,
                code,
                name,
                semesters (
                    academic_years (
                        user_id
                    )
                )
            `)

        if (error) {
            setError(error.message)
            return
        }

        const userCourses = data.filter(
            (course) =>
                course.semesters?.academic_years?.user_id === user.id
        )

        setCourses(userCourses)
    }

    async function loadTimetable() {
        try {
            setLoading(true)
            setError('')

            const { data, error } = await supabase
                .from('timetable_entries')
                .select(`
                    id,
                    day_of_week,
                    start_time,
                    end_time,
                    location,
                    course_id,
                    courses (
                        id,
                        code,
                        name
                    )
                `)
                .order('day_of_week', { ascending: true })
                .order('start_time', { ascending: true })

            if (error) throw error

            setEntries(data || [])
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')

            const { error } = await supabase
                .from('timetable_entries')
                .insert({
                    course_id: form.course_id,
                    day_of_week: Number(form.day_of_week),
                    start_time: form.start_time,
                    end_time: form.end_time,
                    location: form.location || null,
                })

            if (error) throw error

            setForm({
                course_id: '',
                day_of_week: 1,
                start_time: '',
                end_time: '',
                location: '',
            })

            setShowForm(false)

            await loadTimetable()
        } catch (error) {
            setError(error.message)
        }
    }

    const days = [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
        { value: 0, label: 'Sunday' },
    ]

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Timetable
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your class schedule.
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <Plus size={17} />
                    Add Class
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Add Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                >
                    <h2 className="mb-5 font-semibold text-slate-900">
                        Add Class
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">

                        {/* Course */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Course
                            </label>

                            <select
                                value={form.course_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        course_id: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="">
                                    Select course
                                </option>

                                {courses.map((course) => (
                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.code} — {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Day */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Day
                            </label>

                            <select
                                value={form.day_of_week}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        day_of_week: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >
                                {days.map((day) => (
                                    <option
                                        key={day.value}
                                        value={day.value}
                                    >
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Start Time
                            </label>

                            <input
                                type="time"
                                value={form.start_time}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        start_time: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* End */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                End Time
                            </label>

                            <input
                                type="time"
                                value={form.end_time}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        end_time: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Location
                            </label>

                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        location: e.target.value,
                                    })
                                }
                                placeholder="e.g. Room A / Online"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Save Class
                        </button>
                    </div>
                </form>
            )}

            {/* Timetable */}
            <div className="rounded-xl border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-6 py-5">
                    <h2 className="font-semibold text-slate-900">
                        Weekly Schedule
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {entries.length} scheduled{' '}
                        {entries.length === 1 ? 'class' : 'classes'}
                    </p>
                </div>

                {loading ? (
                    <div className="px-6 py-10 text-center">
                        <p className="text-sm text-slate-500">
                            Loading timetable...
                        </p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <Clock3
                            size={32}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                            No classes yet
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Add your first class to build your timetable.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {entries.map((entry) => {
                            const day = days.find(
                                (day) =>
                                    day.value === entry.day_of_week
                            )

                            return (
                                <div
                                    key={entry.id}
                                    className="grid gap-4 px-6 py-5 md:grid-cols-[120px_140px_1fr_auto] md:items-center"
                                >
                                    <div className="text-sm font-medium text-slate-700">
                                        {day?.label}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Clock3 size={15} />

                                        {entry.start_time.slice(0, 5)}
                                        {' – '}
                                        {entry.end_time.slice(0, 5)}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {entry.courses?.code}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {entry.courses?.name}
                                        </p>
                                    </div>

                                    {entry.location && (
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <MapPin size={15} />
                                            {entry.location}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Timetable