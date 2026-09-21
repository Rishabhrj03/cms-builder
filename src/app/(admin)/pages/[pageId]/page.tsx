'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { Block, BlockType, defaultProps } from '@/types/Block';
import { Page } from '@/types/Page';
import ComponentPalette from '@/components/builder/ComponentPalette';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import PageSettingsDrawer from '@/components/builder/PageSettingsDrawer';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_ICONS: Record<Device, string> = {
  desktop: '🖥️',
  tablet: '📱',
  mobile: '📲',
};

const MAX_HISTORY = 50;

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
  const [device, setDevice] = useState<Device>('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Undo/redo history
  const historyRef = useRef<Block[][]>([]);
  const futureRef = useRef<Block[][]>([]);

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
      historyRef.current = [];
      futureRef.current = [];
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  // ─── Auto-save every 30 seconds when dirty ───────────────────────────────────
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      handleSave(true);
    }, 30_000);
    return () => clearTimeout(t);
  });

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if (meta && e.key === 'z' && e.shiftKey) { e.preventDefault(); handleRedo(); }
      if (meta && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ─── History helpers ──────────────────────────────────────────────────────────
  const pushHistory = (prev: Block[]) => {
    historyRef.current = [...historyRef.current.slice(-MAX_HISTORY), prev];
    futureRef.current = [];
  };

  const handleUndo = () => {
    const hist = historyRef.current;
    if (hist.length === 0) return;
    futureRef.current = [blocks, ...futureRef.current];
    const prev = hist[hist.length - 1];
    historyRef.current = hist.slice(0, -1);
    setBlocks(prev);
    setDirty(true);
  };

  const handleRedo = () => {
    const future = futureRef.current;
    if (future.length === 0) return;
    historyRef.current = [...historyRef.current, blocks];
    setBlocks(future[0]);
    futureRef.current = future.slice(1);
    setDirty(true);
  };

  // ─── Block operations ─────────────────────────────────────────────────────────
  const addBlock = (type: BlockType, afterId?: string) => {
    pushHistory(blocks);
    const newBlock: Block = {
      id: uuidv4(),
      type,
      props: { ...defaultProps[type] },
      order: blocks.length,
    };
    let next: Block[];
    if (afterId) {
      const idx = blocks.findIndex((b) => b.id === afterId);
      next = [
        ...blocks.slice(0, idx + 1),
        newBlock,
        ...blocks.slice(idx + 1),
      ].map((b, i) => ({ ...b, order: i }));
    } else {
      next = [...blocks, newBlock];
    }
    setBlocks(next);
    setSelectedId(newBlock.id);
    setDirty(true);
  };

  const addTemplate = (types: BlockType[]) => {
    pushHistory(blocks);
    const newBlocks = types.map((type, i) => ({
      id: uuidv4(),
      type,
      props: { ...defaultProps[type] },
      order: blocks.length + i,
    }));
    setBlocks([...blocks, ...newBlocks]);
    setSelectedId(newBlocks[0].id);
    setDirty(true);
  };

  const deleteBlock = (blockId: string) => {
    pushHistory(blocks);
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedId === blockId) setSelectedId(null);
    setDirty(true);
  };

  const updateBlock = (updated: Block) => {
    pushHistory(blocks);
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setDirty(true);
  };

  const reorderBlocks = (reordered: Block[]) => {
    pushHistory(blocks);
    setBlocks(reordered);
    setDirty(true);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  // ─── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async (silent = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, status: page?.status }),
      });
      if (res.ok) {
        setDirty(false);
        if (!silent) showToast('✅ Saved!');
      } else {
        if (!silent) showToast('Save failed.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePageSettingsSave = async (updates: Partial<Page>) => {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks, ...updates }),
    });
    if (res.ok) {
      setPage((prev) => prev ? { ...prev, ...updates } : prev);
      showToast('✅ Settings saved!');
    } else {
      showToast('Failed to save settings.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: 12 }}>
        <span style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}>⟳</span>
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

        {/* Auto-save indicator */}
        <span className="autosave-indicator">
          {dirty ? '● Unsaved changes' : '✓ Saved'}
        </span>

        {/* Device toggle */}
        <div className="btn-group" style={{ gap: 2 }}>
          {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
            <button
              key={d}
              className={`btn-group-btn ${device === d ? 'active' : ''}`}
              onClick={() => setDevice(d)}
              title={d.charAt(0).toUpperCase() + d.slice(1)}
              style={{ fontSize: 14, padding: '4px 8px' }}
            >
              {DEVICE_ICONS[d]}
            </button>
          ))}
        </div>

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleUndo}
            disabled={historyRef.current.length === 0}
            title="Undo (⌘Z)"
          >↩</button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleRedo}
            disabled={futureRef.current.length === 0}
            title="Redo (⌘⇧Z)"
          >↪</button>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={() => setShowSettings(true)} title="Page Settings">
          ⚙️ Settings
        </button>

        <a href={`/preview/${(page?.slug ?? '').replace(/^\//, '')}`} target="_blank" rel="noreferrer">
          <button className="btn btn-secondary btn-sm">👁 Preview</button>
        </a>

        <button className="btn btn-primary btn-sm" onClick={() => handleSave()} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save'}
        </button>
      </header>

      {/* ── Three-Panel Builder ── */}
      <div className="builder-layout">
        <ComponentPalette
          onAdd={(type) => addBlock(type)}
          onAddTemplate={addTemplate}
        />
        <BuilderCanvas
          slug={page?.slug ?? '/'}
          blocks={blocks}
          selectedId={selectedId}
          device={device}
          onSelect={setSelectedId}
          onDelete={deleteBlock}
          onReorder={reorderBlocks}
          onAddBelow={(afterId) => {
            // Open a quick block-type picker or default to 'text'
            addBlock('text', afterId);
          }}
        />
        <PropertiesPanel block={selectedBlock} onChange={updateBlock} />
      </div>

      {/* ── Page Settings Drawer ── */}
      {showSettings && page && (
        <PageSettingsDrawer
          page={page}
          onClose={() => setShowSettings(false)}
          onSave={handlePageSettingsSave}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}
