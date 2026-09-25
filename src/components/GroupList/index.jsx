import { useEffect, useState } from 'react'

import {
    getGroups,
    createGroup,
} from '../../services/groupService'

import GroupMemberList from '../GroupMemberList'

function GroupList({ semesterId }) {
    const [groups, setGroups] = useState([])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [selectedGroupId, setSelectedGroupId] = useState('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadGroups() {
            try {
                setLoading(true)
                setError('')

                const data = await getGroups(semesterId)

                setGroups(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadGroups()
    }, [semesterId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!name.trim()) return

        try {
            setError('')

            const newGroup = await createGroup(
                semesterId,
                name.trim(),
                description.trim()
            )

            setGroups((current) => [
                ...current,
                newGroup,
            ])

            setName('')
            setDescription('')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading groups...</p>
    }

    return (
        <div>
            <h3>Groups</h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Group name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

                <button type="submit">
                    Add Group
                </button>
            </form>

            {error && <p>{error}</p>}

            {groups.length === 0 ? (
                <p>No groups yet.</p>
            ) : (
                <>
                    <div>
                        <label htmlFor="group">
                            Select Group
                        </label>

                        <select
                            id="group"
                            value={selectedGroupId}
                            onChange={(event) =>
                                setSelectedGroupId(event.target.value)
                            }
                        >
                            <option value="">
                                Select group
                            </option>

                            {groups.map((group) => (
                                <option
                                    key={group.id}
                                    value={group.id}
                                >
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedGroupId && (
                        <GroupMemberList
                            groupId={Number(selectedGroupId)}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default GroupList