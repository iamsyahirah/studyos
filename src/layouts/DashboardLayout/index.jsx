import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function DashboardLayout() {
    const { signOut } = useAuth()

    async function handleLogout() {
        await signOut()
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="logo">
                    StudyOS
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/academic-years">Academic Years</NavLink>
                    <NavLink to="/timetable">Timetable</NavLink>
                    <NavLink to="/courses">Courses</NavLink>
                    <NavLink to="/assignments">Assignments</NavLink>
                    <NavLink to="/tasks">Tasks</NavLink>
                    <NavLink to="/groups">Groups</NavLink>
                </nav>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout