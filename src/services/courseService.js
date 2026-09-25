import { supabase } from '../lib/supabase'

export async function getCourses(semesterId) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('semester_id', semesterId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data
}

export async function createCourse(
  semesterId,
  code,
  name,
  lecturerName
) {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      semester_id: semesterId,
      code,
      name,
      lecturer_name: lecturerName || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}