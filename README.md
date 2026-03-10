# countTokens

Free, privacy-first token counter for LLM models. Paste your text, pick a model, get the count. No sign-up, no tracking, no data leaves your browser.

**Live:** [counttokens.lokeshadapa.com](https://counttokens.lokeshadapa.com)

## Supported models

21 models across 7 providers:

- **Anthropic** — Claude Opus 4.6, Sonnet 4.6, Haiku 4.5
- **OpenAI** — GPT-5.4 Pro, GPT-5.4 Thinking, GPT-5.3 Instant
- **Google** — Gemini 3.1 Pro, Flash-Lite, Deep Think
- **Mistral** — Mistral Large 3, Ministral 14B, Ministral 8B
- **Meta** — Llama 4 Scout, Llama 4 Maverick, Llama 3.1 405B
- **HuggingFace** — DeepSeek R1, Qwen 2.5, SmolLM2
- **xAI** — Grok-4.1 Fast, Grok-4.1, Grok-4 Heavy

## Privacy

All tokenization happens client-side using bundled JavaScript libraries. Your text never leaves the browser. No cookies, no analytics, no backend.

## Run locally

```sh
npm install
npm run dev
```

## Tech stack

- Astro + Preact
- Tailwind CSS
- tiktoken (exact counts for OpenAI models)
- BPE approximation for other providers
- Cloudflare Pages

## Contributing

Got ideas? Open a [discussion](https://github.com/lokeshadapa/counttokens/discussions). Found a bug? Open an issue.

## License

MIT
