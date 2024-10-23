import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const updateDimensions = () => {
      const videoElement = videoRef.current!;
      const videoHeight = videoElement.offsetHeight;
      const videoWidth = videoElement.offsetWidth;

      // Calculate width based on aspect ratio while keeping full height
      const overlayWidth = (videoHeight * aspectRatio.width) / aspectRatio.height;
      const finalWidth = Math.min(overlayWidth, videoWidth);

      const newDimensions = {
        width: finalWidth,
        height: videoHeight
      };

      setDimensions(newDimensions);

      // Calculate drag bounds
      const maxRight = videoWidth - finalWidth;
      setBounds({ left: 0, right: maxRight });

      // Initial position (centered)
      const initialX = (videoWidth - finalWidth) / 2;
      onPositionChange({ x: initialX, y: 0 });
      onDimensionsChange(newDimensions);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(videoRef.current);

    return () => resizeObserver.disconnect();
  }, [aspectRatio, videoRef, onPositionChange, onDimensionsChange]);

  const handleDrag = (e: any, data: { x: number, y: number }) => {
    onPositionChange({ x: data.x, y: 0 });
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 touch-none">
      <Draggable
        axis="x"
        bounds={{ left: bounds.left, right: bounds.right, top: 0, bottom: 0 }}
        onDrag={handleDrag}
        nodeRef={overlayRef}
      >
        <div
          ref={overlayRef}
          className="absolute bg-white/30 cursor-move border-2 border-white/50 select-none"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            top: 0,
            zIndex: 10,
            willChange: 'transform'
          }}
        >
          {/* Grid overlay for visual aid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array(9).fill(null).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>

          {/* Drag handle indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V14M2 8H14" stroke="black" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default VideoOverlay;