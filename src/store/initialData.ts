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
  LinkRequest,
  CourseLink,
  CompletedInternship,
  ProjectInvitation,
  FlaggedProject,
  ProjectAppeal,
  EmployerStats,
  FavoriteItem,
  Message,
  Conversation,
  Notification as AppNotification
} from '../types';

export interface ProjectTask {
  id: string;
  description: string;
  assigneeId: string;
  status: 'pending' | 'post-poned' | 'completed';
  importance: 'High' | 'Medium' | 'Low';
  deadline: string;
}

export interface ThesisDraft {
  id: string;
  name: string;
  uploadDate: string;
  isFinal: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  courseId: string;
  ownerId: string;
  // Extended fields matching ProjectData in useStudentProjects
  course: string;
  githubLink: string;
  projectReport: string;
  languages: string[];
  demoVideoUrl?: string;
  thesisDrafts: ThesisDraft[];
  tasks: ProjectTask[];
  createdDate: string;
  updatedDate: string;
  isPublic: boolean;
  status: 'active' | 'flagged';
  flagReason?: string;
}

export interface DatabaseState {
  courses: Course[];
  instructors: InstructorProfile[];
  courseLinks: CourseLink[];
  linkRequests: LinkRequest[];
  students: StudentPortfolio[];
  completedInternships: CompletedInternship[];
  projects: Project[];
  projectCollaborators: ProjectCollaborator[];
  projectInvitations: ProjectInvitation[];
  taskFeedback: TaskFeedback[];
  projectFeedback: ProjectFeedback[];
  projectRatings: ProjectRating[];
  flaggedProjects: FlaggedProject[];
  projectAppeals: ProjectAppeal[];
  companies: CompanyProfile[];
  employerStats: EmployerStats | null;
  internships: Internship[];
  applications: InternshipApplication[];
  favorites: FavoriteItem[];
  messages: Message[];
  conversations: Conversation[];
  notifications: AppNotification[];
  users: { username: string; role: UserRole; password: string }[];
}

