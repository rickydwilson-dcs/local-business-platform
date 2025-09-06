'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [status, setStatus] = useState<string>('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    setStatus(res.ok ? 'Thanks — we’ll be in touch.' : 'Something went wrong.')
    if (res.ok) form.reset()
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Get a quote</h1>
        <p className="text-slate-700">Tell us about the job and we’ll get back to you quickly.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="name" placeholder="Your name" className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Phone" className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <textarea name="message" placeholder="Tell us about the job" className="w-full border p-2 rounded" rows={5} required />
        {/* Honeypot */}
        <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
        <button className="px-4 py-2 rounded bg-black text-white">Send</button>
      </form>
      {status && <p className="text-sm">{status}</p>}
    </div>
  )
}
