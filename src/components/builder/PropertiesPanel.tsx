'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Block, BlockType, CardItem } from '@/types/Block';
import { v4 as uuidv4 } from 'uuid';

const CodePanel = dynamic(() => import('./CodePanel'), { ssr: false });

interface Props {
  block: Block | null;
  onChange: (updated: Block) => void;
}

// ─── Helper UI primitives ─────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="prop-field">
      <label className="prop-label">{label}</label>
      {children}
      {hint && <p className="prop-hint">{hint}</p>}
    </div>
  );
}

function AlignButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="btn-group">
      {[
        { v: 'left', icon: '⬅' },
        { v: 'center', icon: '⬛' },
        { v: 'right', icon: '➡' },
      ].map(({ v, icon }) => (
        <button
          key={v}
          className={`btn-group-btn ${value === v ? 'active' : ''}`}
          onClick={() => onChange(v)}
          title={v.charAt(0).toUpperCase() + v.slice(1)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

function SizeButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="btn-group">
      {['sm', 'md', 'lg'].map((s) => (
        <button
          key={s}
          className={`btn-group-btn ${value === s ? 'active' : ''}`}
          onClick={() => onChange(s)}
        >
          {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
        </button>
      ))}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="color-row">
        <input type="color" className="form-color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input className="form-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
      </div>
    </Field>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="prop-section">
      <button className="prop-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{ opacity: 0.5, fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="prop-section-body">{children}</div>}
    </div>
  );
}

// ─── Per-block visual panels ──────────────────────────────────────────────────

function HeroPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Headline" hint="Main attention-grabbing title">
          <input className="form-input" value={p.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Subheadline" hint="Supporting text below the headline">
          <input className="form-input" value={p.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
        </Field>
        <Field label="Button Text">
          <input className="form-input" value={p.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} />
        </Field>
        <Field label="Button Link">
          <input className="form-input" value={p.ctaUrl} onChange={(e) => set('ctaUrl', e.target.value)} placeholder="https://…" />
        </Field>
      </Section>
      <Section title="Style">
        <ColorRow label="Background Color" value={p.bgColor} onChange={(v) => set('bgColor', v)} />
        <ColorRow label="Text Color" value={p.textColor} onChange={(v) => set('textColor', v)} />
        <Field label="Text Alignment">
          <AlignButtons value={p.align} onChange={(v) => set('align', v)} />
        </Field>
      </Section>
    </>
  );
}

function TextPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Text Content" hint="Supports multiple paragraphs">
          <textarea className="form-textarea" value={p.content} onChange={(e) => set('content', e.target.value)} rows={6} />
        </Field>
      </Section>
      <Section title="Style">
        <Field label="Alignment">
          <AlignButtons value={p.align} onChange={(v) => set('align', v)} />
        </Field>
        <Field label="Font Size">
          <SizeButtons value={p.fontSize} onChange={(v) => set('fontSize', v)} />
        </Field>
      </Section>
    </>
  );
}

function ImagePanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('src', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Section title="Image">
        <Field label="Upload Image" hint="Or paste a URL below">
          <label className="upload-btn">
            📎 Choose file
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        </Field>
        <Field label="Image URL">
          <input className="form-input" value={p.src} onChange={(e) => set('src', e.target.value)} placeholder="https://…" />
        </Field>
        {p.src && (
          <img src={p.src} alt={p.alt} style={{ width: '100%', borderRadius: 8, marginTop: 4, objectFit: 'cover', maxHeight: 120 }} />
        )}
        <Field label="Alt Text" hint="Describe the image for accessibility">
          <input className="form-input" value={p.alt} onChange={(e) => set('alt', e.target.value)} />
        </Field>
        <Field label="Caption">
          <input className="form-input" value={p.caption} onChange={(e) => set('caption', e.target.value)} />
        </Field>
      </Section>
      <Section title="Layout">
        <Field label="Width">
          <div className="btn-group">
            {(['full', 'half', 'quarter'] as const).map((w) => (
              <button key={w} className={`btn-group-btn ${p.width === w ? 'active' : ''}`} onClick={() => set('width', w)}>
                {w === 'full' ? 'Full' : w === 'half' ? 'Half' : 'Quarter'}
              </button>
            ))}
          </div>
        </Field>
      </Section>
    </>
  );
}

function CardsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items: CardItem[] = p.items ?? [];
  const update = (idx: number, key: keyof CardItem, val: string) =>
    set('items', items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  const add = () => set('items', [...items, { id: uuidv4(), icon: '⭐', title: 'New Card', description: 'Description here' }]);
  const remove = (idx: number) => set('items', items.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Content">
        <Field label="Section Heading">
          <input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} />
        </Field>
      </Section>
      <Section title="Layout">
        <Field label="Columns">
          <div className="btn-group">
            {[2, 3, 4].map((n) => (
              <button key={n} className={`btn-group-btn ${p.columns === n ? 'active' : ''}`} onClick={() => set('columns', n)}>
                {n}
              </button>
            ))}
          </div>
        </Field>
      </Section>
      <Section title={`Cards (${items.length})`}>
        {items.map((item, i) => (
          <div key={item.id} className="card-item-editor">
            <div className="card-item-row">
              <input className="form-input" value={item.icon} onChange={(e) => update(i, 'icon', e.target.value)} style={{ width: 50 }} placeholder="🌟" />
              <input className="form-input" value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Card title" />
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <input className="form-input" value={item.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Short description" />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ marginTop: 6, width: '100%' }} onClick={add}>
          + Add Card
        </button>
      </Section>
    </>
  );
}

function ButtonPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Button Text">
          <input className="form-input" value={p.label} onChange={(e) => set('label', e.target.value)} />
        </Field>
        <Field label="Link to" hint="URL this button goes to">
          <input className="form-input" value={p.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
        </Field>
      </Section>
      <Section title="Style">
        <Field label="Button Style">
          <div className="btn-group">
            {[
              { v: 'primary', label: 'Filled' },
              { v: 'secondary', label: 'Subtle' },
              { v: 'outline', label: 'Outline' },
            ].map(({ v, label }) => (
              <button key={v} className={`btn-group-btn ${p.variant === v ? 'active' : ''}`} onClick={() => set('variant', v)}>
                {label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Size">
          <SizeButtons value={p.size} onChange={(v) => set('size', v)} />
        </Field>
        <Field label="Position">
          <AlignButtons value={p.align} onChange={(v) => set('align', v)} />
        </Field>
      </Section>
    </>
  );
}

function DividerPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Style">
        <Field label="Line Style">
          <div className="btn-group">
            {['solid', 'dashed', 'dotted'].map((s) => (
              <button key={s} className={`btn-group-btn ${p.style === s ? 'active' : ''}`} onClick={() => set('style', s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Optional Label">
          <input className="form-input" value={p.label} onChange={(e) => set('label', e.target.value)} placeholder="e.g. OR" />
        </Field>
        <ColorRow label="Line Color" value={p.color} onChange={(v) => set('color', v)} />
      </Section>
    </>
  );
}

function NavbarPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Brand">
        <Field label="Brand Name">
          <input className="form-input" value={p.brandName} onChange={(e) => set('brandName', e.target.value)} />
        </Field>
        <Field label="Logo Icon / Emoji">
          <input className="form-input" value={p.logoIcon} onChange={(e) => set('logoIcon', e.target.value)} placeholder="🎂" />
        </Field>
      </Section>
      <Section title="Promo Banner">
        <Field label="Promo Message" hint="Top announcement bar text">
          <input className="form-input" value={p.promoText} onChange={(e) => set('promoText', e.target.value)} />
        </Field>
        <Field label="Promo Code">
          <input className="form-input" value={p.promoCode} onChange={(e) => set('promoCode', e.target.value)} />
        </Field>
      </Section>
    </>
  );
}

function ProductGridPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Section Heading">
          <input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Subheading">
          <input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} />
        </Field>
      </Section>
      <div className="prop-hint" style={{ padding: '0 0 8px' }}>
        💡 Products are loaded dynamically. Use the <strong>Code</strong> tab to customise product data or filtering logic.
      </div>
    </>
  );
}

function PincodePanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <Section title="Content">
      <Field label="Title">
        <input className="form-input" value={p.title} onChange={(e) => set('title', e.target.value)} />
      </Field>
      <Field label="Input Placeholder">
        <input className="form-input" value={p.placeholder} onChange={(e) => set('placeholder', e.target.value)} />
      </Field>
    </Section>
  );
}

// ─── Panel registry ───────────────────────────────────────────────────────────

const VISUAL_PANELS: Partial<Record<BlockType, React.ComponentType<{ block: Block; set: (k: string, v: unknown) => void }>>> = {
  hero: HeroPanel,
  text: TextPanel,
  image: ImagePanel,
  cards: CardsPanel,
  button: ButtonPanel,
  divider: DividerPanel,
  navbar: NavbarPanel,
  'product-grid': ProductGridPanel,
  'pincode-checker': PincodePanel,
};

// ─── Main PropertiesPanel ─────────────────────────────────────────────────────

export default function PropertiesPanel({ block, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');

  if (!block) {
    return (
      <div className="builder-props">
        <div className="props-header">Properties</div>
        <div className="props-empty">
          <span style={{ fontSize: 32 }}>👈</span>
          <span>Click a block in the preview to edit it</span>
        </div>
      </div>
    );
  }

  const set = (key: string, value: unknown) => {
    onChange({ ...block, props: { ...block.props, [key]: value } });
  };

  const handleOverride = (enabled: boolean) => {
    onChange({ ...block, props: { ...block.props, _codeOverride: enabled } });
  };

  const isCustom = block.type === 'custom';
  const VisualPanel = VISUAL_PANELS[block.type];

  return (
    <div className="builder-props">
      {/* Header */}
      <div className="props-header">
        <span>{getBlockEmoji(block.type)} {getBlockName(block.type)}</span>
      </div>

      {/* Tab bar — Visual | Code */}
      {!isCustom && (
        <div className="props-tabs">
          <button
            className={`props-tab ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => setActiveTab('visual')}
          >
            🎨 Visual
          </button>
          <button
            className={`props-tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            &lt;/&gt; Code
          </button>
        </div>
      )}

      {/* Body */}
      <div className="props-body">
        {(activeTab === 'visual' && !isCustom) ? (
          VisualPanel ? (
            <VisualPanel block={block} set={set} />
          ) : (
            <div className="prop-hint">No visual settings for this block type.</div>
          )
        ) : (
          <CodePanel block={block} set={set} onOverride={handleOverride} />
        )}
      </div>
    </div>
  );
}

const BLOCK_EMOJIS: Record<BlockType, string> = {
  hero: '🦸',
  text: '📝',
  image: '🖼️',
  cards: '🃏',
  button: '🔘',
  divider: '➖',
  custom: '💻',
  navbar: '🧭',
  'product-grid': '🛍️',
  'pincode-checker': '📍',
};

const BLOCK_NAMES: Record<BlockType, string> = {
  hero: 'Hero Section',
  text: 'Text Block',
  image: 'Image',
  cards: 'Card Grid',
  button: 'Button',
  divider: 'Divider',
  custom: 'Custom Code',
  navbar: 'Navigation Bar',
  'product-grid': 'Product Grid',
  'pincode-checker': 'Pincode Checker',
};

function getBlockEmoji(type: BlockType) { return BLOCK_EMOJIS[type] ?? '🧩'; }
function getBlockName(type: BlockType) { return BLOCK_NAMES[type] ?? type; }
