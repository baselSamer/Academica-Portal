import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useGlobalContext } from './globalContext'
import { lazy, Suspense } from 'react'

// ── Always-eager: tiny layout shells & auth ──────────────────────────────────
import PortalLayout from './pages/portal/PortalLayout.tsx'
import AuthLayout from './pages/auth/AuthLayout.tsx'
import LoginPage from './pages/auth/LoginPage.tsx'
import SignupPage from './pages/auth/SignupPage.tsx'
import PendingVerificationPage from './pages/auth/PendingVerificationPage.tsx'
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ErrorPage from './pages/error/ErrorPage.tsx'
import DashboardLayout from './pages/portal/dashboard/DashboardLayout.tsx'
import EmployerLayout from './pages/portal/employer/EmployerLayout.tsx'
import InstructorLayout from './pages/portal/instructor/InstructorLayout.tsx'
import AdminLayout from './pages/portal/admin/AdminLayout.tsx'

// ── Lazy page chunks ──────────────────────────────────────────────────────────
const DashboardPage            = lazy(() => import('./pages/portal/dashboard/DashboardPage.tsx'))
const SearchHubPage            = lazy(() => import('./pages/portal/explorer/SearchHubPage.tsx'))
const InstructorProfileViewPage = lazy(() => import('./pages/portal/explorer/InstructorProfileViewPage.tsx'))
const AdminPage                = lazy(() => import('./pages/portal/admin/AdminPage.tsx'))
const UserDirectoryPage        = lazy(() => import('./pages/portal/admin/users/UserDirectoryPage.tsx'))
const CourseDirectoryPage      = lazy(() => import('./pages/portal/admin/courses/CourseDirectoryPage.tsx'))
const EmployerVerificationPage = lazy(() => import('./pages/portal/admin/verification/EmployerVerificationPage.tsx'))
const ContentModerationPage    = lazy(() => import('./pages/portal/admin/moderation/ContentModerationPage.tsx'))

const EmployerDashboardPage    = lazy(() => import('./pages/portal/employer/dashboard/EmployerDashboardPage.tsx'))
const CompanyProfilePage       = lazy(() => import('./pages/portal/employer/profile/CompanyProfilePage.tsx'))
const InternshipManagementPage = lazy(() => import('./pages/portal/employer/internships/InternshipManagementPage.tsx'))
const ApplicantReviewPage      = lazy(() => import('./pages/portal/employer/applicants/ApplicantReviewPage.tsx'))

const InstructorProfilePage    = lazy(() => import('./pages/portal/instructor/profile/InstructorProfilePage.tsx'))
const MyCourses                = lazy(() => import('./pages/portal/instructor/courses/MyCourses.tsx'))
const ProjectOversightPage     = lazy(() => import('./pages/portal/instructor/oversight/ProjectOversightPage.tsx'))

const InternshipExplorerPage   = lazy(() => import('./pages/portal/student/internships/InternshipExplorerPage.tsx'))
const MyProjectsPage           = lazy(() => import('./pages/portal/student/projects/MyProjectsPage.tsx'))
const ProjectEditorPage        = lazy(() => import('./pages/portal/student/projects/ProjectEditorPage.tsx'))
const ProjectTasksPage         = lazy(() => import('./pages/portal/student/projects/ProjectTasksPage.tsx'))
const StudentPortfolioPage     = lazy(() => import('./pages/portal/student/portfolio/StudentPortfolioPage.tsx'))
const ProjectCollaboration     = lazy(() => import('./pages/portal/student/projects/ProjectCollaboration.tsx'))
const ProjectInvitationsPage   = lazy(() => import('./pages/portal/student/invitations/ProjectInvitationsPage.tsx'))
const NotificationCenter       = lazy(() => import('./pages/portal/shared/notifications/NotificationCenter.tsx'))

const FavoritesPage            = lazy(() => import('./pages/portal/shared/favorites/FavoritesPage.tsx'))
const CommunicationsPage       = lazy(() => import('./pages/portal/shared/communications/CommunicationsPage.tsx'))
const ProjectDetailsPage       = lazy(() => import('./pages/portal/shared/projects/ProjectDetailsPage.tsx'))

