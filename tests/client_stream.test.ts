import { QwenClient } from '../src/client';
import 'dotenv/config';

async function main() {
    const client = new QwenClient();
    const stream = await client.completion.create({
        messages: [{
            role: "user",
            content: "Apa ibukota Indonesia?",
            web_search: false,
            thinking: false
        }],
        model: "qwen-max-latest",
        stream: true,
    });

    console.log(`User: Apa ibukota Indonesia?`);
    console.log(`Assistant:`);
    if (stream instanceof ReadableStream) {
        for await (const chunk of stream) {
            process.stdout.write(chunk.delta?.content || '');
        }
    } else {
        console.error('Stream is not a ReadableStream');
    }
}

main().catch(console.error);