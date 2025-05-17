import React, { useState } from 'react'

export default function AskVelvet() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAskVelvet = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')

    try {
      const res = await fetch('/api/askvelvet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      setAnswer(data.answer)
    } catch (err) {
      setAnswer("I'm sorry, something went wrong. Please try again shortly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-12 flex flex-col items-center font-sans">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 tracking-wide">Meet Velvet</h1>
        <p className="text-center text-neutral-400 mb-8">Your luxury AI curtain advisor — here to guide you 24/7.</p>

        <textarea
          placeholder="Ask something like: 'What’s the best blackout fabric for a loft bedroom?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-neutral-800 text-white p-4 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4 min-h-[120px] transition"
        />
        <button
          onClick={handleAskVelvet}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition w-full"
        >
          {loading ? 'Thinking…' : 'Ask Velvet'}
        </button>

        {answer && (
          <div className="bg-neutral-900 text-neutral-200 p-6 mt-6 rounded-lg shadow-md border border-neutral-800">
            <p className="whitespace-pre-line">{answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
