import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNavigationByRole } from './navigation'
import { ChatbotWidget } from '../chatbot/ChatbotWidget'
import { useTheme } from '../../context/ThemeContext'

export const AppShell = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const navItems = getNavigationByRole(user?.role)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--app-bg)', color: 'var(--app-fg)' }}>
      <div className="mx-auto flex max-w-screen-2xl">
        <aside className={`ui-sidebar fixed inset-y-0 left-0 z-40 w-72 p-4 shadow-2xl transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="ui-sidebar-muted text-xs uppercase tracking-[0.2em]">Medicore HMS</p>
              <h1 className="text-xl font-semibold">Clinical Command Center</h1>
            </div>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X size={18} />
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'ui-sidebar-link-active ring-1 ring-white/20' : 'ui-sidebar-link'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-h-screen flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 backdrop-blur md:px-6" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface) 82%, transparent)' }}>
            <button className="ui-btn-secondary rounded p-2 md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu size={18} />
            </button>
            <div className="ml-auto flex items-center gap-3 text-right">
              <button
                onClick={toggleTheme}
                className="ui-btn-secondary rounded-md px-3 py-2 text-sm"
                aria-label="Toggle color theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div>
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="ui-text-muted text-xs uppercase">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="ui-btn-primary rounded-md px-3 py-2 text-sm">
                Logout
              </button>
            </div>
          </header>
          <section className="p-4 md:p-6">
            <Outlet />
          </section>
        </main>
      </div>
      <ChatbotWidget user={user} />
    </div>
  )
}
