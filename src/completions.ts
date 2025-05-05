import { QwenClient } from './client';
import { ChatResponse, ChatResponseStream } from './types/chat';
import { CompletionCreateParams } from './types/models';
import { processStream } from './processors/stream';
import { processResponse } from './processors/response';
import { createRequest } from './services/request';

export class Completion {
    constructor(private client: QwenClient) { }

    async create(params: CompletionCreateParams & { stream: true }): Promise<ReadableStream<ChatResponseStream>>;
    async create(params: CompletionCreateParams & { stream?: false }): Promise<ChatResponse>;
    async create(
        params: CompletionCreateParams,
    ): Promise<ChatResponse | ReadableStream<ChatResponseStream>> {
        const {
            messages,
            model = 'qwen-max-latest',
            stream = false,
            temperature = 0.7,
            maxTokens
        } = params;

        const response = await createRequest(this.client.getConfig(), {
            messages,
            model,
            stream,
            temperature,
            maxTokens
        });

        return stream
            ? processStream(response)
            : processResponse(response);
    }
}