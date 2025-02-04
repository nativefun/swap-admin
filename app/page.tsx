"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface Announcement {
  id: number
  title: string
  text: string
  cast_url?: string
  created_at: string
}

export default function AnnouncementPage() {
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [castUrl, setCastUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [progress, setProgress] = useState({ total: 0, success: 0, failed: 0 })
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      if (!response.ok) throw new Error("Failed to fetch announcements")
      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setProgress({ total: 0, success: 0, failed: 0 })

    try {
      const createRes = await fetch("/api/create-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, castUrl }),
      })

      if (!createRes.ok) throw new Error("Failed to create announcement")

      const sendRes = await fetch("/api/send-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      })

      const data = await sendRes.json()
      setProgress(data)
      setResult({ success: true, message: "Announcement sent successfully!" })
      fetchAnnouncements()
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Create and Send Announcement</CardTitle>
          <CardDescription>Fill in the details to create and send an announcement to all users.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter announcement text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="castUrl">Cast URL (optional)</Label>
              <Input
                id="castUrl"
                value={castUrl}
                onChange={(e) => setCastUrl(e.target.value)}
                placeholder="Enter cast URL (optional)"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Sending..." : "Create and Send Announcement"}
          </Button>
          {result && (
            <div className={`flex items-center space-x-2 ${result.success ? "text-green-600" : "text-red-600"}`}>
              {result.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{result.message}</span>
            </div>
          )}
          {progress.total > 0 && (
            <div className="text-sm">
              <p>Total Users: {progress.total}</p>
              <p>Successful: {progress.success}</p>
              <p>Failed: {progress.failed}</p>
            </div>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {announcements.map((announcement) => (
              <li key={announcement.id} className="border-b pb-2">
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className="text-sm text-gray-600">{announcement.text}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(announcement.created_at).toLocaleString()}</span>
                  <Link href={`/edit/${announcement.id}`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

