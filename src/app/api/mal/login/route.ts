import { NextResponse } from "next/server";
import crypto from "crypto"

export const runtime = "edge"

function generateVerifier() {
  return crypto.randomBytes(64).toString("hex")
}

export async function GET() {
    const verifier = generateVerifier()

    const res = NextResponse.redirect(
        `https://myanimelist.net/v1/oauth2/authorize?` +
        new URLSearchParams({
            response_type: "code",
            client_id: process.env.MAL_CLIENT_ID!,
            redirect_uri: process.env.MAL_REDIRECT_URI!,
            code_challenge: verifier,
            code_challenge_method: "plain",
        })
    )
    res.cookies.set("mal_pkce_verifier", verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 300,
    })
    return res
}