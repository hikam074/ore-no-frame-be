import { optionResponse } from "@/server/http/options"
import { jsonResWithCors } from "@/server/http/response"
import { fetchMAL } from "@/server/mal/mal.fetcher"
import { supabaseAdmin } from "@/server/supabase/supabase.admin"
import { mapMALToSource } from "@/server/utils"
import { getUserFromRequest } from "@/server/utils/getUserFromToken"

export const runtime = "edge"

export async function OPTIONS() {
    return optionResponse()
}

// GET /api/artikel?...
// PARAM :
// ?search=...
// ?active=true 
// ?active=false
// ?active=all
// ?source_type=anime
// ?source_type=manga
// ?source_type=unknown
export async function GET(req: Request) {
    // ambil query params
    const { searchParams } = new URL(req.url)
    // ambil ?source_type=...
    const sourceType = searchParams.get("source_type")?.toLowerCase()
    // ambil ?active=...
    const activeParam = searchParams.get("active")?.toLowerCase()
    // ambil ?search=...
    const queryParam = searchParams.get("search")?.toLowerCase()

    // konfigurasi table
    // default
    let tableName = "v_artikel_kards"
    // ?active=true
    if (activeParam === "true") {
        tableName = "v_active_artikel_kards"
    }
    // ?active=false khusus admin
    else if (activeParam === "false") {
        tableName = "v_deleted_artikel_kards"
    }
    // ?active=all khusus admin
    else if (activeParam === "all") {
        tableName = "v_all_artikel_kards"
    }

    // build query
    let query = supabaseAdmin
        .from(tableName)
        .select("*")
    // kalo ada param maka masukkan
    if (sourceType) {
        query = query.eq("source_type", sourceType)
    }
    if (queryParam && queryParam.length > 0) {
        query = query.or(`title.ilike.%${queryParam}%, slug.ilike.%${queryParam}%, short_description.ilike.%${queryParam}%, source->>title.ilike.%${queryParam}%`)
    }

    // panggil
    const { data, error } = await query
    // kalu error return 500
    if (error) {
        return jsonResWithCors({
            success: false,
            message: `Internal Server Error [${error.message}]`,
            data: undefined
        }, 500)
    }
    // kalau ga ada return 404
    if (!data) {
        return jsonResWithCors({
            success: false,
            message: "Artikels not found",
            data: undefined
        }, 404)
    }
    // kalau berhasil return 200
    return jsonResWithCors({
        success: true,
        message: 'Artikels retrieved successfully',
        data: data
    }, 200)
}

export async function POST(req: Request) {

    const user = await getUserFromRequest(req)

    if (!user) {
        return jsonResWithCors({
            success: false,
            message: "Unauthorized",
        }, 401)
    }

    const body = await req.json()

    const malData = await fetchMAL(body.source_type, body.mal_id)
    if (!malData) {
        return jsonResWithCors({
            success: false,
            message: "Failed to fetch MAL data"
        }, 502)
    }

    const sourcePayload = mapMALToSource(malData)

    const { data, error } = await supabaseAdmin.rpc("create_artikel_full", {
        payload: {
            ...(body.artikel_id ? { artikel_id: body.artikel_id } : {}),
            source: sourcePayload,
            title: body.title,
            slug: body.slug,
            short_description: body.short_description,
            is_published: body.is_published,
            tags: body.tags,
            content_html: body.content_html,
            content_json: body.content_json,
            review_breakdown: body.review_breakdown,
            reviewer_id: user.id,
            source_type: body.source_type,
        }
    })
    if (error) {
        return jsonResWithCors({
            success: false,
            message: error.message
        }, 500)
    }

    return jsonResWithCors({
        success: true,
        message: body.artikel_id ? "Artikel updated successfully" : "Artikel created successfully",
        data: data ?? { slug: body.slug }
    }, body.artikel_id ? 200 : 201)
}
