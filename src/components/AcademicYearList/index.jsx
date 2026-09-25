import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
    getAcademicYears,
    createAcademicYear,
} from '../../services/academicYearService'
import SemesterList from '../SemesterList'

function AcademicYearList() {
    const { user } = useAuth()

    const [academicYears, setAcademicYears] = useState([])
    const [name, setName] = useState('')
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadAcademicYears() {
            try {
                const data = await getAcademicYears(user.id)
                setAcademicYears(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadAcademicYears()
    }, [user.id])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!name.trim()) return

        try {
            setError('')

            const newAcademicYear = await createAcademicYear(
                user.id,
                name.trim()
            )

            setAcademicYears((current) => [
                newAcademicYear,
                ...current,
            ])

            setName('')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h2>Academic Years</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="e.g. 2026/2027"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <button type="submit">
                    Add Academic Year
                </button>
            </form>

            {error && <p>{error}</p>}

            {academicYears.length === 0 ? (
                <p>No academic years yet.</p>
            ) : (
                <>
                    <div>
                        <label htmlFor="academic-year">
                            Select Academic Year
                        </label>

                        <select
                            id="academic-year"
                            value={selectedAcademicYearId}
                            onChange={(event) =>
                                setSelectedAcademicYearId(event.target.value)
                            }
                        >
                            <option value="">
                                Select academic year
                            </option>

                            {academicYears.map((year) => (
                                <option
                                    key={year.id}
                                    value={year.id}
                                >
                                    {year.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedAcademicYearId && (
                        <SemesterList
                            academicYearId={Number(selectedAcademicYearId)}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default AcademicYearList