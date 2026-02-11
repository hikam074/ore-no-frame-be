export type Review = {
  id: string
  mal_id: number
  content: string
  personal_score: number | null
  published: boolean
  reviewer_name: string
  reviewer_id: string
  created_at: string
  updated_at: string
}
export type ReviewPayload = Pick<Review, 
'mal_id' |
'content' |
'published' |
'personal_score' |
'reviewer_id'
>