// ── Fallback spinner shown while a chunk loads ────────────────────────────────
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite', color: 'var(--color-primary, #6750A4)' }}>
        progress_activity
      </span>
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Role switcher ─────────────────────────────────────────────────────────────
function RoleSwitcher() {
  const { user, isLoggedIn } = useGlobalContext()

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  let rolePath = 'student'

  if (user?.role === 'Course Instructor') rolePath = 'instructor'
  else if (user?.role === 'Administrator') rolePath = 'administrator'
  else if (user?.role === 'Employer') rolePath = 'employer'

  return <Navigate to={`/portal/${rolePath}`} replace />
}

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'employer-pending-verification', element: <PendingVerificationPage /> }
    ]
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
    errorElement: <ErrorPage />
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <RoleSwitcher />
      </ProtectedRoute>
    )
  },
  {
    path: '/portal',
    element: (
      <ProtectedRoute>
        <PortalLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'student',
        element: <DashboardLayout />,
        children: [
          { index: true,                          element: <Lazy><DashboardPage /></Lazy> },
          { path: 'projects',                     element: <Lazy><MyProjectsPage /></Lazy> },
          { path: 'projects/:id',                 element: <Lazy><ProjectEditorPage /></Lazy> },
          { path: 'projects/new',                 element: <Lazy><ProjectEditorPage /></Lazy> },
          { path: 'search',                       element: <Lazy><SearchHubPage /></Lazy> },
          { path: 'instructors/:id',              element: <Lazy><InstructorProfileViewPage /></Lazy> },
          { path: 'internships',                  element: <Lazy><InternshipExplorerPage /></Lazy> },
          { path: 'portfolio',                    element: <Lazy><StudentPortfolioPage /></Lazy> },
          { path: 'portfolio/:id',                element: <Lazy><StudentPortfolioPage /></Lazy> },
          { path: 'favorites',                    element: <Lazy><FavoritesPage /></Lazy> },
          { path: 'communications',               element: <Lazy><CommunicationsPage /></Lazy> },
          { path: 'projects/:id/collaboration',   element: <Lazy><ProjectCollaboration /></Lazy> },
          { path: 'projects/:id/tasks',           element: <Lazy><ProjectTasksPage /></Lazy> },
          { path: 'invitations',                  element: <Lazy><ProjectInvitationsPage /></Lazy> },
          { path: 'notifications',                element: <Lazy><NotificationCenter /></Lazy> },
          { path: 'projects/:id/view',            element: <Lazy><ProjectDetailsPage /></Lazy> }
        ]
      },
      {
        path: 'employer',
        element: <EmployerLayout />,
        children: [
          { index: true,                          element: <Lazy><EmployerDashboardPage /></Lazy> },
          { path: 'profile',                      element: <Lazy><CompanyProfilePage /></Lazy> },
          { path: 'internships',                  element: <Lazy><InternshipManagementPage /></Lazy> },
          { path: 'internships/:id/applicants',   element: <Lazy><ApplicantReviewPage /></Lazy> },
          { path: 'search',                       element: <Lazy><SearchHubPage /></Lazy> },
          { path: 'instructors/:id',              element: <Lazy><InstructorProfileViewPage /></Lazy> },
          { path: 'portfolio/:id',                element: <Lazy><StudentPortfolioPage /></Lazy> },
          { path: 'favorites',                    element: <Lazy><FavoritesPage /></Lazy> },
          { path: 'communications',               element: <Lazy><CommunicationsPage /></Lazy> },
          { path: 'notifications',                element: <Lazy><NotificationCenter /></Lazy> },
          { path: 'projects/:id/view',            element: <Lazy><ProjectDetailsPage /></Lazy> }
        ]
      },
      {
        path: 'instructor',
        element: <InstructorLayout />,
        children: [
          { index: true,                          element: <Lazy><InstructorProfilePage /></Lazy> },
          { path: 'profile',                      element: <Lazy><InstructorProfilePage /></Lazy> },
          { path: 'courses',                      element: <Lazy><MyCourses /></Lazy> },
          { path: 'search',                       element: <Lazy><SearchHubPage /></Lazy> },
          { path: 'instructors/:id',              element: <Lazy><InstructorProfileViewPage /></Lazy> },
          { path: 'portfolio/:id',                element: <Lazy><StudentPortfolioPage /></Lazy> },
          { path: 'communications',               element: <Lazy><CommunicationsPage /></Lazy> },
          { path: 'notifications',                element: <Lazy><NotificationCenter /></Lazy> },
          { path: 'projects/:id/view',            element: <Lazy><ProjectDetailsPage /></Lazy> },
          { path: 'projects/:id/collaboration',   element: <Lazy><ProjectCollaboration /></Lazy> },
          { path: 'invitations',                  element: <Lazy><ProjectInvitationsPage /></Lazy> },
          { path: 'oversight',                    element: <Lazy><ProjectOversightPage /></Lazy> }
        ]
      },
      {
        path: 'administrator',
        element: <AdminLayout />,
        children: [
          { index: true,                          element: <Lazy><AdminPage /></Lazy> },
          { path: 'verification',                 element: <Lazy><EmployerVerificationPage /></Lazy> },
          { path: 'users',                        element: <Lazy><UserDirectoryPage /></Lazy> },
          { path: 'courses',                      element: <Lazy><CourseDirectoryPage /></Lazy> },
          { path: 'moderation',                   element: <Lazy><ContentModerationPage /></Lazy> },
          { path: 'search',                       element: <Lazy><SearchHubPage /></Lazy> },
          { path: 'instructors/:id',              element: <Lazy><InstructorProfileViewPage /></Lazy> },
          { path: 'notifications',                element: <Lazy><NotificationCenter /></Lazy> },
          { path: 'projects/:id/view',            element: <Lazy><ProjectDetailsPage /></Lazy> }
        ]
      },
    ]
  }
])
