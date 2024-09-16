"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { FaEye } from "react-icons/fa";
import { FrameRange } from "./recorder";
import { useVideoPlayerStore } from "./video-player";


export const columns: ColumnDef<FrameRange>[] = [
  {
    accessorKey: "id",
    header: "Person ID",
  },
  {
    accessorKey: "start_frame",
    header: "Start Frame",
    cell: ({ row }) => {
      const frameRange = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{frameRange.start_frame}</span>
          <Button variant="ghost" onClick={() => useVideoPlayerStore.getState().setFrame(frameRange.start_frame)}>
            <FaEye />
          </Button>
        </div>
      )
    }
  },
  {
    accessorKey: "end_frame",
    header: "End Frame",
    cell: ({ row }) => {
      const frameRange = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{frameRange.end_frame}</span>
          <Button variant="ghost" onClick={() => useVideoPlayerStore.getState().setFrame(frameRange.end_frame)}>
            <FaEye />
          </Button>
        </div>
      )
    }
  },
]