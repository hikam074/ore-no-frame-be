import { NextResponse } from "next/server"
import {
  generateCodeVerifier,
  generateCodeChallenge,
} from "@/server/utils/pkce"

export const runtime = "edge"

export async function GET() {
  const codeVerifier = await generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  const url = new URL("https://myanimelist.net/v1/oauth2/authorize")
  url.searchParams.set("response_type", "code")
  url.searchParams.set("client_id", process.env.MAL_CLIENT_ID!)
  url.searchParams.set("redirect_uri", process.env.MAL_REDIRECT_URI!)
  url.searchParams.set("code_challenge", codeChallenge)
  url.searchParams.set("code_challenge_method", "S256")

  const res = NextResponse.redirect(url.toString())

  res.cookies.set("mal_pkce_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  })

  return res
}
