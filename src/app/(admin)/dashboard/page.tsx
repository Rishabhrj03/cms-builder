'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { PageSummary } from '@/types/Page';

interface StatsData {
  total: number;
  published: number;
  draft: number;
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [stats, setStats] = useState<StatsData>({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      setPages(data.pages ?? []);
      setStats(data.stats ?? { total: 0, published: 0, draft: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, slug: form.slug }),
      });
      const data = await res.json();
      if (data.id) {
        showToast('Page created!');
        setShowNewModal(false);
        setForm({ title: '', slug: '' });
        await load();
      } else {
        showToast(data.error ?? 'Failed to create page. Is MongoDB running?', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      showToast('Page deleted.', 'error');
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <>
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-breadcrumb">
          <span>⬡</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>Dashboard</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewModal(true)}>
            + New Page
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Pages', value: stats.total, icon: '📄', color: '#7c3aed' },
            { label: 'Published', value: stats.published, icon: '✅', color: '#10b981' },
            { label: 'Drafts', value: stats.draft, icon: '📝', color: '#f59e0b' },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div
                className="stat-icon"
                style={{ background: `${s.color}22`, color: s.color, fontSize: 20 }}
              >
                {s.icon}
              </div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pages Table */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>All Pages</h2>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              Loading pages…
            </div>
          ) : pages.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📭</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>No pages yet</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
                Create your first page to get started.
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20 }}
                onClick={() => setShowNewModal(true)}
              >
                + New Page
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Blocks</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{p.title}</span>
                    </td>
                    <td>
                      <code
                        style={{
                          fontSize: 12,
                          background: 'var(--bg-elevated)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          color: 'var(--accent-light)',
                        }}
                      >
                        {p.slug}
                      </code>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.blockCount} blocks</td>
                    <td>
                      <span className={`badge badge-${p.status}`}>
                        <span className="badge-dot" />
                        {p.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {formatDate(p.updatedAt)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/pages/${p._id}`}>
                          <button className="btn btn-outline btn-sm">✏️ Edit</button>
                        </Link>
                        <a href={`/preview${p.slug}`} target="_blank" rel="noreferrer">
                          <button className="btn btn-secondary btn-sm">👁 Preview</button>
                        </a>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                        >
                          {deleting === p._id ? '…' : '🗑'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── New Page Modal ── */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Page</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input
                  className="form-input"
                  placeholder="e.g. Home, About Us"
                  value={form.title}
                  onChange={(e) => {
                    const t = e.target.value;
                    setForm({ title: t, slug: autoSlug(t) });
                  }}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  className="form-input"
                  placeholder="e.g. home"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Preview URL: /preview/{form.slug || '…'}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={saving || !form.title.trim() || !form.slug.trim()}
              >
                {saving ? 'Creating…' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
