import { optionResponse } from "@/server/http/options";
import { jsonResWithCors } from "@/server/http/response";
export async function OPTIONS() {
    return optionResponse()
}
export async function GET() {
    const res = {
        data: [
            {
                id: '001',
                mal_id: 333,
                content: 'string',
                personal_score: null,
                published: true,
                reviewer_name: 'manuk',
                reviewer_id: 'sds',
                created_at: '2025-02-02',
                updated_at: '2025-02-03',

                anime: {

                    mal_id: 333,
                    title: 'nonoa',
                    image_url: 'myanimelist.net',
                    media_type: 'manga',
                    season: 'd',
                    year: 2020,
                    mal_score: 5,
                    mal_rank: 5
                }

            }

        ]
    }
    return jsonResWithCors({
        success: true,
        message: 'Reviews retrieved successfully',
        data: res.data
    }, 200)
}