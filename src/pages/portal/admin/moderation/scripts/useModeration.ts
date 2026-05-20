import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { approveAppeal, rejectAppeal as rejectAppealAction } from '../../../../../store/databaseSlice'
import type { RootState } from '../../../../../store'

export interface FlaggedProject {
  id: string
  title: string
  studentName: string
  studentEmail: string
  course: string
  flaggedBy: string
  reason: string
  dateFlagged: string
  status: 'active' | 'deactivated'
}

export interface Appeal {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  message: string
  dateSubmitted: string
  status: 'pending' | 'accepted' | 'rejected'
}

export function useModeration() {
  const dispatch = useDispatch()
  const flaggedProjects = useSelector((state: RootState) => state.database.flaggedProjects)
  const appeals = useSelector((state: RootState) => state.database.projectAppeals)

  const adminFlaggedProjects: FlaggedProject[] = useMemo(() => {
    return flaggedProjects.map((fp: any) => ({
      id: fp.id,
      title: fp.projectTitle || 'Unknown Project',
      studentName: fp.projectOwnerName || 'Unknown',
      studentEmail: fp.projectOwnerId || '',
      course: 'Unknown',
      flaggedBy: fp.flaggedByName || 'Unknown',
      reason: fp.reason || 'No reason provided',
      dateFlagged: fp.flaggedAt?.split('T')[0] || '',
      status: fp.status === 'appealed' ? 'active' : fp.status === 'resolved' ? 'deactivated' : 'active'
    }))
  }, [flaggedProjects])

  const adminAppeals: Appeal[] = useMemo(() => {
    return appeals.map((a: any) => ({
      id: a.id,
      projectId: a.projectId,
      projectTitle: a.projectTitle || 'Unknown',
      studentName: a.studentName || 'Unknown',
      message: a.appealMessage || '',
      dateSubmitted: a.submittedAt?.split('T')[0] || '',
      status: a.status as 'pending' | 'accepted' | 'rejected'
    }))
  }, [appeals])

  const toggleProjectStatus = (_id: string, _activate: boolean) => {
    // Status changes are reflected in Redux already
  }

  const acceptAppeal = (appealId: string) => {
    dispatch(approveAppeal({ appealId, adminResponse: 'Appeal approved.' }))
  }

  const rejectAppeal = (appealId: string) => {
    dispatch(rejectAppealAction({ appealId, adminResponse: 'Appeal rejected.' }))
  }

  return {
    flaggedProjects: adminFlaggedProjects,
    appeals: adminAppeals,
    toggleProjectStatus,
    acceptAppeal,
    rejectAppeal
  }
}
