import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store'

export function usePlatformStats() {
  const users = useSelector((state: RootState) => state.database.users)
  const courses = useSelector((state: RootState) => state.database.courses)
  const projects = useSelector((state: RootState) => state.database.projects)
  const flaggedProjects = useSelector((state: RootState) => state.database.flaggedProjects)
  const applications = useSelector((state: RootState) => state.database.applications)
  const companyProfiles = useSelector((state: RootState) => state.database.companies)

  return useMemo(() => {
    const totalUsers = users.length
    const activeEmployers = users.filter((u: { role: string }) => u.role === 'Employer').length
    const totalCourses = courses.length
    const totalProjects = projects.length
    const pendingApprovals = applications.filter((a: { status: string }) => a.status === 'Pending').length
    const systemAlerts = flaggedProjects.length
    return { totalUsers, activeEmployers, totalCourses, totalProjects, pendingApprovals, systemAlerts }
  }, [users, courses, projects, flaggedProjects, applications, companyProfiles])
}
