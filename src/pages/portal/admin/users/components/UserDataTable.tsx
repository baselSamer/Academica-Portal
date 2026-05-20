import { useState } from 'react'
import { type AdminUser } from '../scripts/useUsers'
import ConfirmationDialog from '../../../../../components/ConfirmationDialog'

interface UserDataTableProps {
  users: AdminUser[]
  onToggleStatus: (userId: string) => void
}

export default function UserDataTable({ users, onToggleStatus }: UserDataTableProps) {
  const [pendingToggle, setPendingToggle] = useState<AdminUser | null>(null)
  
  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'Instructor': return 'bg-primary/20 text-primary-container font-semibold'
      case 'Student': return 'bg-surface-variant text-on-surface-variant'
      case 'Admin': return 'bg-primary-container text-on-primary-container'
      case 'Staff': return 'bg-surface-variant text-on-surface-variant'
      default: return 'bg-surface-container text-on-surface-variant'
    }
  }

  return (
    <>
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-b-xl shadow-[0_4px_20px_rgba(55,48,163,0.05)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface/50">
              <th className="py-4 px-6 font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant w-1/3">User</th>
              <th className="py-4 px-6 font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant">Role</th>
              <th className="py-4 px-6 font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant">Status</th>
              <th className="py-4 px-6 font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant">Last Active</th>
              <th className="py-4 px-6 font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className={`hover:bg-surface-container-low/50 transition-colors group ${user.status === 'Deactivated' ? 'bg-surface-container-lowest/50' : ''}`}
              >
                <td className={`py-4 px-6 ${user.status === 'Deactivated' ? 'opacity-75' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center font-jakarta font-bold text-tertiary-container border border-outline-variant/20 ${user.status === 'Deactivated' ? 'grayscale' : ''}`}>
                      {(user.name || user.email).split(' ')[0].charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-jakarta text-sm font-semibold text-on-surface ${user.status === 'Deactivated' ? 'line-through decoration-outline/50' : ''}`}>
                        {user.name}
                      </p>
                      <p className="font-lexend text-xs text-outline">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className={`py-4 px-6 ${user.status === 'Deactivated' ? 'opacity-75' : ''}`}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-jakarta text-xs ${getRoleBadgeClasses(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className={`flex items-center gap-1.5 ${user.status === 'Active' ? 'text-secondary' : 'text-error'}`}>
                    <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-secondary' : 'bg-error'}`}></span>
                    <span className="font-lexend text-sm">{user.status}</span>
                  </div>
                </td>
                <td className={`py-4 px-6 font-lexend text-sm text-on-surface-variant ${user.status === 'Deactivated' ? 'opacity-75' : ''}`}>
                  {user.lastActive}
                </td>
                <td className="py-4 px-6 text-right">
                  {user.status === 'Active' ? (
                    <button 
                      onClick={() => setPendingToggle(user)}
                      className="p-2 text-outline hover:text-error transition-colors rounded-full hover:bg-error/10 ml-1" 
                      title="Deactivate"
                      aria-label={`Deactivate ${user.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">block</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setPendingToggle(user)}
                      className="p-2 text-outline hover:text-secondary transition-colors rounded-full hover:bg-secondary/10 ml-1" 
                      title="Activate"
                      aria-label={`Activate ${user.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-on-surface-variant font-lexend text-sm">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        isOpen={!!pendingToggle}
        title={pendingToggle?.status === 'Active' ? 'Deactivate Account?' : 'Activate Account?'}
        message={pendingToggle
          ? `This will ${pendingToggle.status === 'Active' ? 'deactivate' : 'activate'} ${pendingToggle.name}'s account.`
          : ''
        }
        confirmLabel={pendingToggle?.status === 'Active' ? 'Deactivate' : 'Activate'}
        cancelLabel="Cancel"
        tone={pendingToggle?.status === 'Active' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (pendingToggle) onToggleStatus(pendingToggle.id)
          setPendingToggle(null)
        }}
        onCancel={() => setPendingToggle(null)}
      />
    </>
  )
}
