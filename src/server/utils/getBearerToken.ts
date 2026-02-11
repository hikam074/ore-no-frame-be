export function getBearerToken(req: Request) {
  const auth = req.headers.get("authorization")
  if (!auth) return null
  return auth.replace("Bearer ", "")
}