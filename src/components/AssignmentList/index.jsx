import { useEffect, useState } from 'react'
import {
    getAssignments,
    createAssignment,
} from '../../services/assignmentService'
import TaskList from '../TaskList'

const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

function AssignmentList({ courseId }) {
    const [assignments, setAssignments] = useState([])

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('medium')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadAssignments() {
            try {
                setLoading(true)
                setError('')

                const data = await getAssignments(courseId)
                setAssignments(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadAssignments()
    }, [courseId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!title.trim()) {
            return
        }

        try {
            setError('')

            const newAssignment = await createAssignment(
                courseId,
                title.trim(),
                description.trim(),
                dueDate,
                priority
            )

            setAssignments((current) => [
                ...current,
                newAssignment,
            ])

            setTitle('')
            setDescription('')
            setDueDate('')
            setPriority('medium')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading assignments...</p>
    }

    return (
        <div>
            <h3>Assignments</h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Assignment title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

                <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(event) =>
                        setDueDate(event.target.value)
                    }
                />

                <select
                    value={priority}
                    onChange={(event) =>
                        setPriority(event.target.value)
                    }
                >
                    {priorities.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    Add Assignment
                </button>
            </form>

            {error && <p>{error}</p>}

            {assignments.length === 0 ? (
                <p>No assignments yet.</p>
            ) : (
                <ul>
                    {assignments.map((assignment) => (
                        <li key={assignment.id}>
                            <div>
                                <strong>{assignment.title}</strong>

                                {assignment.due_date && (
                                    <span>
                                        {' '}
                                        — Due:{' '}
                                        {new Date(
                                            assignment.due_date
                                        ).toLocaleString()}
                                    </span>
                                )}

                                <span>
                                    {' '}
                                    — Priority: {assignment.priority}
                                </span>
                            </div>

                            <TaskList
                                assignmentId={assignment.id}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default AssignmentList