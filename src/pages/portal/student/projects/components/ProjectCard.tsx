/**
 * ProjectCard — Displays a summary of a student project.
 *
 * @param id - Unique project identifier.
 * @param title - Project title.
 * @param course - Course name the project belongs to.
 * @param languages - Array of programming language names.
 * @param rating - Optional instructor rating out of 5.
 * @param isPublic - Whether the project is visible on the student's portfolio.
 * @param createdDate - Date the project was created.
 * @param onEdit - Callback when edit button is clicked.
 * @param onDelete - Callback when delete button is clicked.
 * @param onView - Callback when view button is clicked.
 * @param onToggleVisibility - Callback when visibility toggle is clicked.
 */


import useCourses from '../../../../../hooks/useCourses';
import FlagReasonBanner from './FlagReasonBanner';

interface ProjectCardProps {
    id: string;
    title: string;
    course?: string;
    languages: string[];
    rating?: number;
    isPublic?: boolean;
    createdDate: string;
    status?: 'active' | 'flagged';
    flagReason?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView: (id: string) => void;
    onToggleVisibility?: (id: string) => void;
    onTasks?: (id: string) => void;
}

export default function ProjectCard({
    id,
    title,
    course,
    languages,
    rating,
    isPublic,
    createdDate,
    status = 'active',
    flagReason,
    onEdit,
    onDelete,
    onView,
    onToggleVisibility,
    onTasks,
}: ProjectCardProps) {
    const { getCourseById } = useCourses();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const courseData = getCourseById(course);
    const isFlagged = status === 'flagged';

    return (
        <div
            className={`bg-surface-container-lowest rounded-xl p-6 border transition-all duration-300 cursor-pointer group relative flex flex-col h-full ${isFlagged ? 'border-error/40 bg-error/5' : 'border-outline-variant/40 hover:shadow-raised hover:scale-[1.01]'
                }`}
            onClick={() => onView(id)}
        >
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-jakarta font-semibold text-on-background group-hover:text-primary transition-colors duration-150 line-clamp-2">
                                    {title}
                                </h3>
                                {isFlagged && (
                                    <span className="px-2 py-0.5 bg-error text-on-error rounded-full text-[10px] font-jakarta font-bold uppercase tracking-wider">
                                        Flagged
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Visibility Toggle Icon (Req Refined) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isFlagged && onToggleVisibility) {
                                    onToggleVisibility(id);
                                }
                            }}
                            disabled={isFlagged}
                            className={`p-2 rounded-lg transition-all duration-200 ${isFlagged
                                    ? 'text-outline-variant cursor-not-allowed'
                                    : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
                                }`}
                            title={isFlagged ? 'Visibility cannot be changed while flagged' : (isPublic ? 'Make Private' : 'Make Public')}
                        >
                            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isPublic ? "'FILL' 1" : "'FILL' 0" }}>
                                {isPublic ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-jakarta font-bold">
                            {courseData?.code || 'N/A'}
                        </span>
                        <p className="text-sm font-lexend text-on-surface-variant line-clamp-1">{courseData?.name || course}</p>
                    </div>
                </div>

                {/* Languages */}
                <div>
                    <div className="flex flex-wrap gap-2">
                        {languages.slice(0, 3).map((lang) => (
                            <span
                                key={lang}
                                className="text-xs font-jakarta font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                                {lang}
                            </span>
                        ))}
                        {languages.length > 3 && (
                            <span className="text-xs font-jakarta font-semibold bg-surface-container text-on-surface-variant px-2 py-1 rounded-full">
                                +{languages.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
                    <p className="text-xs font-lexend text-on-surface-variant">
                        Created {formatDate(createdDate)}
                    </p>
                    {rating && (
                        <p className="text-xs font-lexend text-secondary font-semibold">
                            ⭐ {rating}/5
                        </p>
                    )}
                </div>
            </div>

            {isFlagged && flagReason && <FlagReasonBanner reason={flagReason} />}

            {!isFlagged && (
                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-outline-variant/40" onClick={(e) => e.stopPropagation()}>
                    {/* Tasks shortcut (Req 32) */}
                    {onTasks && (
                        <button
                            onClick={() => onTasks(id)}
                            className="w-full text-sm font-jakarta font-semibold px-4 py-2.5 rounded-lg bg-primary/8 text-primary hover:bg-primary hover:text-on-primary transition-all duration-200 border border-primary/20 shadow-sm flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">task</span>
                            Task Board
                        </button>
                    )}
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(id)}
                                className="flex-1 text-sm font-jakarta font-semibold px-4 py-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all duration-200 border border-primary/10 shadow-sm flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(id)}
                                className="flex-1 text-sm font-jakarta font-semibold px-4 py-2.5 rounded-lg border border-error/30 text-error hover:bg-error hover:text-on-error transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
