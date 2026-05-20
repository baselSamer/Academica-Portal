import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialData, type DatabaseState } from './initialData';
import type { 
  ProjectCollaborator, 
  TaskFeedback, 
  ProjectFeedback, 
  ProjectRating,
  Course,
  Internship,
  InternshipApplication,
  CompanyProfile,
  InstructorProfile,
  StudentPortfolio,
  UserRole,
  Notification as AppNotification
} from '../types';

const databaseSlice = createSlice({
  name: 'database',
  initialState: initialData,
  reducers: {
    resetDatabase: () => initialData,

    updateDatabase: (state, action: PayloadAction<Partial<DatabaseState>>) => {
      return { ...state, ...action.payload };
    },

    // ── Notifications ──────────────────────────────────────────────────────
    toggleNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = (state.notifications as AppNotification[]).find(n => n.id === action.payload);
      if (notif) {
        notif.read = !notif.read;
      }
    },

    markNotificationsAllRead: state => {
      (state.notifications as AppNotification[]).forEach(n => { n.read = true; });
    },

    markInvitationsAllRead: (state) => {
      for (const n of (state.notifications as AppNotification[])) {
        if (n.type === 'project_invitation') {
          n.read = true;
        }
      }
    },

    markInternshipsAllRead: (state) => {
      for (const n of (state.notifications as AppNotification[])) {
        if (n.type === 'internship_status') {
          n.read = true;
        }
      }
    },

    markProjectsAllRead: (state) => {
      for (const n of (state.notifications as AppNotification[])) {
        if (n.type === 'feedback' || n.type === 'flag' || n.type === 'appeal_response') {
          n.read = true;
        }
      }
    },

    markProjectNotifications: (state, action: PayloadAction<string>) => {
      for (const n of (state.notifications as AppNotification[])) {
        if ((n.type === 'feedback' || n.type === 'flag' || n.type === 'appeal_response') && (n as any).projectId === action.payload) {
          n.read = true;
        }
      }
    },

    addNotification: (
      state,
      action: PayloadAction<Omit<AppNotification, 'id' | 'timestamp' | 'read'>>
    ) => {
      const newNotif: AppNotification = {
        ...action.payload,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      (state.notifications as AppNotification[]).unshift(newNotif);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = (state.notifications as AppNotification[]).filter(n => n.id !== action.payload) as any;
    },

    // ── Favorites ──────────────────────────────────────────────────────────
    addFavorite: (state, action: PayloadAction<Omit<DatabaseState['favorites'][number], 'savedAt'>>) => {
      const newItem = { ...action.payload, savedAt: new Date().toISOString().split('T')[0] };
      const existing = state.favorites.find(f => f.id === newItem.id && f.userId === newItem.userId);
      if (existing) {
        return;
      }
      state.favorites.push(newItem);
    },

    removeFavorite: (state, action: PayloadAction<{ id: string; userId: string }>) => {
      state.favorites = state.favorites.filter(f => !(f.id === action.payload.id && f.userId === action.payload.userId));
    },

    // ── Messages ───────────────────────────────────────────────────────────
    sendMessage: (
      state,
      action: PayloadAction<{
        content: string;
        conversationId: string;
        senderId: string;
        senderName: string;
        receiverId: string;
        receiverName: string;
      }>
    ) => {
      const { content, conversationId, senderId, senderName, receiverId, receiverName } = action.payload;
      const msg: DatabaseState['messages'][number] = {
         id: `msg-${Date.now()}`,
         senderId, senderName, senderRole: undefined,
         receiverId, receiverName, receiverRole: undefined,
         content,
         timestamp: new Date().toISOString(),
         read: true,
         conversationId
       };
      state.messages.push(msg);

      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.lastMessage = content.trim();
        conv.lastTimestamp = msg.timestamp;
        if (conv.participants && !conv.participants.includes(senderId)) {
          conv.participants.push(senderId);
        }
        if (conv.participants && !conv.participants.includes(receiverId)) {
          conv.participants.push(receiverId);
        }
        if (!conv.participants) {
          conv.participants = [senderId, receiverId];
        }
        if (conv.participantId !== senderId) {
          conv.unreadCount += 1;
        }
      }
    },

    selectConversation: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find(c => c.id === action.payload);
      if (conv) {
        conv.unreadCount = 0;
      }
    },

    markConversationsAllRead: (state) => {
      state.conversations.forEach(c => { c.unreadCount = 0; });
    },

    startConversation: (state, action: PayloadAction<DatabaseState['conversations'][number] & { senderId?: string }>) => {
      const existing = state.conversations.find(c =>
        c.participantId === action.payload.participantId || c.id === action.payload.id
      );
      if (existing) {
        existing.id = action.payload.id;
        if (action.payload.participants && !existing.participants) {
          existing.participants = action.payload.participants;
        }
        return;
      }
      const conv = { ...action.payload } as any;
      if (!conv.participants && action.payload.senderId) {
        conv.participants = [action.payload.senderId, action.payload.participantId];
      }
      state.conversations.unshift(conv);
    },

    // ── Project Invitations & Collaborators ────────────────────────────────
    acceptInvitation: (
      state,
      action: PayloadAction<{ invitationId: string; recipientEmail: string }>
    ) => {
      const { invitationId, recipientEmail } = action.payload;
      const invitation = state.projectInvitations.find(inv => inv.id === invitationId);
      if (invitation && invitation.recipientEmail === recipientEmail) {
        invitation.invitationStatus = 'accepted';
        invitation.respondedAt = new Date().toISOString();
      }
      state.projectInvitations = state.projectInvitations.filter(inv => 
        !(inv.recipientEmail === recipientEmail && inv.id !== invitationId && inv.projectId === invitation?.projectId)
      );
    },

    rejectInvitation: (
      state,
      action: PayloadAction<{ invitationId: string; recipientEmail: string }>
    ) => {
      const { invitationId, recipientEmail } = action.payload;
      const invitation = state.projectInvitations.find(inv => inv.id === invitationId);
      if (invitation && invitation.recipientEmail === recipientEmail) {
        invitation.invitationStatus = 'rejected';
        invitation.respondedAt = new Date().toISOString();
      }
      state.projectInvitations = state.projectInvitations.filter(inv => 
        !(inv.recipientEmail === recipientEmail && inv.id !== invitationId && inv.projectId === invitation?.projectId)
      );
    },

    sendInvitation: (state, action: PayloadAction<Omit<DatabaseState['projectInvitations'][number], 'id' | 'invitationStatus' | 'createdAt'>>) => {
      state.projectInvitations.push({
        ...action.payload,
        id: `invite-${Date.now()}`,
        invitationStatus: 'pending',
        createdAt: new Date().toISOString(),
      });
    },

    addCollaborator: (state, action: PayloadAction<ProjectCollaborator>) => {
      state.projectCollaborators.push(action.payload);
    },

    removeCollaborator: (state, action: PayloadAction<{ projectId: string; email: string }>) => {
      state.projectCollaborators = state.projectCollaborators.filter(
        c => !(c.projectId === action.payload.projectId && c.email === action.payload.email)
      );
    },

    updateCollaboratorStatus: (
      state,
      action: PayloadAction<{ projectId: string; email: string; status: ProjectCollaborator['invitationStatus'] }>
    ) => {
      const collab = state.projectCollaborators.find(
        c => c.projectId === action.payload.projectId && c.email === action.payload.email
      );
      if (collab) {
        collab.invitationStatus = action.payload.status;
        collab.respondedAt = new Date().toISOString();
      }
    },

    // ── Flagged Projects & Appeals ──────────────────────────────────────────
    flagProject: (state, action: PayloadAction<Omit<DatabaseState['flaggedProjects'][number], 'id' | 'flaggedAt' | 'status'>>) => {
      const { projectId } = action.payload;
      const existing = state.flaggedProjects.find(f => f.projectId === projectId);
      if (existing) {
        Object.assign(existing, action.payload);
        existing.status = 'flagged';
        return;
      }
      state.flaggedProjects.push({
        ...action.payload,
        id: `flag-${Date.now()}`,
        flaggedAt: new Date().toISOString(),
        status: 'flagged',
      });
    },

    submitAppeal: (state, action: PayloadAction<Omit<DatabaseState['projectAppeals'][number], 'id' | 'submittedAt' | 'status'>>) => {
      const { flaggedProjectId } = action.payload;
      state.projectAppeals.push({
        ...action.payload,
        id: `appeal-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      });
      const flag = state.flaggedProjects.find(f => f.id === flaggedProjectId);
      if (flag) {
        flag.status = 'appealed';
      }
    },

    approveAppeal: (state, action: PayloadAction<{ appealId: string; adminResponse?: string }>) => {
      const { appealId, adminResponse } = action.payload;
      const appeal = state.projectAppeals.find(a => a.id === appealId);
      if (appeal) {
        appeal.status = 'approved';
        appeal.adminResponse = adminResponse;
        appeal.respondedAt = new Date().toISOString();
        const flag = state.flaggedProjects.find(f => f.id === appeal.flaggedProjectId);
        if (flag) { flag.status = 'resolved'; }
      }
    },

    rejectAppeal: (state, action: PayloadAction<{ appealId: string; adminResponse?: string }>) => {
      const { appealId, adminResponse } = action.payload;
      const appeal = state.projectAppeals.find(a => a.id === appealId);
      if (appeal) {
        appeal.status = 'rejected';
        appeal.adminResponse = adminResponse;
        appeal.respondedAt = new Date().toISOString();
        const flag = state.flaggedProjects.find(f => f.id === appeal.flaggedProjectId);
        if (flag) { flag.status = 'flagged'; }
      }
    },

    // ── Courses & Links ────────────────────────────────────────────────────────────
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },

    editCourse: (state, action: PayloadAction<{ id: string } & Partial<Course>>) => {
      const { id, ...updates } = action.payload;
      const course = state.courses.find(c => c.id === id);
      if (course) { Object.assign(course, updates); }
    },

    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(c => c.id !== action.payload);
    },

    linkCourse: (state, action: PayloadAction<{ instructorId: string; courseId: string }>) => {
      const { instructorId, courseId } = action.payload;
      const existing = state.courseLinks.find(l => l.instructorId === instructorId && l.courseId === courseId);
      if (existing) {
        existing.status = 'linked';
        existing.linkedAt = new Date().toISOString();
      } else {
        state.courseLinks.push({
          instructorId, courseId, status: 'linked', direction: 'link', linkedAt: new Date().toISOString(),
        });
      }
    },

    unlinkCourse: (state, action: PayloadAction<{ instructorId: string; courseId: string }>) => {
      const { instructorId, courseId } = action.payload;
      state.courseLinks = state.courseLinks.map(l =>
        (l.instructorId === instructorId && l.courseId === courseId)
          ? { ...l, status: 'rejected', linkedAt: new Date().toISOString() }
          : l
      );
    },

    requestCourseLink: (state, action: PayloadAction<{ instructorId: string; courseId: string; direction: 'link' | 'unlink' }>) => {
      const { instructorId, courseId, direction } = action.payload;
      const existing = state.courseLinks.find(l => l.instructorId === instructorId && l.courseId === courseId);
      if (existing) {
        existing.status = 'pending';
        existing.direction = direction;
      } else {
        state.courseLinks.push({
          instructorId, courseId, status: 'pending', direction, linkedAt: new Date().toISOString(),
        });
      }
    },

    // ── Internships & Applications ────────────────────────────────────────────────────────
    addInternship: (state, action: PayloadAction<Internship>) => {
      state.internships.push(action.payload);
    },

    updateInternship: (state, action: PayloadAction<{ id: string } & Partial<Internship>>) => {
      const { id, ...updates } = action.payload;
      const internship = state.internships.find(i => i.id === id);
      if (internship) { Object.assign(internship, updates); }
    },

    deleteInternship: (state, action: PayloadAction<string>) => {
      state.internships = state.internships.filter(i => i.id !== action.payload);
    },

    toggleArchive: (state, action: PayloadAction<string>) => {
      const internship = state.internships.find(i => i.id === action.payload);
      if (internship) { internship.archived = !internship.archived; }
    },

    toggleStatus: (state, action: PayloadAction<string>) => {
      const internship = state.internships.find(i => i.id === action.payload);
      if (internship) {
        internship.status = internship.status === 'Hiring' ? 'Position Filled' : 'Hiring';
      }
    },

    updateApplicationStatus: (state, action: PayloadAction<{ id: string; status: InternshipApplication['status'] }>) => {
      const app = state.applications.find(a => a.id === action.payload.id);
      if (app) { app.status = action.payload.status; }
    },

    applyForInternship: (state, action: PayloadAction<Omit<InternshipApplication, 'id' | 'appliedAt' | 'status' | 'contributionScore'>>) => {
      state.applications.push({
        ...action.payload,
        id: `application-${Date.now()}`,
        appliedAt: new Date().toISOString(),
        status: 'Pending',
        contributionScore: 0,
      });
    },

    // ── Profile Updates ──────────────────────────────
    updateInstructorProfile: (state, action: PayloadAction<{ instructorId: string } & Partial<InstructorProfile>>) => {
      const { instructorId, ...updates } = action.payload;
      const instructor = state.instructors.find(i => i.instructorId === instructorId);
      if (instructor) {
        Object.assign(instructor, updates);
        instructor.updatedAt = new Date().toISOString();
      }
    },

    updateStudentProfile: (state, action: PayloadAction<{ studentId: string } & Partial<StudentPortfolio>>) => {
      const { studentId, ...updates } = action.payload;
      const student = state.students.find(s => s.studentId === studentId);
      if (student) {
        Object.assign(student, updates);
        student.updatedAt = new Date().toISOString();
      }
    },

    updateCompanyProfile: (state, action: PayloadAction<{ contactEmail: string } & Partial<CompanyProfile>>) => {
      const { contactEmail, ...updates } = action.payload;
      const company = state.companies.find(c => c.contactEmail === contactEmail);
      if (company) {
        Object.assign(company, { ...updates });
      }
    },

    setLocation: (state, action: PayloadAction<{ contactEmail: string; lat: number; lng: number; address?: string | null }>) => {
      const { contactEmail, lat, lng, address } = action.payload;
      const company = state.companies.find(c => c.contactEmail === contactEmail);
      if (company) {
        company.location = { lat, lng };
        company.locationAddress = address ?? company.locationAddress ?? null;
        if (address) {
          company.address = address;
        }
      }
    },

    uploadDocument: (state, action: PayloadAction<{ contactEmail: string; doc: { id: string; name: string; type: string; size: number; uploadedAt: string } }>) => {
      const { contactEmail, doc } = action.payload;
      const company = state.companies.find(c => c.contactEmail === contactEmail);
      if (company) {
        company.documents = [...company.documents, doc];
      }
    },

    removeDocument: (state, action: PayloadAction<{ contactEmail: string; docId: string }>) => {
      const { contactEmail, docId } = action.payload;
      const company = state.companies.find(c => c.contactEmail === contactEmail);
      if (company) {
        company.documents = company.documents.filter(d => d.id !== docId);
      }
    },

    // ── Projects ───────────────────────────────────────────────────────────
    addProject: (state, action: PayloadAction<any>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<{ id: string } & Partial<any>>) => {
      const { id, ...updates } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        Object.assign(project, updates);
        (project as any).updatedDate = new Date().toISOString().split('T')[0];
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },

    // ── Feedback & Ratings ──────────────────────────────────────────────────
    addTaskFeedback: (state, action: PayloadAction<TaskFeedback>) => {
      state.taskFeedback.push(action.payload);
    },
    editTaskFeedback: (state, action: PayloadAction<{ id: string; comment: string }>) => {
      const fb = state.taskFeedback.find(f => f.id === action.payload.id);
      if (fb) {
        fb.comment = action.payload.comment;
        fb.updatedAt = new Date().toISOString();
      }
    },
    removeTaskFeedback: (state, action: PayloadAction<string>) => {
      state.taskFeedback = state.taskFeedback.filter(f => f.id !== action.payload);
    },
    addProjectFeedback: (state, action: PayloadAction<ProjectFeedback>) => {
      state.projectFeedback.push(action.payload);
    },
    editProjectFeedback: (state, action: PayloadAction<{ id: string; comment: string }>) => {
      const fb = state.projectFeedback.find(f => f.id === action.payload.id);
      if (fb) {
        fb.comment = action.payload.comment;
        fb.updatedAt = new Date().toISOString();
      }
    },
    removeProjectFeedback: (state, action: PayloadAction<string>) => {
      state.projectFeedback = state.projectFeedback.filter(f => f.id !== action.payload);
    },
    rateProject: (state, action: PayloadAction<ProjectRating>) => {
      const existingIdx = state.projectRatings.findIndex(
        r => r.projectId === action.payload.projectId && r.instructorId === action.payload.instructorId
      );
      if (existingIdx !== -1) {
        state.projectRatings[existingIdx] = action.payload;
      } else {
        state.projectRatings.push(action.payload);
      }
    },
    removeProjectRating: (state, action: PayloadAction<string>) => {
      state.projectRatings = state.projectRatings.filter(r => r.id !== action.payload);
    },

    // ── Auth / Users ────────────────────────────────────────────────────────────
    registerUser: (state, action: PayloadAction<{ username: string; role: UserRole; password?: string; firstName?: string; lastName?: string }>) => {
      const existing = state.users.find(u => u.username === action.payload.username)
      if (!existing) {
        const fullName = [action.payload.firstName, action.payload.lastName].filter(Boolean).join(' ')
        state.users.push({
          username: action.payload.username,
          role: action.payload.role,
          password: action.payload.password || 'password'
        });
        if (action.payload.role === 'Student') {
          state.students.push({
            studentId: action.payload.username,
            name: fullName,
            email: action.payload.username,
            major: '',
            year: '',
            projectCount: 0,
            skills: [],
            linkedinUrl: '',
            bio: '',
            profilePicture: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        } else if (action.payload.role === 'Course Instructor') {
          state.instructors.push({
            instructorId: action.payload.username,
            name: fullName,
            email: action.payload.username,
            biography: '',
            researchInterests: [],
            educationBackground: '',
            linkedCourses: [],
            profilePicture: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
      }
    },
    addCompanyProfile: (state, action: PayloadAction<{
      companyId: string
      name: string
      contactEmail: string
      description: string
      location: string
      industry: string
      size: string
      website: string
      approvalStatus: 'Pending' | 'Approved' | 'Rejected'
    }>) => {
      const existing = state.companies.find((c: any) => c.contactEmail === action.payload.contactEmail)
      if (!existing) {
        state.companies.push({
          ...action.payload,
        } as any)
      }
    },
  }
});

export const {
  resetDatabase,
  updateDatabase,
  addCompanyProfile,

  toggleNotificationRead,
 markNotificationsAllRead,
  markInvitationsAllRead,
  markInternshipsAllRead,
  markProjectsAllRead,
  markProjectNotifications,
  addNotification,
  removeNotification,

  addFavorite,
  removeFavorite,

  sendMessage,
   selectConversation,
   markConversationsAllRead,
   startConversation,

   acceptInvitation,
  rejectInvitation,
  sendInvitation,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorStatus,

  flagProject,
  submitAppeal,
  approveAppeal,
  rejectAppeal,

  addCourse,
  editCourse,
  deleteCourse,
  linkCourse,
  unlinkCourse,
  requestCourseLink,

  addInternship,
  updateInternship,
  deleteInternship,
  toggleArchive,
  toggleStatus,
  updateApplicationStatus,
  applyForInternship,

  updateInstructorProfile,
  updateStudentProfile,
  updateCompanyProfile,
  setLocation,
  uploadDocument,
  removeDocument,

  addProject,
  updateProject,
  deleteProject,

  addTaskFeedback,
  editTaskFeedback,
  removeTaskFeedback,
  addProjectFeedback,
  editProjectFeedback,
  removeProjectFeedback,
  rateProject,
  removeProjectRating,

  registerUser,
} = databaseSlice.actions;

export default databaseSlice.reducer;
