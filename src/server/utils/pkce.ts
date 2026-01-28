function toBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return Buffer.from(binary, "binary")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export async function generateCodeVerifier(): Promise<string> {
  const random = crypto.getRandomValues(new Uint8Array(32))
  return toBase64Url(random)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return toBase64Url(new Uint8Array(hash))
}
