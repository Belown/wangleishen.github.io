import { useState } from 'react'
import { MOODS, TREES } from '../content/site'

export function Demo({ kind }: { kind: 'mood' | 'tree' }) {
  const [out, setOut] = useState('')
  const run = () =>
    setOut(kind === 'mood' ? MOODS[Math.floor(Math.random() * MOODS.length)] : 'Today you are ' + TREES[Math.floor(Date.now() / 864e5) % TREES.length])
  return (
    <>
      <p className="demo-out" aria-live="polite">{out}</p>
      <div className="btns">
        <button type="button" className="b solid" onClick={run}>{kind === 'mood' ? "Get today's forecast" : 'Which tree am I today?'}</button>
      </div>
    </>
  )
}
