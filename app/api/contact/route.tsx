import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, string>
    // Basic spam check: honeypot
    if (body.company) return NextResponse.json({ ok: true }, { status: 200 })

    // TODO: wire to email provider or webhook (Resend/Formspree/Slack)
    // For now, just log (Vercel will show this in Function Logs)
    console.log('New enquiry:', body)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
