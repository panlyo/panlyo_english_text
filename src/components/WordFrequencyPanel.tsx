import { useMemo } from "react";
import { getWordFrequency, getKeywordDensity } from "../lib/textAnalysis";
import { BarChart3, Tags } from "lucide-react";

interface WordFrequencyPanelProps {
  text: string;
}

export default function WordFrequencyPanel({ text }: WordFrequencyPanelProps) {
  const frequencies = useMemo(() => getWordFrequency(text, 15), [text]);
  const keywordDensity = useMemo(() => getKeywordDensity(text), [text]);

  const maxCount = frequencies.length > 0 ? frequencies[0].count : 1;

  if (frequencies.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 text-center">
        <BarChart3 size={24} className="text-neutral-600" />
        <p className="text-sm text-neutral-500">
          Start typing to see word frequency analysis
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Word Frequency
          </h3>
        </div>
        <div className="flex flex-col gap-1.5">
          {frequencies.map((item, i) => (
            <div
              key={item.word}
              className="flex items-center gap-3"
              style={{ animation: `slideUp 0.3s ease-out ${i * 20}ms both` }}
            >
              <span className="w-28 shrink-0 truncate text-sm font-medium text-neutral-300">
                {item.word}
              </span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-neutral-800/50">
                <div
                  className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-7 shrink-0 text-right text-xs font-semibold tabular-nums text-neutral-400">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {keywordDensity.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Tags size={16} className="text-accent-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
              Keyword Density
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordDensity.map((item) => (
              <span
                key={item.keyword}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-800/50 px-2.5 py-1 text-xs text-neutral-300"
              >
                <span className="font-medium">{item.keyword}</span>
                <span className="text-primary-400">{item.density}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
