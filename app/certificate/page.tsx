"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Award, Download, CheckCircle, Trophy, ArrowLeft } from "lucide-react"
import { ShareButton } from "@/components/share-button"

interface AcademyProgress {
  completedModules: string[]
  score: number
  badges: string[]
}

export default function CertificatePage() {
  const [progress, setProgress] = useState<AcademyProgress | null>(null)
  const [userName, setUserName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("template-academy-progress")
    if (saved) {
      try {
        const data = JSON.parse(saved) as AcademyProgress
        setProgress(data)
      } catch (e) {
        console.error("Failed to load progress")
      }
    }

    const savedName = localStorage.getItem("template-academy-username")
    if (savedName) {
      setUserName(savedName)
    } else {
      setShowNameInput(true)
    }
  }, [])

  const saveName = () => {
    if (userName.trim()) {
      localStorage.setItem("template-academy-username", userName.trim())
      setShowNameInput(false)
    }
  }

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    try {
      // Use html2canvas to convert the certificate to an image
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      })

      const link = document.createElement("a")
      link.download = `template-academy-certificate-${userName.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Failed to download certificate:", error)
      alert("Failed to download certificate. Please try again.")
    }
  }

  const shareCertificate = () => {
    const text = `I just completed the Template Evaluation Academy and earned my certificate! 🎓 Total Score: ${progress?.score} points with ${progress?.badges?.length} badges earned.`
    const url = window.location.href

    if (navigator.share) {
      navigator
        .share({
          title: "Template Evaluation Academy Certificate",
          text,
          url,
        })
        .catch(() => {
          // Fallback to copying to clipboard
          copyToClipboard(text + " " + url)
        })
    } else {
      copyToClipboard(text + " " + url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Certificate details copied to clipboard!")
    })
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your certificate...</p>
        </div>
      </div>
    )
  }

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const isCompleted = progress.completedModules.length >= 9

  if (!isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Award className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Yet Available</h2>
            <p className="text-gray-600 mb-6">
              Complete all 9 modules to earn your Template Evaluation Academy certificate!
            </p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{progress.completedModules.length}/9</div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Continue Learning
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Congratulations!</h2>
          <p className="text-gray-600 mb-6 text-center">Enter your name to generate your certificate</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && saveName()}
            placeholder="Your Full Name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none mb-4"
            autoFocus
          />
          <button
            onClick={saveName}
            disabled={!userName.trim()}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
          >
            Generate Certificate
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        {/* Certificate Preview */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-12 rounded-lg border-8 border-double border-indigo-600 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full opacity-20 translate-x-16 translate-y-16"></div>

            {/* Certificate Content */}
            <div className="relative z-10 text-center">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-5xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-8"></div>

              <p className="text-lg text-gray-600 mb-4">This certifies that</p>
              <h2 className="text-4xl font-bold text-indigo-600 mb-6">{userName}</h2>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                has successfully completed the <strong>Template Evaluation Academy</strong> curriculum, demonstrating
                proficiency in finding, evaluating, and customizing code templates
              </p>

              {/* Achievement Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-70 rounded-lg p-4 shadow">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">{progress.completedModules.length}</div>
                  <div className="text-sm text-gray-600">Modules Completed</div>
                </div>
                <div className="bg-white bg-opacity-70 rounded-lg p-4 shadow">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{progress.score}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="bg-white bg-opacity-70 rounded-lg p-4 shadow">
                  <div className="text-3xl font-bold text-pink-600 mb-1">{progress.badges.length}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
              </div>

              {/* Badges Display */}
              <div className="flex justify-center gap-3 mb-8 flex-wrap">
                {["🎯", "🔍", "🛡️", "⚖️", "🚀", "🏆"].map((badge, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md"
                  >
                    {badge}
                  </div>
                ))}
              </div>

              {/* Date and Signature */}
              <div className="flex justify-between items-end max-w-2xl mx-auto pt-8 border-t-2 border-gray-300">
                <div className="text-left">
                  <p className="text-sm text-gray-600 mb-1">Date of Completion</p>
                  <p className="font-semibold text-gray-800">{completionDate}</p>
                </div>
                <div className="text-right">
                  <div className="w-48 border-b-2 border-gray-400 mb-1"></div>
                  <p className="text-sm text-gray-600">Template Academy</p>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="mt-6 text-xs text-gray-500">
                Certificate ID: TEA-{progress.score}-{Date.now().toString(36).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Achievement</h3>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={downloadCertificate}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </button>
            <div className="flex-1 min-w-[200px]">
              <ShareButton
                title="Template Evaluation Academy Certificate"
                text={`I just completed the Template Evaluation Academy and earned my certificate! 🎓 Total Score: ${progress?.score} points with ${progress?.badges?.length} badges earned. #TemplateAcademy #WebDev`}
                variant="outline"
                size="lg"
              />
            </div>
            <button
              onClick={() => setShowNameInput(true)}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Edit Name
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">Congratulations on completing the academy!</p>
                <p className="text-sm text-green-700">
                  You've mastered the skills needed to evaluate and use code templates effectively. Keep applying these
                  principles in your development work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
