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

// ─── New block panels ────────────────────────────────────────────────────────

function TestimonialsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items = (p.items ?? []) as { id: string; name: string; role: string; avatar: string; quote: string; rating: number }[];
  const update = (idx: number, key: string, val: unknown) =>
    set('items', items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  const add = () => set('items', [...items, { id: uuidv4(), name: 'New Customer', role: 'Verified Customer', avatar: '👤', quote: 'Great product!', rating: 5 }]);
  const remove = (idx: number) => set('items', items.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Content">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Subheading"><input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} /></Field>
      </Section>
      <Section title="Layout">
        <Field label="Style">
          <div className="btn-group">
            <button className={`btn-group-btn ${p.layout === 'grid' ? 'active' : ''}`} onClick={() => set('layout', 'grid')}>Grid</button>
            <button className={`btn-group-btn ${p.layout === 'list' ? 'active' : ''}`} onClick={() => set('layout', 'list')}>List</button>
          </div>
        </Field>
        <Field label="Columns">
          <div className="btn-group">
            {[2, 3].map((n) => (<button key={n} className={`btn-group-btn ${p.columns === n ? 'active' : ''}`} onClick={() => set('columns', n)}>{n}</button>))}
          </div>
        </Field>
      </Section>
      <Section title={`Reviews (${items.length})`}>
        {items.map((item, i) => (
          <div key={item.id} className="card-item-editor">
            <div className="card-item-row">
              <input className="form-input" value={item.avatar} onChange={(e) => update(i, 'avatar', e.target.value)} style={{ width: 50 }} placeholder="👤" />
              <input className="form-input" value={item.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Name" />
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <input className="form-input" value={item.role} onChange={(e) => update(i, 'role', e.target.value)} placeholder="Role / Title" />
            <textarea className="form-textarea" rows={2} value={item.quote} onChange={(e) => update(i, 'quote', e.target.value)} placeholder="Review text…" />
            <Field label={`Rating: ${item.rating}★`}>
              <input type="range" min={1} max={5} value={item.rating} onChange={(e) => update(i, 'rating', Number(e.target.value))} style={{ width: '100%' }} />
            </Field>
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={add}>+ Add Review</button>
      </Section>
    </>
  );
}

function FaqPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items = (p.items ?? []) as { id: string; question: string; answer: string }[];
  const update = (idx: number, key: string, val: string) =>
    set('items', items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  const add = () => set('items', [...items, { id: uuidv4(), question: 'New Question?', answer: 'Your answer here.' }]);
  const remove = (idx: number) => set('items', items.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Content">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Subheading"><input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} /></Field>
      </Section>
      <Section title="Style">
        <ColorRow label="Accent Color" value={p.accentColor || '#7c3aed'} onChange={(v) => set('accentColor', v)} />
      </Section>
      <Section title={`Q&amp;A Items (${items.length})`}>
        {items.map((item, i) => (
          <div key={item.id} className="card-item-editor">
            <div className="card-item-row">
              <input className="form-input" value={item.question} onChange={(e) => update(i, 'question', e.target.value)} placeholder="Question?" />
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <textarea className="form-textarea" rows={2} value={item.answer} onChange={(e) => update(i, 'answer', e.target.value)} placeholder="Answer…" />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={add}>+ Add Q&amp;A</button>
      </Section>
    </>
  );
}

function CountdownPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Subheading"><input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} /></Field>
        <Field label="Target Date &amp; Time" hint="When the countdown reaches zero">
          <input type="datetime-local" className="form-input" value={p.targetDate ? new Date(p.targetDate).toISOString().slice(0,16) : ''} onChange={(e) => set('targetDate', new Date(e.target.value).toISOString())} />
        </Field>
      </Section>
      <Section title="Style">
        <ColorRow label="Background Color" value={p.bgColor || '#1a1a2e'} onChange={(v) => set('bgColor', v)} />
        <ColorRow label="Text Color" value={p.textColor || '#ffffff'} onChange={(v) => set('textColor', v)} />
        <ColorRow label="Counter Accent Color" value={p.accentColor || '#7c3aed'} onChange={(v) => set('accentColor', v)} />
      </Section>
    </>
  );
}

function NewsletterPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Subheading"><input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} /></Field>
        <Field label="Button Text"><input className="form-input" value={p.buttonLabel} onChange={(e) => set('buttonLabel', e.target.value)} /></Field>
        <Field label="Input Placeholder"><input className="form-input" value={p.placeholder} onChange={(e) => set('placeholder', e.target.value)} /></Field>
      </Section>
      <Section title="Style">
        <ColorRow label="Background Color" value={p.bgColor || '#7c3aed'} onChange={(v) => set('bgColor', v)} />
        <ColorRow label="Text Color" value={p.textColor || '#ffffff'} onChange={(v) => set('textColor', v)} />
      </Section>
    </>
  );
}

function VideoPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Video">
        <Field label="YouTube or Vimeo URL" hint="Paste the full video URL from YouTube or Vimeo">
          <input className="form-input" value={p.url} onChange={(e) => set('url', e.target.value)} placeholder="https://youtube.com/watch?v=…" />
        </Field>
        <Field label="Caption"><input className="form-input" value={p.caption} onChange={(e) => set('caption', e.target.value)} placeholder="Optional caption below video" /></Field>
      </Section>
      <Section title="Playback">
        <Field label="Aspect Ratio">
          <div className="btn-group">
            {(['16:9', '4:3', '1:1'] as const).map((r) => (
              <button key={r} className={`btn-group-btn ${p.aspectRatio === r ? 'active' : ''}`} onClick={() => set('aspectRatio', r)}>{r}</button>
            ))}
          </div>
        </Field>
        <label className="override-toggle">
          <input type="checkbox" checked={!!p.autoplay} onChange={(e) => set('autoplay', e.target.checked)} />
          <span>Autoplay</span>
        </label>
        <label className="override-toggle">
          <input type="checkbox" checked={!!p.muted} onChange={(e) => set('muted', e.target.checked)} />
          <span>Muted by default</span>
        </label>
      </Section>
    </>
  );
}

function BannerPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Icon / Emoji"><input className="form-input" value={p.icon} onChange={(e) => set('icon', e.target.value)} style={{ width: 60 }} placeholder="🎉" /></Field>
        <Field label="Banner Text"><input className="form-input" value={p.text} onChange={(e) => set('text', e.target.value)} /></Field>
        <Field label="Link Text"><input className="form-input" value={p.linkLabel} onChange={(e) => set('linkLabel', e.target.value)} placeholder="Order Now" /></Field>
        <Field label="Link URL"><input className="form-input" value={p.linkUrl} onChange={(e) => set('linkUrl', e.target.value)} placeholder="https://…" /></Field>
      </Section>
      <Section title="Style">
        <ColorRow label="Background Color" value={p.bgColor || '#7c3aed'} onChange={(v) => set('bgColor', v)} />
        <ColorRow label="Text Color" value={p.textColor || '#ffffff'} onChange={(v) => set('textColor', v)} />
        <label className="override-toggle">
          <input type="checkbox" checked={!!p.dismissible} onChange={(e) => set('dismissible', e.target.checked)} />
          <span>Show close button</span>
        </label>
      </Section>
    </>
  );
}

function StatsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items = (p.items ?? []) as { id: string; icon: string; value: string; suffix: string; label: string }[];
  const update = (idx: number, key: string, val: string) =>
    set('items', items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  const add = () => set('items', [...items, { id: uuidv4(), icon: '📈', value: '100', suffix: '+', label: 'New Stat' }]);
  const remove = (idx: number) => set('items', items.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Content">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Subheading"><input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} /></Field>
      </Section>
      <Section title="Style">
        <Field label="Columns">
          <div className="btn-group">
            {[2, 3, 4].map((n) => <button key={n} className={`btn-group-btn ${p.columns === n ? 'active' : ''}`} onClick={() => set('columns', n)}>{n}</button>)}
          </div>
        </Field>
        <ColorRow label="Accent Color" value={p.accentColor || '#7c3aed'} onChange={(v) => set('accentColor', v)} />
        <ColorRow label="Background Color" value={p.bgColor || '#f8fafc'} onChange={(v) => set('bgColor', v)} />
      </Section>
      <Section title={`Stats (${items.length})`}>
        {items.map((item, i) => (
          <div key={item.id} className="card-item-editor">
            <div className="card-item-row">
              <input className="form-input" value={item.icon} onChange={(e) => update(i, 'icon', e.target.value)} style={{ width: 50 }} placeholder="📊" />
              <input className="form-input" value={item.value} onChange={(e) => update(i, 'value', e.target.value)} placeholder="100" style={{ width: 70 }} />
              <input className="form-input" value={item.suffix} onChange={(e) => update(i, 'suffix', e.target.value)} placeholder="+" style={{ width: 50 }} />
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <input className="form-input" value={item.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Label" />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={add}>+ Add Stat</button>
      </Section>
    </>
  );
}

function StepsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items = (p.items ?? []) as { id: string; icon: string; title: string; description: string }[];
  const update = (idx: number, key: string, val: string) =>
    set('items', items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  const add = () => set('items', [...items, { id: uuidv4(), icon: '✅', title: 'New Step', description: 'Describe this step.' }]);
  const remove = (idx: number) => set('items', items.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Content">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Subheading"><input className="form-input" value={p.subheading} onChange={(e) => set('subheading', e.target.value)} /></Field>
      </Section>
      <Section title="Style">
        <Field label="Layout">
          <div className="btn-group">
            <button className={`btn-group-btn ${p.layout === 'horizontal' ? 'active' : ''}`} onClick={() => set('layout', 'horizontal')}>Horizontal</button>
            <button className={`btn-group-btn ${p.layout === 'vertical' ? 'active' : ''}`} onClick={() => set('layout', 'vertical')}>Vertical</button>
          </div>
        </Field>
        <ColorRow label="Accent Color" value={p.accentColor || '#7c3aed'} onChange={(v) => set('accentColor', v)} />
      </Section>
      <Section title={`Steps (${items.length})`}>
        {items.map((item, i) => (
          <div key={item.id} className="card-item-editor">
            <div className="card-item-row">
              <input className="form-input" value={item.icon} onChange={(e) => update(i, 'icon', e.target.value)} style={{ width: 50 }} placeholder="🚀" />
              <input className="form-input" value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Step title" />
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <input className="form-input" value={item.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Step description" />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={add}>+ Add Step</button>
      </Section>
    </>
  );
}

function SocialLinksPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items = (p.links ?? []) as { id: string; platform: string; url: string; label: string }[];
  const PLATFORMS = ['instagram', 'facebook', 'twitter', 'youtube', 'whatsapp', 'linkedin', 'tiktok', 'pinterest'];
  const update = (idx: number, key: string, val: string) =>
    set('links', items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  const add = () => set('links', [...items, { id: uuidv4(), platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' }]);
  const remove = (idx: number) => set('links', items.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Settings">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Style">
          <div className="btn-group">
            <button className={`btn-group-btn ${p.style === 'icon-only' ? 'active' : ''}`} onClick={() => set('style', 'icon-only')}>Icon Only</button>
            <button className={`btn-group-btn ${p.style === 'icon-label' ? 'active' : ''}`} onClick={() => set('style', 'icon-label')}>Icon + Label</button>
          </div>
        </Field>
        <Field label="Icon Size"><SizeButtons value={p.iconSize} onChange={(v) => set('iconSize', v)} /></Field>
        <Field label="Alignment"><AlignButtons value={p.align} onChange={(v) => set('align', v)} /></Field>
      </Section>
      <Section title={`Links (${items.length})`}>
        {items.map((item, i) => (
          <div key={item.id} className="card-item-editor">
            <div className="card-item-row">
              <select className="form-select" value={item.platform} onChange={(e) => update(i, 'platform', e.target.value)}>
                {PLATFORMS.map((pl) => <option key={pl} value={pl}>{pl.charAt(0).toUpperCase() + pl.slice(1)}</option>)}
              </select>
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <input className="form-input" value={item.url} onChange={(e) => update(i, 'url', e.target.value)} placeholder="https://…" />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={add}>+ Add Link</button>
      </Section>
    </>
  );
}

function GalleryPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const images = (p.images ?? []) as { id: string; src: string; alt: string }[];
  const update = (idx: number, key: string, val: string) =>
    set('images', images.map((img, i) => (i === idx ? { ...img, [key]: val } : img)));
  const add = () => set('images', [...images, { id: uuidv4(), src: '', alt: 'Image' }]);
  const remove = (idx: number) => set('images', images.filter((_, i) => i !== idx));

  return (
    <>
      <Section title="Settings">
        <Field label="Heading"><input className="form-input" value={p.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
        <Field label="Columns">
          <div className="btn-group">
            {[2, 3, 4].map((n) => <button key={n} className={`btn-group-btn ${p.columns === n ? 'active' : ''}`} onClick={() => set('columns', n)}>{n}</button>)}
          </div>
        </Field>
        <Field label="Gap">
          <div className="btn-group">
            {['tight', 'normal', 'loose'].map((g) => <button key={g} className={`btn-group-btn ${p.gap === g ? 'active' : ''}`} onClick={() => set('gap', g)}>{g.charAt(0).toUpperCase() + g.slice(1)}</button>)}
          </div>
        </Field>
      </Section>
      <Section title={`Images (${images.length})`}>
        {images.map((img, i) => (
          <div key={img.id} className="card-item-editor">
            <div className="card-item-row">
              {img.src && <img src={img.src} alt={img.alt} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
              <input className="form-input" value={img.src} onChange={(e) => update(i, 'src', e.target.value)} placeholder="Image URL" />
              <button className="btn btn-danger btn-icon" onClick={() => remove(i)}>✕</button>
            </div>
            <input className="form-input" value={img.alt} onChange={(e) => update(i, 'alt', e.target.value)} placeholder="Alt text" />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={add}>+ Add Image</button>
      </Section>
    </>
  );
}

function RichHtmlPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="HTML Code" hint="Paste any HTML here: maps, forms, widgets, iframes…">
          <textarea className="form-textarea" rows={8} value={p.html} onChange={(e) => set('html', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12 }} />
        </Field>
      </Section>
      <Section title="Layout">
        <Field label="Padding">
          <div className="btn-group">
            {['none', 'sm', 'md', 'lg'].map((s) => <button key={s} className={`btn-group-btn ${p.padding === s ? 'active' : ''}`} onClick={() => set('padding', s)}>{s === 'none' ? 'None' : s.toUpperCase()}</button>)}
          </div>
        </Field>
      </Section>
    </>
  );
}

// ─── Atomic Element Panels ───────────────────────────────────────────────────

function HeadingPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Content">
        <Field label="Heading Text">
          <input className="form-input" value={p.text || ''} onChange={(e) => set('text', e.target.value)} />
        </Field>
        <Field label="Subtitle / Description" hint="Optional secondary text">
          <input className="form-input" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} />
        </Field>
      </Section>
      <Section title="Typography & Tag">
        <Field label="HTML Tag">
          <div className="btn-group">
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((t) => (
              <button key={t} className={`btn-group-btn ${p.tag === t ? 'active' : ''}`} onClick={() => set('tag', t)}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Font Size">
          <input className="form-input" value={p.fontSize || '32px'} onChange={(e) => set('fontSize', e.target.value)} placeholder="32px" />
        </Field>
        <Field label="Font Weight">
          <div className="btn-group">
            {['normal', 'medium', 'semibold', 'bold', 'extrabold'].map((w) => (
              <button key={w} className={`btn-group-btn ${p.fontWeight === w ? 'active' : ''}`} onClick={() => set('fontWeight', w)}>
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </button>
            ))}
          </div>
        </Field>
        <ColorRow label="Text Color" value={p.textColor || '#111827'} onChange={(v) => set('textColor', v)} />
        <Field label="Alignment">
          <AlignButtons value={p.align || 'left'} onChange={(v) => set('align', v)} />
        </Field>
      </Section>
    </>
  );
}

function FlexPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items = p.items || [];

  const updateItem = (index: number, key: string, val: string) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: val };
    set('items', next);
  };

  const addItem = () => {
    set('items', [
      ...items,
      { id: uuidv4(), title: `Flex Item ${items.length + 1}`, content: 'New item content', icon: '⚡', badge: '', linkUrl: '#' },
    ]);
  };

  const removeItem = (index: number) => {
    set('items', items.filter((_: unknown, i: number) => i !== index));
  };

  return (
    <>
      <Section title="Flexbox Container Layout">
        <Field label="Flex Direction">
          <div className="btn-group">
            {[
              { key: 'row', label: 'Row ➡' },
              { key: 'column', label: 'Column ⬇' },
              { key: 'row-reverse', label: 'Reverse ⬅' },
            ].map((d) => (
              <button key={d.key} className={`btn-group-btn ${p.direction === d.key ? 'active' : ''}`} onClick={() => set('direction', d.key)}>
                {d.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Justify Content">
          <div className="btn-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {[
              { key: 'flex-start', label: 'Start' },
              { key: 'center', label: 'Center' },
              { key: 'flex-end', label: 'End' },
              { key: 'space-between', label: 'Between' },
              { key: 'space-around', label: 'Around' },
            ].map((j) => (
              <button key={j.key} className={`btn-group-btn ${p.justifyContent === j.key ? 'active' : ''}`} onClick={() => set('justifyContent', j.key)} style={{ fontSize: 11 }}>
                {j.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Align Items">
          <div className="btn-group">
            {['flex-start', 'center', 'flex-end', 'stretch'].map((a) => (
              <button key={a} className={`btn-group-btn ${p.alignItems === a ? 'active' : ''}`} onClick={() => set('alignItems', a)} style={{ fontSize: 11 }}>
                {a.replace('flex-', '')}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Item Gap">
          <input className="form-input" value={p.gap || '16px'} onChange={(e) => set('gap', e.target.value)} placeholder="16px" />
        </Field>
        <Field label="Container Padding">
          <input className="form-input" value={p.padding || '24px'} onChange={(e) => set('padding', e.target.value)} placeholder="24px" />
        </Field>
        <ColorRow label="Background Color" value={p.bgColor || '#ffffff'} onChange={(v) => set('bgColor', v)} />
        <ColorRow label="Border Color" value={p.borderColor || '#e2e8f0'} onChange={(v) => set('borderColor', v)} />
        <Field label="Border Radius">
          <input className="form-input" value={p.borderRadius || '12px'} onChange={(e) => set('borderRadius', e.target.value)} placeholder="12px" />
        </Field>
      </Section>

      <Section title={`Flex Items (${items.length})`}>
        {items.map((item: any, idx: number) => (
          <div key={item.id || idx} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 10, background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Item #{idx + 1}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(idx)} style={{ color: '#ef4444', fontSize: 11 }}>
                Delete
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 6, marginBottom: 6 }}>
              <input className="form-input" value={item.icon || ''} onChange={(e) => updateItem(idx, 'icon', e.target.value)} placeholder="Icon" />
              <input className="form-input" value={item.title || ''} onChange={(e) => updateItem(idx, 'title', e.target.value)} placeholder="Title" />
            </div>
            <textarea className="form-textarea" rows={2} value={item.content || ''} onChange={(e) => updateItem(idx, 'content', e.target.value)} placeholder="Content body..." style={{ marginBottom: 6 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <input className="form-input" value={item.badge || ''} onChange={(e) => updateItem(idx, 'badge', e.target.value)} placeholder="Badge text" />
              <input className="form-input" value={item.linkUrl || ''} onChange={(e) => updateItem(idx, 'linkUrl', e.target.value)} placeholder="Link URL" />
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addItem} style={{ width: '100%' }}>
          + Add Flex Item
        </button>
      </Section>
    </>
  );
}

function FormPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const fields = p.fields || [];

  const updateField = (index: number, key: string, val: unknown) => {
    const next = [...fields];
    next[index] = { ...next[index], [key]: val };
    set('fields', next);
  };

  const addField = () => {
    set('fields', [
      ...fields,
      { id: uuidv4(), label: `Field ${fields.length + 1}`, type: 'text', placeholder: '', required: false },
    ]);
  };

  const removeField = (index: number) => {
    set('fields', fields.filter((_: unknown, i: number) => i !== index));
  };

  return (
    <>
      <Section title="Form Header & Button">
        <Field label="Form Title">
          <input className="form-input" value={p.title || ''} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Subheading">
          <input className="form-input" value={p.subheading || ''} onChange={(e) => set('subheading', e.target.value)} />
        </Field>
        <Field label="Submit Button Label">
          <input className="form-input" value={p.buttonLabel || ''} onChange={(e) => set('buttonLabel', e.target.value)} />
        </Field>
        <Field label="Success Message">
          <input className="form-input" value={p.successMessage || ''} onChange={(e) => set('successMessage', e.target.value)} />
        </Field>
        <ColorRow label="Button Accent Color" value={p.accentColor || '#7c3aed'} onChange={(v) => set('accentColor', v)} />
        <ColorRow label="Form Card Background" value={p.bgColor || '#ffffff'} onChange={(v) => set('bgColor', v)} />
        <ColorRow label="Border Color" value={p.borderColor || '#e2e8f0'} onChange={(v) => set('borderColor', v)} />
      </Section>

      <Section title={`Form Fields (${fields.length})`}>
        {fields.map((f: any, idx: number) => (
          <div key={f.id || idx} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 10, background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Field #{idx + 1} ({f.type})</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeField(idx)} style={{ color: '#ef4444', fontSize: 11 }}>
                Delete
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
              <input className="form-input" value={f.label || ''} onChange={(e) => updateField(idx, 'label', e.target.value)} placeholder="Field Label" />
              <select className="form-input" value={f.type || 'text'} onChange={(e) => updateField(idx, 'type', e.target.value)}>
                <option value="text">Text Input</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="select">Dropdown Select</option>
                <option value="checkbox">Checkbox</option>
              </select>
            </div>
            <input className="form-input" value={f.placeholder || ''} onChange={(e) => updateField(idx, 'placeholder', e.target.value)} placeholder="Placeholder text" style={{ marginBottom: 6 }} />
            {f.type === 'select' && (
              <input className="form-input" value={f.options || ''} onChange={(e) => updateField(idx, 'options', e.target.value)} placeholder="Options (comma separated, e.g. Red, Blue, Green)" style={{ marginBottom: 6 }} />
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!f.required} onChange={(e) => updateField(idx, 'required', e.target.checked)} />
              Required Field
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addField} style={{ width: '100%' }}>
          + Add Input Field
        </button>
      </Section>
    </>
  );
}

function AlertPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Alert Configuration">
        <Field label="Variant Type">
          <div className="btn-group">
            {[
              { k: 'info', label: 'Info ℹ️' },
              { k: 'success', label: 'Success ✅' },
              { k: 'warning', label: 'Warning ⚠️' },
              { k: 'error', label: 'Error 🚨' },
            ].map((v) => (
              <button key={v.k} className={`btn-group-btn ${p.variant === v.k ? 'active' : ''}`} onClick={() => set('variant', v.k)} style={{ fontSize: 11 }}>
                {v.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Title">
          <input className="form-input" value={p.title || ''} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Message Content">
          <textarea className="form-textarea" rows={3} value={p.message || ''} onChange={(e) => set('message', e.target.value)} />
        </Field>
        <Field label="Custom Icon Emoji">
          <input className="form-input" value={p.icon || ''} onChange={(e) => set('icon', e.target.value)} placeholder="ℹ️" />
        </Field>
        <Field label="Dismissible Close Button">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={p.dismissible ?? true} onChange={(e) => set('dismissible', e.target.checked)} />
            Allow user to close alert
          </label>
        </Field>
      </Section>
    </>
  );
}

function BadgePanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Section title="Badge Settings">
        <Field label="Badge Text">
          <input className="form-input" value={p.text || ''} onChange={(e) => set('text', e.target.value)} />
        </Field>
        <Field label="Badge Variant">
          <div className="btn-group">
            {['soft', 'filled', 'outline'].map((v) => (
              <button key={v} className={`btn-group-btn ${p.variant === v ? 'active' : ''}`} onClick={() => set('variant', v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Icon Emoji">
          <input className="form-input" value={p.icon || ''} onChange={(e) => set('icon', e.target.value)} placeholder="✨" />
        </Field>
        <ColorRow label="Accent Color" value={p.bgColor || '#7c3aed'} onChange={(v) => set('bgColor', v)} />
        <Field label="Size">
          <SizeButtons value={p.size || 'md'} onChange={(v) => set('size', v)} />
        </Field>
        <Field label="Alignment">
          <AlignButtons value={p.align || 'center'} onChange={(v) => set('align', v)} />
        </Field>
      </Section>
    </>
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
  // New blocks
  testimonials: TestimonialsPanel,
  faq: FaqPanel,
  countdown: CountdownPanel,
  newsletter: NewsletterPanel,
  video: VideoPanel,
  banner: BannerPanel,
  stats: StatsPanel,
  steps: StepsPanel,
  'social-links': SocialLinksPanel,
  gallery: GalleryPanel,
  'rich-html': RichHtmlPanel,
  // Atomic HTML element panels
  heading: HeadingPanel,
  flex: FlexPanel,
  form: FormPanel,
  alert: AlertPanel,
  badge: BadgePanel,
};

function SectionLayoutControls({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const containerWidth = p.containerWidth ?? 'default';
  const customWidth = p.customWidth ?? '';
  const sectionPadding = p.sectionPadding ?? 'none';
  const sectionBgColor = p.sectionBgColor ?? '';

  const currentDisplayWidth = customWidth || (containerWidth === 'full' ? '100%' : containerWidth === 'narrow' ? '768px' : containerWidth === 'medium' ? '1000px' : containerWidth === 'wide' ? '1440px' : '1200px');
  const sliderVal = parseInt(currentDisplayWidth.replace(/[^0-9]/g, '') || '1200');

  return (
    <Section title="📐 Section Layout & Width">
      {/* Container Width Presets */}
      <Field label="Section Width Presets" hint="Choose a standard container width">
        <div className="btn-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {[
            { key: 'narrow', label: 'Narrow', hint: '768px' },
            { key: 'medium', label: 'Medium', hint: '1000px' },
            { key: 'default', label: 'Boxed', hint: '1200px' },
            { key: 'wide', label: 'Wide', hint: '1440px' },
            { key: 'full', label: 'Full', hint: '100%' },
          ].map((w) => (
            <button
              key={w.key}
              type="button"
              className={`btn-group-btn ${containerWidth === w.key && !customWidth ? 'active' : ''}`}
              onClick={() => {
                set('containerWidth', w.key);
                set('customWidth', '');
              }}
              title={`${w.label} (${w.hint})`}
              style={{ fontSize: 11, padding: '6px 2px' }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Custom Width Slider & Input */}
      <Field label="Custom Width Slider" hint={`Active Width: ${currentDisplayWidth}`}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="range"
            min="400"
            max="1800"
            step="20"
            value={sliderVal > 1800 ? 1800 : sliderVal < 400 ? 400 : sliderVal}
            onChange={(e) => {
              const val = `${e.target.value}px`;
              set('customWidth', val);
            }}
            style={{ flex: 1, cursor: 'pointer', accentColor: 'var(--accent)' }}
          />
          <input
            className="form-input"
            style={{ width: 85, fontSize: 12, padding: '4px 8px', textAlign: 'center' }}
            value={currentDisplayWidth}
            onChange={(e) => set('customWidth', e.target.value)}
            placeholder="1200px"
          />
          {customWidth && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => set('customWidth', '')}
              title="Reset to preset"
              style={{ padding: '2px 6px', fontSize: 11, flexShrink: 0 }}
            >
              Reset
            </button>
          )}
        </div>
      </Field>

      {/* Vertical Section Padding */}
      <Field label="Vertical Padding">
        <div className="btn-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {[
            { key: 'none', label: '0' },
            { key: 'sm', label: '24px' },
            { key: 'md', label: '48px' },
            { key: 'lg', label: '80px' },
            { key: 'xl', label: '120px' },
          ].map((pad) => (
            <button
              key={pad.key}
              type="button"
              className={`btn-group-btn ${sectionPadding === pad.key ? 'active' : ''}`}
              onClick={() => set('sectionPadding', pad.key)}
              style={{ fontSize: 11, padding: '6px 2px' }}
            >
              {pad.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Section Background Color */}
      <ColorRow
        label="Section Background Color"
        value={sectionBgColor}
        onChange={(val) => set('sectionBgColor', val)}
      />
    </Section>
  );
}

// ─── Main PropertiesPanel ─────────────────────────────────────────────────────

interface Props {
  block: Block | null;
  onChange: (updated: Block) => void;
  width?: number;
  onWidthChange?: (width: number) => void;
}

export default function PropertiesPanel({ block, onChange, width, onWidthChange }: Props) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');

  if (!block) {
    return (
      <div
        className="builder-props"
        style={{
          width: width ?? 380,
          minWidth: 280,
          maxWidth: 850,
        }}
      >
        <div className="props-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span>Properties</span>
          {onWidthChange && (
            <div className="btn-group" style={{ gap: 2 }}>
              {[
                { label: '300px', w: 300, hint: 'Compact' },
                { label: '380px', w: 380, hint: 'Standard' },
                { label: '540px', w: 540, hint: 'Wide (Coding)' },
                { label: '720px', w: 720, hint: 'Max (Split Screen)' },
              ].map((p) => (
                <button
                  key={p.w}
                  type="button"
                  className={`btn-group-btn ${width === p.w ? 'active' : ''}`}
                  onClick={() => onWidthChange(p.w)}
                  title={`Resize side panel to ${p.hint} (${p.w}px)`}
                  style={{ fontSize: 10, padding: '2px 5px' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
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

  const isCustom = block.type === 'custom' || block.type === 'rich-html';
  const VisualPanel = VISUAL_PANELS[block.type];

  return (
    <div
      className="builder-props"
      style={{
        width: width ?? 380,
        minWidth: 280,
        maxWidth: 850,
      }}
    >
      {/* Header */}
      <div className="props-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <span>{getBlockEmoji(block.type)} {getBlockName(block.type)}</span>

        {/* Side Panel Width Quick Switcher */}
        {onWidthChange && (
          <div className="btn-group" style={{ gap: 2 }}>
            {[
              { label: '300px', w: 300, hint: 'Compact' },
              { label: '380px', w: 380, hint: 'Standard' },
              { label: '540px', w: 540, hint: 'Wide (Coding)' },
              { label: '720px', w: 720, hint: 'Max (Split Screen)' },
            ].map((p) => (
              <button
                key={p.w}
                type="button"
                className={`btn-group-btn ${width === p.w ? 'active' : ''}`}
                onClick={() => onWidthChange(p.w)}
                title={`Resize side panel to ${p.hint} (${p.w}px)`}
                style={{ fontSize: 10, padding: '2px 5px' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="props-body">
        {!isCustom ? (
          <>
            <SectionLayoutControls block={block} set={set} />
            {VisualPanel ? (
              <VisualPanel block={block} set={set} />
            ) : (
              <div className="prop-hint">No extra content settings for this block type.</div>
            )}
          </>
        ) : (
          <CodePanel block={block} set={set} onOverride={handleOverride} />
        )}
      </div>
    </div>
  );
}

const BLOCK_EMOJIS: Record<BlockType, string> = {
  hero: '🦸', text: '📝', image: '🖼️', cards: '🃏', button: '🔘',
  divider: '➖', custom: '💻', navbar: '🧭', 'product-grid': '🛍️', 'pincode-checker': '📍',
  testimonials: '💬', faq: '❓', countdown: '⏱️', newsletter: '📧', video: '🎬',
  pricing: '💰', gallery: '🖼️', banner: '📢', stats: '📊', steps: '🪜',
  'social-links': '🔗', 'rich-html': '🌐', heading: '🏷️', flex: '📐',
  form: '📋', alert: '💡', badge: '🏷️',
};

const BLOCK_NAMES: Record<BlockType, string> = {
  hero: 'Hero Section', text: 'Text Block', image: 'Image', cards: 'Card Grid',
  button: 'Button CTA', divider: 'Divider', custom: 'Custom Code', navbar: 'Navigation Bar',
  'product-grid': 'Product Grid', 'pincode-checker': 'Pincode Checker',
  testimonials: 'Testimonials', faq: 'FAQ Accordion', countdown: 'Countdown Timer',
  newsletter: 'Newsletter Signup', video: 'Video Embed', pricing: 'Pricing Table',
  gallery: 'Gallery Grid', banner: 'Banner / Strip', stats: 'Stats Counter',
  steps: 'Steps / Process', 'social-links': 'Social Links', 'rich-html': 'Rich HTML',
  heading: 'Heading', flex: 'Flex Container', form: 'Form Builder',
  alert: 'Alert Box', badge: 'Badge / Pill Tag',
};

function getBlockEmoji(type: BlockType) { return BLOCK_EMOJIS[type] ?? '🧩'; }
function getBlockName(type: BlockType) { return BLOCK_NAMES[type] ?? type; }
