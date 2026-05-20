import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../globalContext'
import type { RootState } from '../store'
import type { Notification as AppNotification } from '../types'

export interface TabNotifications {
  invitations: number
  communications: number
  notifications: number
  internships: number
  projects: number
  courses: number
  admin: number
  total: number
  notificationsMuted: boolean
}

export function useTabNotifications(): TabNotifications {
  const { user } = useGlobalContext()
  const notifications = useSelector((state: RootState) => state.database.notifications)
  const conversations = useSelector((state: RootState) => state.database.conversations)
  const notificationsMuted = false

  const userId = user?.username || 'me'

  const isAdministrator = user?.role === 'Administrator'

  const userNotifications = useMemo(() => notifications.filter((n: AppNotification) => {
    if (isAdministrator && (n.type === 'admin' || n.type === 'link_request')) return true
    if (n.recipientId === userId) return true
    if (!n.recipientId) return true
    return false
  }), [notifications, userId, isAdministrator])

  const messageUnread = useMemo(() => {
    return conversations.reduce((sum, c: any) => {
      if (c.participantId && c.participantId !== userId) return sum
      return sum + c.unreadCount
    }, 0)
  }, [conversations, userId])

  // Count unread project_invitation notifications
  let invitations = 0
  for (const n of userNotifications) {
    if (n.type === 'project_invitation' && !n.read) {
      invitations++
    }
  }

  // Count unread internship_status notifications
  let internships = 0
  for (const n of userNotifications) {
    if (n.type === 'internship_status' && !n.read) {
      internships++
    }
  }

  // Count unread link_request notifications (for Courses tab)
  let courses = 0
  for (const n of userNotifications) {
    if (n.type === 'link_request' && !n.read) {
      courses++
    }
  }

  // Count unread project-related notifications (feedback, flag, appeal_response)
  let projects = 0
  for (const n of userNotifications) {
    if ((n.type === 'feedback' || n.type === 'flag' || n.type === 'appeal_response') && !n.read) {
      projects++
    }
  }

  // Count unread admin notifications
  let adminCount = 0
  for (const n of userNotifications) {
    if (n.type === 'admin' && !n.read) {
      adminCount++
    }
  }

  // Count unread notifications excluding project_invitation, internship_status, project-related, admin, link_request
  let notificationsCount = 0
  for (const n of userNotifications) {
    if (n.type === 'admin') continue
    if (n.type === 'link_request') continue
    if (n.type !== 'project_invitation' && n.type !== 'internship_status' &&
        n.type !== 'feedback' && n.type !== 'flag' && n.type !== 'appeal_response' && !n.read) {
      notificationsCount++
    }
  }

  const total = invitations + messageUnread + notificationsCount + internships + projects + courses + adminCount

  return {
    invitations,
    communications: messageUnread,
    notifications: notificationsCount,
    internships,
    projects,
    courses,
    admin: adminCount,
    total,
    notificationsMuted,
  }
}
