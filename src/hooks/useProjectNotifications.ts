import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGlobalContext } from '../globalContext'
import type { RootState } from '../store'
import { toggleNotificationRead, markInvitationsAllRead } from '../store/databaseSlice'

export interface ProjectInvitationNotification {
  id: string
  type: 'project_invitation'
  title: string
  body: string
  timestamp: string
  read: boolean
  projectId: string
  projectTitle: string
  senderName: string
  senderId: string
  link?: string
}

/**
 * useProjectNotifications — reads project invitation notifications from Redux store.
 */
export function useProjectNotifications() {
  const dispatch = useDispatch()
  const { user } = useGlobalContext()
  const allNotifs = useSelector((state: RootState) => state.database.notifications)
  const userId = user?.username || 'me'
  const adminUsernames = ['admin@polaris.edu.eg', 'admin@guc.edu.eg']

  const invitationNotifications = useMemo(
    () => allNotifs.filter((n: any) => {
      if (n.type !== 'project_invitation') return false
      if (n.recipientId && !adminUsernames.includes(n.recipientId) && n.recipientId !== userId) return false
      return true
    }),
    [allNotifs, userId]
  )

  const unreadCount = useMemo(
    () => invitationNotifications.filter((n: any) => !n.read).length,
    [invitationNotifications]
  )

  const markAsRead = (notificationId: string) => {
    dispatch(toggleNotificationRead(notificationId))
  }

  const markAllAsRead = () => {
    dispatch(markInvitationsAllRead())
  }

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: 'database/removeNotification', payload: notificationId })
  }

  const addNotification = (notification: Omit<ProjectInvitationNotification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({
      type: 'database/addNotification',
      payload: { ...notification, type: 'project_invitation' },
    })
  }

  const getNotificationById = (id: string) => {
    return allNotifs.find((n: any) => n.id === id)
  }

  return {
    notifications: invitationNotifications,
    allNotifications: allNotifs,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationById,
  }
}
