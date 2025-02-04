import { NextResponse } from "next/server"

async function getAllFids() {
  const headers = {
    apikey: process.env.SUPABASE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_KEY!}`,
    "Content-Type": "application/json",
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/notification_tokens?select=fid`, { headers })

  if (response.ok) {
    const data = await response.json() as { fid: number }[]
    const uniqueFids = Array.from(new Set(data.map(item => item.fid)))
    return uniqueFids
  } else {
    throw new Error(`Error getting FIDs: ${response.status}`)
  }
}

async function sendAnnouncementToUser(fid: number, title: string, body: string) {
  const headers = {
    "Content-Type": "application/json",
    "X-Skip-Rate-Limit": "true",
  }

  const data = {
    fid,
    title,
    body,
    notificationId: `announcement_${Date.now()}`,
  }

  const response = await fetch(`${process.env.APP_URL}/api/notifications`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })

  return response.ok
}

export async function POST(req: Request) {
  const { title, text } = await req.json()

  try {
    const fids = await getAllFids()
    let successCount = 0
    let failCount = 0

    for (const fid of fids) {
      const success = await sendAnnouncementToUser(fid, title, text)
      if (success) {
        successCount++
      } else {
        failCount++
      }
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      total: fids.length,
      success: successCount,
      failed: failCount,
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

