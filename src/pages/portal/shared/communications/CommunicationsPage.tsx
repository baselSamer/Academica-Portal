import { useMemo, useState } from 'react'
import useMessages from '../../../../hooks/useMessages'
import { useGlobalContext } from '../../../../globalContext'
import type { Conversation, UserRole } from '../../../../types'

/**
 * CommunicationsPage — premium messaging interface for direct communication.
 * Focused on a modern, integrated feel rather than a separate window app.
 * Covers Req 68, 69, 70.
 */
export default function CommunicationsPage() {
  const { conversations, activeConversation, activeMessages, sendMessage, selectConversation, totalUnread } = useMessages()
  const { user } = useGlobalContext()
  const [msgInput, setMsgInput] = useState('')
  const myId = user?.username || 'me'

  const roleLabels: Record<UserRole, string> = useMemo(() => ({
    Student: 'Student',
    Employer: 'Employer',
    'Course Instructor': 'Instructor',
    Administrator: 'Administrator'
  }), [])

  const getRoleLabel = (role?: UserRole): string | null => (role ? roleLabels[role] : null)

  const handleSend = (): void => {
    if (!msgInput.trim()) return
    sendMessage(msgInput)
    setMsgInput('')
  }

  const fmt = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-jakarta font-bold text-on-surface tracking-tight">Messages</h2>
          <p className="font-lexend text-on-surface-variant text-sm mt-1">
            Secure, direct communication with your network.
          </p>
        </div>
        {totalUnread > 0 && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center gap-2 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-jakarta font-bold uppercase tracking-wider">{totalUnread} New Messages</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left Panel: Conversation List */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/30">
              <p className="text-sm font-lexend text-on-surface-variant">No active conversations</p>
            </div>
          ) : (
            conversations.map((c: Conversation & { _otherParticipant?: { name: string; avatar: string; role?: string } }) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`group flex items-center gap-4 p-3 rounded-2xl transition-all border w-full text-left ${
                  activeConversation?.id === c.id
                    ? 'bg-primary text-on-primary border-primary shadow-raised'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary/40 hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-jakarta font-bold text-lg flex-shrink-0 shadow-sm ${
                  activeConversation?.id === c.id ? 'bg-on-primary text-primary' : 'bg-primary-container text-on-primary-container'
                }`}>
                  <span className="text-lg font-jakarta font-bold">{c.participantAvatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5 mb-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-jakarta font-bold text-sm truncate">{c._otherParticipant?.name ?? c.participantName}</span>
                      <span className={`text-[9px] font-lexend whitespace-nowrap ${activeConversation?.id === c.id ? 'text-on-primary/70' : 'text-outline'}`}>
                        {fmt(c.lastTimestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c._otherParticipant?.role && (
                        <span className={`text-[9px] font-jakarta font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${activeConversation?.id === c.id
                          ? 'text-on-primary border-on-primary/30'
                          : 'text-on-surface-variant border-outline-variant/30'
                          }`}
                        >
                          {getRoleLabel(c._otherParticipant.role as any)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs font-lexend truncate ${activeConversation?.id === c.id ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                    {c.lastMessage}
                  </p>
                </div>
                {c.unreadCount > 0 && activeConversation?.id !== c.id && (
                  <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary text-[10px] flex items-center justify-center font-bold shadow-sm">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Right Panel: Chat Interface */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold">
                    <span className="text-sm font-jakarta font-bold">{activeConversation?.participantAvatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-jakarta font-bold text-on-surface">{activeConversation?._otherParticipant?.name ?? activeConversation?.participantName}</h3>
                      {activeConversation?._otherParticipant?.role && (
                        <span className="text-[10px] font-jakarta font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-outline-variant/30 text-on-surface-variant">
                          {getRoleLabel(activeConversation._otherParticipant.role as any)}
                        </span>
                      )}
                      {activeConversation?.participantRole && !activeConversation?._otherParticipant?.role && (
                        <span className="text-[10px] font-jakarta font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-outline-variant/30 text-on-surface-variant">
                          {getRoleLabel(activeConversation.participantRole)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="text-[10px] font-lexend text-on-surface-variant uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                  </button>
                  <button className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </button>
                  <button className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {activeMessages.map((m) => {
                  const isMe = m.senderId === myId
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] group`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm font-lexend shadow-sm ${
                          isMe 
                            ? 'bg-primary text-on-primary rounded-tr-none' 
                            : 'bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/20'
                        }`}>
                          {m.content}
                        </div>
                        <p className={`text-[10px] font-lexend text-outline mt-1.5 px-1 flex items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {getRoleLabel(isMe ? user?.role : (m.senderRole ?? activeConversation?.participantRole)) && (
                            <span className="uppercase tracking-wider font-jakarta font-semibold text-[10px]">
                              {getRoleLabel(isMe ? user?.role : (m.senderRole ?? activeConversation?.participantRole))}
                            </span>
                          )}
                          <span>{fmt(m.timestamp)}</span>
                          {isMe && <span className="material-symbols-outlined text-[14px] text-secondary">done_all</span>}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/20">
                <div className="flex items-center gap-4 bg-surface-container-low/50 p-2 pl-6 rounded-2xl border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">add_circle</span>
                  </button>
                  <input 
                    value={msgInput} 
                    onChange={e => setMsgInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                    className="flex-1 bg-transparent py-3 font-lexend text-sm text-on-surface placeholder:text-outline outline-none" 
                    placeholder="Type your message here..." 
                  />
                  <button 
                    onClick={handleSend} 
                    className="w-12 h-12 bg-primary text-on-primary rounded-xl hover:shadow-raised transition-all active:scale-95 flex items-center justify-center group"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-surface-container-low/10">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
                  <span className="material-symbols-outlined text-[40px] text-primary/40 animate-pulse">chat_bubble</span>
                </div>
                <h3 className="text-xl font-jakarta font-bold text-on-surface">Your Workspace Inbox</h3>
                <p className="font-lexend text-on-surface-variant text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                  Select a conversation from the sidebar to view messages and collaborate with your team.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
