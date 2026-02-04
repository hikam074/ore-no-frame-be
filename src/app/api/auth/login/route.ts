import { jsonResWithCors } from "@/server/http/response"

export const runtime = "edge"

export async function GET() {

  return jsonResWithCors({
    success: true,
    message: 'OK',
    data: []
  }, 200)
}
