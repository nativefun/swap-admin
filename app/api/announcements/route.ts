import { NextResponse } from "next/server"

export async function GET() {
  const headers = {
    apikey: process.env.SUPABASE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_KEY!}`,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/announcements?select=*&order=created_at.desc`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

