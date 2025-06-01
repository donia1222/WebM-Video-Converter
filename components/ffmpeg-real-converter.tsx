"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FFmpegRealConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Instalación de FFmpeg.wasm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Instalación de FFmpeg.wasm
          </CardTitle>
          <CardDescription>Para conversión real de video en el navegador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto mb-4">
            <pre>{`npm install @ffmpeg/ffmpeg @ffmpeg/util`}</pre>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{`// components/real-video-converter.tsx
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export default function RealVideoConverter() {
  const ffmpegRef = useRef(new FFmpeg())
  const [loaded, setLoaded] = useState(false)

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current
    
    ffmpeg.on('log', ({ message }) => {
      console.log(message)
    })
    
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100))
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(\`\${baseURL}/ffmpeg-core.js\`, 'text/javascript'),
      wasmURL: await toBlobURL(\`\${baseURL}/ffmpeg-core.wasm\`, 'application/wasm'),
    })
    setLoaded(true)
  }

  const convertToWebM = async () => {
    if (!file) return
    
    const ffmpeg = ffmpegRef.current
    await ffmpeg.writeFile('input.mp4', await fetchFile(file))
    
    // Conversión a WebM con compresión optimizada
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c:v', 'libvpx-vp9',  // Codec VP9
      '-crf', '30',          // Calidad (0-63, menor = mejor)
      '-b:v', '0',           // Variable bitrate
      '-b:a', '128k',        // Audio bitrate
      '-c:a', 'libopus',     // Codec de audio Opus
      'output.webm'
    ])
    
    const data = await ffmpeg.readFile('output.webm')
    const blob = new Blob([data], { type: 'video/webm' })
    
    // Descargar archivo
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.webm'
    a.click()
  }

  return (
    <div>
      {!loaded ? (
        <Button onClick={load}>Cargar FFmpeg</Button>
      ) : (
        <Button onClick={convertToWebM}>Convertir a WebM</Button>
      )}
    </div>
  )
}`}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Alternativas más simples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Alternativas más simples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Usar herramientas online:</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• CloudConvert.com</li>
              <li>• Online-Convert.com</li>
              <li>• Convertio.co</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">2. FFmpeg en línea de comandos:</h3>
            <div className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-sm">
              <pre>{`ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus output.webm`}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. Servicios en la nube:</h3>
            <div className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-sm">
              <pre>{`// Cloudinary
https://res.cloudinary.com/demo/video/upload/f_webm,q_auto/sample.mp4

// Vercel con next/image
import { Video } from 'next/video'

<Video
  src="/videos/crypto-background.mp4"
  format={["webm", "mp4"]}
  quality="auto"
/>`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementación optimizada para tu header */}
      <Card>
        <CardHeader>
          <CardTitle>Implementación optimizada para tu header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{`// Reemplaza tu video actual con esto:
<video 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="w-full h-full object-cover object-center"
  onLoadStart={() => setVideoLoading(true)}
  onCanPlay={() => setVideoLoading(false)}
>
  {/* WebM para conexiones rápidas */}
  <source 
    src="/videos/crypto-background.webm" 
    type="video/webm"
    media="(min-width: 768px)"
  />
  
  {/* MP4 optimizado para móviles */}
  <source 
    src="/videos/crypto-background-mobile.mp4" 
    type="video/mp4"
    media="(max-width: 767px)"
  />
  
  {/* MP4 como fallback general */}
  <source 
    src="/videos/crypto-background.mp4" 
    type="video/mp4"
  />
  
  {/* Imagen de fallback */}
  <img 
    src="/fallback-background.jpg" 
    alt="Background" 
    className="w-full h-full object-cover object-center"
  />
</video>`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
