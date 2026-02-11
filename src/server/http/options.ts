import { NextResponse } from "next/server"
import { corsHeaders } from "@/server/http/cors"
export async function optionResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}
