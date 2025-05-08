# qwen-api

Unofficial Qwen Chat API client for Node.js and TypeScript.

## Install

To use this package, you need to install the dependencies by running the following command:

```bash
npm install qwen-api
````

## Setup

You need to set up the API token and other configurations by storing them in a `.env` file in the root of your project directory. Example of a `.env` file:

```env
QWEN_AUTH_TOKEN=your_auth_token_here
QWEN_COOKIE=your_cookie_here

```

Make sure to replace `your_auth_token_here` and `your_cookie_here` with your valid authentication token and cookie.

## Usage Examples

### 1. **Using the Streaming API**

In streaming mode, you can receive data incrementally as the request is being processed.

```typescript
import { QwenClient } from 'qwen-api';
import 'dotenv/config';

async function main() {
    const client = new QwenClient();
    const stream = await client.completion.create({
        messages: [{
            role: "user",
            content: "What is the capital of Indonesia?",
            web_search: false,
            thinking: false
        }],
        model: "qwen-max-latest",
        stream: true,
    });

    console.log(`User: What is the capital of Indonesia?`);
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
```

### 2. **Using the Non-Streaming API**

If you prefer to get the response directly without streaming, you can use the non-streaming mode as shown below:

```typescript
import { QwenClient } from 'qwen-api';
import 'dotenv/config';

async function main() {
    const client = new QwenClient();
    const response = await client.completion.create({
        messages: [{
            role: "user",
            content: "What is the capital of Indonesia?",
            web_search: false,
            thinking: false
        }],
        model: "qwen-max-latest",
        stream: false,
    });

    console.log(response);
}

main().catch(console.error);
```

## API Reference

### `QwenClient`

The main class to interact with the Qwen API.

#### `QwenClient.completion.create(options: CompletionOptions)`

This method sends a request to the Qwen API.

* **options**: The request configuration object.

  * **messages**: An array of messages to send.

    * **role**: The role of the message sender, either `"user"` or `"assistant"`.
    * **content**: The content of the message.
    * **web\_search**: Whether to perform a web search (default: `false`).
    * **thinking**: Whether the model is processing its thoughts (default: `false`).
  * **model**: The name of the model being used, e.g., `"qwen-max-latest"`.
  * **stream**: `true` for streaming, `false` for immediate response.

#### Example Response

For streaming mode, data is received incrementally through a `ReadableStream`. If not using streaming, the response will be in the form of a JSON object containing the result of the request.

## Testing

You can run the tests provided to verify everything is working as expected:

```bash
npm run test:client
npm run test:stream
```

Make sure your `.env` file is configured correctly with a valid API key.

---
