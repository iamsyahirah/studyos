import { NavLink, Outlet } from 'react-router-dom'

import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    ClipboardList,
    CheckSquare,
    Users,
    GraduationCap,
    LogOut,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

function DashboardLayout() {
    const { signOut } = useAuth()

    async function handleLogout() {
        await signOut()
    }

    const navItems = [
        {
            to: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            to: '/academic-years',
            label: 'Academic Years',
            icon: GraduationCap,
        },
        {
            to: '/timetable',
            label: 'Timetable',
            icon: CalendarDays,
        },
        {
            to: '/courses',
            label: 'Courses',
            icon: BookOpen,
        },
        {
            to: '/assignments',
            label: 'Assignments',
            icon: ClipboardList,
        },
        {
            to: '/tasks',
            label: 'Tasks',
            icon: CheckSquare,
        },
        {
            to: '/groups',
            label: 'Groups',
            icon: Users,
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50">

            <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white">

                {/* Logo */}
                <div className="flex h-20 items-center border-b border-slate-100 px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <GraduationCap size={20} />
                        </div>

                        <span className="text-lg font-semibold tracking-tight text-slate-900">
                            Studora
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">

                    <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>

                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                    ].join(' ')
                                }
                            >
                                <Icon size={18} strokeWidth={1.8} />

                                <span>{item.label}</span>
                            </NavLink>
                        )
                    })}

                </nav>

                {/* Bottom */}
                <div className="border-t border-slate-100 p-4">

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={18} strokeWidth={1.8} />

                        <span>Logout</span>
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <main className="min-h-screen pl-64">
                <Outlet />
            </main>

        </div>
    )
}

export default DashboardLayout