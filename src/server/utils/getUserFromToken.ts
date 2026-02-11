import { supabaseAdmin } from "../supabase/supabase.admin"
import { getBearerToken } from "./getBearerToken"

export async function getUserFromRequest(req: Request) {
  const token = getBearerToken(req)
  if (!token) return null

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data.user) return null

  return data.user
}
