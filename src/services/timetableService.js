import { supabase } from '../lib/supabase'

export async function getTimetableEntries(courseId) {
  const { data, error } = await supabase
    .from('timetable_entries')
    .select('*')
    .eq('course_id', courseId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw error

  return data
}

export async function createTimetableEntry(
  courseId,
  dayOfWeek,
  startTime,
  endTime,
  location
) {
  const { data, error } = await supabase
    .from('timetable_entries')
    .insert({
      course_id: courseId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      location: location || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}