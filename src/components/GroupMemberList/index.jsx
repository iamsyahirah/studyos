import { useEffect, useState } from 'react'
import {
    getGroupMembers,
    createGroupMember,
} from '../../services/groupService'

const roles = [
    { value: 'leader', label: 'Leader' },
    { value: 'member', label: 'Member' },
]

function GroupMemberList({ groupId }) {
    const [members, setMembers] = useState([])

    const [name, setName] = useState('')
    const [role, setRole] = useState('member')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadMembers() {
            try {
                setLoading(true)
                setError('')

                const data = await getGroupMembers(groupId)
                setMembers(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadMembers()
    }, [groupId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!name.trim()) return

        try {
            setError('')

            const newMember = await createGroupMember(
                groupId,
                name.trim(),
                role
            )

            setMembers((current) => [
                ...current,
                newMember,
            ])

            setName('')
            setRole('member')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) return <p>Loading members...</p>

    return (
        <div>
            <h4>Group Members</h4>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Member name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />

                <select
                    value={role}
                    onChange={(event) =>
                        setRole(event.target.value)
                    }
                >
                    {roles.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    Add Member
                </button>
            </form>

            {error && <p>{error}</p>}

            {members.length === 0 ? (
                <p>No members yet.</p>
            ) : (
                <ul>
                    {members.map((member) => (
                        <li key={member.id}>
                            {member.name} — {member.role}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default GroupMemberList