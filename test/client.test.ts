import { QwenClient } from '../src/client';
import 'dotenv/config';

async function main() {
    const client = new QwenClient();
    const response = await client.completion.create({
        messages: [{
            role: "user",
            content: "Apa ibukota Indonesia?",
            web_search: false,
            thinking: false
        }],
        model: "qwen-max-latest",
        stream: false,
    });

    console.log(response)
}

main().catch(console.error);