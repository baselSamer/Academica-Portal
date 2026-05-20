import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

import { type UserRole } from './types'

interface User {
  username: string
  role: UserRole
}

interface GlobalContextType {
  user: User | null
  login: (username: string, role: UserRole) => void
  logout: () => void
  isLoggedIn: boolean
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('polaris_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((username: string, role: UserRole) => {
    const u = { username, role }
    localStorage.setItem('polaris_user', JSON.stringify(u))
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('polaris_user')
    setUser(null)
  }, [])

  const isLoggedIn = !!user

  const value: GlobalContextType = {
    user,
    login,
    logout,
    isLoggedIn
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}
