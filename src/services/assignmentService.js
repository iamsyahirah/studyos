import { supabase } from '../lib/supabase'

export async function getAssignments(courseId) {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('due_date', { ascending: true })

  if (error) throw error

  return data
}

export async function createAssignment(
  courseId,
  title,
  description,
  dueDate,
  priority,
  groupId = null
) {
  const { data, error } = await supabase
    .from('assignments')
    .insert({
      course_id: courseId,
      title,
      description: description || null,
      due_date: dueDate || null,
      priority: priority || 'medium',
      group_id: groupId || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}