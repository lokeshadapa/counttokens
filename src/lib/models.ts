export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  vendor: string;
  providerColor: string;
  vocabSize: string;
  contextWindow: string;
  accuracy: 'exact' | 'approximate' | 'estimate';
  disclaimer?: string;
}

export const vendors = [
  { id: 'anthropic', name: 'Anthropic', color: '#d97757' },
  { id: 'openai', name: 'OpenAI', color: '#10a37f' },
  { id: 'google', name: 'Google', color: '#4285f4' },
  { id: 'mistral', name: 'Mistral', color: '#f97316' },
  { id: 'meta', name: 'Meta', color: '#0668E1' },
] as const;

export const collapsedVendors = [
  { id: 'huggingface', name: 'HuggingFace', color: '#FFD21E' },
  { id: 'xai', name: 'xAI', color: '#1d1d1f' },
] as const;

export const models: ModelInfo[] = [
  // Anthropic
  {
    id: 'claude-opus-4.6',
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    vendor: 'anthropic',
    providerColor: '#d97757',
    vocabSize: '~100K',
    contextWindow: '200K',
    accuracy: 'approximate',
    disclaimer: 'Anthropic has not released an official client-side tokenizer. Count is estimated using a similar BPE tokenizer.',
  },
  {
    id: 'claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    vendor: 'anthropic',
    providerColor: '#d97757',
    vocabSize: '~100K',
    contextWindow: '200K',
    accuracy: 'approximate',
    disclaimer: 'Anthropic has not released an official client-side tokenizer. Count is estimated using a similar BPE tokenizer.',
  },
  {
    id: 'claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    vendor: 'anthropic',
    providerColor: '#d97757',
    vocabSize: '~100K',
    contextWindow: '200K',
    accuracy: 'approximate',
    disclaimer: 'Anthropic has not released an official client-side tokenizer. Count is estimated using a similar BPE tokenizer.',
  },

  // OpenAI
  {
    id: 'gpt-5.4-pro',
    name: 'GPT-5.4 Pro',
    provider: 'OpenAI',
    vendor: 'openai',
    providerColor: '#10a37f',
    vocabSize: '200K',
    contextWindow: '1M',
    accuracy: 'exact',
  },
  {
    id: 'gpt-5.4-thinking',
    name: 'GPT-5.4 Thinking',
    provider: 'OpenAI',
    vendor: 'openai',
    providerColor: '#10a37f',
    vocabSize: '200K',
    contextWindow: '1M',
    accuracy: 'exact',
  },
  {
    id: 'gpt-5.3-instant',
    name: 'GPT-5.3 Instant',
    provider: 'OpenAI',
    vendor: 'openai',
    providerColor: '#10a37f',
    vocabSize: '200K',
    contextWindow: '400K',
    accuracy: 'exact',
  },

  // Google
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    vendor: 'google',
    providerColor: '#4285f4',
    vocabSize: '256K',
    contextWindow: '1M',
    accuracy: 'estimate',
    disclaimer: 'Google uses a SentencePiece tokenizer with 256K vocabulary. This estimate uses a BPE approximation with a 0.85 multiplier.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    provider: 'Google',
    vendor: 'google',
    providerColor: '#4285f4',
    vocabSize: '256K',
    contextWindow: '1M',
    accuracy: 'estimate',
    disclaimer: 'Google uses a SentencePiece tokenizer with 256K vocabulary. This estimate uses a BPE approximation with a 0.85 multiplier.',
  },
  {
    id: 'gemini-3.1-deep-think',
    name: 'Gemini 3.1 Deep Think',
    provider: 'Google',
    vendor: 'google',
    providerColor: '#4285f4',
    vocabSize: '256K',
    contextWindow: '1M',
    accuracy: 'estimate',
    disclaimer: 'Google uses a SentencePiece tokenizer with 256K vocabulary. This estimate uses a BPE approximation with a 0.85 multiplier.',
  },

  // Mistral
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral',
    vendor: 'mistral',
    providerColor: '#f97316',
    vocabSize: '131K',
    contextWindow: '256K',
    accuracy: 'approximate',
    disclaimer: 'Mistral uses the Tekken tokenizer. This count is estimated using a similar BPE tokenizer.',
  },
  {
    id: 'ministral-14b',
    name: 'Ministral 14B',
    provider: 'Mistral',
    vendor: 'mistral',
    providerColor: '#f97316',
    vocabSize: '131K',
    contextWindow: '256K',
    accuracy: 'approximate',
    disclaimer: 'Mistral uses the Tekken tokenizer. This count is estimated using a similar BPE tokenizer.',
  },
  {
    id: 'ministral-8b',
    name: 'Ministral 8B',
    provider: 'Mistral',
    vendor: 'mistral',
    providerColor: '#f97316',
    vocabSize: '131K',
    contextWindow: '256K',
    accuracy: 'approximate',
    disclaimer: 'Mistral uses the Tekken tokenizer. This count is estimated using a similar BPE tokenizer.',
  },

  // Meta
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout',
    provider: 'Meta',
    vendor: 'meta',
    providerColor: '#0668E1',
    vocabSize: '128K',
    contextWindow: '10M',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation. Actual counts may vary slightly.',
  },
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick',
    provider: 'Meta',
    vendor: 'meta',
    providerColor: '#0668E1',
    vocabSize: '128K',
    contextWindow: '1M',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation. Actual counts may vary slightly.',
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    vendor: 'meta',
    providerColor: '#0668E1',
    vocabSize: '128K',
    contextWindow: '128K',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation. Actual counts may vary slightly.',
  },

  // HuggingFace
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'HuggingFace',
    vendor: 'huggingface',
    providerColor: '#FFD21E',
    vocabSize: '128K',
    contextWindow: '128K',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation.',
  },
  {
    id: 'qwen-2.5',
    name: 'Qwen 2.5',
    provider: 'HuggingFace',
    vendor: 'huggingface',
    providerColor: '#FFD21E',
    vocabSize: '128K',
    contextWindow: '128K',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation.',
  },
  {
    id: 'smollm2',
    name: 'SmolLM2',
    provider: 'HuggingFace',
    vendor: 'huggingface',
    providerColor: '#FFD21E',
    vocabSize: '49K',
    contextWindow: '8K',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation.',
  },

  // xAI
  {
    id: 'grok-4.1-fast',
    name: 'Grok-4.1 Fast',
    provider: 'xAI',
    vendor: 'xai',
    providerColor: '#1d1d1f',
    vocabSize: '131K',
    contextWindow: '2M',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation.',
  },
  {
    id: 'grok-4.1',
    name: 'Grok-4.1',
    provider: 'xAI',
    vendor: 'xai',
    providerColor: '#1d1d1f',
    vocabSize: '131K',
    contextWindow: '256K',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation.',
  },
  {
    id: 'grok-4-heavy',
    name: 'Grok-4 Heavy',
    provider: 'xAI',
    vendor: 'xai',
    providerColor: '#1d1d1f',
    vocabSize: '131K',
    contextWindow: '256K',
    accuracy: 'approximate',
    disclaimer: 'Uses a similar BPE tokenizer for approximation.',
  },
];

