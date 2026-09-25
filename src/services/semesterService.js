import { supabase } from '../lib/supabase'

export async function getSemesters(academicYearId) {
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .eq('academic_year_id', academicYearId)
    .order('start_date', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function createSemester(
  academicYearId,
  name,
  startDate,
  endDate
) {
  const { data, error } = await supabase
    .from('semesters')
    .insert({
      academic_year_id: academicYearId,
      name,
      start_date: startDate || null,
      end_date: endDate || null,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}