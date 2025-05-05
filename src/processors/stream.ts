import { SSEParser } from '../utils/sse';
import { ChatResponseStream } from '../types/chat';

export function processStream(response: Response): ReadableStream<ChatResponseStream> {
    const parser = new SSEParser();
    const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            try {
                if (!response.body) throw new Error('Response body is null');
                const reader = response.body.getReader();

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
                        controller.enqueue({
                            delta: {
                                content: event.choices[0].delta.content,
                                role: event.choices[0].delta.role,
                                extra: event.choices[0].delta.extra,
                                status: event.choices[0].delta.status,
                                phase: event.choices[0].delta.phase,
                            },
                            usage: event.usage,
                        });
                    }
                }

                controller.close();
            } catch (err) {
                controller.error(err);
            }
        }
    });
}
