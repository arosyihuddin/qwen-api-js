import { SSEParser } from '../utils/sse';
import { ChatResponse } from '../types/chat';

export async function processResponse(response: Response): Promise<ChatResponse> {
    const parser = new SSEParser();
    const decoder = new TextDecoder();

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    let message = '';
    let usage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
    let extra: any = undefined;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const stream = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(chunk));
                controller.close();
            }
        });
        const events = parser.parse(stream);
        for await (const event of events) {
            message += event.choices[0].delta.content;
            if (event.choices[0].delta.extra) {
                extra = event.choices[0].delta.extra;
            }
            if (event.usage) {
                usage = event.usage;
            }
        }
    }

    return {
        message: { role: "assistant", content: message },
        extra,
        usage,
    };
}
