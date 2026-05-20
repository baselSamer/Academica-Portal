import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../../../globalContext';
import ProjectEditor from './components/ProjectEditor';

/**
 * ProjectEditorPage — Page wrapper for the ProjectEditor component.
 * Handles URL parameters and navigation after save/cancel.
 */
export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useGlobalContext();

  const isNew = !id || id === 'new';

  // Both the header "Back" button and the editor's Cancel button navigate here.
  const goBack = () => navigate('/portal/student/projects');

  return (
    <div className="min-h-screen bg-background p-[--spacing-polaris-md] md:p-[--spacing-polaris-lg]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={goBack}
            className="text-sm font-jakarta font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            ← {isNew ? 'Back to Projects' : 'Back to My Projects'}
          </button>
        </div>
        <ProjectEditor
          projectId={isNew ? undefined : id}
          currentUserId={user?.username}
          onSave={goBack}
          onCancel={goBack}
        />
      </div>
    </div>
  );
}
