import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cnhfacil_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('cnhfacil_token'))

  function login(userData, jwt) {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('cnhfacil_user', JSON.stringify(userData))
    localStorage.setItem('cnhfacil_token', jwt)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cnhfacil_user')
    localStorage.removeItem('cnhfacil_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.perfil === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
