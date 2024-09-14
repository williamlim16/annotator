"use client"
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function HomePage() {
  const [path, setPath] = useState<string>("")
  const [listFiles, setListFiles] = useState<string[]>([])

  async function SearchPath() {
    let res = await (await fetch(`/api?query=${path}`)).json()
    setListFiles(res)
  }

  return (
    <div className="h-screen grid grid-cols-4">
      <div className="col-start-2 col-span-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Annotator tool
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Annotation tool for Pose Estimation project
        </p>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Select your source
        </h2>
        <div className="flex items-center gap-1 pt-1">
          <div className="grow">
            <Label>Video path</Label>
            <Input
              value={path}
              onChange={event => {
                setPath(event.target.value);
              }}
            />

          </div>
          <Button className=" h-auto self-stretch" variant={"ghost"} onClick={SearchPath}>Go</Button>
        </div>
        {JSON.stringify(listFiles)}
      </div>
    </div>
  );
}
