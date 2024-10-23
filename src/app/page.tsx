'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import VideoOverlay from '../components/overlay'



export default function VideoCropper() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState('9:16');
  const [isCropperActive, setIsCropperActive] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [overlaySize, setOverlaySize] = useState({ width: 9, height: 16 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const aspectRatios = {
    '9:16': { width: 9, height: 16 },
    '4:5': { width: 4, height: 5 },
    '1:1': { width: 1, height: 1 },
    '16:9': { width: 16, height: 9 },
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setDuration(videoRef.current?.duration || 0);
      };
    }
  }, []);

  // Synchronize preview video with main video
  useEffect(() => {
    if (isPreviewMode && previewVideoRef.current && videoRef.current) {
      previewVideoRef.current.currentTime = videoRef.current.currentTime;
      if (isPlaying) {
        previewVideoRef.current.play();
      } else {
        previewVideoRef.current.pause();
      }
    }
  }, [isPlaying, isPreviewMode, currentTime]);

  const handleStartCropper = () => {
    setIsCropperActive(true);
  };

  const handleGeneratePreview = () => {
    setIsPreviewMode(true);
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

  const updateOverlaySize = (ratio: string) => {
    const aspectRatio = aspectRatios[ratio as keyof typeof aspectRatios];
    if (aspectRatio) {
      // Assuming you want to set the overlay size in pixels
      const height = 300; // Set a fixed height or calculate based on your requirements
      const width = (height * aspectRatio.width) / aspectRatio.height;
      handleSizeChange({ width, height });
    }
  };










  return (
    <div className="bg-[#1C1C1F] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-medium">Dynamic Flip</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">
              Auto Flip
            </button>
            <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">
              Dynamic Flip
            </button>
          </div>
          <button className="text-white text-xl">X</button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Video Player Section */}
          <div className="space-y-4">
            {/* Video Container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                src="/sample-video.mp4"
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              />
              {isCropperActive && (
                <VideoOverlay
                  videoRef={videoRef}
                  isActive={true}
                  aspectRatio={aspectRatios[selectedRatio as keyof typeof aspectRatios]}
                  onPositionChange={setOverlayPosition}
                  onDimensionsChange={setOverlaySize}
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

                <div className="flex-1">
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
                    className="w-24 accent-white"
                  />
                </div>
              </div>
            </div>
          </div>


















          {/* Preview */}
          <div className="bg-[#1F1F1F] rounded-lg p-6">
            <h2 className="text-white mb-4">Preview</h2>
            <div className="bg-[#2A2A2A] rounded-lg flex items-center justify-center min-h-[300px] overflow-hidden">
              {!isCropperActive ? (
                <div className="text-center">
                  <div className="mb-2">
                    <img src="/api/placeholder/48/48" alt="Preview" className="mx-auto" />
                  </div>
                  <p className="text-white/60 mb-1">Preview not available</p>
                  <p className="text-white/40 text-sm">
                    Please click on "Start Cropper" and then play video
                  </p>
                </div>
              ) : isPreviewMode ? (
                <div style={{
                  width: overlaySize.width,
                  height: overlaySize.height,
                  overflow: 'hidden'
                }}>
                  <video
                    ref={previewVideoRef}
                    className="w-full h-full object-cover"
                    src="/sample-video.mp4"
                    style={{
                      transform: `translateX(-${overlayPosition.x}px)`
                    }}
                  />
                </div>
              ) : (
                <div className="text-white">Click "Generate Preview" to see the cropped video</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-6 flex items-center gap-4">
          <select
            value={`${playbackRate}x`}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="bg-transparent text-white/60 border border-white/20 rounded px-3 py-2"
          >
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="1x">
              Playback speed 1x
            </option>
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="0.5x">
              0.5x
            </option>
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="1.5x">
              1.5x
            </option>
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="2x">
              2x
            </option>
          </select>

          <select
            value={selectedRatio}
            onChange={(e) => {
              const newRatio = e.target.value;
              setSelectedRatio(newRatio);
              updateOverlaySize(newRatio); // Update overlay size when the ratio changes
            }}
            className="bg-transparent text-white/60 border border-white/20 rounded px-3 py-2"
          >
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="9:16">
              Cropper Aspect Ratio 9:16
            </option>
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="1:1">
              1:1
            </option>
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="4:5">
              4:5
            </option>
            <option className="bg-[#2a2a2a] hover:bg-[#2c2c2c]" value="16:9">
              16:9
            </option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleStartCropper}
            className="bg-[#7F5AF0] hover:bg-[#7F5AF0]/90 text-white px-6 py-2 rounded"
          >
            Start Cropper
          </button>

          <button
            className="border border-white/20 text-white/60 hover:text-white px-6 py-2 rounded"
            onClick={() => {
              setIsCropperActive(false);
              setIsPreviewMode(false);
            }}
          >
            Remove Cropper
          </button>

          <button
            className="bg-[#7F5AF0] hover:bg-[#7F5AF0]/90 text-white px-6 py-2 rounded"
            disabled={!isCropperActive}
            onClick={handleGeneratePreview}
          >
            Generate Preview
          </button>

          <button className="ml-auto text-white/60 hover:text-white px-6 py-2 rounded">
            Cancel
          </button>
        </div>
      </div >
    </div >
  );
}