import { transformOptions } from "../lib/textTransform";
import type { TransformType } from "../lib/textTransform";
import { Sparkles } from "lucide-react";

interface TransformBarProps {
  onTransform: (type: TransformType) => void;
  onCopy: () => void;
  onClear: () => void;
  onDownload: () => void;
  hasText: boolean;
}

export default function TransformBar({
  onTransform,
  onCopy,
  onClear,
  onDownload,
  hasText,
}: TransformBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <Sparkles size={14} className="text-primary-400" />
        <span>Transform</span>
      </div>

      <div className="h-5 w-px bg-neutral-700" />

      <div className="flex flex-wrap gap-1.5">
        {transformOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onTransform(opt.type)}
            disabled={!hasText}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-primary-600/50 hover:bg-primary-950/30 hover:text-primary-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="font-mono text-[10px] text-primary-400 opacity-70 group-hover:opacity-100">
              {opt.icon}
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onCopy}
          disabled={!hasText}
          className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-accent-600/50 hover:bg-accent-950/30 hover:text-accent-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copy
        </button>
        <button
          onClick={onDownload}
          disabled={!hasText}
          className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-accent-600/50 hover:bg-accent-950/30 hover:text-accent-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Download
        </button>
        <button
          onClick={onClear}
          disabled={!hasText}
          className="rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-400/80 transition-all hover:border-red-700/50 hover:bg-red-950/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
