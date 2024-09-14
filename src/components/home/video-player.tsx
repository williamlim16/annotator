"use client"

import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FaPlay, FaPause } from "react-icons/fa";

export default function VideoPlayer({ src }: { src: string }) {
  const [frame, setFrame] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="flex gap-4">
      <video controls className="w-full mt-4" ref={videoRef}>
        <source src={`/api/video?path=${encodeURIComponent(src)}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="w-full">
        <h3 className="text-lg font-bold">Controls</h3>
        <div className="border border-gray-300 rounded-md p-2 mb-2">
          <h4 className="text-sm text-gray-500 ">
            Playback
          </h4>

          <div>
            <Input type="number" value={frame} onChange={(e) => setFrame(parseInt(e.target.value))} />
          </div>
          <div className="flex gap-4 mt-5">
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime -= 1 / 10;
              }
            }}>-1</Button>
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime -= 10 / 10;
              }
            }}>-10</Button>
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
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime += 1 / 10;
              }
            }}>+1</Button>
            <Button variant="outline" onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime += 10 / 10;
              }
            }}>+10</Button>
          </div>
        </div>

        <h4 className="text-sm text-gray-500">
          Record
        </h4>
      </div>
    </div>
  );
};