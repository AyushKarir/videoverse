'use client'
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import VideoOverlay from "../components/overlay";
import VideoPreview from "../components/videoPreview";
// import VideoPreview from "../components/overlay";

interface VideoSettings {
  volume: number;
  percentage: number;
  playbackRate: number;
  timestamp?: string;
  previousSettings?: {
    volume: number;
    leftBound: number;
    rightBound: number;
    playbackRate: number;
    timestamp: string;  // To track when the setting was saved
  }[];
}

const VideoCropper = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState("9:16");
  const [isCropperActive, setIsCropperActive] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [overlaySize, setOverlaySize] = useState({ width: 9, height: 16 });
  const [percentage, setPercentage] = useState(0);
  const [aRWidthPercent, setARWidthPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    volume: 0.5,
    percentage: 0,
    playbackRate: 1
  });

  const [activeTab, setActiveTab] = useState("auto");
  const wasPlayingBeforeDragRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const aspectRatios = {
    "9:16": { width: 9, height: 16 },
    "4:5": { width: 4, height: 5 },
    "1:1": { width: 1, height: 1 },
    "16:9": { width: 16, height: 9 },
  };

  // Modified: Only save settings when drag ends and only for specific properties
  useEffect(() => {
    if (!isDragging) {
      const newSetting = {
        volume,
        percentage,
        playbackRate,
        timestamp: new Date().toISOString()
      };

      setVideoSettings(prevSettings => {
        const previousSettings = prevSettings.previousSettings || [];

        return {
          ...newSetting,
          previousSettings: [...previousSettings, {
            volume: prevSettings.volume,
            leftBound: prevSettings.percentage,
            rightBound: 100 - prevSettings.percentage,
            playbackRate: prevSettings.playbackRate,
            timestamp: prevSettings.timestamp || new Date().toISOString()
          }]
        };
      });

      console.log('Settings saved:', videoSettings);
    }
  }, [percentage, isDragging, playbackRate]);

  useEffect(() => {
    if (isPreviewVisible && previewVideoRef.current && videoRef.current && !isDragging) {
      previewVideoRef.current.currentTime = videoRef.current.currentTime;
      previewVideoRef.current.playbackRate = playbackRate;
      previewVideoRef.current.volume = volume;

      if (isPlaying && !isDragging) {
        previewVideoRef.current.play().catch(console.error);
      } else {
        previewVideoRef.current.pause();
      }
    }
  }, [isPlaying, isPreviewVisible, currentTime, playbackRate, volume, isDragging]);

  // Handle preview visibility with modified conditions
  useEffect(() => {
    if (videoRef.current) {
      if (isCropperActive && !isDragging) {
        setIsPreviewVisible(true);
      } else {
        setIsPreviewVisible(false);
      }
    }
  }, [isCropperActive, isDragging]);

  useEffect(() => {
    if (isPreviewVisible && previewVideoRef.current && videoRef.current && !isDragging) {
      previewVideoRef.current.currentTime = videoRef.current.currentTime;
      previewVideoRef.current.playbackRate = playbackRate;
      previewVideoRef.current.volume = volume;

      if (isPlaying && !isDragging) {
        previewVideoRef.current.play().catch(console.error);
      } else {
        previewVideoRef.current.pause();
      }
    }
  }, [isPlaying, isPreviewVisible, currentTime, playbackRate, volume, isDragging]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setDuration(videoRef.current?.duration || 0);
      };
    }
  }, []);

  const handleStartCropper = () => {
    setIsCropperActive(true);
    setIsPreviewVisible(true);
    updateOverlaySize(selectedRatio);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setOverlayPosition(newPosition);
  };

  const handleSizeChange = (newSize: { width: number; height: number }) => {
    setOverlaySize(newSize);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    wasPlayingBeforeDragRef.current = isPlaying;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Don't automatically resume playback
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const updateOverlaySize = (ratio: string) => {
    const aspectRatio = aspectRatios[ratio as keyof typeof aspectRatios];
    if (aspectRatio && videoRef.current) {
      const videoWidth = videoRef.current.videoWidth || 1;
      const videoHeight = videoRef.current.videoHeight || 1;
      const height = videoHeight * 0.5;
      const width = (height * aspectRatio.width) / aspectRatio.height;

      const overlayWidth = (videoHeight * aspectRatio.width) / aspectRatio.height;
      const finalWidth1 = Math.min(overlayWidth, videoWidth);
      const aspectRatioWidthPercentage = (finalWidth1 / videoWidth) * 100;

      setARWidthPercent(aspectRatioWidthPercentage);
      handleSizeChange({ width: finalWidth1, height });
      setIsPreviewVisible(true);
    }
  };

  return (
    <div className="bg-[#1C1C1F] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-medium">Cropper</h1>
          <div className="flex gap-4 bg-[#45474e] px-2 py-1 rounded-xl">
            <button
              onClick={() => setActiveTab("auto")}
              className={`px-4 py-2 transition-colors ${activeTab === "auto" ? "bg-[#1c1c1f] text-white rounded-xl" : "bg-transparent text-white/60 rounded-xl"}`}
            >
              Auto Flip
            </button>
            <button
              onClick={() => setActiveTab("dynamic")}
              className={`px-4 py-2 transition-colors ${activeTab === "dynamic" ? "bg-[#1c1c1f] text-white rounded-xl" : "rounded-xl bg-transparent text-white/60"}`}
            >
              Dynamic Flip
            </button>
          </div>
          <p className=""></p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Video Player Section */}
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="aspect-video object-cover w-full"
                src="/sample-video.mp4"
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              />
              {isCropperActive && (
                <VideoOverlay
                  percentage={percentage}
                  setPercentage={setPercentage}
                  videoRef={videoRef}
                  isActive={true}
                  aspectRatio={aspectRatios[selectedRatio as keyof typeof aspectRatios]}
                  onPositionChange={handlePositionChange}
                  onDimensionsChange={handleSizeChange}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              )}
            </div>

            {/* Video Controls */}
            <div className="bg-[#1F1F1F] p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <div className="flex-1 flex-col">
                  <div
                    ref={progressRef}
                    className="h-1 bg-white/20 rounded cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-white rounded"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2 text-white/60">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 size={20} className="text-white" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 accent-white border-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#1F1F1F] rounded-lg p-6">
            <h2 className="text-white mb-4">Preview</h2>
            <div className="bg-[#2A2A2A] rounded-lg flex items-center justify-center min-h-[300px] overflow-hidden aspect-video">
              {!isCropperActive ? (
                <div className="text-center">
                  <div className="mb-2">
                    <img
                      src="/api/placeholder/48/48"
                      alt="Preview"
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-white/60 mb-1">Preview not available</p>
                  <p className="text-white/40 text-sm">
                    Please click on &quot;Start Cropper&quot; and then play video
                  </p>
                </div>
              ) : isPreviewVisible ? (
                <VideoPreview
                  percentage={percentage}
                  aRWidthPercent={aRWidthPercent}
                >
                  <video
                    ref={previewVideoRef}
                    className="aspect-video object-cover w-full"
                    src="/sample-video.mp4"
                  />
                </VideoPreview>
              ) : (
                <div className="text-white">
                  Play the video to see preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-6 flex items-center gap-4">
          <select
            value={`${playbackRate}`}
            onChange={(e) => {
              const newRate = parseFloat(e.target.value);
              setPlaybackRate(newRate);
              if (videoRef.current) {
                videoRef.current.playbackRate = newRate;
              }
              setIsPreviewVisible(false);
            }}
            className="bg-transparent text-white/60 border border-white/20 rounded px-3 py-2"
          >
            <option className="bg-[#2a2a2a]" value="1">Playback speed 1x</option>
            <option className="bg-[#2a2a2a]" value="0.25">0.25x</option>
            <option className="bg-[#2a2a2a]" value="0.5">0.5x</option>
            <option className="bg-[#2a2a2a]" value="1.5">1.5x</option>
            <option className="bg-[#2a2a2a]" value="2">2x</option>
          </select>

          <select
            value={selectedRatio}
            onChange={(e) => {
              const newRatio = e.target.value;
              setSelectedRatio(newRatio);
              updateOverlaySize(newRatio);
            }}
            className="bg-transparent text-white/60 border border-white/20 rounded px-3 py-2"
          >
            <option className="bg-[#2a2a2a]" value="9:16">Cropper Aspect Ratio 9:16</option>
            <option className="bg-[#2a2a2a]" value="1:1">1:1</option>
            <option className="bg-[#2a2a2a]" value="4:5">4:5</option>
            <option className="bg-[#2a2a2a]" value="16:9">16:9</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleStartCropper}
            className="bg-[#7F5AF0] hover:bg-[#7F5AF0]/90 text-white px-6 py-2 rounded-xl"
          >
            Start Cropper
          </button>

          <button
            className="border border-white/20 text-white/60 hover:text-white px-6 py-2 rounded-xl"
            onClick={() => {
              setIsCropperActive(false);
              setIsPreviewVisible(false);
            }}
          >
            Remove Cropper
          </button>
          <button
            onClick={() => {
              const jsonString = JSON.stringify(videoSettings, null, 2);
              const blob = new Blob([jsonString], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'video-settings.json';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
          >
            Generate Preview
          </button>

          <button className="ml-auto text-white/60 hover:text-white px-6 py-2 rounded">
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}
export default VideoCropper;