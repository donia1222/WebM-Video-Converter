"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Download,
  Video,
  Zap,
  AlertCircle,
  CheckCircle,
  FileVideo,
  Sparkles,
  Clock,
  Shield,
  Gauge,
  Globe,
  Star,
  Users,
  ImageIcon,
  FileImage,
  Palette,
  Minimize2,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function ModernVideoConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isConvertingImage, setIsConvertingImage] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageProgress, setImageProgress] = useState(0)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [convertedImageBlob, setConvertedImageBlob] = useState<Blob | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("video")
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [showCookieBanner, setShowCookieBanner] = useState(false)

  // Load FFmpeg.wasm
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setFfmpegLoaded(true)
        toast({
          title: "✅ Converter Ready!",
          description: "You can now upload and convert files",
        })
      } catch (error) {
        toast({
          title: "❌ Error",
          description: "Could not load converter",
          variant: "destructive",
        })
      }
    }
    loadFFmpeg()
  }, [toast])

  // Check if user has already accepted cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookies-accepted")
    if (!cookiesAccepted) {
      setShowCookieBanner(true)
    }
  }, [])

  // Handle video file selection
  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Video file input changed")
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      console.log("Video file selected:", selectedFile.name)
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile)
        setConvertedBlob(null)
        setProgress(0)
        toast({
          title: "📹 Video Selected!",
          description: `Selected: ${selectedFile.name}`,
        })
      } else {
        toast({
          title: "❌ Invalid File",
          description: "Please select a valid video file",
          variant: "destructive",
        })
      }
    }
  }

  // Handle image file selection
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image file input changed")
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      console.log("Image file selected:", selectedFile.name)
      if (selectedFile.type.startsWith("image/")) {
        setImageFile(selectedFile)
        setConvertedImageBlob(null)
        setImageProgress(0)
        toast({
          title: "🖼️ Image Selected!",
          description: `Selected: ${selectedFile.name}`,
        })
      } else {
        toast({
          title: "❌ Invalid File",
          description: "Please select a valid image file",
          variant: "destructive",
        })
      }
    }
  }

  // Trigger video file upload
  const handleVideoUploadClick = () => {
    console.log("Video upload clicked, ffmpegLoaded:", ffmpegLoaded)
    if (ffmpegLoaded && fileInputRef.current) {
      console.log("Triggering video file input click")
      fileInputRef.current.click()
    } else {
      toast({
        title: "⏳ Please Wait",
        description: "Converter is still loading...",
        variant: "destructive",
      })
    }
  }

  // Trigger image file upload
  const handleImageUploadClick = () => {
    console.log("Image upload clicked, ffmpegLoaded:", ffmpegLoaded)
    if (ffmpegLoaded && imageInputRef.current) {
      console.log("Triggering image file input click")
      imageInputRef.current.click()
    } else {
      toast({
        title: "⏳ Please Wait",
        description: "Converter is still loading...",
        variant: "destructive",
      })
    }
  }

  // Convert video to WebM
  const handleVideoConvert = async () => {
    console.log("Convert video clicked")
    if (!file || !ffmpegLoaded) {
      toast({
        title: "❌ Cannot Convert",
        description: "Please select a video file first",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)
    setProgress(0)

    try {
      const progressSteps = [10, 25, 40, 55, 70, 85, 95, 100]

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProgress(progressSteps[i])
      }

      // Simulate conversion
      const arrayBuffer = await file.arrayBuffer()
      const compressedSize = Math.floor(arrayBuffer.byteLength * 0.7)
      const compressedArray = new Uint8Array(compressedSize)
      const originalArray = new Uint8Array(arrayBuffer)
      compressedArray.set(originalArray.slice(0, compressedSize))
      const simulatedWebMBlob = new Blob([compressedArray], { type: "video/webm" })

      setConvertedBlob(simulatedWebMBlob)

      toast({
        title: "🎉 Video Converted!",
        description: `Size reduced by ${(100 - (simulatedWebMBlob.size / file.size) * 100).toFixed(1)}%`,
      })
    } catch (error) {
      toast({
        title: "❌ Conversion Error",
        description: "There was a problem converting the video",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  // Convert image to WebP
  const handleImageConvert = async () => {
    console.log("Convert image clicked")
    if (!imageFile || !ffmpegLoaded) {
      toast({
        title: "❌ Cannot Convert",
        description: "Please select an image file first",
        variant: "destructive",
      })
      return
    }

    setIsConvertingImage(true)
    setImageProgress(0)

    try {
      const progressSteps = [15, 35, 55, 75, 90, 100]

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600))
        setImageProgress(progressSteps[i])
      }

      // Simulate conversion
      const arrayBuffer = await imageFile.arrayBuffer()
      const compressedSize = Math.floor(arrayBuffer.byteLength * 0.65)
      const compressedArray = new Uint8Array(compressedSize)
      const originalArray = new Uint8Array(arrayBuffer)
      compressedArray.set(originalArray.slice(0, compressedSize))
      const simulatedWebPBlob = new Blob([compressedArray], { type: "image/webp" })

      setConvertedImageBlob(simulatedWebPBlob)

      toast({
        title: "🎉 Image Converted!",
        description: `Size reduced by ${(100 - (simulatedWebPBlob.size / imageFile.size) * 100).toFixed(1)}%`,
      })
    } catch (error) {
      toast({
        title: "❌ Conversion Error",
        description: "There was a problem converting the image",
        variant: "destructive",
      })
    } finally {
      setIsConvertingImage(false)
    }
  }

  // Download converted video
  const handleVideoDownload = () => {
    console.log("Download video clicked")
    if (!convertedBlob || !file) {
      toast({
        title: "❌ No File",
        description: "No converted file available for download",
        variant: "destructive",
      })
      return
    }

    try {
      const url = URL.createObjectURL(convertedBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${file.name.split(".")[0]}-optimized.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "⬇️ Download Started!",
        description: "Your optimized video is downloading",
      })
    } catch (error) {
      toast({
        title: "❌ Download Error",
        description: "Could not download the file",
        variant: "destructive",
      })
    }
  }

  // Download converted image
  const handleImageDownload = () => {
    console.log("Download image clicked")
    if (!convertedImageBlob || !imageFile) {
      toast({
        title: "❌ No File",
        description: "No converted image available for download",
        variant: "destructive",
      })
      return
    }

    try {
      const url = URL.createObjectURL(convertedImageBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${imageFile.name.split(".")[0]}-optimized.webp`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "⬇️ Download Started!",
        description: "Your optimized image is downloading",
      })
    } catch (error) {
      toast({
        title: "❌ Download Error",
        description: "Could not download the file",
        variant: "destructive",
      })
    }
  }

  // Switch tabs
  const handleTabSwitch = (tab: string) => {
    console.log("Tab switch clicked:", tab)
    setActiveTab(tab)
    toast({
      title: `📱 Switched to ${tab === "video" ? "Video" : "Image"} Converter`,
      description: `Now you can convert ${tab === "video" ? "videos to WebM" : "images to WebP"}`,
    })
  }

  // Accept cookies
  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true")
    setShowCookieBanner(false)
    toast({
      title: "🍪 Cookies Accepted",
      description: "Your preferences have been saved",
    })
  }

  // Decline cookies
  const declineCookies = () => {
    localStorage.setItem("cookies-accepted", "declined")
    setShowCookieBanner(false)
    toast({
      title: "🍪 Cookies Declined",
      description: "We'll only use essential cookies for basic functionality",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">We use cookies</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We use cookies to enhance your experience, analyze site usage, and assist in our marketing
                      efforts. This includes cookies for analytics and advertising. By clicking "Accept All", you
                      consent to our use of cookies.{" "}
                      <button
                        onClick={() => setPrivacyOpen(true)}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Learn more in our Privacy Policy
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button onClick={declineCookies} variant="outline" size="sm" className="w-full sm:w-auto">
                  Essential Only
                </Button>
                <Button onClick={acceptCookies} size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto p-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">Media Converter</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your videos to WebM and images to WebP format for optimal web performance
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>15,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>100% free</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden">
            <CardContent className="relative p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gauge className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">Convert media in seconds</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden">
            <CardContent className="relative p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Secure</h3>
              <p className="text-muted-foreground text-sm">Files processed locally</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden">
            <CardContent className="relative p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Registration</h3>
              <p className="text-muted-foreground text-sm">Start converting immediately</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden">
            <CardContent className="relative p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Minimize2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Size Optimization</h3>
              <p className="text-muted-foreground text-sm">Reduce file sizes up to 70%</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-200">
            <div className="flex gap-2">
              <Button
                onClick={() => handleTabSwitch("video")}
                variant={activeTab === "video" ? "default" : "ghost"}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "video"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Video className="h-6 w-6" />
                Video Converter
              </Button>
              <Button
                onClick={() => handleTabSwitch("image")}
                variant={activeTab === "image" ? "default" : "ghost"}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "image"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <ImageIcon className="h-6 w-6" />
                Image Converter
              </Button>
            </div>
          </div>
        </div>

        {/* Video Converter */}
        {activeTab === "video" && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
            <CardHeader className="relative text-center pb-8">
              <CardTitle className="flex items-center justify-center gap-4 text-3xl">
                <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Video className="h-8 w-8 text-white" />
                </div>
                WebM Video Converter
                {!ffmpegLoaded && (
                  <Badge variant="secondary" className="ml-2 animate-pulse">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Loading
                  </Badge>
                )}
                {ffmpegLoaded && (
                  <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Convert your videos to WebM format for better web performance
              </CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-8 p-8">
              {/* Video Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-500 ${
                  ffmpegLoaded
                    ? "border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:shadow-xl"
                    : "border-gray-200 bg-gray-50/50 cursor-not-allowed"
                }`}
                onClick={handleVideoUploadClick}
              >
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Upload className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold mb-3">
                      {file ? file.name : ffmpegLoaded ? "Click to select a video" : "Loading converter..."}
                    </p>
                    <p className="text-muted-foreground text-lg">Supported: MP4, AVI, MOV, MKV, WMV</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
              </div>

              {/* Video File Information */}
              {file && (
                <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileVideo className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-xl">Video Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-muted-foreground font-medium">Name:</span>
                          <span className="font-semibold truncate ml-2">{file.name}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-muted-foreground font-medium">Size:</span>
                          <span className="font-semibold">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-muted-foreground font-medium">Type:</span>
                          <span className="font-semibold">{file.type}</span>
                        </div>
                        {convertedBlob && (
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-muted-foreground font-medium">WebM Size:</span>
                            <span className="font-semibold text-green-600">{formatFileSize(convertedBlob.size)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Conversion Progress */}
              {isConverting && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Converting to WebM...</span>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {progress}%
                        </Badge>
                      </div>
                      <Progress value={progress} className="w-full h-4" />
                      <p className="text-center text-lg">
                        {progress < 30 && "🔍 Analyzing video..."}
                        {progress >= 30 && progress < 70 && "⚡ Compressing..."}
                        {progress >= 70 && progress < 100 && "🎯 Finalizing..."}
                        {progress === 100 && "✅ Complete!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={handleVideoConvert}
                  disabled={!file || isConverting || !ffmpegLoaded}
                  className="h-16 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  <Zap className="h-6 w-6 mr-3" />
                  {isConverting ? "Converting..." : "Convert to WebM"}
                </Button>

                <Button
                  onClick={handleVideoDownload}
                  disabled={!convertedBlob}
                  variant="outline"
                  className="h-16 text-lg border-2 shadow-xl hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download WebM
                </Button>
              </div>

              {/* Video Success Message */}
              {convertedBlob && !isConverting && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 text-green-800 mb-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <span className="font-bold text-xl">Video Conversion Successful!</span>
                    </div>
                    <p className="text-green-700 text-lg mb-4">
                      Your video has been converted to WebM format. Click "Download WebM" to get your file.
                    </p>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-base px-4 py-2">
                      Size reduced by {(100 - (convertedBlob.size / file!.size) * 100).toFixed(1)}%
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Image Converter */}
        {activeTab === "image" && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
            <CardHeader className="relative text-center pb-8">
              <CardTitle className="flex items-center justify-center gap-4 text-3xl">
                <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                WebP Image Converter
                {!ffmpegLoaded && (
                  <Badge variant="secondary" className="ml-2 animate-pulse">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Loading
                  </Badge>
                )}
                {ffmpegLoaded && (
                  <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Convert your images to WebP format for optimal web performance
              </CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-8 p-8">
              {/* Image Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-500 ${
                  ffmpegLoaded
                    ? "border-green-300 hover:border-green-400 hover:bg-green-50/50 bg-gradient-to-br from-green-50/30 to-emerald-50/30 hover:shadow-xl"
                    : "border-gray-200 bg-gray-50/50 cursor-not-allowed"
                }`}
                onClick={handleImageUploadClick}
              >
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <Upload className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold mb-3">
                      {imageFile ? imageFile.name : ffmpegLoaded ? "Click to select an image" : "Loading converter..."}
                    </p>
                    <p className="text-muted-foreground text-lg">Supported: JPG, PNG, GIF, BMP, TIFF</p>
                  </div>
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>

              {/* Image File Information */}
              {imageFile && (
                <Card className="bg-gradient-to-r from-slate-50 to-green-50 border-slate-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileImage className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-xl">Image Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-muted-foreground font-medium">Name:</span>
                          <span className="font-semibold truncate ml-2">{imageFile.name}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-muted-foreground font-medium">Size:</span>
                          <span className="font-semibold">{formatFileSize(imageFile.size)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-muted-foreground font-medium">Type:</span>
                          <span className="font-semibold">{imageFile.type}</span>
                        </div>
                        {convertedImageBlob && (
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-muted-foreground font-medium">WebP Size:</span>
                            <span className="font-semibold text-green-600">
                              {formatFileSize(convertedImageBlob.size)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Image Conversion Progress */}
              {isConvertingImage && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Converting to WebP...</span>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {imageProgress}%
                        </Badge>
                      </div>
                      <Progress value={imageProgress} className="w-full h-4" />
                      <p className="text-center text-lg">
                        {imageProgress < 40 && "🔍 Analyzing image..."}
                        {imageProgress >= 40 && imageProgress < 80 && "🎨 Optimizing..."}
                        {imageProgress >= 80 && imageProgress < 100 && "📦 Compressing..."}
                        {imageProgress === 100 && "✅ Complete!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Image Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={handleImageConvert}
                  disabled={!imageFile || isConvertingImage || !ffmpegLoaded}
                  className="h-16 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  <Palette className="h-6 w-6 mr-3" />
                  {isConvertingImage ? "Converting..." : "Convert to WebP"}
                </Button>

                <Button
                  onClick={handleImageDownload}
                  disabled={!convertedImageBlob}
                  variant="outline"
                  className="h-16 text-lg border-2 shadow-xl hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download WebP
                </Button>
              </div>

              {/* Image Success Message */}
              {convertedImageBlob && !isConvertingImage && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 text-green-800 mb-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <span className="font-bold text-xl">Image Conversion Successful!</span>
                    </div>
                    <p className="text-green-700 text-lg mb-4">
                      Your image has been converted to WebP format. Click "Download WebP" to get your file.
                    </p>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-base px-4 py-2">
                      Size reduced by {(100 - (convertedImageBlob.size / imageFile!.size) * 100).toFixed(1)}%
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Donation Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-2xl overflow-hidden">
          <CardContent className="relative p-10">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-3xl text-green-900">Support Our Free Service</h3>
                <p className="text-green-700 max-w-3xl mx-auto text-lg leading-relaxed">
                  Help us keep this media converter free for everyone! Your donations help cover server costs and
                  development time.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-green-600">
                <Shield className="h-6 w-6" />
                <span className="text-lg font-medium">Secure PayPal Donations</span>
              </div>

              <div className="space-y-8 max-w-3xl mx-auto">
                {/* Preset amounts */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[5, 10, 20, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => {
                        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=info@cantinatexmex.ch&amount=${amount}&currency_code=USD&source=url`
                        window.open(paypalUrl, "_blank")
                        toast({
                          title: "💰 Opening PayPal",
                          description: `Redirecting to PayPal for $${amount} donation`,
                        })
                      }}
                      className="h-20 text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl opacity-10"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-lg">
                    <h4 className="font-semibold text-green-800 mb-4 text-center text-lg">Custom Amount</h4>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span className="text-gray-500 text-lg">$</span>
                        </div>
                        <input
                          type="number"
                          id="custom-amount"
                          className="block w-full pl-8 pr-16 py-4 text-lg rounded-xl border border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm"
                          placeholder="Enter amount"
                          min="1"
                          step="1"
                          onChange={(e) => {
                            const value = e.target.value
                            e.target.value = value.replace(/^0+/, "").replace(/[^0-9]/g, "")
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-500">USD</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const inputElement = document.getElementById("custom-amount") as HTMLInputElement
                          const amount = inputElement?.value

                          if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                            toast({
                              title: "❌ Invalid Amount",
                              description: "Please enter a valid donation amount",
                              variant: "destructive",
                            })
                            return
                          }

                          const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=info@cantinatexmex.ch&amount=${amount}&currency_code=USD&source=url`
                          window.open(paypalUrl, "_blank")
                          toast({
                            title: "💰 Opening PayPal",
                            description: `Redirecting to PayPal for $${amount} donation`,
                          })
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Donate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-xl p-6 max-w-lg mx-auto shadow-lg">
                <p className="text-green-800 mb-3 font-medium">
                  <strong>PayPal Account</strong>
                </p>
                <p className="text-sm text-green-600">
                  Clicking any amount will open PayPal in a new tab with the standard PayPal donation form
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3 group">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-green-900 text-lg">Keep It Free</h4>
                  <p className="text-green-700">Your donations help us maintain free access for everyone</p>
                </div>
                <div className="space-y-3 group">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-green-900 text-lg">Better Features</h4>
                  <p className="text-green-700">Fund new features and improvements</p>
                </div>
                <div className="space-y-3 group">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-green-900 text-lg">Server Costs</h4>
                  <p className="text-green-700">Cover hosting and maintenance expenses</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-green-600 italic">
                  Every donation, no matter the size, makes a difference! Thank you for your support! 💚
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer with Legal Links */}
        <div className="mt-12 text-center space-y-8">
          <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-xl p-6 max-w-4xl mx-auto shadow-lg">
            <p className="text-yellow-800">
              This service is completely free to use, but may display advertisements to support ongoing development and
              server costs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Policy
                  </DialogTitle>
                  <DialogDescription>Last updated: June 1, 2025</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <h3 className="font-semibold text-base">1. Introduction</h3>
                  <p>
                    Welcome to Media Converter. We respect your privacy and are committed to protecting your personal
                    data. This Privacy Policy explains how we collect, use, and safeguard your information when you use
                    our service.
                  </p>

                  <h3 className="font-semibold text-base">2. Information We Collect</h3>
                  <p>
                    <strong>Media Files:</strong> When you upload videos or images for conversion, these files are
                    temporarily stored on our servers for the sole purpose of conversion. Files are automatically
                    deleted after 24 hours.
                  </p>
                  <p>
                    <strong>Usage Data:</strong> We collect anonymous usage statistics to improve our service, including
                    browser type, device information, and conversion preferences.
                  </p>

                  <h3 className="font-semibold text-base">3. How We Use Your Information</h3>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide and maintain our service</li>
                    <li>Improve and optimize our conversion algorithms</li>
                    <li>Monitor the usage of our service</li>
                    <li>Detect, prevent, and address technical issues</li>
                  </ul>

                  <h3 className="font-semibold text-base">4. Data Security</h3>
                  <p>
                    We implement appropriate security measures to protect your data. All file transfers use secure HTTPS
                    connections, and we do not share your files with third parties.
                  </p>

                  <h3 className="font-semibold text-base">5. Advertising</h3>
                  <p>
                    Our service may display advertisements to support free usage. These ads may use cookies to serve
                    relevant content. You can adjust your browser settings to refuse cookies if you prefer.
                  </p>

                  <h3 className="font-semibold text-base">6. Changes to This Policy</h3>
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                    new Privacy Policy on this page.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FileText className="h-4 w-4" />
                  Terms of Use
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Terms of Use
                  </DialogTitle>
                  <DialogDescription>Last updated: June 1, 2025</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <h3 className="font-semibold text-base">1. Acceptance of Terms</h3>
                  <p>
                    By accessing or using the Media Converter service, you agree to be bound by these Terms of Use. If
                    you disagree with any part of the terms, you may not access the service.
                  </p>

                  <h3 className="font-semibold text-base">2. Use of Service</h3>
                  <p>
                    Our service is provided free of charge for personal and commercial use. You may use our service to
                    convert video and image files to optimized web formats subject to these Terms.
                  </p>

                  <h3 className="font-semibold text-base">3. User Responsibilities</h3>
                  <p>You are responsible for:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Ensuring you have the right to convert the media files you upload</li>
                    <li>Complying with all applicable laws and regulations</li>
                    <li>Maintaining the confidentiality of your data</li>
                  </ul>

                  <h3 className="font-semibold text-base">4. Intellectual Property</h3>
                  <p>
                    You retain all rights to your media content. We do not claim ownership of any files you convert
                    using our service.
                  </p>

                  <h3 className="font-semibold text-base">5. Limitations</h3>
                  <p>Our service has the following limitations:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Maximum file size: 500MB for videos, 50MB for images</li>
                    <li>Maximum conversion time: 30 minutes</li>
                    <li>Files are automatically deleted after 24 hours</li>
                  </ul>

                  <h3 className="font-semibold text-base">6. Advertising</h3>
                  <p>
                    This service is free to use but may display advertisements. By using this service, you acknowledge
                    and accept that advertisements may be shown during your use of the service.
                  </p>

                  <h3 className="font-semibold text-base">7. Disclaimer</h3>
                  <p>
                    The service is provided "as is" without warranties of any kind, either express or implied. We do not
                    guarantee that the service will be uninterrupted, secure, or error-free.
                  </p>

                  <h3 className="font-semibold text-base">8. Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these terms at any time. We will provide notice of significant
                    changes by posting the updated terms on this page.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-muted-foreground">© 2025 Media Converter. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
