"use client"

import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FaPlay, FaPause, FaArrowDown, FaArrowUp, FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function VideoPlayer({ src }: { src: string }) {
  const [frame, setFrame] = useState<number>(0);
  const [magnification, setMagnification] = useState<number>(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const moveFrame = (frames: number) => {
    setFrame(frame + frames);
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const drawMagnifiedFrame = () => {
          const { videoWidth, videoHeight } = video;
          canvas.width = videoWidth;
          canvas.height = videoHeight;

          const magnifiedWidth = videoWidth * magnification;
          const magnifiedHeight = videoHeight * magnification;

          context.drawImage(
            video,
            -offsetX, -offsetY, magnifiedWidth, magnifiedHeight
          );
          requestAnimationFrame(drawMagnifiedFrame);
        };
        drawMagnifiedFrame();
      }
    }
  }, [magnification, offsetX, offsetY]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && frame !== 0 && !isNaN(frame)) {
      console.log(frame)
      video.currentTime = frame / 10;
    }
  }, [frame]);

  const moveOffset = (dx: number, dy: number) => {
    setOffsetX(prev => Math.max(0, Math.min(prev + dx, videoRef.current!.videoWidth * (magnification - 1))));
    setOffsetY(prev => Math.max(0, Math.min(prev + dy, videoRef.current!.videoHeight * (magnification - 1))));
  };

  const reset = () => {
    setMagnification(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <div className="flex gap-4">
      <div className="relative w-full mt-4">
        <video className="w-full" ref={videoRef}>
          <source src={`/api/video?path=${encodeURIComponent(src)}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>
      <div className="w-full">
        <h3 className="text-lg font-bold">Playback Controls</h3>
        <div className="border border-gray-300 rounded-md p-2 mb-2">
          <h4 className="text-sm text-gray-500 ">
            Frame
          </h4>
          <div>
            <Input type="number" value={frame} onChange={(e) => setFrame(parseInt(e.target.value))} />
          </div>
          <div className="flex gap-4 mt-5 w-full">
            <Button variant="outline" onClick={() => moveFrame(-1)}>-1</Button>
            <Button variant="outline" onClick={() => moveFrame(-10)}>-10</Button>
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.play();
              }
            }}><FaPlay />
            </Button>
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.pause();
              }
            }}><FaPause />
            </Button>
            <Button variant="outline" onClick={() => moveFrame(1)}>+1</Button>
            <Button variant="outline" onClick={() => moveFrame(10)}>+10</Button>
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

        <h4 className="text-sm text-gray-500">
          Record
        </h4>
      </div>
    </div>
  );
};