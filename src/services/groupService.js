import { supabase } from '../lib/supabase'

export async function getGroups(semesterId) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('semester_id', semesterId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data
}

export async function createGroup(
  semesterId,
  name,
  description
) {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      semester_id: semesterId,
      name,
      description: description || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getGroupMembers(groupId) {
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data
}

export async function createGroupMember(
  groupId,
  name,
  role
) {
  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      name,
      role: role || 'member',
    })
    .select()
    .single()

  if (error) throw error

  return data
}