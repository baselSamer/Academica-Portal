import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import { useStudentPortfolio } from '../../../hooks/useStudentPortfolio'
import { useInstructorProfile } from '../../../hooks/useInstructorProfile'
import useCompanyProfile from '../employer/profile/scripts/useCompanyProfile'
import Button from '../../../components/Button'
import { useTabNotifications } from '../../../hooks/useTabNotifications'
import { useDispatch } from 'react-redux'
import { type UserRole } from '../../../types'

interface Tab {
    name: string
    path: string
    icon: string
    notificationKey?: 'invitations' | 'communications' | 'notifications' | 'internships' | 'projects'
}

const roleTabs: Record<UserRole, Tab[]> = {    Student: [
        { name: 'Dashboard', path: '/portal/student', icon: 'dashboard' },
        { name: 'My Projects', path: '/portal/student/projects', icon: 'list_alt', notificationKey: 'projects' },
        { name: 'Invitations', path: '/portal/student/invitations', icon: 'mail', notificationKey: 'invitations' },
        { name: 'Search', path: '/portal/student/search', icon: 'search' },
        { name: 'Internships', path: '/portal/student/internships', icon: 'work', notificationKey: 'internships' },
        { name: 'Portfolio', path: '/portal/student/portfolio', icon: 'person' },
        { name: 'Favorites', path: '/portal/student/favorites', icon: 'favorite' },
        { name: 'Communications', path: '/portal/student/communications', icon: 'chat', notificationKey: 'communications' }
    ],
    Employer: [
        { name: 'Dashboard', path: '/portal/employer', icon: 'dashboard' },
        { name: 'Company Profile', path: '/portal/employer/profile', icon: 'business' },
        { name: 'Internships', path: '/portal/employer/internships', icon: 'work', notificationKey: 'internships' },
        { name: 'Search', path: '/portal/employer/search', icon: 'search' },
        { name: 'Favorites', path: '/portal/employer/favorites', icon: 'favorite' },
        { name: 'Communications', path: '/portal/employer/communications', icon: 'chat', notificationKey: 'communications' }
    ],
    'Course Instructor': [
        { name: 'Profile', path: '/portal/instructor', icon: 'person' },
        { name: 'Courses', path: '/portal/instructor/courses', icon: 'menu_book' },
        { name: 'Invitations', path: '/portal/instructor/invitations', icon: 'mail', notificationKey: 'invitations' },
        { name: 'Search', path: '/portal/instructor/search', icon: 'search' },
        { name: 'Project Oversight', path: '/portal/instructor/oversight', icon: 'visibility', notificationKey: 'projects' },
        { name: 'Communications', path: '/portal/instructor/communications', icon: 'chat', notificationKey: 'communications' }
    ],
    Administrator: [
        { name: 'Admin Dashboard', path: '/portal/administrator', icon: 'admin_panel_settings' },
        { name: 'Search', path: '/portal/administrator/search', icon: 'search' }
    ]
}

// ── Role-specific user card sub-components ────────────────────────────────────

