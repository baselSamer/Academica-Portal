import { useState, useCallback, useEffect } from 'react'
import useDatabase from './useDatabase'

/**
 * useStudentPortfolio — reads student portfolios from Redux store.
 */
export function useStudentPortfolio(studentId?: string) {
  const { students, dispatch } = useDatabase()

  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const portfolio = students.find(p =>
    p.studentId === studentId ||
    p.email === studentId
  ) || {
    studentId: studentId || '',
    name: '',
    email: studentId || '',
    major: '',
    year: '',
    projectCount: 0,
    skills: [],
    linkedinUrl: '',
    bio: '',
    profilePicture: null,
    createdAt: '',
    updatedAt: '',
  }

  const updatePortfolio = useCallback((updates: Partial<any>) => {
    if (portfolio) {
      dispatch({
        type: 'database/updateStudentProfile',
        payload: { studentId: portfolio.studentId, ...updates },
      })
    }
  }, [dispatch, portfolio])

  const updateMajor = useCallback((major: string) => updatePortfolio({ major }), [updatePortfolio])
  const updateBio = useCallback((bio: string) => updatePortfolio({ bio }), [updatePortfolio])
  const updateLinkedinUrl = useCallback((linkedinUrl: string) => updatePortfolio({ linkedinUrl }), [updatePortfolio])

  const addSkill = useCallback((skill: string) => {
    if (portfolio) {
      const exists = portfolio.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      if (exists) return
      updatePortfolio({ skills: [...portfolio.skills, skill] })
    }
  }, [portfolio, updatePortfolio])

  const removeSkill = useCallback((skill: string) => {
    if (portfolio) {
      updatePortfolio({ skills: portfolio.skills.filter(s => s !== skill) })
    }
  }, [portfolio, updatePortfolio])

  const updateProfilePicture = useCallback((pictureUrl: string | null) => updatePortfolio({ profilePicture: pictureUrl }), [updatePortfolio])

  return {
    portfolio,
    updatePortfolio,
    updateMajor,
    updateBio,
    updateLinkedinUrl,
    addSkill,
    removeSkill,
    updateProfilePicture,
  }
}
