"use client"
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IoIosSave } from "react-icons/io";
import VideoPlayer from "~/components/home/video-player";
import Cookies from 'js-cookie';

import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

const formSchema = z.object({
  source: z.string({
    required_error: "You need to select a notification type.",
  }),
})

export default function HomePage() {
  const [path, setPath] = useState<string>("")
  const [listFiles, setListFiles] = useState<string[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  async function SearchPath() {
    let res = await (await fetch(`/api?query=${path}`)).json()
    setListFiles(res)
  }

  useEffect(() => {
    const savedPath = Cookies.get('videoPath');
    if (savedPath) {
      setPath(savedPath);
    } else if (path) {
      SavePath();
    }
  }, []);

  const SavePath = useCallback(() => {
    Cookies.set('videoPath', path)
  }, [path])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const videoPath = `${path}/${values.source}`;
    setSelectedVideo(videoPath);
  }

  return (
    <div className="h-screen grid grid-cols-7">
      <div className="col-start-2 col-span-5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Annotator tool
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Annotation tool for Pose Estimation project
        </p>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Configuration
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
          <Button className=" h-auto self-stretch" variant={"outline"} onClick={SearchPath}>Go</Button>
          <Button className=" h-auto self-stretch" variant={"outline"} onClick={SavePath}><IoIosSave /></Button>
        </div>

        <h3 className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Available videos
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup className="pt-5" onValueChange={field.onChange} defaultValue={field.value}>
                      {listFiles.length !== 0 && listFiles.map((file) => {
                        return (
                          <FormItem className="flex items-center space-x-2" key={file}>
                            <FormControl>
                              <RadioGroupItem value={file} id={file} />
                            </FormControl>
                            <FormLabel>
                              {file}
                            </FormLabel>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Use Video</Button>
          </form>
        </Form>
        {selectedVideo && <VideoPlayer src={selectedVideo} />}
      </div >
    </div >
  );
}
