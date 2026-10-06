import { useEffect, useState } from 'react'
import {
    BookOpen,
    ClipboardList,
    CheckSquare,
    Clock3,
    CalendarDays,
    ArrowUpRight,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import {
    getDashboardCourses,
    getDashboardAssignments,
    getDashboardTasks,
    getTodayTimetable,
} from '../../services/dashboardService'

function Dashboard() {
    const { user } = useAuth()

    const [courses, setCourses] = useState([])
    const [assignments, setAssignments] = useState([])
    const [tasks, setTasks] = useState([])
    const [todayTimetable, setTodayTimetable] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true)
                setError('')

                const today = new Date()
                const dayOfWeek = today.getDay()

                const [
                    courseData,
                    assignmentData,
                    taskData,
                    timetableData,
                ] = await Promise.all([
                    getDashboardCourses(user.id),
                    getDashboardAssignments(user.id),
                    getDashboardTasks(user.id),
                    getTodayTimetable(user.id, dayOfWeek),
                ])

                setCourses(courseData)
                setAssignments(assignmentData)
                setTasks(taskData)
                setTodayTimetable(timetableData)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadDashboard()
    }, [user.id])

    const upcomingAssignments = assignments
        .filter((assignment) => {
            if (!assignment.due_date) return false

            const dueDate = new Date(assignment.due_date)
            const now = new Date()

            const isUpcoming = dueDate >= now

            const isCompleted =
                assignment.status === 'completed' ||
                assignment.status === 'submitted'

            return isUpcoming && !isCompleted
        })
        .sort(
            (a, b) =>
                new Date(a.due_date) -
                new Date(b.due_date)
        )

    const upcomingTasks = tasks
        .filter((task) => {
            if (!task.due_date) return false

            const dueDate = new Date(task.due_date)
            const now = new Date()

            return (
                dueDate >= now &&
                task.status !== 'completed'
            )
        })
        .sort(
            (a, b) =>
                new Date(a.due_date) -
                new Date(b.due_date)
        )

    const todoCount = tasks.filter(
        (task) => task.status === 'todo'
    ).length

    const inProgressCount = tasks.filter(
        (task) => task.status === 'in_progress'
    ).length

    const completedCount = tasks.filter(
        (task) => task.status === 'completed'
    ).length

    const today = new Date()

    const dateLabel = today.toLocaleDateString(
        'en-MY',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        }
    )

    const hour = today.getHours()

    const greeting =
        hour < 12
            ? 'Good Morning'
            : hour < 18
                ? 'Good Afternoon'
                : 'Good Evening'

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading dashboard...
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

            {/* Header */}
            <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="mb-2 text-sm text-slate-500">
                        {dateLabel}
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {greeting}, Syahirah
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Here’s what’s happening with your studies today.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        View Timetable
                    </button>

                    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                        <ArrowUpRight size={16} />
                        Add Task
                    </button>
                </div>
            </section>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Overview */}
            <section className="grid gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <BookOpen size={20} />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Courses
                    </p>

                    <p className="mt-1 text-3xl font-semibold text-slate-900">
                        {courses.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                            <ClipboardList size={20} />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Upcoming Assignments
                    </p>

                    <p className="mt-1 text-3xl font-semibold text-slate-900">
                        {upcomingAssignments.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                            <CheckSquare size={20} />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Open Tasks
                    </p>

                    <p className="mt-1 text-3xl font-semibold text-slate-900">
                        {todoCount + inProgressCount}
                    </p>
                </div>

            </section>

            {/* Today's Classes */}
            <section className="rounded-xl border border-slate-200 bg-white">

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={19}
                                className="text-slate-500"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Today’s Classes
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            {todayTimetable.length}{' '}
                            {todayTimetable.length === 1
                                ? 'class'
                                : 'classes'}{' '}
                            scheduled today
                        </p>
                    </div>

                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        See all
                    </button>
                </div>

                {todayTimetable.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <p className="text-sm text-slate-500">
                            No classes scheduled today.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {todayTimetable.map((entry) => (
                            <div
                                key={entry.id}
                                className="grid gap-4 px-6 py-5 md:grid-cols-[120px_1fr_auto] md:items-center"
                            >
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock3 size={16} />

                                    <span>
                                        {entry.start_time.slice(0, 5)}
                                        {' – '}
                                        {entry.end_time.slice(0, 5)}
                                    </span>
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
                                    <span className="text-sm text-slate-500">
                                        {entry.location}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </section>

            {/* Assignments + Tasks */}
            <section className="grid gap-6 lg:grid-cols-2">

                {/* Assignments */}
                <div className="rounded-xl border border-slate-200 bg-white">

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Upcoming Assignments
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your next deadlines
                            </p>
                        </div>

                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            See all
                        </button>
                    </div>

                    {upcomingAssignments.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-slate-500">
                                No upcoming assignments.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {upcomingAssignments
                                .slice(0, 5)
                                .map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="px-6 py-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {assignment.title}
                                                </p>

                                                {assignment.courses && (
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {assignment.courses.code}
                                                        {' — '}
                                                        {assignment.courses.name}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${assignment.priority === 'high'
                                                    ? 'bg-red-50 text-red-600'
                                                    : assignment.priority === 'medium'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}
                                            >
                                                {assignment.priority}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Due{' '}
                                            {new Date(
                                                assignment.due_date
                                            ).toLocaleDateString(
                                                'en-MY',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                }
                                            )}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    )}

                </div>

                {/* Tasks */}
                <div className="rounded-xl border border-slate-200 bg-white">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="font-semibold text-slate-900">
                            Upcoming Tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Tasks that need your attention
                        </p>
                    </div>

                    {upcomingTasks.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-slate-500">
                                No upcoming tasks.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {upcomingTasks
                                .slice(0, 5)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        className="px-6 py-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {task.title}
                                                </p>

                                                {task.courses && (
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {task.courses.code}
                                                        {' — '}
                                                        {task.courses.name}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.priority === 'high'
                                                    ? 'bg-red-50 text-red-600'
                                                    : task.priority === 'medium'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Due{' '}
                                            {new Date(
                                                task.due_date
                                            ).toLocaleDateString(
                                                'en-MY',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                }
                                            )}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    )}

                </div>

            </section>

            {/* Task Status */}
            <section className="rounded-xl border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-6 py-5">
                    <h2 className="font-semibold text-slate-900">
                        Task Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current task progress
                    </p>
                </div>

                <div className="grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">

                    <div className="px-6 py-5">
                        <p className="text-sm text-slate-500">
                            To Do
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {todoCount}
                        </p>
                    </div>

                    <div className="px-6 py-5">
                        <p className="text-sm text-slate-500">
                            In Progress
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {inProgressCount}
                        </p>
                    </div>

                    <div className="px-6 py-5">
                        <p className="text-sm text-slate-500">
                            Completed
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {completedCount}
                        </p>
                    </div>

                </div>

            </section>

        </div>
    )
}

export default Dashboard