import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { linkCourse, unlinkCourse, updateDatabase, updateCollaboratorStatus } from '../../../../../store/databaseSlice'
import type { RootState } from '../../../../../store'

export interface LinkRequest {
  id: string
  instructorName: string
  instructorEmail: string
  courseName: string
  courseCode: string
  type: 'link' | 'unlink'
  status: 'pending' | 'accepted' | 'rejected'
  date: string
  projectId?: string
  projectTitle?: string
  requestKind?: 'course_link' | 'project_invitation'
}

export function useLinkRequests() {
  const dispatch = useDispatch()
  const courseLinks = useSelector((state: RootState) => state.database.courseLinks)
  const courses = useSelector((state: RootState) => state.database.courses)
  const instructors = useSelector((state: RootState) => state.database.instructors)
  const storedLinkRequests = useSelector((state: RootState) => state.database.linkRequests)
  const projectInvitations = useSelector((state: RootState) => state.database.projectInvitations)

  const requests: LinkRequest[] = useMemo(() => {
    const linkRequests = courseLinks.map((link: any) => {
      const course = courses.find((c: any) => c.id === link.courseId)
      const instructor = instructors.find((i: any) => i.instructorId === link.instructorId)
      return {
        id: `${link.instructorId}-${link.courseId}`,
        instructorName: instructor?.name || 'Unknown',
        instructorEmail: link.instructorId,
        courseName: course?.name || 'Unknown',
        courseCode: course?.code || 'Unknown',
        type: link.direction || (link.status === 'pending' ? 'link' : 'unlink'),
        status: (link.status === 'pending' ? 'pending' : link.status === 'linked' ? 'accepted' : 'rejected') as 'pending' | 'accepted' | 'rejected',
        date: link.linkedAt?.split('T')[0] || '',
        projectId: undefined,
        projectTitle: undefined,
        requestKind: 'course_link' as const
      }
    })
    const storedRequests: LinkRequest[] = (storedLinkRequests || []).map((req: any) => ({
      id: req.id,
      instructorName: req.instructorName,
      instructorEmail: req.instructorId,
      courseName: req.courseName,
      courseCode: courses.find((c: any) => c.id === req.courseId)?.code || 'Unknown',
      type: req.type,
      status: req.status,
      date: req.createdAt?.split('T')[0] || '',
      projectId: undefined,
      projectTitle: undefined,
      requestKind: 'course_link' as const
    }))
    const projectInvites: LinkRequest[] = (projectInvitations || []).filter((inv: any) => inv.invitationStatus === 'pending').map((inv: any) => ({
      id: inv.id,
      instructorName: inv.recipientName,
      instructorEmail: inv.recipientEmail,
      courseName: inv.projectTitle,
      courseCode: inv.projectId,
      type: 'link',
      status: 'pending',
      date: inv.createdAt?.split('T')[0] || '',
      projectId: inv.projectId,
      projectTitle: inv.projectTitle,
      requestKind: 'project_invitation' as const
    }))
    return [...linkRequests, ...storedRequests, ...projectInvites]
  }, [courseLinks, courses, instructors, storedLinkRequests, projectInvitations])

  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'pending'), [requests])

  const acceptRequest = (requestId: string, requestKind?: string) => {
    if (requestKind === 'project_invitation') {
      const inv = (projectInvitations || []).find((i: any) => i.id === requestId)
      if (inv) {
        dispatch(updateCollaboratorStatus({
          projectId: inv.projectId,
          email: inv.recipientEmail,
          status: 'accepted'
        }))
      }
      const updatedInvitations = (projectInvitations || []).map((i: any) =>
        i.id === requestId ? { ...i, invitationStatus: 'accepted' as const } : i
      )
      dispatch(updateDatabase({ projectInvitations: updatedInvitations }))
      return
    }
    if (requestId.startsWith('link_req_')) {
      const stored = (storedLinkRequests || []).find((r: any) => r.id === requestId)
      if (stored) {
        dispatch(linkCourse({ instructorId: stored.instructorId, courseId: stored.courseId }))
        const updatedLinkRequests = (storedLinkRequests || []).map((r: any) =>
          r.id === requestId ? { ...r, status: 'accepted' as const } : r
        )
        dispatch(updateDatabase({ linkRequests: updatedLinkRequests }))
      }
    } else {
      const [instructorId, ...courseIdParts] = requestId.split('-')
      dispatch(linkCourse({ instructorId, courseId: courseIdParts.join('-') }))
    }
  }

  const rejectRequest = (requestId: string, requestKind?: string) => {
    if (requestKind === 'project_invitation') {
      const inv = (projectInvitations || []).find((i: any) => i.id === requestId)
      if (inv) {
        dispatch(updateCollaboratorStatus({
          projectId: inv.projectId,
          email: inv.recipientEmail,
          status: 'rejected'
        }))
      }
      const updatedInvitations = (projectInvitations || []).map((i: any) =>
        i.id === requestId ? { ...i, invitationStatus: 'rejected' as const } : i
      )
      dispatch(updateDatabase({ projectInvitations: updatedInvitations }))
      return
    }
    if (requestId.startsWith('link_req_')) {
      const stored = (storedLinkRequests || []).find((r: any) => r.id === requestId)
      if (stored) {
        const updatedLinkRequests = (storedLinkRequests || []).map((r: any) =>
          r.id === requestId ? { ...r, status: 'rejected' as const } : r
        )
        dispatch(updateDatabase({ linkRequests: updatedLinkRequests }))
      }
    } else {
      const [instructorId, ...courseIdParts] = requestId.split('-')
      dispatch(unlinkCourse({ instructorId, courseId: courseIdParts.join('-') }))
    }
  }

  return {
    requests,
    pendingRequests,
    acceptRequest,
    rejectRequest
  }
}
