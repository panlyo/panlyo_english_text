import { useMemo } from "react";
import type { TextStats } from "../types";
import {
  FileText,
  Type,
  AlignLeft,
  Clock,
  Mic,
  Hash,
  Ruler,
  TrendingUp,
  Zap,
} from "lucide-react";

interface StatsPanelProps {
  stats: TextStats;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
}

function StatCard({ icon, label, value, sublabel }: StatCardProps) {
  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all hover:border-primary-700/50 hover:bg-neutral-900">
      <div className="flex items-center gap-2 text-neutral-400">
        <span className="text-primary-400 transition-transform group-hover:scale-110">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums text-neutral-50">{value}</span>
        {sublabel && <span className="text-xs text-neutral-500">{sublabel}</span>}
      </div>
    </div>
  );
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const cards = useMemo(
    () => [
      {
        icon: <Type size={16} />,
        label: "Words",
        value: stats.words,
        sublabel: stats.uniqueWords > 0 ? `${stats.uniqueWords} unique` : undefined,
      },
      {
        icon: <FileText size={16} />,
        label: "Characters",
        value: stats.characters,
        sublabel: stats.charactersNoSpaces > 0 ? `${stats.charactersNoSpaces} no spaces` : undefined,
      },
      {
        icon: <FileText size={16} className="opacity-60" />,
        label: "Sentences",
        value: stats.sentences,
      },
      {
        icon: <AlignLeft size={16} />,
        label: "Paragraphs",
        value: stats.paragraphs,
      },
      {
        icon: <Clock size={16} />,
        label: "Reading Time",
        value: stats.readingTimeMin,
        sublabel: "min",
      },
      {
        icon: <Mic size={16} />,
        label: "Speaking Time",
        value: stats.speakingTimeMin,
        sublabel: "min",
      },
      {
        icon: <Ruler size={16} />,
        label: "Avg Word Length",
        value: stats.avgWordLength,
        sublabel: "chars",
      },
      {
        icon: <Hash size={16} />,
        label: "Avg Sentence",
        value: stats.avgSentenceLength,
        sublabel: "words",
      },
      {
        icon: <TrendingUp size={16} />,
        label: "Lexical Density",
        value: stats.lexicalDensity,
        sublabel: "%",
      },
      {
        icon: <Zap size={16} />,
        label: "Longest Word",
        value: stats.longestWord.length > 12
          ? stats.longestWord.slice(0, 10) + "…"
          : stats.longestWord || "—",
        sublabel: stats.longestWord ? `${stats.longestWord.length} chars` : undefined,
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card, i) => (
        <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
          <StatCard {...card} />
        </div>
      ))}
    </div>
  );
}
