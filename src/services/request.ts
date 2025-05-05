import { ChatMessage } from '../types/chat';
import { validateMessages, validateModel } from '../utils/validate';

export async function createRequest(
    config: {
        authToken: string;
        cookie: string;
        timeout: number;
        baseURL: string;
    },
    params: {
        messages: ChatMessage[];
        model: string;
        stream: boolean;
        temperature: number;
        maxTokens?: number;
    }
): Promise<Response> {
    const { authToken, cookie, timeout, baseURL } = config;
    const { messages, model, stream, temperature, maxTokens } = params;

    validateMessages(messages);
    validateModel(model);

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0...'
    });

    const payload = {
        model,
        messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            chat_type: msg.web_search ? 'search' : 't2t',
            feature_config: {
                thinking_enabled: msg.thinking,
                output_schema: stream ? 'phase' : null,
            }
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
        incremental_output: true
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw new Error(error.message || 'Unknown error');
    }
}
