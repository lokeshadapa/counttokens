import { useState, useMemo, useCallback, useRef } from 'preact/hooks';
import { models, vendors, collapsedVendors, defaultSelectedModels, presets } from '../lib/models';
import { countTokens, getTextStats } from '../lib/tokenizers';
import type { ModelInfo } from '../lib/models';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_EXTENSIONS = ['.txt', '.md'];
const ALLOWED_MIMES = ['text/plain', 'text/markdown', 'text/x-markdown'];

function AccuracyBadge({ accuracy, disclaimer }: { accuracy: ModelInfo['accuracy']; disclaimer?: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    exact: { bg: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.3)' },
    approximate: { bg: '#eef2ff', color: '#4338ca', border: '1px solid rgba(99,102,241,0.25)' },
    estimate: { bg: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.25)' },
  };

  const labels = {
    exact: 'Exact',
    approximate: 'Approx',
    estimate: 'Estimate',
  };

  const badgeStyle = styles[accuracy];

  if (!disclaimer) {
    return (
      <span
        class="text-[9px] font-bold uppercase tracking-widest px-1.5 py-px rounded"
        style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color, border: badgeStyle.border, lineHeight: '16px' }}
      >
        {labels[accuracy]}
      </span>
    );
  }

  return (
    <span class="relative group/badge">
      <span
        class="text-[9px] font-bold uppercase tracking-widest px-1.5 py-px rounded cursor-help"
        style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color, border: badgeStyle.border, lineHeight: '16px' }}
      >
        {labels[accuracy]}
      </span>
      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 px-3.5 py-2.5 rounded-lg text-xs leading-relaxed opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all duration-150 z-20 pointer-events-none" style={{ backgroundColor: '#1f1d1a', color: '#e8e4de', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)' }}>
        {disclaimer}
        <span class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[6px] border-transparent" style={{ borderTopColor: '#1f1d1a' }} />
      </span>
    </span>
  );
}

function TokenCard({ model, count }: { model: ModelInfo; count: number }) {
  return (
    <div
      class="relative rounded-lg px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e3da',
        borderLeftWidth: '3px',
        borderLeftColor: model.providerColor,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div class="flex items-center gap-2 mb-2">
        <h3 class="font-semibold text-[13px]" style={{ color: '#1f1d1a' }}>{model.name}</h3>
        <AccuracyBadge accuracy={model.accuracy} disclaimer={model.disclaimer} />
      </div>

      <div class="flex items-baseline gap-1.5">
        <p class="text-xl font-mono font-bold tabular-nums" style={{ color: '#1f1d1a' }}>
          {count.toLocaleString()}
        </p>
        <p class="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#9a9489' }}>tokens</p>
      </div>
    </div>
  );
}

