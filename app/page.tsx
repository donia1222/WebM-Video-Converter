import VideoConverterFixed from "@/components/video-converter-fixed"
import FFmpegRealConverter from "@/components/ffmpeg-real-converter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <Tabs defaultValue="simple" className="w-full">

          <TabsContent value="simple">
            <VideoConverterFixed />
          </TabsContent>

          <TabsContent value="advanced">
            <FFmpegRealConverter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
