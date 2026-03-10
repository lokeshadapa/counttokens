import {
  encode as encodeO200k,
} from 'gpt-tokenizer/encoding/o200k_base';
import {
  encode as encodeCl100k,
} from 'gpt-tokenizer/encoding/cl100k_base';

export interface TokenCount {
  modelId: string;
  count: number;
}

/**
 * Count tokens for a given model.
 * - OpenAI models use o200k_base (exact)
 * - Claude, Llama, Mistral, DeepSeek, Qwen, SmolLM, Grok use cl100k_base as approximation
 * - Gemini uses cl100k_base × 0.85 multiplier (SentencePiece with larger vocab)
 */
export function countTokens(text: string, modelId: string): number {
  if (!text) return 0;

  switch (modelId) {
    // OpenAI — exact with o200k_base
    case 'gpt-5.4-pro':
    case 'gpt-5.4-thinking':
    case 'gpt-5.3-instant':
      return encodeO200k(text).length;

    // Gemini — SentencePiece 256K vocab, ~15-20% fewer tokens than cl100k
    case 'gemini-3.1-pro':
    case 'gemini-3.1-flash-lite':
    case 'gemini-3.1-deep-think': {
      const cl100kCount = encodeCl100k(text).length;
      return Math.round(cl100kCount * 0.85);
    }

    // All other BPE-based models: use cl100k as reasonable approximation
    case 'claude-opus-4.6':
    case 'claude-sonnet-4.6':
    case 'claude-haiku-4.5':
    case 'mistral-large-3':
    case 'ministral-14b':
    case 'ministral-8b':
    case 'llama-4-scout':
    case 'llama-4-maverick':
    case 'llama-3.1-405b':
    case 'deepseek-r1':
    case 'qwen-2.5':
    case 'smollm2':
    case 'grok-4.1-fast':
    case 'grok-4.1':
    case 'grok-4-heavy':
      return encodeCl100k(text).length;

    default:
      return encodeCl100k(text).length;
  }
}

export function countAllModels(text: string, modelIds: string[]): TokenCount[] {
  return modelIds.map((modelId) => ({
    modelId,
    count: countTokens(text, modelId),
  }));
}

export function getTextStats(text: string) {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  return { characters, words, lines };
}
