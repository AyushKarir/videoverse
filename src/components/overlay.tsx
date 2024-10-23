import React, { useState, useRef, useEffect } from 'react';

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  aspectRatio: number;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  videoRef,
  isActive,
  aspectRatio,
  onPositionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, initialPosition: { x: 0, y: 0 } });

  useEffect(() => {
    if (!videoRef.current) return;

    const updateDimensions = () => {
      const videoHeight = videoRef.current?.offsetHeight || 0;
      const calculatedWidth = videoHeight * aspectRatio;

      setDimensions({
        height: videoHeight,
        width: calculatedWidth
      });

      if (videoRef.current) {
        const videoWidth = videoRef.current.offsetWidth;
        const newX = (videoWidth - calculatedWidth) / 2;
        setPosition({ x: newX, y: 0 });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (videoRef.current) {
      resizeObserver.observe(videoRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [aspectRatio, videoRef]);

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
    const maxY = videoRect.height - dimensions.height;

    const newX = Math.max(0, Math.min(maxX, dragStartRef.current.initialPosition.x + deltaX));
    const newY = Math.max(0, Math.min(maxY, dragStartRef.current.initialPosition.y + deltaY));

    setPosition({ x: newX, y: newY });
    onPositionChange({ x: newX, y: newY });
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
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {Array(9).fill(null).map((_, i) => (
          <div key={i} className="border border-white/30" />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-white/50 cursor-move" />
      </div>
    </div>
  );
};

export default VideoOverlay;
