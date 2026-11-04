import { useState, useMemo, useCallback, useEffect } from "react";
import { analyzeText } from "./lib/textAnalysis";
import { transformText } from "./lib/textTransform";
import type { TransformType } from "./lib/textTransform";
import type { SavedText } from "./types";
import StatsPanel from "./components/StatsPanel";
import TransformBar from "./components/TransformBar";
import WordFrequencyPanel from "./components/WordFrequencyPanel";
import SavedDocuments from "./components/SavedDocuments";
import { BookOpen, PenLine, Check, AlertCircle } from "lucide-react";

const SAMPLE_TEXT = `The art of writing is the art of discovering what you believe. When you sit down to write, you enter a conversation with yourself. Each sentence is a step into the unknown, a small act of courage that transforms fleeting thoughts into something lasting.

Good writing is clear thinking made visible. It strips away the unnecessary, leaving only what matters. The best writers do not hide behind complexity; they reveal simplicity. They know that every word must earn its place on the page.

Revision is where writing truly happens. The first draft is just clay; the revision is where the sculptor emerges. You cut, you reshape, you polish, until the words feel inevitable, as if they could not have been written any other way.

Read your work aloud. Your ears will catch what your eyes miss. The rhythm of language matters as much as its meaning. A sentence that stumbles when spoken will stumble when read.`;

export default function App() {
  const [text, setText] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = useMemo(() => analyzeText(text), [text]);
  const hasText = text.trim().length > 0;

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleTransform = useCallback(
    (type: TransformType) => {
      const result = transformText(text, type);
      if (result !== text) {
        setText(result);
        showToast("Text transformed");
      }
    },
    [text, showToast]
  );

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch {
      showToast("Could not copy", "error");
    }
  }, [text, showToast]);

  const handleClear = useCallback(() => {
    setText("");
    showToast("Text cleared");
  }, [showToast]);

  const handleDownload = useCallback(() => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded");
  }, [text, showToast]);

  const handleLoadDoc = useCallback((doc: SavedText) => {
    setText(doc.content);
    showToast(`Loaded "${doc.title}"`);
  }, [showToast]);

  const handleSample = useCallback(() => {
    setText(SAMPLE_TEXT);
    showToast("Sample text loaded");
  }, [showToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-neutral-50">
                English Text Studio
              </h1>
              <p className="hidden text-xs text-neutral-500 sm:block">
                Analyze, transform, and refine your English text
              </p>
            </div>
          </div>
          <button
            onClick={handleSample}
            className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-primary-600/50 hover:text-primary-300"
          >
            Try sample
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left column: editor + stats + transforms */}
          <div className="flex flex-col gap-4">
            {/* Transform bar */}
            <TransformBar
              onTransform={handleTransform}
              onCopy={handleCopy}
              onClear={handleClear}
              onDownload={handleDownload}
              hasText={hasText}
            />

            {/* Editor + word frequency */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
              {/* Editor */}
              <div className="relative">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  <PenLine size={14} className="text-primary-400" />
                  Editor
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start typing or paste your text here…"
                  spellCheck={true}
                  className="h-[420px] w-full rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 text-[15px] leading-relaxed text-neutral-100 outline-none transition-all placeholder:text-neutral-600 focus:border-primary-700/50 focus:bg-neutral-900 focus:ring-2 focus:ring-primary-700/20"
                />
              </div>

              {/* Word frequency */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  <BarChartIcon />
                  Analysis
                </div>
                <WordFrequencyPanel text={text} />
              </div>
            </div>

            {/* Stats */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <PenLine size={14} className="text-accent-400" />
                Statistics
              </div>
              <StatsPanel stats={stats} />
            </div>
          </div>

          {/* Right column: saved documents */}
          <div className="lg:sticky lg:top-[64px] lg:h-[calc(100vh-88px)]">
            <SavedDocuments
              onLoad={handleLoadDoc}
              currentText={text}
              currentTitle={text.split("\n")[0]?.slice(0, 40) || ""}
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-slide-up"
        >
          <div
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "border-accent-700/50 bg-accent-950/80 text-accent-200"
                : "border-red-800/50 bg-red-950/80 text-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent-400"
    >
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </svg>
  );
}
