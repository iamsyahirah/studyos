import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Timetable from './pages/Timetable'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Tasks from './pages/Tasks'
import Groups from './pages/Groups'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/groups" element={<Groups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App