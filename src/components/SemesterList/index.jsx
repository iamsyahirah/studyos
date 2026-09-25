import { useEffect, useState } from 'react'
import {
    getSemesters,
    createSemester,
} from '../../services/semesterService'

function SemesterList({ academicYearId }) {
    const [semesters, setSemesters] = useState([])
    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadSemesters() {
            try {
                setLoading(true)
                setError('')

                const data = await getSemesters(academicYearId)
                setSemesters(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadSemesters()
    }, [academicYearId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!name.trim()) return

        try {
            setError('')

            const newSemester = await createSemester(
                academicYearId,
                name.trim(),
                startDate,
                endDate
            )

            setSemesters((current) => [...current, newSemester])

            setName('')
            setStartDate('')
            setEndDate('')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading semesters...</p>
    }

    return (
        <div>
            <h2>Semesters</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="e.g. Semester 4"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                />

                <button type="submit">
                    Add Semester
                </button>
            </form>

            {error && <p>{error}</p>}

            {semesters.length === 0 ? (
                <p>No semesters yet.</p>
            ) : (
                <ul>
                    {semesters.map((semester) => (
                        <li key={semester.id}>
                            {semester.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SemesterList