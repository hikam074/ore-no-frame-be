export type MALAnime = {
  id: number
  title: string
  alternative_titles?: {
    ja?: string
    en?: string
  }
  main_picture?: {
    large?: string
  }
  synopsis?: string
  media_type?: string
  mean?: number
  rank?: number
  start_season?: {
    season?: string
    year?: number
  }
  studios?: { name: string }[]
  genres?: { name: string }[]
}
