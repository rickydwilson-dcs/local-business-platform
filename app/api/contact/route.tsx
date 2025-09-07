import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // TODO: handle message send using `data`
    return NextResponse.json({ ok: true });
  } catch {
    // no unused variable now
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
