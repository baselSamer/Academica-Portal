export type UserRole = 'Student' | 'Employer' | 'Course Instructor' | 'Administrator'

export type CompanyStatus = 'Pending' | 'Approved' | 'Rejected'

export interface StudentPortfolio {
  studentId: string
  name: string
  email: string
  major: string
  year: string
  projectCount: number
  skills: string[]
  linkedinUrl: string
  bio: string
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}

export interface CompanyProfile {
  companyName: string
  biography: string
  address: string
  contactEmail: string
  phone: string
  logoUrl: string
  approvalStatus: CompanyStatus
  location: { lat: number; lng: number } | null
  locationAddress?: string | null
  documents: DocumentFile[]
}

export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
}

export interface Internship {
  id: string
  title: string
  description: string
  skills: string[]
  duration: string
  applicationDeadline: string
  programmingLanguages: string[]
  status: 'Hiring' | 'Position Filled'
  archived: boolean
  postedAt: string
  companyName: string
  companyLogo: string
  applicantCount: number
}

export interface InternshipApplication {
  id: string
  internshipId: string
  internshipTitle: string
  companyName: string
  studentId: string
  studentName: string
  studentEmail: string
  coverLetter: string
  appliedAt: string
  status: 'Pending' | 'Nominated' | 'Accepted' | 'Rejected'
  contributionScore: number
}

export interface FavoriteItem {
  id: string
  userId: string
  type: 'project' | 'portfolio'
  title: string
  subtitle: string
  tags: string[]
  rating?: number
  savedAt: string
}

export interface LinkRequest {
  id: string
  instructorId: string
  instructorName: string
  courseId: string
  courseName: string
  type: 'link' | 'unlink'
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole?: UserRole
  receiverId: string
  receiverName: string
  receiverRole?: UserRole
  content: string
  timestamp: string
  read: boolean
  conversationId?: string
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantProfilePicture?: string
  participantRole?: UserRole
  lastMessage: string
  lastTimestamp: string
  unreadCount: number
  participants?: string[]
}

export interface Notification {
  id: string
  type: 'message' | 'internship_status' | 'project_invitation' | 'feedback' | 'flag' | 'admin' | 'appeal_response' | 'link_request'
  title: string
  body: string
  timestamp: string
  read: boolean
  recipientId?: string
  link?: string
  projectId?: string
  projectTitle?: string
  senderName?: string
  feedbackType?: string
  instructorName?: string
  flagReason?: string
}

export interface EmployerStats {
  internshipsOffered: number
  studentsPlaced: number
  placementsOverTime: { month: string; placements: number; internships: number }[]
}

export interface CompletedInternship {
  id: string
  studentId: string
  title: string
  companyName: string
  duration: string
  completedAt: string
}

export interface InstructorProfile {
  instructorId: string
  name: string
  email: string
  biography: string
  researchInterests: string[]
  educationBackground: string
  linkedCourses: string[] // Array of course IDs
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  name: string
  code: string
  semester: string
  description: string
}

export interface CourseLink {
  instructorId: string
  courseId: string
  status: 'linked' | 'pending' | 'rejected'
  direction: 'link' | 'unlink'
  linkedAt: string
}

export interface ProjectCollaborator {
  id: string
  projectId: string
  collaboratorId: string
  name: string
  email: string
  role: 'owner' | 'collaborator' | 'instructor'
  invitationStatus: 'pending' | 'accepted' | 'rejected'
  invitedAt: string
  respondedAt?: string
  profilePicture?: string | null
}

export interface ProjectInvitation {
  id: string
  projectId: string
  projectTitle: string
  senderName: string
  senderId: string
  recipientEmail: string
  recipientName: string
  invitationStatus: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  respondedAt?: string
}

export interface CollaborationSearchResult {
  userId: string
  name: string
  email: string
  role: 'Student' | 'Course Instructor'
  profilePicture?: string | null
  isAlreadyCollaborator: boolean
  teachingCourses?: string[] // For instructor validation
}

export interface TaskFeedback {
  id: string
  taskId: string
  instructorId: string
  instructorName: string
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFeedback {
  id: string
  projectId: string
  instructorId: string
  instructorName: string
  feedbackType: 'general' | 'thesis_draft'
  comment: string
  relatedThesisDraftId?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectRating {
  id: string
  projectId: string
  instructorId: string
  instructorName: string
  rating: number // 1-5
  comment?: string
  createdAt: string
}

export interface FlaggedProject {
  id: string
  projectId: string
  projectTitle: string
  projectOwnerId: string
  projectOwnerName: string
  flaggedBy: string
  flaggedByName: string
  reason: string
  description?: string
  flaggedAt: string
  status: 'flagged' | 'appealed' | 'resolved'
}

export interface ProjectAppeal {
  id: string
  flaggedProjectId: string
  projectId: string
  studentId: string
  studentName: string
  appealMessage: string
  attachedEvidence?: string[]
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  adminResponse?: string
  respondedAt?: string
}

export interface FeedbackNotification extends Notification {
  type: 'feedback' | 'flag' | 'appeal_response'
  projectId: string
  projectTitle: string
  feedbackType?: 'task' | 'project' | 'rating'
  instructorName?: string
  flagReason?: string
}
