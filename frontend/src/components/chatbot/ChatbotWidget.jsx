import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../../api/http'
import { endpoints } from '../../api/endpoints'
import { getErrorMessage } from '../../utils/httpError'

export const ChatbotWidget = ({ user }) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({ connected: false, message: 'Checking...' })
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.username || ''}, I am your Medicore AI assistant. Ask me about appointments, records, pharmacy, lab, or billing.`,
    },
  ])

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await api.get(endpoints.chatbot.status)
        setStatus({
          connected: Boolean(response.data.connected),
          message: response.data.message || 'Status loaded.',
        })
      } catch {
        setStatus({
          connected: false,
          message: 'Could not verify chatbot status.',
        })
      }
    }
    if (open) loadStatus()
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setSending(true)
    try {
      const response = await api.post(endpoints.chatbot.ask, {
        message: text,
        history: nextMessages.slice(-8),
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Chatbot error: ${getErrorMessage(error, 'Unable to get response right now.')}`,
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button onClick={() => setOpen(true)} className="ui-btn-primary inline-flex items-center rounded-full p-3 shadow-lg" aria-label="Open chat assistant">
          <MessageCircle size={18} />
        </button>
      ) : (
        <div className="ui-card w-[22rem] rounded-xl shadow-2xl">
          <div className="ui-sidebar flex items-center justify-between rounded-t-xl px-3 py-2">
            <div>
              <p className="text-sm font-semibold">Medicore AI Chat</p>
              <p className="ui-sidebar-muted text-[11px]">
                {status.connected ? 'Connected' : 'Key Missing'} - {status.message}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
          <div className="h-80 space-y-2 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user' ? 'ui-btn-primary ml-auto' : 'ui-soft'
                }`}
              >
                {message.content}
              </div>
            ))}
            {sending && <p className="ui-text-muted text-xs">Assistant is typing...</p>}
          </div>
          <div className="flex gap-2 border-t p-3" style={{ borderColor: 'var(--border)' }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage()
              }}
              className="ui-input w-full rounded px-3 py-2 text-sm"
              placeholder="Ask hospital assistant..."
              disabled={!status.connected}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim() || !status.connected}
              className="ui-btn-primary rounded px-3 py-2 disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
