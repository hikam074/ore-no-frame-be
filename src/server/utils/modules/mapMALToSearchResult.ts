import { MALResponse, SourceSearchResult } from "@/types";
function extractYear(m: MALResponse): number | null {
  if (m.start_season?.year) return m.start_season.year

  if (m.start_date) {
    const date = new Date(m.start_date)
    const year = date.getFullYear()
    return isNaN(year) ? null : year
  }

  return null
}
export function mapMALtoSearchResult(m: MALResponse): SourceSearchResult {
    // const year =
    //     m.start_season?.year ??
    //     (m.start_date ? new Date(m.start_date).getFullYear() : null)

    return {
        mal_id: m.id,
        title: m.title,
        title_en: m.alternative_titles?.en || '',
        image_url: m.main_picture?.medium || m.main_picture?.large || '',
        media_type: m.media_type,
        year: extractYear(m),
    }
}