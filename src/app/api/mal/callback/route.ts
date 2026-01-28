import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 })
  }

  const codeVerifier = (await cookies()).get("mal_pkce_verifier")?.value
  if (!codeVerifier) {
    return NextResponse.json(
        { error: "Tidak ada PKCE verifier"},
        { status: 400 }
    )
  }
  
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.MAL_REDIRECT_URI!,
    client_id: process.env.MAL_CLIENT_ID!,
    client_secret: process.env.MAL_CLIENT_SECRET!,
    code_verifier: codeVerifier,
  })

  const res = await fetch("https://myanimelist.net/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",      
    },
    body,
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: 400 })
  }

  const response = NextResponse.redirect("http://localhost:3000")

  response.cookies.set("mal_access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: data.expires_in,
    path: "/",
  })

  response.cookies.delete("mal_pkce_verifier")

  return response
}
