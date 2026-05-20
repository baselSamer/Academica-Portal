import { useLocation, Link } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import NotificationBadge from '../../../components/NotificationBadge'
import { useTabNotifications } from '../../../hooks/useTabNotifications'
import { useStudentPortfolio } from '../../../hooks/useStudentPortfolio'
import { useInstructorProfile } from '../../../hooks/useInstructorProfile'
import useCompanyProfile from '../employer/profile/scripts/useCompanyProfile'
import type { UserRole } from '../../../types'

// ---------------------------------------------------------------------------
// Role-specific avatar sub-components
// ---------------------------------------------------------------------------

function StudentAvatar({ studentId }: { studentId?: string }) {
  const { portfolio } = useStudentPortfolio(studentId)
  const initial = (portfolio.name || 'S').charAt(0).toUpperCase()
  return portfolio.profilePicture ? (
    <img src={portfolio.profilePicture} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-sm font-jakarta font-bold text-on-surface">{initial}</span>
  )
}

function InstructorAvatar({ instructorId: _instructorId }: { instructorId?: string }) {
  const { profile } = useInstructorProfile()
  void _instructorId
  const initial = (profile.name || 'I').charAt(0).toUpperCase()
  return profile.profilePicture ? (
    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-sm font-jakarta font-bold text-on-surface">{initial}</span>
  )
}

function EmployerAvatar() {
  const { profile } = useCompanyProfile()
  const initial = profile.companyName.charAt(0).toUpperCase()
  return profile.logoUrl ? (
    <img src={profile.logoUrl} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-sm font-jakarta font-bold text-on-surface">{initial}</span>
  )
}

function RoleAvatar({ role, username }: { role: UserRole | undefined; username: string | undefined }) {
  if (role === 'Student') return <StudentAvatar studentId={username} />
  if (role === 'Course Instructor') return <InstructorAvatar instructorId={username} />
  if (role === 'Employer') return <EmployerAvatar />
  return (
    <span className="text-sm font-jakarta font-bold text-on-surface">
      {(username?.charAt(0) ?? 'A').toUpperCase()}
    </span>
  )
}

// ---------------------------------------------------------------------------

export default function Header() {
  const location = useLocation()
  const { user } = useGlobalContext()
  const { total, notificationsMuted } = useTabNotifications()

  const unreadCount = total

  let rolePath = 'student'
  if (user?.role === 'Course Instructor') rolePath = 'instructor'
  else if (user?.role === 'Administrator') rolePath = 'administrator'
  else if (user?.role === 'Employer') rolePath = 'employer'


  const pageNameMap: Record<string, string> = {
    '/portal/student': 'Dashboard',
    '/portal/student/projects': 'My Projects',
    '/portal/student/invitations': 'Invitations',
    '/portal/student/search': 'Search',
    '/portal/student/internships': 'Internships',
    '/portal/student/portfolio': 'Portfolio',
    '/portal/student/favorites': 'Favorites',
    '/portal/student/communications': 'Communications',
    '/portal/student/notifications': 'Notifications',
    '/portal/employer': 'Dashboard',
    '/portal/employer/profile': 'Company Profile',
    '/portal/employer/internships': 'Internships',
    '/portal/employer/search': 'Search',
    '/portal/employer/favorites': 'Favorites',
    '/portal/employer/communications': 'Communications',
    '/portal/employer/notifications': 'Notifications',
    '/portal/instructor': 'Profile',
    '/portal/instructor/courses': 'Courses',
    '/portal/instructor/invitations': 'Invitations',
    '/portal/instructor/search': 'Search',
    '/portal/instructor/communications': 'Communications',
    '/portal/instructor/notifications': 'Notifications',
    '/portal/instructor/oversight': 'Project Oversight'
  }

  const pageName = user?.role === 'Administrator'
    ? 'Admin Control Panel'
    : pageNameMap[location.pathname] || pageNameMap[Object.keys(pageNameMap).find(key => location.pathname.startsWith(key)) || '/'] || 'Dashboard'

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between px-10 shadow-sm">
      <h2 className="font-jakarta text-xl font-bold text-on-surface">
        {pageName}
      </h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Link
            to={`/portal/${rolePath}/notifications`}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">
              {notificationsMuted ? 'notifications_paused' : 'notifications'}
            </span>
          </Link>
          {notificationsMuted ? (
            <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-surface-container-highest text-on-surface-variant text-[10px] font-jakarta font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-surface-container shadow-sm">
              <span className="material-symbols-outlined text-[12px]">volume_off</span>
            </span>
          ) : (
            <NotificationBadge count={unreadCount} />
          )}
        </div>
        <div className="h-8 w-px bg-surface-container mx-2"></div>
        <Link
          to={
            user?.role === 'Student' ? `/portal/student/portfolio` :
            user?.role === 'Course Instructor' ? `/portal/instructor/profile` :
            user?.role === 'Employer' ? `/portal/employer/profile` :
            `/portal/administrator/profile`
          }
          className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-primary/40 transition-all"
          title="Go to my profile"
        >
          <RoleAvatar role={user?.role} username={user?.username} />
        </Link>
      </div>
    </header>
  )
}
