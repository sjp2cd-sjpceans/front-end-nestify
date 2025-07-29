const BASE = import.meta.env.VITE_AI_BRIDGE_URL || 'http://localhost:3002';

export function aiChatStream(
  message: string,
  onChunk: (msg: string) => void,
  onDone?: () => void
) {
  
  //REM: Yikes...
  // const encoder = new TextEncoder()
  const body = JSON.stringify({
    type: 'chat',
    system: { content: 'You are a helpful real estate assistant chatbot. Make it short but very helpfull.' },
    user: { content: message }
  })

  fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(async res => {
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const events = buffer.split('\n\n')
      buffer = events.pop()!

      for (const evt of events) {

        if (!evt.startsWith('data:')) continue

        const match = evt.match(/^data:\s?([\s\S]*)$/)
        if (!match) continue

        const payload = match[1].replace(/\\n/g, '\n')

        if (payload === '[DONE]') {
          onDone?.()
        } else {
          
          onChunk(payload)
        }
      }
    }

    onDone?.()
  })

  // fetch(`${BASE}/ai/chat`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body
  // }).then(async res => {

  //   const reader = res.body!.getReader();
  //   const decoder = new TextDecoder()
  //   let done = false;

  //   while (!done) {

  //     const { value, done: doneReading } = await reader.read()
  //     done = doneReading
  //     if (value) {
  //       const text = decoder.decode(value)
  //       text
  //         .split('\n')
  //         .filter(l => l.startsWith('data: '))
  //         .forEach(l => {
  //           const chunk = l.replace(/^data: /, '').replace(/\\n/g, '\n')
  //           onChunk(chunk)
  //         })
  //     }
  //   }
    
  //   onDone?.()
  // })
}