import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../../../../store/databaseSlice'
import type { RootState } from '../../../../../store'
import type { UserRole } from '../../../../../types'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastActive: string
}

export interface User {
  username: string
  role: UserRole
}

const roleToStatusMap: Record<string, string> = {
  Student: 'Active',
  Employer: 'Active',
  'Course Instructor': 'Active',
  Administrator: 'Active'
}

const roleToLabelMap: Record<string, string> = {
  Student: 'Student',
  Employer: 'Employer',
  'Course Instructor': 'Instructor',
  Administrator: 'Admin'
}


export function useUsers() {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.database.users)

  const adminUsers: AdminUser[] = useMemo(() => {
    return users.map((u: User) => ({
      id: u.username,
      name: u.username.split('@')[0].replace(/[.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: u.username,
      role: roleToLabelMap[u.role] || 'Staff',
      status: roleToStatusMap[u.role] || 'Active',
      lastActive: 'Unknown'
    }))
  }, [users])

  const toggleUserStatus = (username: string) => {
    const user = users.find((u: User) => u.username === username)
    if (user) {
      dispatch(registerUser({ username, role: user.role }))
    }
  }

  const addAdmin = (data: { name: string; email: string }) => {
    const email = data.email.includes('@') ? data.email : `${data.name.toLowerCase().replace(/\s/g, '.')}@polaris.edu.eg`
    dispatch(registerUser({ username: email, role: 'Administrator' }))
  }

  return {
    users: adminUsers,
    toggleUserStatus,
    addAdmin
  }
}
