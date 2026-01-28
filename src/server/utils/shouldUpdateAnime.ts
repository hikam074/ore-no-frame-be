import { Anime } from "@/types/anime";

export function shouldUpdateAnime(dbAnime: Anime | null , maxAgeHours = 24): boolean {
    if (!dbAnime) return true

    const updatedAt = new Date(dbAnime.updated_at).getTime()
    const now = Date.now()
    const diffHours = (now - updatedAt) / (1000 * 60 * 60)
    return diffHours >= maxAgeHours
}