export const defaultSelectedModels = ['claude-sonnet-4.6', 'gpt-5.4-pro', 'gemini-3.1-flash-lite'];

export const presets = {
  topModels: ['claude-sonnet-4.6', 'gpt-5.4-pro', 'gemini-3.1-flash-lite'],
  allOpenAI: ['gpt-5.4-pro', 'gpt-5.4-thinking', 'gpt-5.3-instant'],
};

export const faqItems = [
  {
    question: 'What is a token?',
    answer: 'A token is a chunk of text that an AI model processes. It can be a word, part of a word, or even a single character. For example, "tokenization" might be split into "token" and "ization" \u2014 that\'s 2 tokens. Most English words are 1-3 tokens.',
  },
  {
    question: 'Why do different models have different token counts?',
    answer: 'Each AI model uses its own tokenizer with a different vocabulary and algorithm. A model with a larger vocabulary (like Gemini with 256K tokens) can represent more words as single tokens, resulting in fewer total tokens for the same text. The tokenizer is trained on different data, so efficiency varies by language and content type.',
  },
  {
    question: 'Is my text stored or sent anywhere?',
    answer: 'No. All token counting happens entirely in your browser using JavaScript. Your text never leaves your device. You can verify this by opening your browser\'s Developer Tools (F12) and checking the Network tab \u2014 you\'ll see zero requests when you type.',
  },
  {
    question: 'How accurate are the token counts?',
    answer: 'OpenAI models show exact counts using the official tiktoken tokenizer. Other models show approximate counts because their tokenizers aren\'t publicly available as client-side libraries. Approximations are typically within 5-15% of the actual count.',
  },
  {
    question: 'What is a context window?',
    answer: 'The context window is the maximum number of tokens a model can process in a single conversation \u2014 including both your input (prompt) and the model\'s output (response). For example, GPT-5.4 Pro has a 1M token context window.',
  },
  {
    question: 'How many tokens is 1,000 words?',
    answer: 'In English, 1,000 words is roughly 1,300-1,500 tokens for most models. The exact number depends on the complexity of the words and the specific tokenizer. Code tends to use more tokens per word than prose.',
  },
];
