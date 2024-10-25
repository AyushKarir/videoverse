import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { DraggableEvent } from 'react-draggable';
import { debounce } from 'lodash';

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
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  videoRef,
  isActive,
  aspectRatio,
  onPositionChange,
  onDimensionsChange,
  percentage,
  setPercentage,
  onDragStart,
  onDragEnd,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const updateDimensions = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoHeight = videoElement.offsetHeight;
    const videoWidth = videoElement.offsetWidth;

    // Calculate overlay dimensions based on aspect ratio
    const overlayWidth = (videoHeight * aspectRatio.width) / aspectRatio.height;
    const finalWidth = Math.min(overlayWidth, videoWidth);

    const newDimensions = { width: finalWidth, height: videoHeight };

    // Calculate drag bounds and set initial position
    const maxRight = videoWidth - finalWidth;
    setDimensions(newDimensions);
    setBounds({ left: 0, right: maxRight });
    onDimensionsChange(newDimensions);

    if (!isInitializedRef.current) {
      const initialX = (videoWidth - finalWidth) / 2;
      const initialPercentage = maxRight === 0 ? 0 : (initialX / maxRight) * 100;
      setPosition({ x: initialX, y: 0 });
      onPositionChange({ x: initialX, y: 0, percentage: initialPercentage });
      isInitializedRef.current = true;
    }
  };

  // Debounced version of updateDimensions
  const debouncedUpdateDimensions = useRef(
    debounce(updateDimensions, 250, { leading: true, trailing: true })
  ).current;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive) return;

    // Initial update
    updateDimensions();

    // Setup resize observer
    resizeObserverRef.current = new ResizeObserver((entries) => {
      // Only update if the size actually changed significantly
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        if (
          Math.abs(width - dimensions.width) > 1 ||
          Math.abs(height - dimensions.height) > 1
        ) {
          debouncedUpdateDimensions();
        }
      }
    });

    resizeObserverRef.current.observe(videoElement);

    return () => {
      debouncedUpdateDimensions.cancel();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isActive, aspectRatio]); // Only re-run when isActive or aspectRatio changes

  // Handle drag with debouncing
  const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
    const totalDragWidth = bounds.right - bounds.left;
    const percentage = totalDragWidth === 0 ? 0 : (data.x / totalDragWidth) * 100;

    // Update position immediately for smooth dragging
    setPosition({ x: data.x, y: 0 });

    // Update percentage with some debouncing to prevent too frequent updates
    if (position.x !== data.x) {
      setPercentage(percentage);
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
        onStart={() => onDragStart?.()}
        onStop={() => onDragEnd?.()}
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