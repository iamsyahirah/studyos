import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

import Dashboard from './pages/Dashboard'
import AcademicYears from './pages/AcademicYears'
import Timetable from './pages/Timetable'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Tasks from './pages/Tasks'
import Groups from './pages/Groups'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academic-years" element={<AcademicYears />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App