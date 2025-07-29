const BASE = import.meta.env.VITE_AI_BRIDGE_URL || 'http://localhost:3002';

export function aiChatStream(
  message: string,
  onChunk: (msg: string) => void,
  onDone?: () => void
) {

  // const encoder = new TextEncoder()
  const body = JSON.stringify({
    type: 'chat',
    system: { content: 'You are a helpful real estate assistant chatbot.' },
    user: { content: message }
  })

  fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(async res => {

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let done = false;

    while (!done) {

      const { value, done: doneReading } = await reader.read()
      done = doneReading
      if (value) {
        const text = decoder.decode(value)
        text
          .split('\n')
          .filter(l => l.startsWith('data: '))
          .forEach(l => {
            const chunk = l.replace(/^data: /, '').replace(/\\n/g, '\n')
            onChunk(chunk)
          })
      }
    }
    
    onDone?.()
  })
}