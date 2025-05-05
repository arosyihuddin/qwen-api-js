import { Completion } from './completions';
import { QwenClientConfig } from './types/models';
import 'dotenv/config';

export class QwenClient {
    private readonly config: Required<QwenClientConfig>;
    public completion: Completion;

    constructor(config: QwenClientConfig = {}) {
        if (!process.env.QWEN_AUTH_TOKEN || !process.env.QWEN_COOKIE) {
            throw new Error('QWEN_AUTH_TOKEN or QWEN_COOKIE is not set');
        }

        this.config = {
            authToken: config.authToken || process.env.QWEN_AUTH_TOKEN!,
            cookie: config.cookie || process.env.QWEN_COOKIE!,
            timeout: config.timeout || 30000,
            baseURL: config.baseURL || 'https://chat.qwen.ai/api/chat/completions',
        };

        this.completion = new Completion(this);
    }

    getConfig() {
        return this.config;
    }
}