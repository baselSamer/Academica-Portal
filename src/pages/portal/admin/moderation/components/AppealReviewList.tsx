import { useState } from 'react'
import { type Appeal } from '../scripts/useModeration'
import ConfirmationDialog from '../../../../../components/ConfirmationDialog'

interface AppealReviewListProps {
  appeals: Appeal[]
  onAcceptAppeal: (appealId: string, projectId: string) => void
  onRejectAppeal: (appealId: string) => void
}

export default function AppealReviewList({ appeals, onAcceptAppeal, onRejectAppeal }: AppealReviewListProps) {
  const [pendingAction, setPendingAction] = useState<{
    appeal: Appeal
    action: 'accept' | 'reject'
  } | null>(null)

  const pendingAppeals = appeals.filter(a => a.status === 'pending')

  if (pendingAppeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-4">forum</span>
        <h3 className="font-jakarta text-lg font-bold text-on-surface">No Pending Appeals</h3>
        <p className="font-lexend text-sm text-on-surface-variant">There are no appeals from students at the moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
        {pendingAppeals.map(appeal => (
          <div 
            key={appeal.id} 
            className="flex flex-col md:flex-row md:items-start justify-between p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl gap-6 shadow-sm"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Appeal Request
                  </span>
                  <span className="text-xs font-lexend text-outline">&bull; Submitted on {appeal.dateSubmitted}</span>
                </div>
                <h4 className="font-jakarta text-on-surface font-bold text-lg mb-1">
                  {appeal.studentName}
                </h4>
                <p className="font-lexend text-sm text-on-surface-variant mb-4">
                  Regarding Project: <span className="font-semibold">{appeal.projectTitle}</span>
                </p>
                
                <div className="bg-surface-container-low rounded-xl p-4 text-sm font-lexend text-on-surface border border-outline-variant/30">
                  "{appeal.message}"
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
              <button
                onClick={() => setPendingAction({ appeal, action: 'reject' })}
                className="px-4 py-2 font-jakarta font-semibold text-sm text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Reject
              </button>
              <button
                onClick={() => setPendingAction({ appeal, action: 'accept' })}
                className="px-4 py-2 font-jakarta font-semibold text-sm text-on-primary bg-primary hover:bg-primary-container rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationDialog
        isOpen={!!pendingAction}
        title={pendingAction?.action === 'accept' ? 'Accept Appeal?' : 'Reject Appeal?'}
        message={pendingAction
          ? `${pendingAction.appeal.studentName}'s appeal for "${pendingAction.appeal.projectTitle}" will be ${pendingAction.action === 'accept' ? 'accepted and the project activated' : 'rejected'}.`
          : ''
        }
        confirmLabel={pendingAction?.action === 'accept' ? 'Accept Appeal' : 'Reject Appeal'}
        cancelLabel="Cancel"
        tone={pendingAction?.action === 'reject' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (!pendingAction) return
          if (pendingAction.action === 'accept') {
            onAcceptAppeal(pendingAction.appeal.id, pendingAction.appeal.projectId)
          } else {
            onRejectAppeal(pendingAction.appeal.id)
          }
          setPendingAction(null)
        }}
        onCancel={() => setPendingAction(null)}
      />
    </>
  )
}
