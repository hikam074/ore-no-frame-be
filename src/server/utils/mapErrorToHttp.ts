import { AppError } from "@/types/result";
import { jsonResWithCors } from "../http/response";

export function mapErrorToHttp(error: AppError) {
    switch (error.type) {
        case 'NOT_FOUND':
            return jsonResWithCors({success: false, message: error.message}, 404)
        case 'DB_ERROR':
            return jsonResWithCors({success: false, message: 'Database Error'}, 500)
        case 'VALIDATION_ERROR':
            return jsonResWithCors({success: false, message: error.message}, 422)
        default:
            return jsonResWithCors({success: false, message: 'Unknown error'}, 500)
    }
}