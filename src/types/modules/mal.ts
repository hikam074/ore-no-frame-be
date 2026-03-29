// CORE
export type MALResponse = {
    id: number
    title: string
    alternative_titles?: {
        en?: string
        ja?: string
    }
    main_picture?: { medium: string, large: string }
    media_type: string
    mean?: number
    rank?: number
    start_date?: string
    start_season?: { season: string; year: number }
    genres?: { name: string }[]
    studios?: { name: string }[]
    authors?: { node: { name: string } }[]
}
// DERIVED MALRESPONSE
export type MALApiResponse = {
  data: {
    node: MALResponse
  }[]
}
export type MALSearchResponse = {
    data: {
        node: Pick<MALResponse,
            'id' |
            'title' |
            'alternative_titles' |
            'main_picture' |
            'media_type' |
            'start_date' |
            'start_season'
        >
    }
}
// INI SOURCE_TYPE DI ARTICLES & SOURCES KENA DENORMALISASI, JADI KETIKA INSERT DAN UPDATE PASTIKAN KEDUA DATA ITU IDENTIK