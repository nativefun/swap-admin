import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { title, text, castUrl } = await req.json()

  const headers = {
    apikey: process.env.SUPABASE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_KEY!}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  }

  const data = {
    title,
    text,
    created_at: new Date().toISOString(),
    ...(castUrl && { cast_url: castUrl }),
  }

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/announcements`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (response.status !== 201) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

