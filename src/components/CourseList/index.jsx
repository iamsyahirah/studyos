import { useEffect, useState } from 'react'
import {
    getCourses,
    createCourse,
} from '../../services/courseService'

function CourseList({ semesterId }) {
    const [courses, setCourses] = useState([])

    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [lecturerName, setLecturerName] = useState('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadCourses() {
            try {
                setLoading(true)
                setError('')

                const data = await getCourses(semesterId)
                setCourses(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadCourses()
    }, [semesterId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!code.trim() || !name.trim()) {
            return
        }

        try {
            setError('')

            const newCourse = await createCourse(
                semesterId,
                code.trim(),
                name.trim(),
                lecturerName.trim()
            )

            setCourses((current) => [...current, newCourse])

            setCode('')
            setName('')
            setLecturerName('')
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <p>Loading courses...</p>
    }

    return (
        <div>
            <h3>Courses</h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Course code e.g. CSC580"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Course name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Lecturer name"
                    value={lecturerName}
                    onChange={(event) =>
                        setLecturerName(event.target.value)
                    }
                />

                <button type="submit">
                    Add Course
                </button>
            </form>

            {error && <p>{error}</p>}

            {courses.length === 0 ? (
                <p>No courses yet.</p>
            ) : (
                <ul>
                    {courses.map((course) => (
                        <li key={course.id}>
                            <strong>{course.code}</strong> — {course.name}

                            {course.lecturer_name && (
                                <span> — {course.lecturer_name}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default CourseList