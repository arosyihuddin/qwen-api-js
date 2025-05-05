export type ChatRole = 'system' | 'user' | 'assistant' | 'function';

export interface ChatMessage {
    role: ChatRole;
    content: string;
    web_search?: boolean;
    thinking?: boolean;
}

export interface ChatResponse {
    message: {
        role: string;
        content: string;
    };
    extra?: {
        web_search_info: string;
    };
    usage: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    }
}

export interface ChatResponseStream {
    delta: {
        content?: string;
        role?: string;
        extra?: any;
        status: string;
        phase: string;
    }
    usage: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    }
}