import { NextResponse } from "next/server"

export async function GET() {
  const content = `google.com, pub-6351511741135891, DIRECT, f08c47fec0942fa0`
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