function StudentUserCard({ username }: { username: string }) {
    const { portfolio } = useStudentPortfolio(username)
    const displayName = portfolio.name || username
    const initial = displayName.charAt(0).toUpperCase()
    return (
        <Link to="/portal/student/portfolio" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors group" title="Go to my portfolio">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold shadow-sm overflow-hidden flex-shrink-0">
                {portfolio.profilePicture
                    ? <img src={portfolio.profilePicture} alt={displayName} className="w-full h-full object-cover" />
                    : <span>{initial}</span>
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-jakarta font-bold text-on-surface truncate group-hover:text-primary transition-colors">{displayName}</p>
                <p className="text-xs text-on-surface-variant truncate">Student</p>
            </div>
        </Link>
    )
}

function InstructorUserCard({ username }: { username: string }) {
    const { profile } = useInstructorProfile(username)
    const displayName = profile.name || username
    const email = profile.email || username
    const initial = displayName.charAt(0).toUpperCase()
    return (
        <Link to="/portal/instructor/profile" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors group" title="Go to my portfolio">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold shadow-sm overflow-hidden flex-shrink-0">
                {profile.profilePicture
                    ? <img src={profile.profilePicture} alt={displayName} className="w-full h-full object-cover" />
                    : <span>{initial}</span>
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-jakarta font-bold text-on-surface truncate group-hover:text-primary transition-colors">{displayName}</p>
                <p className="text-xs text-on-surface-variant truncate">{email}</p>
            </div>
        </Link>
    )
}

function EmployerUserCard({ username }: { username: string }) {
    const { profile } = useCompanyProfile()
    const displayName = profile.companyName || username
    const initial = displayName.charAt(0).toUpperCase()
    return (
        <Link to="/portal/employer/profile" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors group" title="Go to my portfolio">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold shadow-sm overflow-hidden flex-shrink-0">
                {profile.logoUrl
                    ? <img src={profile.logoUrl} alt={displayName} className="w-full h-full object-cover" />
                    : <span>{initial}</span>
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-jakarta font-bold text-on-surface truncate group-hover:text-primary transition-colors">{displayName}</p>
                <p className="text-xs text-on-surface-variant truncate">Employer</p>
            </div>
        </Link>
    )
}

function AdminUserCard({ username }: { username: string }) {
    const initial = username.charAt(0).toUpperCase()
    return (
        <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold shadow-sm flex-shrink-0">
                {initial}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-jakarta font-bold text-on-surface truncate">{username}</p>
                <p className="text-xs text-on-surface-variant truncate">Administrator</p>
            </div>
        </div>
    )
}

function RoleUserCard({ role, username }: { role: UserRole | undefined; username: string }) {
    if (role === 'Student') return <StudentUserCard username={username} />
    if (role === 'Course Instructor') return <InstructorUserCard username={username} />
    if (role === 'Employer') return <EmployerUserCard username={username} />
    return <AdminUserCard username={username} />
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sidebar — persistent sidebar navigation with role-based tabs, user profile, and logout.
 */
export default function Sidebar() {
    const { user, logout } = useGlobalContext()
    const navigate = useNavigate()
    const location = useLocation()
    const tabNotifs = useTabNotifications()
    const dispatch = useDispatch()

    const handleLogout = (): void => {
        logout()
        navigate('/auth/login')
    }

    const handleTabClick = (path: string, notificationKey?: string): void => {
        if (notificationKey === 'invitations') {
            dispatch({ type: 'database/markInvitationsAllRead' })
        } else if (notificationKey === 'communications') {
            dispatch({ type: 'database/markConversationsAllRead' })
        } else if (notificationKey === 'internships') {
            dispatch({ type: 'database/markInternshipsAllRead' })
        } else if (notificationKey === 'projects') {
            dispatch({ type: 'database/markProjectsAllRead' })
        }
        navigate(path)
    }

    const tabs = roleTabs[user?.role || 'Student']

    const isActive = (path: string): boolean => {
        if (path === '/portal/administrator') {
            return location.pathname.startsWith(path) && !location.pathname.includes('/search')
        }
        if (path === `/portal/${location.pathname.split('/')[2]}`) {
            return location.pathname === path
        }
        return location.pathname.startsWith(path)
    }

    return (
        <aside className="w-72 bg-surface-container-lowest border-r border-surface-container flex flex-col shadow-sm relative z-20">
            <div className="h-24 flex items-center px-8 border-b border-surface-container bg-surface-container-low/20">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm">
                        <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                    </div>
                    <span className="font-jakarta text-xl font-extrabold text-on-surface tracking-tight">Project Polaris</span>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => handleTabClick(tab.path, tab.notificationKey)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-jakarta font-semibold rounded-xl transition-all relative ${isActive(tab.path)
                            ? 'bg-primary text-on-primary shadow-md'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isActive(tab.path) ? '' : 'text-outline-variant'}`}>
                            {tab.icon}
                        </span>
                        {tab.name}
                        {tab.notificationKey && tabNotifs[tab.notificationKey] > 0 && (
                            <span className="ml-auto bg-error text-on-error text-[10px] font-jakarta font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                                {tabNotifs[tab.notificationKey]}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-surface-container bg-surface-container-low/30 space-y-3">
                <RoleUserCard role={user?.role} username={user?.username || ''} />
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-error/20 text-error hover:bg-error/5 hover:border-error/40"
                    onClick={handleLogout}
                >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                </Button>
            </div>
        </aside>
    )
}
