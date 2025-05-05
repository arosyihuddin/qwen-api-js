export function validateMessages(messages: any[]) {
    if (!messages || messages.length === 0) {
        throw new Error('At least one message is required');
    }

    for (const msg of messages) {
        if (!['system', 'user', 'assistant'].includes(msg.role)) {
            throw new Error(`Invalid role: ${msg.role}`);
        }
    }
}

export function validateModel(model: string) {
    const validModels = [
        "qwen3-235b-a22b",
        "qwen3-30b-a3b",
        "qwen3-32b",
        "qwen3-235b-a22b",
        "qwen-max-latest",
        "qwen-plus-2025-01-25",
        "qwq-32b",
        "qwen-turbo-2025-02-11",
        "qwen2.5-omni-7b",
        "qvq-72b-preview-0310",
        "qwen2.5-vl-32b-instruct",
        "qwen2.5-14b-instruct-1m",
        "qwen2.5-coder-32b-instruct",
        "qwen2.5-72b-instruct",
    ];
    if (!validModels.includes(model)) {
        throw new Error(`Invalid model: ${model}`);
    }
}