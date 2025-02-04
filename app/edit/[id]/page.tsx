"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [castUrl, setCastUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcements/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch announcement")
        const data = await response.json()
        setTitle(data.title)
        setText(data.text)
        setCastUrl(data.cast_url || "")
      } catch (error) {
        console.error("Error fetching announcement:", error)
      }
    }

    fetchAnnouncement()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/announcements/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, castUrl }),
      })

      if (!response.ok) throw new Error("Failed to update announcement")

      setResult({ success: true, message: "Announcement updated successfully!" })
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Announcement</CardTitle>
          <CardDescription>Update the details of the announcement.</CardDescription>
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
          <div className="flex space-x-2">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Announcement"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
          </div>
          {result && (
            <div className={`flex items-center space-x-2 ${result.success ? "text-green-600" : "text-red-600"}`}>
              {result.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{result.message}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

