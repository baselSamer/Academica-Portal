import { useCallback } from 'react'
import type { Internship } from '../../../../../types'
import useDatabase from '../../../../../hooks/useDatabase'
import {
  addInternship as addInternshipAction,
  updateInternship as updateInternshipAction,
  deleteInternship as deleteInternshipAction,
  toggleArchive as toggleArchiveAction,
  toggleStatus as toggleStatusAction
} from '../../../../../store/databaseSlice'

/**
 * useInternships — provides internship data and management operations for an employer via Redux.
 */
export default function useInternships() {
  const { internships, dispatch } = useDatabase()

  const addInternship = useCallback((data: Omit<Internship, 'id' | 'postedAt' | 'companyName' | 'companyLogo' | 'applicantCount' | 'archived'>): void => {
    const newInternship: Internship = {
      ...data,
      id: `int-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      companyName: 'TechVentures Inc.',
      companyLogo: '',
      applicantCount: 0,
      archived: false
    }
    dispatch(addInternshipAction(newInternship))
  }, [dispatch])

  const updateInternship = useCallback((id: string, updates: Partial<Internship>): void => {
    dispatch(updateInternshipAction({ id, ...updates }))
  }, [dispatch])

  const deleteInternship = useCallback((id: string): void => {
    dispatch(deleteInternshipAction(id))
  }, [dispatch])

  const toggleStatus = useCallback((id: string): void => {
    dispatch(toggleStatusAction(id))
  }, [dispatch])

  const toggleArchive = useCallback((id: string): void => {
    dispatch(toggleArchiveAction(id))
  }, [dispatch])

  const activeInternships = internships.filter(i => !i.archived)
  const archivedInternships = internships.filter(i => i.archived)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    internships,
    activeInternships,
    archivedInternships,
    addInternship,
    updateInternship,
    deleteInternship,
    toggleStatus,
    toggleArchive
  }
}

