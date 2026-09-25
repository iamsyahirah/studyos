import { supabase } from '../lib/supabase'

export async function getTasks(courseId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('course_id', courseId)
    .is('assignment_id', null)
    .order('due_date', { ascending: true })

  if (error) throw error

  return data
}

export async function getAssignmentTasks(assignmentId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data
}

export async function createCourseTask(
  courseId,
  title,
  description,
  dueDate,
  priority
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      course_id: courseId,
      title,
      description: description || null,
      due_date: dueDate || null,
      priority: priority || 'medium',
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function createAssignmentTask(
  assignmentId,
  title,
  description,
  dueDate,
  priority,
  assignedTo = null
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      assignment_id: assignmentId,
      title,
      description: description || null,
      due_date: dueDate || null,
      priority: priority || 'medium',
      assigned_to: assignedTo || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateTaskStatus(taskId, status) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error

  return data
}