import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ListFiles } from '~/server/file_explorer'


export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  if (!query) {
    return new Response("Error path is not provided", {
      status: 400
    })
  }

  return NextResponse.json(ListFiles(query))
}