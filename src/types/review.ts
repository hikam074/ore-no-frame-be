export type Review = {
  id: string
  mal_id: number
  content: string
  verdict: string | null
  personal_score: number | null
  published: boolean
  reviewer_name: string
  reviewer_id: string
  created_at: string
  updated_at: string
}
