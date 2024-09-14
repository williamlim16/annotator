import { type NextRequest } from 'next/server'
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path')

  if (!path) {
    return new Response("Error: video path is not provided", {
      status: 400
    })
  }

  const filePath = path

  try {
    const stats = await stat(filePath);
    const fileSize = stats.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = 0
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
      };
      return new Response(file as any, { status: 206, headers: head });
    } else {
      const head = {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
      };
      const file = createReadStream(filePath);
      return new Response(file as any, { status: 200, headers: head });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response("Error: Unable to load video", { status: 500 });
  }
}