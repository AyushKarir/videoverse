import React, { useState, useRef, useEffect } from 'react';

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  aspectRatio: { width: number; height: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  videoRef,
  isActive,
  aspectRatio,
  onPositionChange,
  onDimensionsChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, initialPosition: { x: 0, y: 0 } });

  useEffect(() => {
    if (!videoRef.current) return;

    const updateDimensions = () => {
      const videoElement = videoRef.current!;
      const videoHeight = videoElement.offsetHeight;
      const videoWidth = videoElement.offsetWidth;

      // Calculate width based on aspect ratio while keeping full height
      const overlayWidth = (videoHeight * aspectRatio.width) / aspectRatio.height;

      setDimensions({
        width: Math.min(overlayWidth, videoWidth),
        height: videoHeight
      });

      // Center the overlay horizontally
      const newX = (videoWidth - Math.min(overlayWidth, videoWidth)) / 2;
      setPosition({ x: newX, y: 0 });

      onPositionChange({ x: newX, y: 0 });
      onDimensionsChange({
        width: Math.min(overlayWidth, videoWidth),
        height: videoHeight
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(videoRef.current);

    return () => resizeObserver.disconnect();
  }, [aspectRatio, videoRef, onPositionChange, onDimensionsChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPosition: { ...position }
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !videoRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const videoRect = videoRef.current.getBoundingClientRect();
    const maxX = videoRect.width - dimensions.width;

    // Only allow horizontal movement
    const newX = Math.max(0, Math.min(maxX, dragStartRef.current.initialPosition.x + deltaX));

    setPosition({ x: newX, y: 0 });
    onPositionChange({ x: newX, y: 0 });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isActive) return null;

  return (
    <div>
      <div
        ref={overlayRef}
        className="absolute bg-white/30 cursor-move border-2 border-white/50"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Grid overlay for visual aid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array(9)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
        </div>

        {/* Drag handle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white/50 cursor-move" />
        </div>
      </div>
    </div>
  );
};

export default VideoOverlay;


const PreviewSection = () => {
  // ... other code remains the same ...

  return (
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
  );
};