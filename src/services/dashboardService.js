import { supabase } from '../lib/supabase'

export async function getDashboardCourses(userId) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id,
      code,
      name,
      semesters (
        id,
        name,
        academic_years (
          id,
          name,
          user_id
        )
      )
    `)

  if (error) throw error

  return data.filter(
    (course) =>
      course.semesters?.academic_years?.user_id === userId
  )
}

export async function getDashboardAssignments(userId) {
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      due_date,
      priority,
      status,
      progress,
      courses (
        id,
        code,
        name,
        semesters (
          academic_years (
            user_id
          )
        )
      )
    `)
    .order('due_date', { ascending: true })

  if (error) throw error

  return data.filter(
    (assignment) =>
      assignment.courses?.semesters?.academic_years?.user_id === userId
  )
}

export async function getDashboardTasks(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      due_date,
      priority,
      status,
      courses (
        id,
        code,
        name,
        semesters (
          academic_years (
            user_id
          )
        )
      )
    `)
    .order('due_date', { ascending: true })

  if (error) throw error

  return data.filter(
    (task) =>
      task.courses?.semesters?.academic_years?.user_id === userId
  )
}

export async function getTodayTimetable(userId, dayOfWeek) {
  const { data, error } = await supabase
    .from('timetable_entries')
    .select(`
      id,
      day_of_week,
      start_time,
      end_time,
      location,
      courses (
        id,
        code,
        name,
        semesters (
          academic_years (
            user_id
          )
        )
      )
    `)
    .eq('day_of_week', dayOfWeek)
    .order('start_time', { ascending: true })

  if (error) throw error

  return data.filter(
    (entry) =>
      entry.courses?.semesters?.academic_years?.user_id === userId
  )
}