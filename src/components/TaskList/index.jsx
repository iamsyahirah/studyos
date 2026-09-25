import { useEffect, useState } from 'react'
import {
    getTasks,
    getAssignmentTasks,
    createCourseTask,
    createAssignmentTask,
    updateTaskStatus,
} from '../../services/taskService'
import { getGroups, getGroupMembers } from '../../services/groupService'

const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

function TaskList({ courseId, assignmentId, groupId }) {
    const [tasks, setTasks] = useState([])
    const [members, setMembers] = useState([])

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('medium')
    const [assignedTo, setAssignedTo] = useState('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                setError('')

                const taskData = assignmentId
                    ? await getAssignmentTasks(assignmentId)
                    : await getTasks(courseId)

                setTasks(taskData)

                if (groupId) {
                    const memberData = await getGroupMembers(groupId)
                    setMembers(memberData)
                } else {
                    setMembers([])
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [courseId, assignmentId, groupId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!title.trim()) return

        try {
            setError('')

            const newTask = assignmentId
                ? await createAssignmentTask(
                    assignmentId,
                    title.trim(),
                    description.trim(),
                    dueDate,
                    priority,
                    assignedTo
                        ? Number(assignedTo)
                        : null
                )
                : await createCourseTask(
                    courseId,
                    title.trim(),
                    description.trim(),
                    dueDate,
                    priority
                )

            setTasks((current) => [
                ...current,
                newTask,
            ])

            setTitle('')
            setDescription('')
            setDueDate('')
            setPriority('medium')
            setAssignedTo('')
        } catch (error) {
            setError(error.message)
        }
    }

    async function handleStatusChange(taskId, status) {
        try {
            setError('')

            const updatedTask = await updateTaskStatus(
                taskId,
                status
            )

            setTasks((current) =>
                current.map((task) =>
                    task.id === updatedTask.id
                        ? updatedTask
                        : task
                )
            )
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading tasks...</p>
    }

    return (
        <div>
            <h4>
                {assignmentId
                    ? 'Assignment Tasks'
                    : 'Course Tasks'}
            </h4>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task title"
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

                {assignmentId && groupId && (
                    <select
                        value={assignedTo}
                        onChange={(event) =>
                            setAssignedTo(event.target.value)
                        }
                    >
                        <option value="">
                            Unassigned
                        </option>

                        {members.map((member) => (
                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.name}
                            </option>
                        ))}
                    </select>
                )}

                <button type="submit">
                    Add Task
                </button>
            </form>

            {error && <p>{error}</p>}

            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                <ul>
                    {tasks.map((task) => {
                        const assignedMember = members.find(
                            (member) =>
                                member.id === task.assigned_to
                        )

                        return (
                            <li key={task.id}>
                                <strong>{task.title}</strong>

                                {task.due_date && (
                                    <span>
                                        {' '}
                                        — Due:{' '}
                                        {new Date(
                                            task.due_date
                                        ).toLocaleString()}
                                    </span>
                                )}

                                <span>
                                    {' '}
                                    — Priority: {task.priority}
                                </span>

                                {assignedMember && (
                                    <span>
                                        {' '}
                                        — Assigned to:{' '}
                                        {assignedMember.name}
                                    </span>
                                )}

                                <select
                                    value={task.status}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            task.id,
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="todo">
                                        To Do
                                    </option>

                                    <option value="in_progress">
                                        In Progress
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>
                                </select>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default TaskList