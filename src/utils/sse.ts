export class SSEParser {
    private decoder: TextDecoder;
    private buffer: string;

    constructor() {
        this.decoder = new TextDecoder();
        this.buffer = '';
    }

    async *parse(stream: ReadableStream<Uint8Array>): AsyncGenerator<any> {
        const reader = stream.getReader();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                this.buffer += this.decoder.decode(value, { stream: true });

                while (this.buffer.includes('\n\n')) {
                    const splitIndex = this.buffer.indexOf('\n\n');
                    const chunk = this.buffer.slice(0, splitIndex);
                    this.buffer = this.buffer.slice(splitIndex + 2);

                    if (chunk.startsWith('data:')) {
                        const data = chunk.slice(5).trim();
                        if (data === '[DONE]') return;
                        yield JSON.parse(data);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}