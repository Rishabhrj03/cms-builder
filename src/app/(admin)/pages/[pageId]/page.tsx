'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { Block, BlockType, defaultProps } from '@/types/Block';
import { Page } from '@/types/Page';
import ComponentPalette from '@/components/builder/ComponentPalette';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import PropertiesPanel from '@/components/builder/PropertiesPanel';

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.pageId as string;

  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${id}`);
      if (!res.ok) { router.push('/dashboard'); return; }
      const data: Page = await res.json();
      setPage(data);
      setBlocks(data.blocks ?? []);
      setStatus(data.status);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      props: { ...defaultProps[type] },
      order: blocks.length,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedId(newBlock.id);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedId === blockId) setSelectedId(null);
  };

  const updateBlock = (updated: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, status }),
      });
      if (res.ok) showToast('Saved!');
      else showToast('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading editor…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ── Builder Topbar ── */}
      <header className="builder-topbar">
        <Link href="/dashboard">
          <button className="btn btn-ghost btn-sm">← Back</button>
        </Link>
        <span className="builder-topbar-title">{page?.title ?? 'Page Editor'}</span>
        <span
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'var(--bg-elevated)',
            padding: '3px 10px',
            borderRadius: 999,
          }}
        >
          {page?.slug}
        </span>

        {/* Status toggle */}
        <select
          className="form-select"
          style={{ width: 130, fontSize: 12 }}
          value={status}
          onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
        >
          <option value="draft">📝 Draft</option>
          <option value="published">✅ Published</option>
        </select>

        <a href={`/preview${page?.slug}`} target="_blank" rel="noreferrer">
          <button className="btn btn-secondary btn-sm">👁 Preview</button>
        </a>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save'}
        </button>
      </header>

      {/* ── Three-Panel Builder ── */}
      <div className="builder-layout">
        <ComponentPalette onAdd={addBlock} />
        <BuilderCanvas
          blocks={blocks}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={deleteBlock}
          onReorder={setBlocks}
        />
        <PropertiesPanel block={selectedBlock} onChange={updateBlock} />
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}
