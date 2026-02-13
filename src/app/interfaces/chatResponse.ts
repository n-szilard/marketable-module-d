export interface ChatResponse {
    conversation_id?: string,
    response?: string,
    is_final?: boolean,
    type?: string,
    title?: string,
    status?: number,
    detail?: string,
}