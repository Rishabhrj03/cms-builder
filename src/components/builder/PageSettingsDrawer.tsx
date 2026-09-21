'use client';

import { useState } from 'react';
import { Page } from '@/types/Page';

interface Props {
  page: Page;
  onClose: () => void;
  onSave: (updates: Partial<Page>) => void;
}

export default function PageSettingsDrawer({ page, onClose, onSave }: Props) {
  const [title, setTitle] = useState(page.title ?? '');
  const [slug, setSlug] = useState(page.slug ?? '');
  const [seoTitle, setSeoTitle] = useState(page.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(page.seoDescription ?? '');
  const [ogImage, setOgImage] = useState(page.ogImage ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(page.status ?? 'draft');

  const handleSave = () => {
    onSave({ title, slug, seoTitle, seoDescription, ogImage, status });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer">
        <div className="drawer-header">
          <span>⚙️ Page Settings</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">
          {/* Basic */}
          <div className="drawer-section">
            <div className="drawer-section-title">Basic</div>

            <div className="prop-field">
              <label className="prop-label">Page Title</label>
              <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              <p className="prop-hint">Shown in the dashboard list</p>
            </div>

            <div className="prop-field">
              <label className="prop-label">URL Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>yoursite.com</span>
                <input
                  className="form-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                  placeholder="/page-name"
                />
              </div>
            </div>

            <div className="prop-field">
              <label className="prop-label">Status</label>
              <div className="btn-group">
                <button className={`btn-group-btn ${status === 'draft' ? 'active' : ''}`} onClick={() => setStatus('draft')}>
                  📝 Draft
                </button>
                <button className={`btn-group-btn ${status === 'published' ? 'active' : ''}`} onClick={() => setStatus('published')}>
                  ✅ Published
                </button>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="drawer-section">
            <div className="drawer-section-title">SEO & Sharing</div>

            <div className="prop-field">
              <label className="prop-label">Browser Tab Title</label>
              <input className="form-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title} />
              <p className="prop-hint">Shown in Google search results. Keep under 60 characters.</p>
            </div>

            <div className="prop-field">
              <label className="prop-label">Meta Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="A short summary of this page for search engines…"
              />
              <p className="prop-hint">Keep under 160 characters for best results.</p>
            </div>

            <div className="prop-field">
              <label className="prop-label">Social Share Image URL</label>
              <input className="form-input" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://…" />
              <p className="prop-hint">Shown when shared on Facebook, WhatsApp, Twitter.</p>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </>
  );
}
