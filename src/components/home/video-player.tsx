"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FaPlay, FaPause, FaArrowDown, FaArrowUp, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Recorder from "./recorder";
import { create } from "zustand";

interface VideoPlayerStore {
  frame: number;
  setFrame: (frame: number) => void;
}

export const useVideoPlayerStore = create<VideoPlayerStore>((set) => ({
  frame: 0,
  setFrame: (frame) => set({ frame }),
}));

export default function VideoPlayer({ src }: { src: string }) {
  const { frame, setFrame } = useVideoPlayerStore();
  const [magnification, setMagnification] = useState<number>(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateVideoSize = () => {
        setVideoSize({ width: video.videoWidth, height: video.videoHeight });
        setAspectRatio(video.videoWidth / video.videoHeight);
      };
      video.addEventListener('loadedmetadata', updateVideoSize);
      return () => {
        video.removeEventListener('loadedmetadata', updateVideoSize);
      };
    }
  }, []);

  const drawMagnifiedFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const magnifiedWidth = video.videoWidth * magnification;
        const magnifiedHeight = video.videoHeight * magnification;

        context.drawImage(
          video,
          -offsetX, -offsetY, magnifiedWidth, magnifiedHeight
        );
      }
    }
  }, [magnification, offsetX, offsetY]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        drawMagnifiedFrame();
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [drawMagnifiedFrame]);

  useEffect(() => {
    drawMagnifiedFrame();
  }, [magnification, offsetX, offsetY, drawMagnifiedFrame]);

  const moveFrame = (frames: number) => {
    setFrame(frame + frames);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && frame !== 0 && !isNaN(frame)) {
      setIsLoading(true);
      video.currentTime = frame / 10;
      const handleSeeked = () => {
        setIsLoading(false);
        video.removeEventListener('seeked', handleSeeked);
      };
      video.addEventListener('seeked', handleSeeked);
    }
  }, [frame]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const moveOffset = useCallback((dx: number, dy: number) => {
    setOffsetX(prev => Math.max(0, Math.min(prev + dx, videoRef.current!.videoWidth * (magnification - 1))));
    setOffsetY(prev => Math.max(0, Math.min(prev + dy, videoRef.current!.videoHeight * (magnification - 1))));
  }, [magnification]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = dragStart.x - e.clientX;
      const dy = dragStart.y - e.clientY;
      moveOffset(dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, moveOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const reset = () => {
    setMagnification(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <div className="flex gap-4">
      <div className="relative w-1/2">
        <div
          className="overflow-hidden"
          style={{
            width: '100%',
            paddingTop: `${(1 / aspectRatio) * 100}%`,
            position: 'relative',
          }}
        >
          <video
            className="absolute top-0 left-0 w-full h-full object-contain"
            ref={videoRef}
          >
            <source src={`/api/video?path=${encodeURIComponent(src)}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 w-full h-full">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 cursor-move"
                style={{
                  width: '100%',
                  height: '100%',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-1/2 overflow-y-auto" style={{ maxHeight: `${(1 / aspectRatio) * 50}vw` }}>
        <h3 className="text-lg font-bold">Playback Controls</h3>
        <div className="border border-gray-300 rounded-md p-2 mb-2">
          <h4 className="text-sm text-gray-500 ">
            Frame
          </h4>
          <div>
            <Input type="number" value={frame} onChange={(e) => setFrame(parseInt(e.target.value))} />
          </div>
          <div className="flex gap-4 mt-5 w-full">
            <Button variant="outline" onClick={() => moveFrame(-1)} disabled={isLoading}>-1</Button>
            <Button variant="outline" onClick={() => moveFrame(-10)} disabled={isLoading}>-10</Button>
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.play();
              }
            }} disabled={isLoading}><FaPlay />
            </Button>
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.pause();
              }
            }} disabled={isLoading}><FaPause />
            </Button>
            <Button variant="outline" onClick={() => moveFrame(1)} disabled={isLoading}>+1</Button>
            <Button variant="outline" onClick={() => moveFrame(10)} disabled={isLoading}>+10</Button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-md p-2 mb-2">
          <h4 className="text-sm text-gray-500 pt-1">
            Magnifier
          </h4>

          <div className="text-center mt-2">
            {magnification.toFixed(1)}x
          </div>
          <div className="flex gap-4 w-full pt-3">
            <Button variant="outline" className="w-full" onClick={() => setMagnification(prev => Math.max(1, prev - 0.1))}>-</Button>
            <Button variant="outline" className="w-full" onClick={() => setMagnification(prev => prev + 0.1)}>+</Button>
          </div>

          <div className="flex gap-4 w-full pt-3">
            <Button variant="outline" className="w-full" onClick={() => moveOffset(-25, 0)}><FaArrowLeft /></Button>
            <Button variant="outline" className="w-full" onClick={() => moveOffset(25, 0)}><FaArrowRight /></Button>
            <Button variant="outline" className="w-full" onClick={() => moveOffset(0, -25)}><FaArrowUp /></Button>
            <Button variant="outline" className="w-full" onClick={() => moveOffset(0, 25)}><FaArrowDown /></Button>
          </div>
          <div className="flex justify-center pt-2">
            <Button variant="outline" className="w-full " onClick={reset}>Reset</Button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-md p-2 mb-2">
          <h4 className="text-sm text-gray-500">
            Record
          </h4>
          <div className="pt-3">
            <Recorder />
          </div>
        </div>
      </div>
    </div>
  );
};