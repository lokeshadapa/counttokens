# Model Refresh Guide

Monthly checklist for keeping TokenCalc models up to date. Designed to be agent-executable.

---

## Vendor Documentation URLs

Check these pages for new model announcements:

| Vendor | URL |
|--------|-----|
| Anthropic | https://docs.anthropic.com/en/docs/about-claude/models |
| OpenAI | https://platform.openai.com/docs/models |
| Google | https://ai.google.dev/models/gemini |
| Mistral | https://docs.mistral.ai/getting-started/models/ |
| Meta | https://llama.meta.com/ |
| HuggingFace | https://huggingface.co/models (trending) |
| xAI | https://docs.x.ai/docs |

---

## `models.ts` Schema

Each model entry in `src/lib/models.ts` follows this interface:

```ts
interface ModelInfo {
  id: string;           // Unique slug, e.g. 'claude-sonnet-4.6'
  name: string;         // Display name, e.g. 'Claude Sonnet 4.6'
  provider: string;     // Vendor display name, e.g. 'Anthropic'
  vendor: string;       // Vendor key matching vendors/collapsedVendors arrays
  providerColor: string; // Hex color for vendor identity
  vocabSize: string;    // e.g. '~100K', '200K'
  contextWindow: string; // e.g. '200K', '1M'
  accuracy: 'exact' | 'approximate' | 'estimate';
  disclaimer?: string;  // Shown when user clicks info icon
}
```

### How to add a model

1. Add entry to `models` array in `src/lib/models.ts`, grouped with its vendor
2. Add the model ID to the switch statement in `src/lib/tokenizers.ts`:
   - OpenAI models → `encodeO200k` case
   - Gemini models → `cl100k × 0.85` case
   - All others → `encodeCl100k` case
3. If adding a new vendor:
   - Add to `vendors` or `collapsedVendors` array in `models.ts`
   - Choose a brand color

### Example: Adding "Claude Opus 5.0"

```ts
// In models.ts, add to Anthropic section:
{
  id: 'claude-opus-5.0',
  name: 'Claude Opus 5.0',
  provider: 'Anthropic',
  vendor: 'anthropic',
  providerColor: '#d97757',
  vocabSize: '~100K',
  contextWindow: '500K',
  accuracy: 'approximate',
  disclaimer: 'Anthropic has not released an official client-side tokenizer. Count is estimated using a similar BPE tokenizer.',
},
```

```ts
// In tokenizers.ts, add to cl100k case:
case 'claude-opus-5.0':
```

---

## `index.astro` Update Steps

The comparison table at `src/pages/index.astro` auto-renders from the `models` array. No manual table update needed — just update `models.ts`.

Update the SEO title/description if the new model is notable:
- `<Layout title="...">` — include prominent new model names
- `<meta name="description">` — update model count if changed

---

## `llms.txt` Update Steps

1. Open `public/llms.txt`
2. Update the "Supported Models" section with new/changed models
3. Update "Key Facts" if tokenizer approach changes

---

## Build Verification

```bash
cd app
npm run build
```

Check:
- [ ] Build succeeds with no errors
- [ ] All models appear in the comparison table (view `dist/index.html`)
- [ ] Default selection shows correct models
- [ ] Token counting works for all new model IDs

---

## Removing a Model

1. Remove entry from `models` array in `models.ts`
2. Remove case from `tokenizers.ts` switch (optional — falls through to default)
3. Remove from `defaultSelectedModels` or `presets` if present
4. Update `llms.txt`
5. Run `npm run build`
