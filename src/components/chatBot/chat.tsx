import { useState, useRef } from 'react'
import type { JSX } from 'react'
import { aiChatStream } from '@nestify/services/api/ai/chat'
import ReactMarkdown from 'react-markdown'

type Msg = { from: 'user' | 'bot', text: string }

export function Chatbot(): JSX.Element {

  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  const send = () => {

    if (!input.trim()) return

    const userMsg: Msg = { from: 'user', text: input }

    setMsgs(m => [...m, userMsg])
    setInput('')
    aiChatStream(input, chunk => {
      setMsgs(m => {
        const last = m[m.length - 1]
        if (last.from === 'bot') {

          const updated: Msg = { from: 'bot', text: last.text + chunk }
          return [...m.slice(0, -1), updated]
        } else {

          return [...m, { from: 'bot', text: chunk }]
        }
      })
    })

  }

  setTimeout(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, 100)

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-5 w-[25rem] h-96 border border-gray-400 rounded-lg bg-white flex flex-col shadow-lg"
        >
          <div
            ref={boxRef}
            className="flex-1 p-3 overflow-y-auto"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`my-1 ${m.from === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-xl ${
                    m.from === 'user'
                      ? 'bg-green-100 text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-300 flex items-center space-x-2 flex-row">
            <input
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type..."
            />
            <button
              onClick={send}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700"
      >
        💬
      </button>
    </>
  )
}
