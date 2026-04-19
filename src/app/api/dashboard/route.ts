import { optionResponse } from "@/server/http/options"
import { jsonResWithCors } from "@/server/http/response"
import { supabaseAdmin } from "@/server/supabase/supabase.admin"

export const runtime = 'edge'

export async function OPTIONS() {
    return optionResponse()
}

export async function GET() {
    const { data, error } = await supabaseAdmin.rpc("get_dashboard_data")
    if (error) {
        return jsonResWithCors({
            success: false,
            message: error.message
        }, 500)
    }
    return jsonResWithCors({
        success: true,
        message: 'Dashboard Summary data retrieved successfully',
        data: data
    }, 200)
}