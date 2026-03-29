// CORE
// import { SOURCE_TYPE } from "@/types";
export type Source = {
  id: string
  mal_id: number
  title: string
  title_ja: string
  title_en: string
  image_url: string
  source_type: 'anime' | 'manga' | 'unknown'
  media_type: string | 'unknown'
  season: string | null
  month: string | null
  year: number | null
  genres: string[] | []
  studios: string[] | []
  author_name: string[] | []
  mal_score: number | null
  mal_rank: number | null
  created_at: string
  updated_at: string
}

export type SourceSearchResult = Pick<Source,
    'mal_id' |
    'title' | 
    'title_en' |
    'image_url' |
    'media_type' |
    'year'
>