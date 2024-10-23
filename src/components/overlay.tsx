import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  aspectRatio: { width: number; height: number };
  onPositionChange: (position: {
    x: number;
    y: number;
    percentage: number;
  }) => void;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  percentage: number;
  setPercentage: React.Dispatch<React.SetStateAction<number>>;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  videoRef,
  isActive,
  aspectRatio,
  onPositionChange,
  onDimensionsChange,
  percentage,
  setPercentage,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);
  console.log(position);

  useEffect(() => {
    if (!videoRef.current) return;

    const updateDimensions = () => {
      const videoElement = videoRef.current!;
      const videoHeight = videoElement.offsetHeight;
      const videoWidth = videoElement.offsetWidth;

      // Calculate width based on aspect ratio while keeping full height
      const overlayWidth =
        (videoHeight * aspectRatio.width) / aspectRatio.height;
      const finalWidth = Math.min(overlayWidth, videoWidth);

      const newDimensions = {
        width: finalWidth,
        height: videoHeight,
      };

      // Calculate drag bounds
      const maxRight = videoWidth - finalWidth;

      // Update dimensions and bounds
      setDimensions(newDimensions);
      setBounds({ left: 0, right: maxRight });
      onDimensionsChange(newDimensions);

      // Set initial position only once
      if (!isInitializedRef.current) {
        const initialX = (videoWidth - finalWidth) / 2;
        setPosition({ x: initialX, y: 0 });
        const initialPercentage =
          maxRight === 0 ? 0 : (initialX / maxRight) * 100;
        onPositionChange({
          x: initialX,
          y: 0,
          percentage: initialPercentage,
        });
        isInitializedRef.current = true;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize updates
      requestAnimationFrame(updateDimensions);
    });

    resizeObserver.observe(videoRef.current);
    return () => resizeObserver.disconnect();
  }, [aspectRatio, videoRef, onDimensionsChange, onPositionChange]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    const totalDragWidth = bounds.right - bounds.left;
    const percentage =
      totalDragWidth === 0 ? 0 : (data.x / totalDragWidth) * 100;
    console.log(percentage);
    setPercentage(percentage);

    // Only update if position actually changed
    if (position.x !== data.x) {
      setPosition({ x: data.x, y: 0 });
      onPositionChange({
        x: data.x,
        y: 0,
        percentage: Math.max(0, Math.min(100, percentage)),
      });
    }
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 touch-none">
      <Draggable
        axis="x"
        bounds={{ left: bounds.left, right: bounds.right, top: 0, bottom: 0 }}
        onDrag={handleDrag}
        nodeRef={overlayRef}
        position={position}
      >
        <div
          ref={overlayRef}
          className="absolute bg-white/30 cursor-move border-2 border-white/50 select-none"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            top: 0,
            zIndex: 10,
            willChange: "transform",
          }}
        >
          {/* Grid overlay for visual aid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 text-white text-xs bg-black bg-opacity-50 p-1">
            {percentage.toFixed(2)}%
          </div>
          {/* Drag handle indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

