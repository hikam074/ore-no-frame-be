import { optionResponse } from "@/server/http/options"
import { jsonResWithCors } from "@/server/http/response"
import { lazyUpdateSource } from "@/server/services/lazyUpdateSource"
import { supabaseAdmin } from "@/server/supabase/supabase.admin"

export const runtime = "edge"

export async function OPTIONS() {
    return optionResponse()
}

export async function GET(
    req: Request,
    context: { params: Promise<{ source_type: string, slug: string }> }
) {
    const { source_type, slug } = await context.params

    if (!slug || !source_type) {
        return jsonResWithCors({
            success: false,
            message: "Invalid params",
            data: undefined
        }, 400)
    }

    const { data, error } = await supabaseAdmin
        .from("v_artikel_detail")
        .select("*")
        .eq("source_type", source_type)
        .eq("slug", slug)
        .single()

    if (error) {
        return jsonResWithCors({
            success: false,
            message: `Internal Server Error [${error.message}]`,
            data: undefined
        }, 500)
    }
    if (!data) {
        return jsonResWithCors({
            success: false,
            message: "Artikel not found",
            data: undefined
        }, 404)
    }

    lazyUpdateSource(
        source_type,
        data.source.mal_id,
        data.source.updated_at,
        data.source.id
    )

    console.log(data)

    return jsonResWithCors({
        success: true,
        message: 'Artikel retrieved successfully',
        data: data
    }, 200)
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ source_type: string, slug: string }> }
) {
    const { source_type, slug } = await context.params

    if (!slug || !source_type) {
        return jsonResWithCors({
            success: false,
            message: "Invalid params",
            data: undefined
        }, 400)
    }

    const { error } = await supabaseAdmin.rpc(
        "delete_artikel_with_cleanup",
        {
            p_source_type: source_type,
            p_slug: slug
        }
    )

    if (error) {
        return jsonResWithCors({
            success: false,
            message: error.message,
            data: undefined
        }, 500)
    }

    return jsonResWithCors({
        success: true,
        message: "Artikel deleted successfully",
        data: {}
    }, 200)
}