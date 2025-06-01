"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OptimizedVideoHeaderProps {
  className?: string
}

export default function OptimizedVideoHeader({ className = "" }: OptimizedVideoHeaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionSpeed, setConnectionSpeed] = useState<"fast" | "slow">("fast")

  // Detectar velocidad de conexión
  useEffect(() => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const effectiveType = connection.effectiveType
      // Si la conexión es 2g o slow-2g, usar video de baja calidad
      if (effectiveType === "2g" || effectiveType === "slow-2g") {
        setConnectionSpeed("slow")
      }
    }
  }, [])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`fixed inset-0 z-0 h-screen ${className}`}>
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10"></div>

      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-5">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
        </div>
      )}

      {/* Optimized video with multiple sources */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        onLoadedData={handleVideoLoad}
        className="w-full h-full object-cover object-center"
        preload={connectionSpeed === "slow" ? "metadata" : "auto"}
      >
        {/* WebM para mejor compresión y soporte moderno */}
        <source
          src={connectionSpeed === "slow" ? "/videos/crypto-background-low.webm" : "/videos/crypto-background.webm"}
          type="video/webm"
        />

        {/* MP4 como fallback */}
        <source
          src={connectionSpeed === "slow" ? "/videos/crypto-background-low.mp4" : "/videos/crypto-background.mp4"}
          type="video/mp4"
        />

        {/* Imagen de fallback si el video no se puede cargar */}
        <img src="/fallback-background.jpg" alt="Background" className="w-full h-full object-cover object-center" />
      </video>

      {/* Controles de video */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="bg-black/50 backdrop-blur-sm border border-gray-700 text-white hover:bg-black/70"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="bg-black/50 backdrop-blur-sm border border-gray-700 text-white hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </motion.div>
      </div>

      {/* Indicador de calidad de conexión */}
      {connectionSpeed === "slow" && (
        <div className="absolute top-20 left-4 z-20 bg-yellow-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
          Modo de conexión lenta activado
        </div>
      )}
    </div>
  )
}
