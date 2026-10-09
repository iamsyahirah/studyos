import { useEffect, useState } from 'react'
import { Plus, Trash2, BookOpen } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

function Courses() {
    const { user } = useAuth()

    const [academicYears, setAcademicYears] = useState([])
    const [semesters, setSemesters] = useState([])
    const [courses, setCourses] = useState([])

    const [selectedYear, setSelectedYear] = useState('')
    const [selectedSemester, setSelectedSemester] = useState('')

    const [form, setForm] = useState({
        code: '',
        name: '',
        lecturer_name: '',
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Load Academic Years
    useEffect(() => {
        async function loadAcademicYears() {
            try {
                const { data, error } = await supabase
                    .from('academic_years')
                    .select('id, name')
                    .eq('user_id', user.id)
                    .order('name', { ascending: false })

                if (error) throw error

                setAcademicYears(data || [])

                if (data?.length > 0) {
                    setSelectedYear(data[0].id)
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) {
            loadAcademicYears()
        }
    }, [user?.id])

    // Load Semesters when Academic Year changes
    useEffect(() => {
        async function loadSemesters() {
            if (!selectedYear) {
                setSemesters([])
                setSelectedSemester('')
                return
            }

            try {
                const { data, error } = await supabase
                    .from('semesters')
                    .select('id, name, start_date, end_date')
                    .eq('academic_year_id', selectedYear)
                    .order('start_date', { ascending: true })

                if (error) throw error

                setSemesters(data || [])

                if (data?.length > 0) {
                    setSelectedSemester(data[0].id)
                } else {
                    setSelectedSemester('')
                }
            } catch (error) {
                setError(error.message)
            }
        }

        loadSemesters()
    }, [selectedYear])

    // Load Courses
    useEffect(() => {
        async function loadCourses() {
            if (!selectedSemester) {
                setCourses([])
                return
            }

            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select(`
                        id,
                        semester_id,
                        code,
                        name,
                        lecturer_name,
                        created_at
                    `)
                    .eq('semester_id', selectedSemester)
                    .order('code', { ascending: true })

                if (error) throw error

                setCourses(data || [])
            } catch (error) {
                setError(error.message)
            }
        }

        loadCourses()
    }, [selectedSemester])

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!selectedSemester) {
            setError('Please select a semester first.')
            return
        }

        if (!form.code.trim() || !form.name.trim()) {
            setError('Course code and course name are required.')
            return
        }

        try {
            setSaving(true)
            setError('')

            const { data, error } = await supabase
                .from('courses')
                .insert({
                    semester_id: selectedSemester,
                    code: form.code.trim(),
                    name: form.name.trim(),
                    lecturer_name: form.lecturer_name.trim() || null,
                })
                .select()
                .single()

            if (error) throw error

            setCourses((current) =>
                [...current, data].sort((a, b) =>
                    a.code.localeCompare(b.code)
                )
            )

            setForm({
                code: '',
                name: '',
                lecturer_name: '',
            })
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(courseId) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this course?'
        )

        if (!confirmed) return

        try {
            setError('')

            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', courseId)

            if (error) throw error

            setCourses((current) =>
                current.filter((course) => course.id !== courseId)
            )
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-slate-500">Loading...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Courses
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your courses for each semester.
                </p>
            </div>

            {/* Select Academic Year & Semester */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Academic Year
                    </label>

                    <select
                        value={selectedYear}
                        onChange={(event) =>
                            setSelectedYear(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                    >
                        <option value="">Select academic year</option>

                        {academicYears.map((year) => (
                            <option key={year.id} value={year.id}>
                                {year.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Semester
                    </label>

                    <select
                        value={selectedSemester}
                        onChange={(event) =>
                            setSelectedSemester(event.target.value)
                        }
                        disabled={!selectedYear}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-slate-500"
                    >
                        <option value="">Select semester</option>

                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Add Course */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-slate-600" />

                    <h2 className="font-semibold text-slate-900">
                        Add Course
                    </h2>
                </div>

                {!selectedSemester ? (
                    <p className="text-sm text-slate-500">
                        Select an academic year and semester first.
                    </p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Course Code
                            </label>

                            <input
                                type="text"
                                name="code"
                                placeholder="e.g. CSC101"
                                value={form.code}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Course Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Web Development"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Lecturer
                            </label>

                            <input
                                type="text"
                                name="lecturer_name"
                                placeholder="e.g. Dr. Ahmad"
                                value={form.lecturer_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                <Plus size={16} />

                                {saving ? 'Adding...' : 'Add Course'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Course List */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="font-semibold text-slate-900">
                        {semesters.find(
                            (semester) => semester.id === selectedSemester
                        )?.name || 'Courses'}
                    </h2>
                </div>

                {courses.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <BookOpen
                            size={32}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-sm text-slate-500">
                            No courses added yet.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-900">
                                        {course.code} — {course.name}
                                    </p>

                                    {course.lecturer_name && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            {course.lecturer_name}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(course.id)
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                    title="Delete course"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Courses