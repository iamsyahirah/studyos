import { supabase } from '../lib/supabase'

export async function getAcademicYears(userId) {
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function createAcademicYear(userId, name) {
  const { data, error } = await supabase
    .from('academic_years')
    .insert({
      user_id: userId,
      name,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}