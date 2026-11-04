import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { SavedText } from "../types";
import {
  Save,
  FilePlus,
  Trash2,
  FileText,
  X,
  Calendar,
} from "lucide-react";

interface SavedDocumentsProps {
  onLoad: (doc: SavedText) => void;
  currentText: string;
  currentTitle: string;
  refreshKey: number;
}

export default function SavedDocuments({
  onLoad,
  currentText,
  currentTitle,
  refreshKey,
}: SavedDocumentsProps) {
  const [documents, setDocuments] = useState<SavedText[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("saved_texts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (fetchError) {
      setError("Could not load saved documents");
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  const handleSave = async () => {
    const trimmedTitle = title.trim() || "Untitled";
    if (!currentText.trim()) return;

    setSaving(true);
    setError(null);
    const { data, error: insertError } = await supabase
      .from("saved_texts")
      .insert({ title: trimmedTitle, content: currentText })
      .select()
      .single();

    setSaving(false);
    if (insertError) {
      setError("Could not save document");
      return;
    }
    setShowSaveDialog(false);
    setTitle("");
    if (data) {
      setDocuments((prev) => [data as SavedText, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from("saved_texts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError("Could not delete document");
      return;
    }
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-neutral-800 bg-neutral-900/50">
      <div className="flex items-center justify-between border-b border-neutral-800 p-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Documents
          </h3>
          {documents.length > 0 && (
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {documents.length}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setTitle(currentTitle || "");
            setShowSaveDialog(true);
          }}
          disabled={!currentText.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary-700/50 bg-primary-950/30 px-2.5 py-1.5 text-xs font-medium text-primary-300 transition-all hover:border-primary-600 hover:bg-primary-900/30 hover:text-primary-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FilePlus size={14} />
          Save
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {showSaveDialog && (
        <div className="mx-4 mt-3 rounded-lg border border-neutral-700 bg-neutral-800/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-300">Save document</span>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="text-neutral-500 hover:text-neutral-300"
            >
              <X size={14} />
            </button>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title…"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setShowSaveDialog(false);
            }}
            className="mb-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-primary-600"
          />
          <button
            onClick={handleSave}
            disabled={saving || !currentText.trim()}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-primary-500 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-sm text-neutral-500">
            Loading…
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <FileText size={24} className="text-neutral-600" />
            <p className="text-sm text-neutral-500">
              No saved documents yet.
              <br />
              Type something and click Save.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-start gap-2 rounded-lg border border-transparent p-2.5 transition-all hover:border-neutral-700 hover:bg-neutral-800/40"
              >
                <button
                  onClick={() => onLoad(doc)}
                  className="flex flex-1 flex-col gap-1 text-left"
                >
                  <span className="text-sm font-medium text-neutral-200 group-hover:text-primary-200">
                    {doc.title}
                  </span>
                  <span className="line-clamp-2 text-xs text-neutral-500">
                    {doc.content.slice(0, 80)}
                    {doc.content.length > 80 ? "…" : ""}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-neutral-600">
                    <Calendar size={10} />
                    {formatDate(doc.updated_at)}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="shrink-0 rounded-md p-1 text-neutral-600 opacity-0 transition-all hover:bg-red-950/40 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
