'use client';

import { useState } from 'react';
import { Block, BlockType } from '@/types/Block';

interface PaletteItem {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
  category: 'layout' | 'content' | 'ecommerce' | 'media' | 'marketing' | 'atomic';
}

const BLOCK_LABELS: Record<string, { icon: string; label: string }> = {
  hero: { icon: '🦸', label: 'Hero Banner' },
  text: { icon: '📝', label: 'Text Block' },
  image: { icon: '🖼️', label: 'Image' },
  cards: { icon: '🃏', label: 'Card Grid' },
  button: { icon: '🔘', label: 'Button CTA' },
  divider: { icon: '➖', label: 'Divider' },
  custom: { icon: '💻', label: 'Custom Code' },
  navbar: { icon: '🧭', label: 'Navbar Header' },
  'product-grid': { icon: '🛍️', label: 'Product Grid' },
  'pincode-checker': { icon: '📍', label: 'Pincode Checker' },
  testimonials: { icon: '💬', label: 'Testimonials' },
  faq: { icon: '❓', label: 'FAQ Accordion' },
  countdown: { icon: '⏱️', label: 'Countdown Timer' },
  newsletter: { icon: '📧', label: 'Newsletter Signup' },
  video: { icon: '🎬', label: 'Video Embed' },
  pricing: { icon: '💰', label: 'Pricing Table' },
  gallery: { icon: '🖼️', label: 'Image Gallery' },
  banner: { icon: '📢', label: 'Promo Banner' },
  stats: { icon: '📊', label: 'Stats Counter' },
  steps: { icon: '🪜', label: 'Steps Process' },
  'social-links': { icon: '🔗', label: 'Social Links' },
  'rich-html': { icon: '🌐', label: 'Rich HTML' },
  heading: { icon: '🏷️', label: 'Heading' },
  flex: { icon: '📐', label: 'Flex Container' },
  form: { icon: '📋', label: 'Form Builder' },
  alert: { icon: '💡', label: 'Alert Callout' },
  badge: { icon: '🏷️', label: 'Badge Tag' },
};

const PALETTE_ITEMS: PaletteItem[] = [
  // Atomic Elements
  { type: 'heading', icon: '🏷️', label: 'Heading', description: 'H1-H6 typography tag with alignment', category: 'atomic' },
  { type: 'flex', icon: '📐', label: 'Flex Layout', description: 'Flexbox container with item gap & layout', category: 'atomic' },
  { type: 'button', icon: '🔘', label: 'Button CTA', description: 'Standalone interactive button element', category: 'atomic' },
  { type: 'form', icon: '📋', label: 'Form Builder', description: 'Custom form with inputs, select & submit', category: 'atomic' },
  { type: 'alert', icon: '💡', label: 'Alert Box', description: 'Callout notification banner with icon', category: 'atomic' },
  { type: 'badge', icon: '🏷️', label: 'Badge / Pill', description: 'Tag or pill badge element', category: 'atomic' },
  { type: 'divider', icon: '➖', label: 'Divider Line', description: 'Horizontal line separator', category: 'atomic' },
  { type: 'text', icon: '📝', label: 'Paragraph Text', description: 'Standard HTML paragraph block', category: 'atomic' },
  // Layout
  { type: 'hero', icon: '🦸', label: 'Hero', description: 'Full-width banner with headline & CTA', category: 'layout' },
  // Content
  { type: 'cards', icon: '🃏', label: 'Card Grid', description: 'Grid of feature cards with icons', category: 'content' },
  { type: 'testimonials', icon: '💬', label: 'Testimonials', description: 'Customer reviews with star ratings', category: 'content' },
  { type: 'faq', icon: '❓', label: 'FAQ', description: 'Expandable question & answer accordion', category: 'content' },
  { type: 'stats', icon: '📊', label: 'Stats', description: 'Highlighted number statistics', category: 'content' },
  { type: 'steps', icon: '🪜', label: 'Steps', description: 'Numbered step-by-step process', category: 'content' },
  { type: 'social-links', icon: '🔗', label: 'Social Links', description: 'Social media icon row', category: 'content' },
  { type: 'pricing', icon: '💰', label: 'Pricing Table', description: 'Feature comparison plan cards', category: 'content' },
  // Marketing
  { type: 'banner', icon: '📢', label: 'Banner', description: 'Thin promotional announcement strip', category: 'marketing' },
  { type: 'countdown', icon: '⏱️', label: 'Countdown', description: 'Live sale or launch countdown timer', category: 'marketing' },
  { type: 'newsletter', icon: '📧', label: 'Newsletter', description: 'Email capture with CTA button', category: 'marketing' },
  // Media
  { type: 'image', icon: '🖼️', label: 'Image', description: 'Image with optional caption', category: 'media' },
  { type: 'gallery', icon: '🖼️', label: 'Gallery', description: 'Image grid with lightbox', category: 'media' },
  { type: 'video', icon: '🎬', label: 'Video', description: 'YouTube / Vimeo embed by URL', category: 'media' },
  { type: 'rich-html', icon: '🌐', label: 'Rich HTML', description: 'Paste any HTML — maps, widgets', category: 'media' },
  { type: 'custom', icon: '💻', label: 'Custom Code', description: 'Full HTML/CSS/JS code block', category: 'media' },
  // E-commerce
  { type: 'navbar', icon: '🧭', label: 'Navbar', description: 'Site header with brand & promo bar', category: 'ecommerce' },
  { type: 'product-grid', icon: '🛍️', label: 'Product Grid', description: 'Showcase products with add-to-cart', category: 'ecommerce' },
  { type: 'pincode-checker', icon: '📍', label: 'Pincode Check', description: 'Delivery availability checker', category: 'ecommerce' },
];

