export function shouldUpdateSource(updated_at?: string, maxAgeHours = 24): boolean {
    if (!updated_at) return true
    const updatedAt = new Date(updated_at).getTime()
    const now = Date.now()
    return (now - updatedAt) / (1000 * 60 * 60) >= maxAgeHours
}