function VendorRow({
  vendorName,
  vendorModels,
  selectedModels,
  onToggle,
}: {
  vendorName: string;
  vendorModels: ModelInfo[];
  selectedModels: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div class="flex items-center gap-3 py-2">
      <span class="text-[11px] font-semibold text-parchment-500 uppercase tracking-wider w-24 shrink-0 text-right">
        {vendorName}
      </span>
      <div class="flex flex-wrap gap-2">
        {vendorModels.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          return (
            <button
              key={model.id}
              onClick={() => onToggle(model.id)}
              class={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                isSelected
                  ? 'border-transparent shadow-sm'
                  : 'border-parchment-300 hover:border-sienna-300 hover:text-sienna-600'
              }`}
              style={isSelected
                ? { backgroundColor: '#1f1d1a', color: '#fffef9' }
                : { backgroundColor: '#fffef9', color: '#5c564c' }
              }
            >
              {model.name.replace(model.provider + ' ', '')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Calculator() {
  const [text, setText] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([...defaultSelectedModels]);
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => getTextStats(text), [text]);

  const tokenCounts = useMemo(() => {
    return selectedModels.map((modelId) => ({
      modelId,
      count: countTokens(text, modelId),
    }));
  }, [text, selectedModels]);

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  }, []);

  const applyPreset = useCallback((preset: 'topModels' | 'allOpenAI' | 'all' | 'clear') => {
    if (preset === 'all') {
      setSelectedModels(models.map((m) => m.id));
      setShowMoreVendors(true);
    } else if (preset === 'clear') {
      setSelectedModels([]);
    } else {
      setSelectedModels([...presets[preset]]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    setFileError(null);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError('Only .txt and .md files are supported.');
      return;
    }

    if (!ALLOWED_MIMES.includes(file.type) && file.type !== '') {
      setFileError('Invalid file type.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File too large (max 1MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setUploadedFileName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) handleFile(file);
    input.value = '';
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setUploadedFileName(null);
    setText('');
    textareaRef.current?.focus();
  }, []);


  return (
    <div class="space-y-6">
      {/* Text Input with Drop Zone */}
      <div class="relative">
        {/* Privacy note */}
        <div class="flex items-center gap-1.5 mb-2.5 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" style={{ color: '#16a34a' }} viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <p class="text-xs text-parchment-500">
            Your text never leaves your browser. All counting happens locally.{' '}
            <a href="/privacy" class="text-parchment-600 hover:text-sienna-500 transition-colors underline underline-offset-2 decoration-parchment-400">Learn more</a>
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          class="relative"
        >
          {isDragging && (
            <div class="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-sienna-400 bg-sienna-50/90 backdrop-blur-sm">
              <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-sienna-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm font-medium text-sienna-600">Drop .txt or .md file</p>
              </div>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={text}
            onInput={(e) => {
              setText((e.target as HTMLTextAreaElement).value);
              setUploadedFileName(null);
            }}
            placeholder="Paste or type your text here to count tokens..."
            class="w-full h-48 md:h-64 p-5 rounded-2xl border border-parchment-300 bg-parchment-50 text-parchment-900 placeholder-parchment-400 focus:ring-2 focus:ring-sienna-400/40 focus:border-sienna-300 outline-none resize-y font-mono text-sm leading-relaxed transition-all"
            style="box-shadow: inset 0 2px 4px rgba(140, 120, 90, 0.04), 0 1px 3px rgba(140, 120, 90, 0.06)"
            spellcheck={false}
          />
        </div>

        {/* Stats bar */}
        <div class="flex items-center justify-between mt-2.5 px-1">
          <div class="flex items-center gap-4">
            <div class="flex gap-4 text-xs text-parchment-500 font-mono">
              <span>{stats.characters.toLocaleString()} chars</span>
              <span>{stats.words.toLocaleString()} words</span>
              <span>{stats.lines.toLocaleString()} lines</span>
            </div>
            {uploadedFileName && (
              <span class="inline-flex items-center gap-1 text-xs bg-sienna-50 text-sienna-600 px-2 py-0.5 rounded-full border border-sienna-200/60">
                {uploadedFileName}
                <button onClick={clearFile} class="hover:text-sienna-800 transition-colors" aria-label="Clear file">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
          </div>
          <div class="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-parchment-900 text-parchment-50 hover:bg-parchment-800 rounded-full transition-colors"
              title="Upload .txt or .md file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attach file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={handleFileInput}
              class="hidden"
            />
          </div>
        </div>

        {fileError && (
          <div class="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {fileError}
          </div>
        )}
      </div>

      {/* Model Selector */}
      <div class="card-surface p-5">
        {/* Presets bar */}
        <div class="flex items-center gap-2 mb-4 pb-4 border-b border-parchment-300/50">
          <span class="text-[11px] font-semibold text-parchment-500 uppercase tracking-wider mr-1">Quick:</span>
          {[
            { label: 'Top Models', key: 'topModels' as const },
            { label: 'All OpenAI', key: 'allOpenAI' as const },
            { label: 'All', key: 'all' as const },
            { label: 'Clear', key: 'clear' as const },
          ].map(({ label, key }) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              class="px-3 py-1 rounded-lg text-xs font-medium bg-parchment-200/60 text-parchment-700 hover:bg-sienna-50 hover:text-sienna-600 transition-colors border border-parchment-300/50"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Vendor rows — main */}
        <div class="space-y-1">
          {vendors.map((vendor) => {
            const vendorModels = models.filter((m) => m.vendor === vendor.id);
            return (
              <VendorRow
                key={vendor.id}
                vendorName={vendor.name}
                vendorModels={vendorModels}
                selectedModels={selectedModels}
                onToggle={toggleModel}
              />
            );
          })}
        </div>

        {/* Collapsed vendors */}
        <div class="mt-3 pt-3 border-t border-parchment-300/50">
          <button
            onClick={() => setShowMoreVendors(!showMoreVendors)}
            class="flex items-center gap-1 text-xs font-medium text-parchment-500 hover:text-sienna-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class={`h-3.5 w-3.5 transition-transform duration-200 ${showMoreVendors ? 'rotate-90' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            More models (HuggingFace, xAI)
          </button>

          {showMoreVendors && (
            <div class="mt-2 space-y-1">
              {collapsedVendors.map((vendor) => {
                const vendorModels = models.filter((m) => m.vendor === vendor.id);
                return (
                  <VendorRow
                    key={vendor.id}
                    vendorName={vendor.name}
                    vendorModels={vendorModels}
                    selectedModels={selectedModels}
                    onToggle={toggleModel}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Token Results — grouped by vendor, collapsible rows like FAQ */}
      {text && selectedModels.length > 0 && (
        <div class="space-y-0">
          {[...vendors, ...collapsedVendors]
            .filter((vendor) => tokenCounts.some(({ modelId }) => models.find((m) => m.id === modelId)?.vendor === vendor.id))
            .map((vendor) => {
              const vendorTokenCounts = tokenCounts.filter(({ modelId }) => models.find((m) => m.id === modelId)?.vendor === vendor.id);
              return (
                <details key={vendor.id} class="group" open>
                  <summary class="cursor-pointer flex items-center gap-2 py-3 border-b" style={{ borderColor: '#e8e3da' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-90" style={{ color: '#b5ad9e' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-bold uppercase tracking-wider" style={{ color: '#5c564c' }}>{vendor.name}</span>
                    <span class="text-[11px] font-mono" style={{ color: '#b5ad9e' }}>({vendorTokenCounts.length})</span>
                  </summary>
                  <div class="flex flex-wrap gap-3 py-3">
                    {vendorTokenCounts.map(({ modelId, count }) => {
                      const model = models.find((m) => m.id === modelId);
                      if (!model) return null;
                      return <TokenCard key={modelId} model={model} count={count} />;
                    })}
                  </div>
                </details>
              );
            })}
        </div>
      )}

      {null}
    </div>
  );
}
