"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { FrameStart } from "./recorder";
import { Input } from "~/components/ui/input";


export const recordingColumns: ColumnDef<FrameStart>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "start_frame",
    header: "Start",
    cell: ({ row }) => {
      const frameRange = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{frameRange.start_frame}</span>
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
          <Input type="number" />
        </div>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const frameRange = row.original
      return (
        <div className="flex gap-2">
          <Button variant="outline" >Location</Button>
          <Button variant="outline" >Duplicate</Button>
        </div>
      )
    }
  }
]