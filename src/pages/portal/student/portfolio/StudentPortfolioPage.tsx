import { useState } from 'react'
import { useStudentPortfolio } from '../../../../hooks/useStudentPortfolio'
import useStudentProjects from '../projects/scripts/useStudentProjects'
import ProjectList from '../projects/components/ProjectList'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../../../globalContext'
import useFavorites from '../../../../hooks/useFavorites'
import useInternshipSearch from '../../../../hooks/useInternshipSearch'

interface PortfolioSection {
  id: 'profile' | 'skills' | 'projects' | 'internships' | 'contact'
  label: string
}

const PORTFOLIO_SECTIONS: PortfolioSection[] = [
  { id: 'profile', label: 'Profile Info' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'internships', label: 'Internships' },
  { id: 'contact', label: 'Contact & Links' }
]

/**
 * StudentPortfolioPage – main interface for students to manage their portfolio.
 * Displays portfolio information with tabs for profile, skills, and contact details.
 * Allows users to add, view, update, and remove portfolio information.
 */
export default function StudentPortfolioPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useGlobalContext()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites(user?.username || '')

  // State management
  const [activeSection, setActiveSection] = useState<'profile' | 'skills' | 'projects' | 'internships' | 'contact'>('profile')
  const [newSkill, setNewSkill] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editMajor, setEditMajor] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editLinkedin, setEditLinkedin] = useState('')

  const _location = useLocation()
  void _location

  // Determine target portfolio and permissions
  const isStudent = user?.role === 'Student'

  // It is ONLY considered "own editable portfolio" if accessed via the root path without an ID.
  // If an ID is present (e.g. from search), it is viewed in read-only mode, just like others see it.
  const isOwnEditablePortfolio = isStudent && !id

  const targetId = id || user?.username || 'student-001'
  const isReadOnly = !isOwnEditablePortfolio

  // We still use isOwnPortfolio for some titles, but now it checks if the target matches their username
  const isOwnPortfolio = isStudent && targetId === (user?.username || 'student-001')
  const canFavorite = isReadOnly && (user?.role === 'Student' || user?.role === 'Employer')

  // Hook for portfolio data
  const {
    portfolio,
    updateMajor,
    updateBio,
    updateLinkedinUrl,
    addSkill,
    removeSkill,
    updateProfilePicture
  } = useStudentPortfolio(targetId)

  const { projects, deleteProject, isLoading: projectsLoading } = useStudentProjects(user?.username)
  const { completedInternships } = useInternshipSearch(user?.username || '')

  // Project Handlers
  const handleEditProject = (id: string) => {
    navigate(`/portal/student/projects/${id}`)
  }

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id)
    }
  }

  const handleViewProject = (id: string) => {
    localStorage.setItem('polaris_back_label', 'Back to Profile')
    const rolePath = user?.role === 'Course Instructor' ? 'instructor' : user?.role === 'Employer' ? 'employer' : 'student'
    navigate(`/portal/${rolePath}/projects/${id}/view`)
  }

  // Handler: Start editing mode
  const handleEditStart = () => {
    setEditMajor(portfolio.major)
    setEditBio(portfolio.bio)
    setEditLinkedin(portfolio.linkedinUrl)
    setNewSkill('')
    setIsEditing(true)
  }

  // Handler: Save changes
  const handleSaveChanges = () => {
    updateMajor(editMajor)
    updateBio(editBio)
    updateLinkedinUrl(editLinkedin)
    // Synchronize name if we had a name edit field (currently name is static in dummy)
    setIsEditing(false)
  }

  

  // Handler: Add skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim())
      setNewSkill('')
    }
  }

  // Handler: Remove skill
  const handleRemoveSkill = (skill: string) => {
    removeSkill(skill)
  }

  // Handler: Upload profile picture
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const pictureUrl = e.target?.result as string
        updateProfilePicture(pictureUrl)
      }
      reader.readAsDataURL(file)
    }
  }

