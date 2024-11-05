import React, { useState, useRef, useEffect, useCallback, memo } from "react";
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

const VideoOverlay: React.FC<VideoOverlayProps> = memo(({
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
  const previousAspectRatio = useRef(aspectRatio);

  // Memoize the update dimensions function
  const updateDimensions = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoHeight = videoElement.offsetHeight;
    const videoWidth = videoElement.offsetWidth;


    // Calculate overlay dimensions based on aspect ratio
    const overlayWidth = (videoHeight * aspectRatio.width) / aspectRatio.height;
    const finalWidth = Math.min(overlayWidth, videoWidth);
    const newDimensions = { width: finalWidth, height: videoHeight };

    console.log(newDimensions);


    // Only update if dimensions have actually changed
    if (
      dimensions.width !== newDimensions.width ||
      dimensions.height !== newDimensions.height
    ) {
      setDimensions(newDimensions);
      onDimensionsChange(newDimensions);

      // Calculate drag bounds and set initial position
      const maxRight = videoWidth - finalWidth;
      setBounds({ left: 0, right: maxRight });

      if (!isInitializedRef.current) {
        const initialX = (videoWidth - finalWidth) / 2;
        const initialPercentage = maxRight === 0 ? 0 : (initialX / maxRight) * 100;
        setPosition({ x: initialX, y: 0 });
        onPositionChange({ x: initialX, y: 0, percentage: initialPercentage });
        isInitializedRef.current = true;
      }
    }
  }, [aspectRatio, dimensions, onDimensionsChange, onPositionChange]);

  // Debounced version with cleanup
  const debouncedUpdateDimensions = useRef(
    debounce(updateDimensions, 250, { leading: false, trailing: true })
  ).current;

  // Setup resize observer only once when component mounts
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive) return;

    // Create resize observer only if it doesn't exist
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          // Only trigger update if size changed significantly
          if (
            Math.abs(width - dimensions.width) > 5 ||
            Math.abs(height - dimensions.height) > 5
          ) {
            debouncedUpdateDimensions();
          }
        }
      });
    }

    resizeObserverRef.current.observe(videoElement);

    return () => {
      debouncedUpdateDimensions.cancel();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isActive]); // Only depend on isActive

  // Handle aspect ratio changes separately
  useEffect(() => {
    if (
      previousAspectRatio.current.width !== aspectRatio.width ||
      previousAspectRatio.current.height !== aspectRatio.height
    ) {
      updateDimensions();
      previousAspectRatio.current = aspectRatio;
    }
  }, [aspectRatio, updateDimensions]);

  // Memoize drag handler
  const handleDrag = useCallback((e: DraggableEvent, data: { x: number; y: number }) => {
    const totalDragWidth = bounds.right - bounds.left;
    const newPercentage = totalDragWidth === 0 ? 0 : (data.x / totalDragWidth) * 100;

    if (position.x !== data.x) {
      setPosition({ x: data.x, y: 0 });
      setPercentage(newPercentage);
      onPositionChange({
        x: data.x,
        y: 0,
        percentage: Math.max(0, Math.min(100, newPercentage)),
      });
    }
  }, [bounds.left, bounds.right, onPositionChange, position.x, setPercentage]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 touch-none">
      <Draggable
        axis="x"
        bounds={{ left: bounds.left, right: bounds.right, top: 0, bottom: 0 }}
        onDrag={handleDrag}
        onStart={onDragStart}
        onStop={onDragEnd}
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
});

VideoOverlay.displayName = 'VideoOverlay';

export default VideoOverlay;