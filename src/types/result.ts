export type AppError =
    | { type: 'UNAUTHORIZED' }
    | { type: 'VALIDATION_ERROR', message: string }
    | { type: 'NOT_FOUND', message: string }
    | { type: 'DB_ERROR', code?: string }
export type Result<T, E = AppError> =
    | { ok: true; data: T }
    | { ok: false; error: E }
