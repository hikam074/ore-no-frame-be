import { NextResponse } from "next/server";
import { corsHeaders } from "./cors";

export function jsonResWithCors(
    data: unknown,
    status = 200
) {
    return NextResponse.json(
        data, {
            status,
            headers: corsHeaders
        }
    )
}