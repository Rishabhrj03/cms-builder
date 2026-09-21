'use client';

import { useState } from 'react';
import { BlockType, defaultProps } from '@/types/Block';

interface PaletteItem {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
  category: 'layout' | 'content' | 'ecommerce' | 'media';
  preview?: string; // mini CSS background
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Layout
  { type: 'hero', icon: '🦸', label: 'Hero', description: 'Full-width banner with headline & CTA', category: 'layout' },
  { type: 'divider', icon: '➖', label: 'Divider', description: 'Section separator line', category: 'layout' },
  // Content
  { type: 'text', icon: '📝', label: 'Text', description: 'Paragraph or rich text block', category: 'content' },
  { type: 'cards', icon: '🃏', label: 'Card Grid', description: 'Grid of feature cards with icons', category: 'content' },
  { type: 'button', icon: '🔘', label: 'Button', description: 'Call-to-action button', category: 'content' },
  // Media
  { type: 'image', icon: '🖼️', label: 'Image', description: 'Image with optional caption', category: 'media' },
  { type: 'custom', icon: '💻', label: 'Custom Code', description: 'Your own HTML / CSS / JS', category: 'media' },
  // E-commerce
  { type: 'navbar', icon: '🧭', label: 'Navbar', description: 'Site header with brand & promo bar', category: 'ecommerce' },
  { type: 'product-grid', icon: '🛍️', label: 'Product Grid', description: 'Showcase products with add-to-cart', category: 'ecommerce' },
  { type: 'pincode-checker', icon: '📍', label: 'Pincode Check', description: 'Delivery availability checker', category: 'ecommerce' },
];

// Quick-add templates that insert multiple pre-configured blocks
interface Template {
  label: string;
  icon: string;
  description: string;
  blocks: BlockType[];
}

const TEMPLATES: Template[] = [
  {
    label: 'Bakingo Home',
    icon: '🎂',
    description: 'Navbar + Hero + Product Grid + Pincode',
    blocks: ['navbar', 'hero', 'product-grid', 'pincode-checker'],
  },
  {
    label: 'Landing Page',
    icon: '🚀',
    description: 'Hero + Cards + Button',
    blocks: ['hero', 'cards', 'button'],
  },
  {
    label: 'Content Page',
    icon: '📄',
    description: 'Hero + Text + Image + Button',
    blocks: ['hero', 'text', 'image', 'button'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '⊞' },
  { id: 'layout', label: 'Layout', icon: '🏗️' },
  { id: 'content', label: 'Content', icon: '✏️' },
  { id: 'ecommerce', label: 'Shop', icon: '🛒' },
  { id: 'media', label: 'Media', icon: '🖼️' },
] as const;

interface Props {
  onAdd: (type: BlockType) => void;
  onAddTemplate?: (types: BlockType[]) => void;
}

export default function ComponentPalette({ onAdd, onAddTemplate }: Props) {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const filtered = PALETTE_ITEMS.filter((item) => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = search === '' ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="builder-palette">
      {/* Search */}
      <div className="palette-search-wrap">
        <input
          className="palette-search"
          placeholder="🔍 Search blocks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category tabs */}
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

      {/* Block tiles */}
      <div className="palette-title">BLOCKS</div>
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
          <div className="palette-empty">No blocks match "{search}"</div>
        )}
      </div>

      {/* Templates */}
      {onAddTemplate && (
        <div className="palette-templates-section">
          <button
            className="palette-title palette-templates-toggle"
            onClick={() => setShowTemplates(!showTemplates)}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', padding: '10px 0 6px' }}
          >
            TEMPLATES {showTemplates ? '▲' : '▼'}
          </button>
          {showTemplates && (
            <div className="palette-template-list">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  className="palette-template-btn"
                  onClick={() => onAddTemplate(tmpl.blocks)}
                  title={tmpl.description}
                >
                  <span style={{ fontSize: 20 }}>{tmpl.icon}</span>
                  <div>
                    <div className="palette-template-name">{tmpl.label}</div>
                    <div className="palette-template-desc">{tmpl.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