interface Template {
  label: string;
  icon: string;
  description: string;
  blocks: BlockType[];
}

const TEMPLATES: Template[] = [
  {
    label: 'Bakery Store',
    icon: '🎂',
    description: 'Navbar + Banner + Hero + Steps + Product Grid + Stats + Testimonials + FAQ + Newsletter',
    blocks: ['navbar', 'banner', 'hero', 'steps', 'product-grid', 'stats', 'testimonials', 'faq', 'newsletter'],
  },
  {
    label: 'Landing Page',
    icon: '🚀',
    description: 'Hero + Stats + Cards + Steps + Testimonials + CTA Button',
    blocks: ['hero', 'stats', 'cards', 'steps', 'testimonials', 'button'],
  },
  {
    label: 'Pricing Page',
    icon: '💰',
    description: 'Hero + Pricing Table + FAQ + Social Links',
    blocks: ['hero', 'pricing', 'faq', 'social-links'],
  },
  {
    label: 'About Us',
    icon: '👥',
    description: 'Hero + Stats + Steps + Testimonials + Social Links',
    blocks: ['hero', 'stats', 'steps', 'testimonials', 'social-links'],
  },
  {
    label: 'Product Launch',
    icon: '⚡',
    description: 'Banner + Hero + Countdown + Video + Gallery + Testimonials + Newsletter',
    blocks: ['banner', 'hero', 'countdown', 'video', 'gallery', 'testimonials', 'newsletter'],
  },
  {
    label: 'Content Page',
    icon: '📄',
    description: 'Hero + Text + Image + FAQ + Button',
    blocks: ['hero', 'text', 'image', 'faq', 'button'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '⊞' },
  { id: 'atomic', label: 'Elements', icon: '⚛️' },
  { id: 'layout', label: 'Layout', icon: '🏗️' },
  { id: 'content', label: 'Content', icon: '✏️' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
  { id: 'ecommerce', label: 'Shop', icon: '🛒' },
  { id: 'media', label: 'Media', icon: '🖼️' },
] as const;

interface Props {
  blocks?: Block[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (blocks: Block[]) => void;
  onAdd: (type: BlockType) => void;
  onAddTemplate?: (types: BlockType[]) => void;
}

export default function ComponentPalette({
  blocks = [],
  selectedId,
  onSelect,
  onDelete,
  onReorder,
  onAdd,
  onAddTemplate,
}: Props) {
  const [activeTab, setActiveTab] = useState<'blocks' | 'sections' | 'templates'>('blocks');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const moveBlock = (index: number, dir: 'up' | 'down') => {
    if (!onReorder) return;
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[targetIdx]] = [next[targetIdx], next[index]];
    onReorder(next.map((b, i) => ({ ...b, order: i })));
  };

  const filtered = PALETTE_ITEMS.filter((item) => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = search === '' ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="builder-palette">
      {/* Sidebar Mode Selector */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: 4,
          borderRadius: 8,
          margin: '8px 8px 12px',
          gap: 4,
          border: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => setActiveTab('blocks')}
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'blocks' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'blocks' ? '#fff' : 'var(--text-muted)',
            transition: 'all 150ms ease',
          }}
        >
          🧱 Add
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'sections' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'sections' ? '#fff' : 'var(--text-muted)',
            transition: 'all 150ms ease',
          }}
        >
          🔀 Sections ({blocks.length})
        </button>

        {onAddTemplate && (
          <button
            onClick={() => setActiveTab('templates')}
            style={{
              flex: 1,
              padding: '6px 4px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'templates' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'templates' ? '#fff' : 'var(--text-muted)',
              transition: 'all 150ms ease',
            }}
          >
            📑 Preset
          </button>
        )}
      </div>

      {/* ──────── TAB 1: ADD BLOCKS ──────── */}
      {activeTab === 'blocks' && (
        <>
          <div className="palette-search-wrap">
            <input
              className="palette-search"
              placeholder="🔍 Search blocks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="palette-cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`palette-cat-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
                title={cat.label}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          <div className="palette-title">
            BLOCKS {search || category !== 'all' ? `(${filtered.length})` : `(${PALETTE_ITEMS.length})`}
          </div>

          <div className="palette-grid">
            {filtered.map((item) => (
              <button
                key={item.type}
                className="palette-tile"
                onClick={() => onAdd(item.type)}
                title={item.description}
              >
                <span className="palette-tile-icon">{item.icon}</span>
                <span className="palette-tile-label">{item.label}</span>
                <span className="palette-tile-desc">{item.description}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="palette-empty">No blocks match &ldquo;{search}&rdquo;</div>
            )}
          </div>
        </>
      )}

      {/* ──────── TAB 2: SECTIONS REORDER TREE ──────── */}
      {activeTab === 'sections' && (
        <div style={{ padding: '0 8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="palette-title" style={{ padding: '4px 0' }}>
            PAGE SECTIONS ({blocks.length})
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            Click to edit section. Use ▲ and ▼ buttons to shift section order up or down.
          </p>

          {blocks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
              No sections added yet. Switch to &ldquo;🧱 Add&rdquo; tab to insert sections.
            </div>
          ) : (
            blocks
              .sort((a, b) => a.order - b.order)
              .map((b, idx) => {
                const info = BLOCK_LABELS[b.type] ?? { icon: '🧩', label: b.type };
                const isSel = b.id === selectedId;

                return (
                  <div
                    key={b.id}
                    onClick={() => onSelect?.(b.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      background: isSel ? 'rgba(124, 58, 237, 0.15)' : 'var(--bg-surface)',
                      border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{info.icon}</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? 'var(--accent-light)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {idx + 1}. {info.label}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {b.props?.title || b.props?.heading || b.props?.brandName || b.type}
                      </div>
                    </div>

                    {/* Reorder Up / Down Controls */}
                    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        title="Shift Section Up"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: idx === 0 ? 'var(--text-muted)' : '#fff',
                          borderRadius: 4,
                          width: 24,
                          height: 24,
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === blocks.length - 1}
                        title="Shift Section Down"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: idx === blocks.length - 1 ? 'var(--text-muted)' : '#fff',
                          borderRadius: 4,
                          width: 24,
                          height: 24,
                          cursor: idx === blocks.length - 1 ? 'not-allowed' : 'pointer',
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ▼
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(b.id)}
                          title="Delete Section"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            borderRadius: 4,
                            width: 24,
                            height: 24,
                            cursor: 'pointer',
                            fontSize: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 4,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ──────── TAB 3: TEMPLATES ──────── */}
      {activeTab === 'templates' && onAddTemplate && (
        <div style={{ padding: '0 8px 12px' }}>
          <div className="palette-title" style={{ padding: '4px 0 8px' }}>
            PREBUILT PAGE TEMPLATES
          </div>
          <div className="palette-template-list">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                className="palette-template-btn"
                onClick={() => onAddTemplate(tmpl.blocks)}
                title={tmpl.description}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{tmpl.icon}</span>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div className="palette-template-name">{tmpl.label}</div>
                  <div className="palette-template-desc">{tmpl.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
