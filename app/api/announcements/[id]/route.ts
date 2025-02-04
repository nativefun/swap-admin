import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const headers = {
    apikey: process.env.SUPABASE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_KEY!}`,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/announcements?id=eq.${params.id}&select=*`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
    ...(castUrl && { cast_url: castUrl }),
  }

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/announcements?id=eq.${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