const handleToggleFavorite = (): void => {
    if (isFavorite(targetId)) {
      removeFavorite(targetId, user?.username || '')
      return
    }
    addFavorite({
      id: targetId,
      userId: user?.username || '',
      type: 'portfolio',
      title: portfolio.name,
      subtitle: `${portfolio.major} - ${portfolio.projectCount} Projects`,
      tags: portfolio.skills
    })
   }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          {isOwnPortfolio ? 'My Portfolio' : `${portfolio.name}'s Portfolio`}
        </h1>
        <p className="text-body-md text-on-surface-variant">
          {isReadOnly ? 'Viewing student professional profile' : 'Manage your professional profile and showcase your skills'}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm mb-8 overflow-hidden">
        <div className="p-6 lg:p-8">
          {/* Profile Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-surface-container-high">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-primary text-3xl font-jakarta font-bold overflow-hidden">
                {portfolio.profilePicture ? (
                  <img src={portfolio.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{portfolio.name.charAt(0)}</span>
                )}
              </div>
              {!isReadOnly && (
                <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-jakarta font-semibold text-sm cursor-pointer hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-1">{portfolio.name}</h2>
              <p className="text-body-md text-on-surface-variant mb-4">{portfolio.email}</p>
              <p className="text-body-sm text-on-surface-variant mb-6">
                Last updated: {new Date(portfolio.updatedAt).toLocaleDateString()}
              </p>
              {!isReadOnly && (
                <button
                  onClick={handleEditStart}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors"
                >
                  {isEditing ? 'Editing' : 'Edit Profile'}
                </button>
              )}
              {canFavorite && (
                <button
                  onClick={handleToggleFavorite}
                  className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-jakarta font-semibold text-sm border transition-all focus-visible:ring-2 focus-visible:ring-secondary ${isFavorite(targetId)
                    ? 'text-error bg-error/10 border-error/20'
                    : 'text-on-surface border-outline-variant/40 hover:text-error hover:bg-error/5 hover:border-error/30'
                    }`}
                  aria-label={`${isFavorite(targetId) ? 'Remove' : 'Add'} ${portfolio.name} portfolio to favorites`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={isFavorite(targetId) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    favorite
                  </span>
                  {isFavorite(targetId) ? 'Favorited' : 'Add to Favorites'}
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-surface-container-high">
            {PORTFOLIO_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 font-jakarta font-semibold text-sm transition-all border-b-2 ${activeSection === section.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* SECTION 1: Profile Info Tab */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-6">
                  {/* Major Input */}
                  <div>
                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                      Major
                    </label>
                    <input
                      type="text"
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      className="w-full px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  {/* Bio Textarea */}
                  <div>
                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                      Biography
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-outline text-on-surface rounded-lg font-jakarta font-semibold hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-1">Major</p>
                    <p className="text-body-md text-on-surface">{portfolio.major}</p>
                  </div>
                  <div>
                    <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-1">Biography</p>
                    <p className="text-body-md text-on-surface">{portfolio.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: Skills Tab */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              {/* Skills Display */}
              <div>
                <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-4">
                  {isOwnPortfolio ? 'Your Skills' : `${portfolio.name}'s Skills`}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {portfolio.skills.length > 0 ? (
                    portfolio.skills.map(skill => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-3 py-1 bg-secondary-container rounded-full"
                      >
                        <span className="text-sm font-lexend text-on-secondary-container">{skill}</span>
                        {isEditing && !isReadOnly && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-on-secondary-container hover:opacity-70 transition-opacity"
                            aria-label={`Remove ${skill} skill`}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Add Skill Input */}
              {isEditing && !isReadOnly && (
                <div>
                  <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                    Add a Skill
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="e.g., React, TypeScript"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-6 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: Projects Tab */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-jakarta font-semibold text-on-surface-variant">
                  {isOwnPortfolio ? 'Your Showcase Projects' : `${portfolio.name}'s Showcase Projects`}
                </p>
                {!isReadOnly && (
                  <button
                    onClick={() => navigate('/portal/student/projects/new')}
                    className="text-sm font-jakarta font-semibold text-primary hover:underline"
                  >
                    + Add Project
                  </button>
                )}
              </div>

              {projects.length > 0 ? (
                <ProjectList
                  projects={projects.filter(p => p.ownerId === portfolio.studentId && p.isPublic)}
                  onEdit={isReadOnly ? undefined : handleEditProject}
                  onDelete={isReadOnly ? undefined : handleDeleteProject}
                  onView={handleViewProject}
                  isLoading={projectsLoading}
                />
              ) : (
                <div className="text-center py-12 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                  <p className="text-on-surface-variant font-lexend mb-4">No public projects available.</p>
                  {!isReadOnly && (
                    <button
                      onClick={() => navigate('/portal/student/projects')}
                      className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors"
                    >
                      Manage Projects
                    </button>
                  )}
                </div>
              )}

              {!isReadOnly && projects.some(p => !p.isPublic) && (
                <p className="text-xs text-on-surface-variant font-lexend mt-4 italic">
                  Note: Some of your projects are set to private and are not shown here.
                  Manage them in the <button onClick={() => navigate('/portal/student/projects')} className="text-primary hover:underline">Projects Dashboard</button>.
                </p>
              )}
            </div>
          )}

          {/* SECTION 4: Internships Tab — Req 90 */}
          {activeSection === 'internships' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-jakarta font-semibold text-on-surface-variant">
                  {isOwnPortfolio ? 'Your Completed Internships' : `${portfolio.name}'s Completed Internships`}
                </p>
              </div>
              {completedInternships.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-[40px] text-outline/40 block mb-2">workspace_premium</span>
                  <p className="text-on-surface-variant font-lexend text-sm">No completed internships yet.</p>
                  {isOwnPortfolio && (
                    <p className="text-xs font-lexend text-on-surface-variant mt-1">
                      Completed internships appear here automatically once you finish an internship.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {completedInternships.map(ci => (
                    <div
                      key={ci.id}
                      className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 flex items-center gap-4"
                      style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
                    >
                      <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-jakarta font-semibold text-on-surface">{ci.title}</h4>
                        <p className="text-sm font-lexend text-on-surface-variant mt-0.5">
                          {ci.companyName} • {ci.duration}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-jakarta font-semibold">Completed</span>
                        <p className="text-xs font-lexend text-on-surface-variant mt-1">{new Date(ci.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: Contact & Links Tab */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              {isEditing ? (
                // Edit LinkedIn
                <div>
                  <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  <p className="text-xs text-on-surface-variant mt-2">This URL acts as your CV/resume link</p>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-outline text-on-surface rounded-lg font-jakarta font-semibold hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Contact Info
                <div>
                  <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">Email</p>
                  <p className="text-body-md text-on-surface mb-6">{portfolio.email}</p>

                  <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">LinkedIn</p>
                  {portfolio.linkedinUrl ? (
                    <a
                      href={portfolio.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-md text-secondary hover:text-secondary-container transition-colors"
                    >
                      {portfolio.linkedinUrl}
                    </a>
                  ) : (
                    <p className="text-body-md text-on-surface-variant">No LinkedIn URL provided</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Box / Tips */}
      <div className="bg-surface-container rounded-xl p-6 border border-surface-container-high">
        <h3 className="font-jakarta font-semibold text-on-surface mb-2">💡 Portfolio Tips</h3>
        <ul className="text-body-sm text-on-surface-variant space-y-1">
          <li>• Keep your profile information up to date</li>
          <li>• Add relevant skills that match your expertise</li>
          <li>• Link your LinkedIn profile to showcase your professional experience</li>
          <li>• Your portfolio is visible to employers and course instructors</li>
        </ul>
      </div>
    </div>
  )
}

