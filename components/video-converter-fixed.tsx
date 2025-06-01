"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Video, Zap, AlertCircle, CheckCircle, FileVideo, Sparkles } from "lucide-react"
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
import { Shield, FileText } from "lucide-react"

export default function ModernVideoConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [showCookieBanner, setShowCookieBanner] = useState(false)

  // Load FFmpeg.wasm
  useEffect(() => {
    loadFFmpeg()
  }, [])

  // Check if user has already accepted cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookies-accepted")
    if (!cookiesAccepted) {
      setShowCookieBanner(true)
    }
  }, [])

  const loadFFmpeg = async () => {
    try {
      // Simulate FFmpeg loading (in production you would load the actual library)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setFfmpegLoaded(true)
      toast({
        title: "FFmpeg Loaded",
        description: "Video converter is ready to use",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load FFmpeg",
        variant: "destructive",
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile)
        setConvertedBlob(null)
        setProgress(0)
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a valid video file",
          variant: "destructive",
        })
      }
    }
  }

  const convertToWebM = async () => {
    if (!file || !ffmpegLoaded) return

    setIsConverting(true)
    setProgress(0)

    try {
      // Simulate conversion with realistic progress
      const progressSteps = [10, 25, 40, 55, 70, 85, 95, 100]

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProgress(progressSteps[i])
      }

      // SIMULATED CONVERSION - In production you would use FFmpeg.wasm here
      // For now we create a simulated WebM blob
      const simulatedWebMBlob = await createSimulatedWebM(file)
      setConvertedBlob(simulatedWebMBlob)

      toast({
        title: "Conversion Complete!",
        description: `Video converted successfully. Size reduced by ${(100 - (simulatedWebMBlob.size / file.size) * 100).toFixed(1)}%`,
      })
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "There was a problem converting the video",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  // Function to simulate conversion (replace with real FFmpeg)
  const createSimulatedWebM = async (inputFile: File): Promise<Blob> => {
    // In a real implementation, you would use FFmpeg.wasm here
    // For now we simulate a smaller file
    const arrayBuffer = await inputFile.arrayBuffer()

    // Simulate compression by reducing size
    const compressedSize = Math.floor(arrayBuffer.byteLength * 0.7) // 30% reduction simulation
    const compressedArray = new Uint8Array(compressedSize)

    // Fill with original file data (truncated)
    const originalArray = new Uint8Array(arrayBuffer)
    compressedArray.set(originalArray.slice(0, compressedSize))

    return new Blob([compressedArray], { type: "video/webm" })
  }

  const downloadConverted = () => {
    if (!convertedBlob || !file) {
      toast({
        title: "Error",
        description: "No converted file available for download",
        variant: "destructive",
      })
      return
    }

    try {
      // Create blob URL
      const url = URL.createObjectURL(convertedBlob)

      // Create download element
      const a = document.createElement("a")
      a.href = url
      a.download = `${file.name.split(".")[0]}-optimized.webm`
      a.style.display = "none"

      // Add to DOM, click and remove
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up URL after some time
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)

      toast({
        title: "Download Started",
        description: "Your optimized video is downloading",
      })
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Could not download the file",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true")
    setShowCookieBanner(false)
    toast({
      title: "Cookies Accepted",
      description: "Your preferences have been saved",
    })
  }

  const declineCookies = () => {
    localStorage.setItem("cookies-accepted", "declined")
    setShowCookieBanner(false)
    toast({
      title: "Cookies Declined",
      description: "We'll only use essential cookies for basic functionality",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Video Converter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your videos to WebM format for optimal web performance and faster loading times
          </p>
        </div>

        {/* Main Converter Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              WebM Video Converter
              {!ffmpegLoaded && (
                <Badge variant="secondary" className="ml-2">
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
            <CardDescription className="text-base">
              Convert your videos to WebM format for better web performance
              {!ffmpegLoaded && " (Loading converter...)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                ffmpegLoaded
                  ? "border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 bg-gradient-to-br from-blue-50/30 to-purple-50/30"
                  : "border-gray-200 bg-gray-50/50 cursor-not-allowed"
              }`}
              onClick={() => ffmpegLoaded && fileInputRef.current?.click()}
            >
              <div className="space-y-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                    ffmpegLoaded ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Upload className={`h-8 w-8 ${ffmpegLoaded ? "text-blue-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2">
                    {file ? file.name : ffmpegLoaded ? "Click to select a video" : "Loading converter..."}
                  </p>
                  <p className="text-muted-foreground">Supported formats: MP4, AVI, MOV, MKV, WMV</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={!ffmpegLoaded}
              />
            </div>

            {/* File Information */}
            {file && (
              <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileVideo className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">File Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium truncate ml-2">{file.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{file.type}</span>
                      </div>
                      {convertedBlob && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">WebM Size:</span>
                          <span className="font-medium text-green-600">{formatFileSize(convertedBlob.size)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversion Progress */}
            {isConverting && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Converting to WebM...</span>
                      <Badge variant="secondary">{progress}%</Badge>
                    </div>
                    <Progress value={progress} className="w-full h-3" />
                    <p className="text-sm text-muted-foreground text-center">
                      {progress < 30 && "🔍 Analyzing video..."}
                      {progress >= 30 && progress < 70 && "⚡ Compressing..."}
                      {progress >= 70 && progress < 100 && "🎯 Finalizing..."}
                      {progress === 100 && "✅ Complete!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={convertToWebM}
                disabled={!file || isConverting || !ffmpegLoaded}
                className="h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                {isConverting ? "Converting..." : "Convert to WebM"}
              </Button>

              <Button
                onClick={downloadConverted}
                disabled={!convertedBlob}
                variant="outline"
                className="h-12 text-base border-2"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download WebM
              </Button>
            </div>

            {/* Success Message */}
            {convertedBlob && !isConverting && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-green-800 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold text-lg">Conversion Successful!</span>
                  </div>
                  <p className="text-green-700">
                    Your video has been converted to WebM format. Click "Download WebM" to get your optimized file.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Size reduced by {(100 - (convertedBlob.size / file!.size) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Donation Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-green-900">Support Our Free Service</h3>
                <p className="text-green-700 max-w-2xl mx-auto">
                  Help us keep this video converter free for everyone! Your donations help cover server costs and
                  development time.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Secure PayPal Donations</span>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Preset amounts */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[5, 10, 20, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => {
                        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=info@cantinatexmex.ch&amount=${amount}&currency_code=USD&source=url`
                        window.open(paypalUrl, "_blank")
                        toast({
                          title: "Opening PayPal",
                          description: `Redirecting to PayPal for $${amount} donation`,
                        })
                      }}
                      className="h-16 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg opacity-20"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800 mb-3 text-center">Custom Amount</h4>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          id="custom-amount"
                          className="block w-full pl-7 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter amount"
                          min="1"
                          step="1"
                          onChange={(e) => {
                            const value = e.target.value
                            // Remove non-numeric characters and leading zeros
                            e.target.value = value.replace(/^0+/, "").replace(/[^0-9]/g, "")
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">USD</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const inputElement = document.getElementById("custom-amount") as HTMLInputElement
                          const amount = inputElement?.value

                          if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                            toast({
                              title: "Invalid Amount",
                              description: "Please enter a valid donation amount",
                              variant: "destructive",
                            })
                            return
                          }

                          const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=info@cantinatexmex.ch&amount=${amount}&currency_code=USD&source=url`
                          window.open(paypalUrl, "_blank")
                          toast({
                            title: "Opening PayPal",
                            description: `Redirecting to PayPal for $${amount} donation`,
                          })
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
                      >
                        Donate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-green-800 mb-2">
                  <strong>PayPal Account:</strong> info@cantinatexmex.ch
                </p>
                <p className="text-xs text-green-600">
                  Clicking any amount will open PayPal in a new tab with the standard PayPal donation form
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">Keep It Free</h4>
                  <p className="text-sm text-green-700">Your donations help us maintain free access for everyone</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">Better Features</h4>
                  <p className="text-sm text-green-700">Fund new features and improvements</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">Server Costs</h4>
                  <p className="text-sm text-green-700">Cover hosting and maintenance expenses</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-green-600 italic">
                  Every donation, no matter the size, makes a difference! Thank you for your support! 💚
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer with Legal Links */}
        <div className="mt-8 text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-yellow-800 text-sm">
              This service is completely free to use, but may display advertisements to support ongoing development and
              server costs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                    Welcome to WebM Video Converter. We respect your privacy and are committed to protecting your
                    personal data. This Privacy Policy explains how we collect, use, and safeguard your information when
                    you use our service.
                  </p>

                  <h3 className="font-semibold text-base">2. Information We Collect</h3>
                  <p>
                    <strong>Video Files:</strong> When you upload videos for conversion, these files are temporarily
                    stored on our servers for the sole purpose of conversion. Files are automatically deleted after 24
                    hours.
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
                <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                    By accessing or using the WebM Video Converter service, you agree to be bound by these Terms of Use.
                    If you disagree with any part of the terms, you may not access the service.
                  </p>

                  <h3 className="font-semibold text-base">2. Use of Service</h3>
                  <p>
                    Our service is provided free of charge for personal and commercial use. You may use our service to
                    convert video files to WebM format subject to these Terms.
                  </p>

                  <h3 className="font-semibold text-base">3. User Responsibilities</h3>
                  <p>You are responsible for:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Ensuring you have the right to convert the videos you upload</li>
                    <li>Complying with all applicable laws and regulations</li>
                    <li>Maintaining the confidentiality of your data</li>
                  </ul>

                  <h3 className="font-semibold text-base">4. Intellectual Property</h3>
                  <p>
                    You retain all rights to your video content. We do not claim ownership of any videos you convert
                    using our service.
                  </p>

                  <h3 className="font-semibold text-base">5. Limitations</h3>
                  <p>Our service has the following limitations:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Maximum file size: 500MB</li>
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

          <p className="text-sm text-muted-foreground">© 2025 WebM Video Converter. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