export const initialData: DatabaseState = {
  courses: [
    {
      id: "course_1",
      name: "Advanced Web Development",
      code: "CSW501",
      semester: "Spring 2026",
      description: "Capstone web development course."
    },
    {
      id: "course_2",
      name: "System Architecture",
      code: "CSW502",
      semester: "Fall 2025",
      description: "Enterprise software design and architecture."
    },
    {
      id: "course_3",
      name: "Machine Learning",
      code: "CSW601",
      semester: "Spring 2026",
      description: "Foundations of ML and statistical learning."
    }
  ],
  instructors: [
    {
      instructorId: "bob@guc.edu.eg",
      name: "Dr. Bob Jones",
      email: "bob@guc.edu.eg",
      biography: "Web Architecture Expert.",
      researchInterests: ["React", "Distributed Systems"],
      educationBackground: "PhD CompSci",
      linkedCourses: ["course_1", "course_2", "course_3"],
      profilePicture: null,
      createdAt: "2026-01-01T10:00:00Z",
      updatedAt: "2026-04-28T10:00:00Z"
    },
    {
      instructorId: "sarah@guc.edu.eg",
      name: "Dr. Sarah Connor",
      email: "sarah@guc.edu.eg",
      biography: "Machine Learning and AI specialist.",
      researchInterests: ["Deep Learning", "Neural Networks", "Computer Vision"],
      educationBackground: "PhD in AI from MIT",
      linkedCourses: ["course_1", "course_3"],
      profilePicture: null,
      createdAt: "2026-01-05T09:00:00Z",
      updatedAt: "2026-01-05T09:00:00Z"
    }
  ],
  courseLinks: [
    {
      instructorId: "bob@guc.edu.eg",
      courseId: "course_1",
      status: "linked",
      direction: "link",
      linkedAt: "2026-01-10T12:00:00Z"
    },
    {
      instructorId: "bob@guc.edu.eg",
      courseId: "course_2",
      status: "linked",
      direction: "link",
      linkedAt: "2026-01-10T12:30:00Z"
    },
    {
      instructorId: "sarah@guc.edu.eg",
      courseId: "course_3",
      status: "linked",
      direction: "link",
      linkedAt: "2026-01-10T10:00:00Z"
    },
    {
      instructorId: "sarah@guc.edu.eg",
      courseId: "course_1",
      status: "linked",
      direction: "unlink",
      linkedAt: "2026-04-25T15:00:00Z"
    }
  ],
  linkRequests: [
    {
      id: "link_req_1",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      courseId: "course_2",
      courseName: "System Architecture",
      type: "link",
      status: "accepted",
      createdAt: "2026-04-22T11:00:00Z"
    },
    {
      id: "link_req_2",
      instructorId: "sarah@guc.edu.eg",
      instructorName: "Dr. Sarah Connor",
      courseId: "course_1",
      courseName: "Advanced Web Development",
      type: "unlink",
      status: "accepted",
      createdAt: "2026-04-25T14:30:00Z"
    },
    {
      id: "link_req_3",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      courseId: "course_3",
      courseName: "Machine Learning",
      type: "link",
      status: "accepted",
      createdAt: "2026-04-28T10:00:00Z"
    }
  ],
  students: [
    {
      studentId: "alice.smith@student.guc.edu.eg",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      major: "Computer Science",
      year: "Senior",
      projectCount: 5,
      skills: ["React", "TypeScript", "Tailwind", "System Design"],
      linkedinUrl: "https://linkedin.com/in/alicesmith",
      bio: "Frontend enthusiast looking for internships.",
      profilePicture: null,
      createdAt: "2026-02-01T08:00:00Z",
      updatedAt: "2026-02-01T08:00:00Z"
    },
    {
      studentId: "charlie@student.guc.edu.eg",
      name: "Charlie Brown",
      email: "charlie@student.guc.edu.eg",
      major: "Artificial Intelligence",
      year: "Senior",
      projectCount: 1,
      skills: ["Python", "TensorFlow", "Keras", "Data Analysis"],
      linkedinUrl: "https://linkedin.com/in/charliebrown",
      bio: "Aspiring data scientist with a focus on deep learning.",
      profilePicture: null,
      createdAt: "2026-02-05T10:00:00Z",
      updatedAt: "2026-02-05T10:00:00Z"
    },
    {
      studentId: "david.m@student.guc.edu.eg",
      name: "David Miller",
      email: "david.m@student.guc.edu.eg",
      major: "Software Engineering",
      year: "Junior",
      projectCount: 1,
      skills: ["Java", "Spring Boot", "MySQL", "Docker"],
      linkedinUrl: "https://linkedin.com/in/davidmiller",
      bio: "Backend developer interested in scalable microservices.",
      profilePicture: null,
      createdAt: "2026-02-10T14:00:00Z",
      updatedAt: "2026-02-10T14:00:00Z"
    }
  ],
  completedInternships: [
    {
      id: "completed_int_1",
      studentId: "alice.smith@student.guc.edu.eg",
      title: "QA Tester Intern",
      companyName: "TechCorp",
      duration: "3 months",
      completedAt: "2025-08-30T00:00:00Z"
    },
    {
      id: "completed_int_2",
      studentId: "charlie@student.guc.edu.eg",
      title: "Backend Developer Intern",
      companyName: "Siemens Healthineers",
      duration: "4 months",
      completedAt: "2025-06-15T00:00:00Z"
    },
    {
      id: "completed_int_3",
      studentId: "david.m@student.guc.edu.eg",
      title: "DevOps Engineer Intern",
      companyName: "TechFlow Solutions",
      duration: "3 months",
      completedAt: "2025-09-01T00:00:00Z"
    }
  ],
  projects: [
    {
      id: "proj-001",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with payment integration and admin dashboard.",
      courseId: "course_1",
      ownerId: "alice.smith@student.guc.edu.eg",
      course: "course_1",
      githubLink: "https://github.com/student/ecommerce",
      projectReport: "Built a full-stack e-commerce platform with React frontend and Node.js backend. Implemented shopping cart, payment integration, and admin dashboard.",
      languages: ["TypeScript", "React", "Node.js", "MongoDB"],
      demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thesisDrafts: [],
      tasks: [
        { id: "task-1", description: "Setup database schema", assigneeId: "alice.smith@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-01-20" },
        { id: "task-2", description: "Implement authentication", assigneeId: "alice.smith@student.guc.edu.eg", status: "pending", importance: "Medium", deadline: "2026-02-15" },
        { id: "task-3", description: "Add unit tests", assigneeId: "alice.smith@student.guc.edu.eg", status: "pending", importance: "Low", deadline: "2026-03-01" }
      ],
      createdDate: "2026-01-15",
      updatedDate: "2026-02-10",
      isPublic: true,
      status: "active"
    },
    {
      id: "proj-002",
      title: "Machine Learning Classifier",
      description: "Image recognition system using CNNs with 94% accuracy.",
      courseId: "course_3",
      ownerId: "alice.smith@student.guc.edu.eg",
      course: "course_3",
      githubLink: "https://github.com/student/ml-classifier",
      projectReport: "Developed a machine learning classifier for image recognition using convolutional neural networks. Achieved 94% accuracy on test dataset.",
      languages: ["Python", "TensorFlow", "Scikit-learn"],
      demoVideoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
      thesisDrafts: [],
      tasks: [],
      createdDate: "2025-09-01",
      updatedDate: "2026-03-20",
      isPublic: true,
      status: "active"
    },
    {
      id: "proj-003",
      title: "Mobile Chat App",
      description: "Cross-platform chat app with real-time messaging and push notifications.",
      courseId: "course_1",
      ownerId: "alice.smith@student.guc.edu.eg",
      course: "course_1",
      githubLink: "https://github.com/student/chat-app",
      projectReport: "Cross-platform chat application with real-time messaging, user authentication, and push notifications.",
      languages: ["React Native", "Firebase", "JavaScript"],
      thesisDrafts: [],
      tasks: [
        { id: "task-p3-1", description: "Set up Firebase project", assigneeId: "alice.smith@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-02-05" },
        { id: "task-p3-2", description: "Implement real-time chat with Socket.io", assigneeId: "alice.smith@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-02-15" },
        { id: "task-p3-3", description: "Add push notifications", assigneeId: "alice.smith@student.guc.edu.eg", status: "pending", importance: "Medium", deadline: "2026-03-10" }
      ],
      createdDate: "2026-02-01",
      updatedDate: "2026-02-28",
      isPublic: true,
      status: "active"
    },
    {
      id: "proj-004",
      title: "Polaris UI Engine",
      description: "A dynamic rendering engine for component-based UI frameworks.",
      courseId: "course_1",
      ownerId: "alice.smith@student.guc.edu.eg",
      course: "course_1",
      githubLink: "https://github.com/student/polaris-ui",
      projectReport: "Developed a high-performance rendering engine that supports virtual DOM diffing, lazy loading, and server-side rendering for large-scale React applications.",
      languages: ["TypeScript", "React", "Webpack"],
      thesisDrafts: [
        { id: "draft-1", name: "thesis_v1.pdf", uploadDate: "2026-03-15", isFinal: false },
        { id: "draft-2", name: "thesis_final.pdf", uploadDate: "2026-04-10", isFinal: true }
      ],
      tasks: [
        { id: "task-p4-1", description: "Design rendering pipeline", assigneeId: "alice.smith@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-03-01" },
        { id: "task-p4-2", description: "Implement virtual DOM diff algorithm", assigneeId: "charlie@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-03-20" },
        { id: "task-p4-3", description: "Write performance benchmarks", assigneeId: "alice.smith@student.guc.edu.eg", status: "pending", importance: "Medium", deadline: "2026-05-01" }
      ],
      createdDate: "2026-02-15",
      updatedDate: "2026-04-10",
      isPublic: true,
      status: "active"
    },
    {
      id: "proj-005",
      title: "Distributed Task Queue",
      description: "A scalable, fault-tolerant job queue using Redis and worker nodes.",
      courseId: "course_2",
      ownerId: "alice.smith@student.guc.edu.eg",
      course: "course_2",
      githubLink: "https://github.com/student/task-queue",
      projectReport: "Built a distributed task queue system capable of handling 10,000+ concurrent jobs with Redis-backed persistence, retry logic, and a real-time dashboard for monitoring job statuses.",
      languages: ["Node.js", "Redis", "Docker", "TypeScript"],
      thesisDrafts: [],
      tasks: [
        { id: "task-p5-1", description: "Set up Redis cluster", assigneeId: "alice.smith@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-01-30" },
        { id: "task-p5-2", description: "Implement job retry logic", assigneeId: "alice.smith@student.guc.edu.eg", status: "completed", importance: "High", deadline: "2026-02-20" },
        { id: "task-p5-3", description: "Build monitoring dashboard", assigneeId: "alice.smith@student.guc.edu.eg", status: "post-poned", importance: "Medium", deadline: "2026-04-15" }
      ],
      createdDate: "2026-01-20",
      updatedDate: "2026-03-05",
      isPublic: true,
      status: "flagged",
      flagReason: "Unapproved API usage"
    },
    {
      id: "proj-007",
      ownerId: "charlie@student.guc.edu.eg",
      title: "Neural Network Optimizer",
      description: "A tool to optimize hyperparameters for deep neural networks.",
      courseId: "course_3",
      course: "course_3",
      githubLink: "https://github.com/charlie/nn-opt",
      projectReport: "Developed a tool that uses genetic algorithms to find optimal hyperparameters for CNNs and RNNs.",
      languages: ["Python", "PyTorch"],
      thesisDrafts: [],
      tasks: [
        { id: "task-c7-1", description: "Implement genetic algorithm optimizer", assigneeId: "charlie@student.guc.edu.eg", status: "pending", importance: "High", deadline: "2026-06-01" },
        { id: "task-c7-2", description: "Write unit tests for CNN optimizer", assigneeId: "charlie@student.guc.edu.eg", status: "post-poned", importance: "Medium", deadline: "2026-07-01" }
      ],
      createdDate: "2026-03-01",
      updatedDate: "2026-03-05",
      isPublic: true,
      status: "active"
    },
    {
      id: "proj-006",
      ownerId: "david.m@student.guc.edu.eg",
      title: "Microservices Gateway",
      description: "API Gateway for a distributed microservices architecture.",
      courseId: "course_2",
      course: "course_2",
      githubLink: "https://github.com/david/gateway",
      projectReport: "Implemented a custom API gateway using Spring Cloud Gateway with integrated rate limiting and authentication.",
      languages: ["Java", "Spring"],
      thesisDrafts: [],
      tasks: [],
      createdDate: "2026-03-15",
      updatedDate: "2026-03-15",
      isPublic: true,
      status: "active"
    }
  ],
  projectCollaborators: [
    {
      id: "collab-1",
      projectId: "proj-001",
      collaboratorId: "alice.smith@student.guc.edu.eg",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-01-15T09:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-2",
      projectId: "proj-004",
      collaboratorId: "alice.smith@student.guc.edu.eg",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-02-15T09:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-3",
      projectId: "proj-004",
      collaboratorId: "charlie@student.guc.edu.eg",
      name: "Charlie Brown",
      email: "charlie@student.guc.edu.eg",
      role: "collaborator",
      invitationStatus: "accepted",
      invitedAt: "2026-02-16T10:00:00Z",
      respondedAt: "2026-02-16T14:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-4",
      projectId: "proj-002",
      collaboratorId: "alice.smith@student.guc.edu.eg",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2025-09-01T08:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-5",
      projectId: "proj-003",
      collaboratorId: "alice.smith@student.guc.edu.eg",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-02-01T09:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-6",
      projectId: "proj-005",
      collaboratorId: "alice.smith@student.guc.edu.eg",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-01-20T10:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-7",
      projectId: "proj-006",
      collaboratorId: "david.m@student.guc.edu.eg",
      name: "David Miller",
      email: "david.m@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-03-15T11:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-8",
      projectId: "proj-007",
      collaboratorId: "charlie@student.guc.edu.eg",
      name: "Charlie Brown",
      email: "charlie@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-03-01T09:00:00Z",
      profilePicture: null
    },
    {
      id: "collab-9",
      projectId: "proj-006",
      collaboratorId: "sarah@guc.edu.eg",
      name: "Dr. Sarah Connor",
      email: "sarah@guc.edu.eg",
      role: "instructor",
      invitationStatus: "accepted",
      invitedAt: "2026-05-02T14:00:00Z",
      respondedAt: "2026-05-03T09:00:00Z",
      profilePicture: null
    }
  ],
  projectInvitations: [
    {
      id: "invite_1",
      projectId: "proj-004",
      projectTitle: "Polaris UI Engine",
      senderName: "Alice Smith",
      senderId: "alice.smith@student.guc.edu.eg",
      recipientEmail: "charlie@student.guc.edu.eg",
      recipientName: "Charlie Brown",
      invitationStatus: "accepted",
      createdAt: "2026-02-16T10:00:00Z",
      respondedAt: "2026-02-16T14:00:00Z"
    },
    {
      id: "invite_3",
      projectId: "proj-005",
      projectTitle: "Distributed Task Queue",
      senderName: "Alice Smith",
      senderId: "alice.smith@student.guc.edu.eg",
      recipientEmail: "bob@guc.edu.eg",
      recipientName: "Dr. Bob Jones",
      invitationStatus: "pending",
      createdAt: "2026-04-22T11:00:00Z"
    },
    {
      id: "invite_4",
      projectId: "proj-007",
      projectTitle: "Neural Network Optimizer",
      senderName: "Charlie Brown",
      senderId: "charlie@student.guc.edu.eg",
      recipientEmail: "david.m@student.guc.edu.eg",
      recipientName: "David Miller",
      invitationStatus: "pending",
      createdAt: "2026-05-01T10:00:00Z"
    },
    {
      id: "invite_5",
      projectId: "proj-006",
      projectTitle: "Microservices Gateway",
      senderName: "David Miller",
      senderId: "david.m@student.guc.edu.eg",
      recipientEmail: "sarah@guc.edu.eg",
      recipientName: "Dr. Sarah Connor",
      invitationStatus: "accepted",
      createdAt: "2026-05-02T14:00:00Z",
      respondedAt: "2026-05-03T09:00:00Z"
    },
    {
      id: "invite_6",
      projectId: "proj-007",
      projectTitle: "Neural Network Optimizer",
      senderName: "Charlie Brown",
      senderId: "charlie@student.guc.edu.eg",
      recipientEmail: "sarah@guc.edu.eg",
      recipientName: "Dr. Sarah Connor",
      invitationStatus: "pending",
      createdAt: "2026-05-05T08:00:00Z"
    },
    {
      id: "invite_7",
      projectId: "proj-007",
      projectTitle: "Neural Network Optimizer",
      senderName: "Charlie Brown",
      senderId: "charlie@student.guc.edu.eg",
      recipientEmail: "alice.smith@student.guc.edu.eg",
      recipientName: "Alice Smith",
      invitationStatus: "pending",
      createdAt: "2026-05-06T10:00:00Z"
    },
    {
      id: "invite_8",
      projectId: "proj-006",
      projectTitle: "Microservices Gateway",
      senderName: "David Miller",
      senderId: "david.m@student.guc.edu.eg",
      recipientEmail: "alice.smith@student.guc.edu.eg",
      recipientName: "Alice Smith",
      invitationStatus: "pending",
      createdAt: "2026-05-07T11:00:00Z"
    }
  ],
 taskFeedback: [
    {
      id: "task_feedback_1",
      taskId: "task-1",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      comment: "Your schema design looks good, but consider indexing the foreign keys.",
      createdAt: "2026-02-28T10:00:00Z",
      updatedAt: "2026-02-28T10:00:00Z"
    }
  ],
  projectFeedback: [
    {
      id: "feedback_1",
      projectId: "proj-001",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      feedbackType: "general",
      comment: "Excellent use of Tailwind and TypeScript. Needs better responsive design.",
      createdAt: "2026-03-01T14:00:00Z",
      updatedAt: "2026-03-01T14:00:00Z"
    },
    {
      id: "feedback_2",
      projectId: "proj-006",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      feedbackType: "general",
      comment: "Well-structured API gateway. Consider adding rate limiting documentation to the project report.",
      createdAt: "2026-04-26T10:30:00Z",
      updatedAt: "2026-04-26T10:30:00Z"
    }
  ],
  projectRatings: [
    {
      id: "rating_1",
      projectId: "proj-001",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      rating: 4,
      comment: "Solid A- work.",
      createdAt: "2026-03-01T14:05:00Z"
    },
    {
      id: "rating_2",
      projectId: "proj-006",
      instructorId: "bob@guc.edu.eg",
      instructorName: "Dr. Bob Jones",
      rating: 4,
      comment: "Strong architecture. Good use of Spring Cloud Gateway.",
      createdAt: "2026-04-26T11:00:00Z"
    }
  ],
  flaggedProjects: [
    {
      id: "flag_1",
      projectId: "proj-005",
      projectTitle: "Distributed Task Queue",
      projectOwnerId: "alice.smith@student.guc.edu.eg",
      projectOwnerName: "Alice Smith",
      flaggedBy: "admin_1",
      flaggedByName: "System Admin",
      reason: "Unapproved API usage",
      description: "Project uses external API without declaring it in documentation.",
      flaggedAt: "2026-03-05T09:00:00Z",
      status: "resolved"
    }
  ],
  projectAppeals: [
    {
      id: "appeal_1",
      flaggedProjectId: "flag_1",
      projectId: "proj-005",
      studentId: "alice.smith@student.guc.edu.eg",
      studentName: "Alice Smith",
      appealMessage: "The API used is an open-source mock backend permitted by the syllabus.",
      submittedAt: "2026-03-06T11:00:00Z",
      status: "approved",
      adminResponse: "The mock backend is permitted under the course syllabus. Flag removed.",
      respondedAt: "2026-04-10T11:00:00Z"
    }
  ],
  companies: [
    {
      companyName: "TechCorp",
      biography: "Leading software company in Cairo.",
      address: "New Cairo, Egypt",
      contactEmail: "hr@techcorp.com",
      phone: "01000000000",
      logoUrl: "/techcorp_logo.png",
      approvalStatus: "Approved",
      location: { lat: 30.0444, lng: 31.2357 },
      documents: [
        { id: "doc_1", name: "Tax_Registration.pdf", type: "PDF", size: 102450, uploadedAt: "2026-01-15T10:00:00Z" },
        { id: "doc_2", name: "Commercial_License.pdf", type: "PDF", size: 204800, uploadedAt: "2026-01-15T10:05:00Z" }
      ]
    },
    {
      companyName: "Global Systems",
      biography: "International IT consulting firm.",
      address: "Maadi, Cairo",
      contactEmail: "hr@globalsys.com",
      phone: "01222222222",
      logoUrl: "/dummy-logo-2.png",
      approvalStatus: "Pending",
      location: { lat: 29.9602, lng: 31.2569 },
      documents: [
        { id: "doc_3", name: "Company_Portfolio.pdf", type: "PDF", size: 512000, uploadedAt: "2026-03-01T14:00:00Z" }
      ]
    },
    {
      companyName: "Siemens Healthineers",
      biography: "Pioneering breakthroughs in healthcare. For everyone. Everywhere.",
      address: "Henkestr. 127, 91052 Erlangen, Germany",
      contactEmail: "hr@siemens-healthineers.com",
      phone: "0049912345678",
      logoUrl: "/dummy-logo-2.png",
      approvalStatus: "Approved",
      location: null,
      documents: [
        { id: "doc_siemens_1", name: "Tax_Certificate.pdf", type: "PDF", size: 245000, uploadedAt: "2026-04-01T09:00:00Z" }
      ]
    },
    {
      companyName: "TechFlow Solutions",
      biography: "Agile software consulting and custom enterprise development.",
      address: "100 Tech Park Way, Suite 400, San Jose, CA",
      contactEmail: "recruiting@techflow.io",
      phone: "0014085551234",
      logoUrl: "/dummy-logo.png",
      approvalStatus: "Approved",
      location: null,
      documents: [
        { id: "doc_techflow_1", name: "Business_Registration.pdf", type: "PDF", size: 189000, uploadedAt: "2026-04-15T14:00:00Z" }
      ]
    },
    {
      companyName: "Global Corp",
      biography: "A multinational conglomerate.",
      address: "123 Global Ave, New York, NY",
      contactEmail: "contact@globalcorp.com",
      phone: "0012125559876",
      logoUrl: "/globalcorp_logo.png",
      approvalStatus: "Pending",
      location: null,
      documents: [
        { id: "doc_global_1", name: "Incorporation_Documents.pdf", type: "PDF", size: 312000, uploadedAt: "2026-04-20T11:00:00Z" }
      ]
    }
  ],
  employerStats: {
    internshipsOffered: 15,
    studentsPlaced: 10,
    placementsOverTime: [
      { month: "Jan", placements: 2, internships: 3 },
      { month: "Feb", placements: 5, internships: 5 },
      { month: "Mar", placements: 3, internships: 7 }
    ]
  },
 internships: [
    {
      id: "internship_1",
      title: "Frontend Developer Intern",
      description: "Build modern UIs using React.",
      skills: ["React", "TypeScript"],
      duration: "3 months",
      applicationDeadline: "2025-05-01T00:00:00Z",
      programmingLanguages: ["JavaScript", "TypeScript"],
      status: "Hiring",
      archived: false,
      postedAt: "2026-03-10T08:00:00Z",
      companyName: "TechCorp",
      companyLogo: "/dummy-logo.png",
      applicantCount: 5
    },
    {
      id: "internship_2",
      title: "UI/UX Designer Intern",
      description: "Create wireframes and prototypes for our web apps.",
      skills: ["Figma", "UI Design"],
      duration: "2 months",
      applicationDeadline: "2025-04-15T00:00:00Z",
      programmingLanguages: [],
      status: "Hiring",
      archived: false,
      postedAt: "2026-03-12T09:00:00Z",
      companyName: "TechCorp",
      companyLogo: "/dummy-logo.png",
      applicantCount: 2
    },
    {
      id: "internship_3",
      title: "Data Scientist Intern",
      description: "Analyze large datasets and build predictive models.",
      skills: ["Python", "SQL", "Machine Learning"],
      duration: "4 months",
      applicationDeadline: "2026-06-01T00:00:00Z",
      programmingLanguages: ["Python", "R"],
      status: "Hiring",
      archived: false,
      postedAt: "2026-03-25T10:00:00Z",
      companyName: "Global Systems",
      companyLogo: "/dummy-logo-2.png",
      applicantCount: 0
    },
    {
      id: "internship_4",
      title: "Backend Engineer Intern",
      description: "Build scalable APIs and microservices.",
      skills: ["Node.js", "PostgreSQL", "Docker"],
      duration: "3 months",
      applicationDeadline: "2025-03-15T00:00:00Z",
      programmingLanguages: ["JavaScript", "TypeScript"],
      status: "Hiring",
      archived: false,
      postedAt: "2026-02-01T08:00:00Z",
      companyName: "Siemens Healthineers",
      companyLogo: "/dummy-logo-2.png",
      applicantCount: 3
    }
  ],
  applications: [
    {
      id: "application_1",
      internshipId: "internship_1",
      internshipTitle: "Frontend Developer Intern",
      companyName: "TechCorp",
      studentId: "alice.smith@student.guc.edu.eg",
      studentName: "Alice Smith",
      studentEmail: "alice.smith@student.guc.edu.eg",
      coverLetter: "I have built several React applications and am excited about frontend development.",
      appliedAt: "2025-04-10T10:00:00Z",
      status: "Pending",
      contributionScore: 92
    },
    {
      id: "application_2",
      internshipId: "internship_1",
      internshipTitle: "Frontend Developer Intern",
      companyName: "TechCorp",
      studentId: "charlie@student.guc.edu.eg",
      studentName: "Charlie Brown",
      studentEmail: "charlie@student.guc.edu.eg",
      coverLetter: "I am a senior student with Python experience but eager to learn React.",
      appliedAt: "2025-04-12T11:00:00Z",
      status: "Nominated",
      contributionScore: 87
    },
    {
      id: "application_3",
      internshipId: "internship_1",
      internshipTitle: "Frontend Developer Intern",
      companyName: "TechCorp",
      studentId: "david.m@student.guc.edu.eg",
      studentName: "David Miller",
      studentEmail: "david.m@student.guc.edu.eg",
      coverLetter: "Experienced in full-stack development with strong TypeScript skills.",
      appliedAt: "2025-04-18T14:00:00Z",
      status: "Rejected",
      contributionScore: 78
    },
    {
      id: "application_4",
      internshipId: "internship_2",
      internshipTitle: "UI/UX Designer Intern",
      companyName: "TechCorp",
      studentId: "alice.smith@student.guc.edu.eg",
      studentName: "Alice Smith",
      studentEmail: "alice.smith@student.guc.edu.eg",
      coverLetter: "I have experience with Figma and wireframing from my coursework.",
      appliedAt: "2025-04-05T09:00:00Z",
      status: "Accepted",
      contributionScore: 95
    },
    {
      id: "application_5",
      internshipId: "internship_4",
      internshipTitle: "Backend Engineer Intern",
      companyName: "Siemens Healthineers",
      studentId: "david.m@student.guc.edu.eg",
      studentName: "David Miller",
      studentEmail: "david.m@student.guc.edu.eg",
      coverLetter: "My backend projects include Spring Boot microservices and PostgreSQL databases.",
      appliedAt: "2025-03-10T10:00:00Z",
      status: "Pending",
      contributionScore: 88
    }
  ],
  favorites: [
    {
      id: "fav_1",
      userId: "alice.smith@student.guc.edu.eg",
      type: "project",
      title: "Frontend Developer Intern (TechCorp)",
      subtitle: "Hiring",
      tags: ["React", "TypeScript"],
      savedAt: "2026-03-14T09:00:00Z"
    },
    {
      id: "fav_2",
      userId: "bob@guc.edu.eg",
      type: "portfolio",
      title: "Dr. Bob Jones",
      subtitle: "Web Architecture Expert",
      tags: ["Instructor", "React"],
      savedAt: "2026-03-16T11:00:00Z"
    }
  ],
  messages: [
    {
      id: "msg_1",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "Hello, I just submitted my application for the Frontend Intern position. Let me know if you need any additional documents.",
      timestamp: "2026-03-15T10:05:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_2",
      senderId: "hr@techcorp.com",
      senderName: "TechCorp HR",
      senderRole: "Employer",
      receiverId: "alice.smith@student.guc.edu.eg",
      receiverName: "Alice Smith",
      receiverRole: "Student",
      content: "Hi Alice, we received your application. Your portfolio looks great! We will be in touch soon.",
      timestamp: "2026-03-15T14:30:00Z",
      read: false,
      conversationId: "conv_1"
    },
    {
      id: "msg_a9",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      content: "Hi! I just submitted my application for the Frontend Developer Intern role.",
      timestamp: "2026-04-19T16:00:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a1",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "Hi! I saw your internship posting for Frontend Developer. I just applied and wanted to introduce myself.",
      timestamp: "2026-04-20T09:30:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a2",
      senderId: "hr@techcorp.com",
      senderName: "TechCorp HR",
      senderRole: "Employer",
      receiverId: "alice.smith@student.guc.edu.eg",
      receiverName: "Alice Smith",
      content: "Hi Alice! Thanks for reaching out. Your portfolio looks impressive, especially the Polaris UI Engine project.",
      timestamp: "2026-04-20T11:00:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a3",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "Thank you! I've been working really hard on it. Are there any other open positions you'd recommend?",
      timestamp: "2026-04-20T11:30:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a4",
      senderId: "hr@techcorp.com",
      senderName: "TechCorp HR",
      senderRole: "Employer",
      receiverId: "alice.smith@student.guc.edu.eg",
      receiverName: "Alice Smith",
      content: "We also have a UI/UX Designer Intern role. Would you be interested in that as well?",
      timestamp: "2026-04-21T10:00:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a5",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "That sounds amazing! I have experience with Figma and wireframing. Could we schedule a call to discuss?",
      timestamp: "2026-04-21T14:00:00Z",
      read: false,
      conversationId: "conv_1"
    },
    {
      id: "msg_a6",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "I also wanted to ask — do you offer any mentorship programs for interns? I'd love to learn from experienced developers.",
      timestamp: "2026-04-22T09:00:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a7",
      senderId: "hr@techcorp.com",
      senderName: "TechCorp HR",
      senderRole: "Employer",
      receiverId: "alice.smith@student.guc.edu.eg",
      receiverName: "Alice Smith",
      content: "Absolutely! Every intern is paired with a senior developer mentor. We also have weekly tech talks.",
      timestamp: "2026-04-22T11:00:00Z",
      read: true,
      conversationId: "conv_1"
    },
    {
      id: "msg_a8",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "hr@techcorp.com",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "That's exactly what I was hoping to hear! Looking forward to the possibility of joining the team.",
      timestamp: "2026-04-22T12:30:00Z",
      read: false,
      conversationId: "conv_1"
    },
    {
      id: "msg_a10",
      senderId: "hr@techcorp.com",
      senderName: "TechCorp HR",
      senderRole: "Employer",
      receiverId: "alice.smith@student.guc.edu.eg",
      receiverName: "Alice Smith",
      content: "Hi Alice! I've reviewed your portfolio and I'm impressed with your React skills. Let's set up an interview.",
      timestamp: "2026-04-25T10:00:00Z",
      read: false,
      conversationId: "conv_1"
    },
    {
      id: "msg_bob_1",
      senderId: "bob@guc.edu.eg",
      senderName: "Dr. Bob Jones",
      senderRole: "Course Instructor",
      receiverId: "alice.smith@student.guc.edu.eg",
      receiverName: "Alice Smith",
      content: "Alice, I've updated the feedback on your project. Please check the comments.",
      timestamp: "2026-04-24T15:30:00Z",
      read: true,
      conversationId: "conv_bob_alice"
    },
    {
      id: "msg_bob_2",
      senderId: "alice.smith@student.guc.edu.eg",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "bob@guc.edu.eg",
      receiverName: "Dr. Bob Jones",
      receiverRole: "Course Instructor",
      content: "Thank you Dr. Bob! I'll review the feedback right away.",
      timestamp: "2026-04-24T16:00:00Z",
      read: false,
      conversationId: "conv_bob_alice"
    },
    {
      id: "msg_charlie_1",
      senderId: "david.m@student.guc.edu.eg",
      senderName: "David Miller",
      senderRole: "Student",
      receiverId: "charlie@student.guc.edu.eg",
      receiverName: "Charlie Brown",
      content: "Hey Charlie, are you working on the same project for CSW502?",
      timestamp: "2026-04-23T09:00:00Z",
      read: false,
      conversationId: "conv_charlie_david"
    },
    {
      id: "msg_charlie_2",
      senderId: "charlie@student.guc.edu.eg",
      senderName: "Charlie Brown",
      senderRole: "Student",
      receiverId: "david.m@student.guc.edu.eg",
      receiverName: "David Miller",
      receiverRole: "Student",
      content: "Yeah! We should collaborate. What stack are you planning to use?",
      timestamp: "2026-04-23T10:00:00Z",
      read: false,
      conversationId: "conv_charlie_david"
    },
    {
      id: "msg_david_1",
      senderId: "bob@guc.edu.eg",
      senderName: "Dr. Bob Jones",
      senderRole: "Course Instructor",
      receiverId: "david.m@student.guc.edu.eg",
      receiverName: "David Miller",
      content: "David, your project submission is due next week. Make sure to include the API documentation.",
      timestamp: "2026-04-25T09:00:00Z",
      read: true,
      conversationId: "conv_bob_david"
    },
    {
      id: "msg_david_2",
      senderId: "david.m@student.guc.edu.eg",
      senderName: "David Miller",
      senderRole: "Student",
      receiverId: "bob@guc.edu.eg",
      receiverName: "Dr. Bob Jones",
      receiverRole: "Course Instructor",
      content: "Will do, Dr. Bob. I'll have everything submitted by Friday.",
      timestamp: "2026-04-25T11:00:00Z",
      read: true,
      conversationId: "conv_bob_david"
    }
],
  conversations: [
    {
      id: "conv_1",
      participantId: "hr@techcorp.com",
      participantName: "TechCorp HR",
      participantAvatar: "TH",
      participantRole: "Employer",
      lastMessage: "Hi Alice! I've reviewed your portfolio and I'm impressed with your React skills. Let's set up an interview.",
      lastTimestamp: "2026-04-25T10:00:00Z",
      unreadCount: 2,
      participants: ["alice.smith@student.guc.edu.eg", "hr@techcorp.com"]
    },
    {
      id: "conv_bob_alice",
      participantId: "bob@guc.edu.eg",
      participantName: "Dr. Bob Jones",
      participantAvatar: "BJ",
      participantRole: "Course Instructor",
      lastMessage: "Thank you Dr. Bob! I'll review the feedback right away.",
      lastTimestamp: "2026-04-24T16:00:00Z",
      unreadCount: 1,
      participants: ["alice.smith@student.guc.edu.eg", "bob@guc.edu.eg"]
    },
    {
      id: "conv_charlie_david",
      participantId: "charlie@student.guc.edu.eg",
      participantName: "Charlie Brown",
      participantAvatar: "CB",
      participantRole: "Student",
      lastMessage: "Yeah! We should collaborate. What stack are you planning to use?",
      lastTimestamp: "2026-04-23T10:00:00Z",
      unreadCount: 0,
      participants: ["charlie@student.guc.edu.eg", "david.m@student.guc.edu.eg"]
    },
    {
      id: "conv_bob_david",
      participantId: "david.m@student.guc.edu.eg",
      participantName: "David Miller",
      participantAvatar: "DM",
      participantRole: "Student",
      lastMessage: "Will do, Dr. Bob. I'll have everything submitted by Friday.",
      lastTimestamp: "2026-04-25T11:00:00Z",
      unreadCount: 0,
      participants: ["david.m@student.guc.edu.eg", "bob@guc.edu.eg"]
    }
  ],
  notifications: [
    {
      id: "notif_s1",
      type: "feedback",
      title: "New Project Feedback",
      body: "Dr. Bob Jones left feedback on your project 'Polaris UI Engine'.",
      timestamp: "2026-03-01T14:00:00Z",
      read: false,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/projects/proj-004",
      // @ts-ignore (Specific interface extending Notification)
      projectId: "proj-004",
      projectTitle: "Polaris UI Engine",
      feedbackType: "project",
      instructorName: "Dr. Bob Jones"
    },
    {
      id: "notif_s2",
      type: "flag",
      title: "Project Flagged",
      body: "Your project 'Distributed Task Queue' has been flagged for review.",
      timestamp: "2026-03-05T09:00:00Z",
      read: true,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/projects/proj-005/settings",
      // @ts-ignore
      projectId: "proj-005",
      projectTitle: "Distributed Task Queue",
      flagReason: "Unapproved API usage"
    },
    {
      id: "notif_s3",
      type: "appeal_response",
      title: "Appeal Approved",
      body: "Your appeal for 'Distributed Task Queue' was approved. The flag has been removed.",
      timestamp: "2026-04-10T11:00:00Z",
      read: false,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/portal/student/projects/proj-005/view"
    },
    {
      id: "notif_4",
      type: "project_invitation",
      title: "New Collaboration Request",
      body: "Charlie Brown invited you to join 'Neural Network Optimizer'.",
      timestamp: "2026-05-06T10:01:00Z",
      read: false,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/portal/student/invitations"
    },
    {
      id: "notif_5",
      type: "project_invitation",
      title: "New Collaboration Request",
      body: "David Miller invited you to join 'Microservices Gateway'.",
      timestamp: "2026-05-07T11:02:00Z",
      read: false,
      recipientId: "david.m@student.guc.edu.eg",
      link: "/portal/student/invitations"
    },
    {
      id: "notif_6",
      type: "project_invitation",
      title: "New Collaboration Request",
      body: "Charlie Brown invited you to join 'Neural Network Optimizer'.",
      timestamp: "2026-05-01T10:01:00Z",
      read: false,
      recipientId: "david.m@student.guc.edu.eg",
      link: "/portal/student/invitations"
    },
    {
      id: "notif_s4",
      type: "internship_status",
      title: "Application Update",
      body: "TechCorp updated your Frontend Developer application status to Nominated.",
      timestamp: "2026-03-16T09:00:00Z",
      read: false,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/internships/application_1"
    },
    {
      id: "notif_s5",
      type: "project_invitation",
      title: "Invitation Accepted",
      body: "Charlie accepted your invitation to join 'Polaris UI Engine'.",
      timestamp: "2026-02-16T11:00:00Z",
      read: true,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/projects/proj-004/collaborators"
    },
    {
      id: "notif_s6",
      type: "message",
      title: "New Message",
      body: "You have a new message from TechCorp HR.",
      timestamp: "2026-03-15T14:30:00Z",
      read: false,
      recipientId: "alice.smith@student.guc.edu.eg",
      link: "/messages/conv_1"
    },
    {
      id: "notif_i1",
      type: "project_invitation",
      title: "Evaluation Requested",
      body: "Alice Smith invited you to evaluate 'Polaris UI Engine'.",
      timestamp: "2026-02-20T10:00:00Z",
      read: true,
      recipientId: "bob@guc.edu.eg",
      link: "/projects/proj-004"
    },
    {
      id: "notif_i2",
      type: "admin",
      title: "Course Link Approved",
      body: "Your request to link to 'Advanced Web Development' was approved.",
      timestamp: "2026-01-11T09:00:00Z",
      read: true,
      recipientId: "bob@guc.edu.eg",
      link: "/instructor/courses"
    },
    {
      id: "notif_i3",
      type: "message",
      title: "New Message",
      body: "You have a new message from Alice Smith.",
      timestamp: "2026-02-21T11:00:00Z",
      read: false,
      recipientId: "bob@guc.edu.eg",
      link: "/messages/conv_2"
    },
    {
      id: "notif_e1",
      type: "admin",
      title: "Profile Approved",
      body: "Your company profile for TechCorp has been verified and approved.",
      timestamp: "2026-03-01T10:00:00Z",
      read: true,
      recipientId: "hr@techcorp.com",
      link: "/employer/profile"
    },
    {
      id: "notif_e2",
      type: "message",
      title: "New Applicant Message",
      body: "Alice Smith sent a message regarding the Frontend Developer role.",
      timestamp: "2026-03-15T10:05:00Z",
      read: false,
      recipientId: "hr@techcorp.com",
      link: "/messages/conv_1"
    },
    {
      id: "notif_a1",
      type: "admin",
      title: "New Project Flagged",
      body: "The project 'Distributed Task Queue' was flagged for unapproved API usage.",
      timestamp: "2026-03-05T09:00:00Z",
      read: true,
      recipientId: "admin@polaris.edu.eg",
      link: "/portal/administrator/moderation"
    },
    {
      id: "notif_a2",
      type: "admin",
      title: "Company Approval Pending",
      body: "TechCorp has submitted their company profile for review.",
      timestamp: "2026-02-28T14:00:00Z",
      read: true,
      recipientId: "admin@polaris.edu.eg",
      link: "/portal/administrator/verification"
    },
    {
      id: "notif_a3",
      type: "admin",
      title: "Course Link Approved",
      body: "Dr. Bob Jones' request to link 'System Architecture' was approved.",
      timestamp: "2026-04-23T09:00:00Z",
      read: true,
      recipientId: "admin@polaris.edu.eg",
      link: "/portal/administrator/courses"
    },
    {
      id: "notif_a4",
      type: "link_request",
      title: "New Course Link Request",
      body: "Dr. Sarah Connor requested to unlink from 'Advanced Web Development'.",
      timestamp: "2026-04-29T14:30:00Z",
      read: true,
      recipientId: "admin@polaris.edu.eg",
      link: "/portal/administrator/courses"
    },
    {
      id: "notif_a5",
      type: "link_request",
      title: "Course Link Request",
      body: "Dr. Bob Jones requested to link 'Machine Learning' course.",
      timestamp: "2026-04-28T10:00:00Z",
      read: true,
      recipientId: "admin@polaris.edu.eg",
      link: "/portal/administrator/courses"
    },
    {
      id: "notif_a6",
      type: "admin",
      title: "Course Link Approved",
      body: "Dr. Bob Jones' request to link 'Machine Learning' was approved.",
      timestamp: "2026-04-29T09:00:00Z",
      read: true,
      recipientId: "admin@polaris.edu.eg",
      link: "/portal/administrator/courses"
    }
  ],
  users: [
    { username: "alice.smith@student.guc.edu.eg", role: "Student", password: "student123" },
    { username: "bob@guc.edu.eg", role: "Course Instructor", password: "instructor123" },
    { username: "hr@techcorp.com", role: "Employer", password: "employer123" },
    { username: "admin@polaris.edu.eg", role: "Administrator", password: "admin123" },
    { username: "charlie@student.guc.edu.eg", role: "Student", password: "password" },
    { username: "david.m@student.guc.edu.eg", role: "Student", password: "password" },
    { username: "sarah@guc.edu.eg", role: "Course Instructor", password: "password" },
    { username: "hr@globalsys.com", role: "Employer", password: "password" },
    // Pending employers (awaiting verification)
    { username: "hr@siemens-healthineers.com", role: "Employer", password: "pending123" },
    { username: "recruiting@techflow.io", role: "Employer", password: "pending123" },
    { username: "contact@globalcorp.com", role: "Employer", password: "pending123" },
    // Legacy mock accounts
    { username: "student@guc.edu.eg", role: "Student", password: "password" },
    { username: "instructor@guc.edu.eg", role: "Course Instructor", password: "password" },
    { username: "employer@company.com", role: "Employer", password: "password" },
    { username: "admin@guc.edu.eg", role: "Administrator", password: "password" }
  ]
};
