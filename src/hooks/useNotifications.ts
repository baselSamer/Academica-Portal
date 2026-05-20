import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGlobalContext } from '../globalContext'
import type { RootState } from '../store'
import type { Notification as AppNotification } from '../types'

import { toggleNotificationRead, markNotificationsAllRead } from '../store/databaseSlice'

const STORAGE_KEY = 'polaris_notifications'
const MUTE_KEY = 'polaris_notifications_muted'

const dummyNotifications: AppNotification[] = [
  { id: 'n-1', type: 'message', title: 'New Message', body: 'Ahmed Hassan sent you a message.', timestamp: '2026-04-30T10:30:00Z', read: false },
  { id: 'n-2', type: 'internship_status', title: 'Application Accepted', body: 'Your application for "Software Engineering Intern" at TechVentures has been accepted!', timestamp: '2026-04-29T16:00:00Z', read: false },
  { id: 'n-3', type: 'message', title: 'New Message', body: 'Sara Mohamed sent you a message about the internship.', timestamp: '2026-04-28T09:20:00Z', read: true },
  { id: 'n-4', type: 'project_invitation', title: 'Project Invitation', body: 'You have been invited to collaborate on "AI Study Planner".', timestamp: '2026-04-27T14:00:00Z', read: true },
  { id: 'n-5', type: 'feedback', title: 'Instructor Feedback', body: 'Dr. Mona left feedback on your project task "API Integration".', timestamp: '2026-04-26T11:00:00Z', read: true },
  { id: 'n-6', type: 'internship_status', title: 'Application Rejected', body: 'Your application for "UX Research Intern" at DesignCo has been declined.', timestamp: '2026-04-25T09:00:00Z', read: true },
  { id: 'n-7', type: 'message', title: 'New Message', body: 'Dr. Mona Farid updated the project feedback.', timestamp: '2026-04-24T15:45:00Z', read: true },
]

type Listener = () => void
const listeners: Set<Listener> = new Set()

const loadNotifications = (): AppNotification[] => {
  if (typeof window === 'undefined') return dummyNotifications
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return dummyNotifications
  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : dummyNotifications
  } catch {
    return dummyNotifications
  }
}

const loadMuted = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(MUTE_KEY) === 'true'
}

let sharedNotifications: AppNotification[] = loadNotifications()
let sharedMuted: boolean = loadMuted()

function emit() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedNotifications))
    window.localStorage.setItem(MUTE_KEY, String(sharedMuted))
  }
  listeners.forEach(fn => fn())
}

/**
 * useNotifications — reads notifications from Redux store (falls back to localStorage).
 */
export default function useNotifications() {
  const dispatch = useDispatch()
  const { user } = useGlobalContext()
  const reduxNotifications = useSelector((state: RootState) => state.database.notifications)
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick(t => t + 1)
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const userId = user?.username || 'me'
  const isAdministrator = user?.role === 'Administrator'

  const filteredReduxNotifications = useMemo(
    () => reduxNotifications.filter((n: AppNotification) => {
      if (isAdministrator && (n.type === 'admin' || n.type === 'link_request')) return true
      if (n.recipientId === userId) return true
      if (!n.recipientId) return true
      return false
    }),
    [reduxNotifications, userId, isAdministrator]
  )
  const filteredSharedNotifications = useMemo(
    () => sharedNotifications.filter((n: AppNotification) => {
      if (isAdministrator && (n.type === 'admin' || n.type === 'link_request')) return true
      if (n.recipientId === userId) return true
      if (!n.recipientId) return true
      return false
    }),
    [sharedNotifications, userId, isAdministrator]
  )
  const notifications = reduxNotifications.length > 0 ? filteredReduxNotifications : filteredSharedNotifications
  const notificationsMuted = sharedMuted

  const unreadCount = useMemo(
    () => notifications.filter((n: AppNotification) => !n.read).length,
    [notifications]
  )

  const toggleRead = useCallback((id: string): void => {
    dispatch(toggleNotificationRead(id))
    sharedNotifications = sharedNotifications.map((n: AppNotification) =>
      n.id === id ? { ...n, read: !n.read } : n
    )
    emit()
  }, [dispatch])

  const markAllRead = useCallback((): void => {
    dispatch(markNotificationsAllRead())
    sharedNotifications = sharedNotifications.map((n: AppNotification) => ({ ...n, read: true }))
    emit()
  }, [dispatch])

  const addNotification = useCallback(
    (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & { recipientId?: string }) => {
      const newNotification: AppNotification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        recipientId: notification.recipientId,
      }
      dispatch({
        type: 'database/addNotification',
        payload: { ...notification, type: notification.type },
      })
      sharedNotifications = [newNotification, ...sharedNotifications]
      emit()
    },
    [dispatch]
  )

  const toggleMuteAll = useCallback((): void => {
    sharedMuted = !sharedMuted
    emit()
  }, [])

  return {
    notifications,
    unreadCount,
    toggleRead,
    markAllRead,
    addNotification,
    notificationsMuted,
    toggleMuteAll,
  }
}
