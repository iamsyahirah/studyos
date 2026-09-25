import { useEffect, useState } from 'react'
import {
    getTimetableEntries,
    createTimetableEntry,
} from '../../services/timetableService'

const days = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
]

function TimetableList({ courseId }) {
    const [entries, setEntries] = useState([])

    const [dayOfWeek, setDayOfWeek] = useState('6')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadTimetable() {
            try {
                setLoading(true)
                setError('')

                const data = await getTimetableEntries(courseId)
                setEntries(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadTimetable()
    }, [courseId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!startTime || !endTime) {
            return
        }

        try {
            setError('')

            const newEntry = await createTimetableEntry(
                courseId,
                Number(dayOfWeek),
                startTime,
                endTime,
                location.trim()
            )

            setEntries((current) => [...current, newEntry])

            setStartTime('')
            setEndTime('')
            setLocation('')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading timetable...</p>
    }

    return (
        <div>
            <h3>Timetable</h3>

            <form onSubmit={handleSubmit}>
                <select
                    value={dayOfWeek}
                    onChange={(event) =>
                        setDayOfWeek(event.target.value)
                    }
                >
                    {days.map((day) => (
                        <option
                            key={day.value}
                            value={day.value}
                        >
                            {day.label}
                        </option>
                    ))}
                </select>

                <input
                    type="time"
                    value={startTime}
                    onChange={(event) =>
                        setStartTime(event.target.value)
                    }
                />

                <input
                    type="time"
                    value={endTime}
                    onChange={(event) =>
                        setEndTime(event.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(event) =>
                        setLocation(event.target.value)
                    }
                />

                <button type="submit">
                    Add Schedule
                </button>
            </form>

            {error && <p>{error}</p>}

            {entries.length === 0 ? (
                <p>No timetable entries yet.</p>
            ) : (
                <ul>
                    {entries.map((entry) => {
                        const day = days.find(
                            (item) => item.value === entry.day_of_week
                        )

                        return (
                            <li key={entry.id}>
                                {day?.label} — {entry.start_time} to{' '}
                                {entry.end_time}

                                {entry.location && (
                                    <span> — {entry.location}</span>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default TimetableList