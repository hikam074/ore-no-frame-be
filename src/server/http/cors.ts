export const CORS_ORIGIN =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:2000"

export const corsHeaders = {
  "Access-Control-Allow-Origin": CORS_ORIGIN,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Expose-Headers": "Set-Cookie",
}