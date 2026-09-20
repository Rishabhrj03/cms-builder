'use client';

import dynamic from 'next/dynamic';
import { Block, BlockType, CardItem } from '@/types/Block';
import { v4 as uuidv4 } from 'uuid';

const CustomCodePanel = dynamic(() => import('./CustomCodePanel'), { ssr: false });

interface Props {
  block: Block | null;
  onChange: (updated: Block) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function AlignSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
    </select>
  );
}

function HeroProps({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Field label="Title"><input className="form-input" value={p.title} onChange={e => set('title', e.target.value)} /></Field>
      <Field label="Subtitle"><input className="form-input" value={p.subtitle} onChange={e => set('subtitle', e.target.value)} /></Field>
      <Field label="CTA Label"><input className="form-input" value={p.ctaLabel} onChange={e => set('ctaLabel', e.target.value)} /></Field>
      <Field label="CTA URL"><input className="form-input" value={p.ctaUrl} onChange={e => set('ctaUrl', e.target.value)} /></Field>
      <Field label="Background Color">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" className="form-color" value={p.bgColor} onChange={e => set('bgColor', e.target.value)} />
          <input className="form-input" value={p.bgColor} onChange={e => set('bgColor', e.target.value)} />
        </div>
      </Field>
      <Field label="Text Color">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" className="form-color" value={p.textColor} onChange={e => set('textColor', e.target.value)} />
          <input className="form-input" value={p.textColor} onChange={e => set('textColor', e.target.value)} />
        </div>
      </Field>
      <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
    </>
  );
}

function TextPropsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Field label="Content"><textarea className="form-textarea" value={p.content} onChange={e => set('content', e.target.value)} rows={6} /></Field>
      <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
      <Field label="Font Size">
        <select className="form-select" value={p.fontSize} onChange={e => set('fontSize', e.target.value)}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </Field>
    </>
  );
}

function ImagePropsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Field label="Image URL"><input className="form-input" value={p.src} onChange={e => set('src', e.target.value)} placeholder="https://…" /></Field>
      <Field label="Alt Text"><input className="form-input" value={p.alt} onChange={e => set('alt', e.target.value)} /></Field>
      <Field label="Caption"><input className="form-input" value={p.caption} onChange={e => set('caption', e.target.value)} /></Field>
      <Field label="Width">
        <select className="form-select" value={p.width} onChange={e => set('width', e.target.value)}>
          <option value="full">Full Width</option>
          <option value="half">Half</option>
          <option value="quarter">Quarter</option>
        </select>
      </Field>
    </>
  );
}

function CardsPropsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  const items: CardItem[] = p.items ?? [];
  const updateItem = (idx: number, key: keyof CardItem, val: string) =>
    set('items', items.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));
  const addItem = () => set('items', [...items, { id: uuidv4(), icon: '⭐', title: 'New Card', description: 'Description' }]);
  const removeItem = (idx: number) => set('items', items.filter((_, i) => i !== idx));

  return (
    <>
      <Field label="Heading"><input className="form-input" value={p.heading} onChange={e => set('heading', e.target.value)} /></Field>
      <Field label="Columns">
        <select className="form-select" value={p.columns} onChange={e => set('columns', Number(e.target.value))}>
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </select>
      </Field>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="form-label">Cards ({items.length})</span>
          <button className="btn btn-outline btn-sm" onClick={addItem}>+ Add</button>
        </div>
        {items.map((item, i) => (
          <div key={item.id} style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input className="form-input" value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} style={{ width: 50 }} placeholder="🌟" />
              <input className="form-input" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="Title" />
              <button className="btn btn-danger btn-icon" onClick={() => removeItem(i)}>✕</button>
            </div>
            <input className="form-input" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description" />
          </div>
        ))}
      </div>
    </>
  );
}

function ButtonPropsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Field label="Label"><input className="form-input" value={p.label} onChange={e => set('label', e.target.value)} /></Field>
      <Field label="URL"><input className="form-input" value={p.url} onChange={e => set('url', e.target.value)} /></Field>
      <Field label="Variant">
        <select className="form-select" value={p.variant} onChange={e => set('variant', e.target.value)}>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </Field>
      <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
      <Field label="Size">
        <select className="form-select" value={p.size} onChange={e => set('size', e.target.value)}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </Field>
    </>
  );
}

function DividerPropsPanel({ block, set }: { block: Block; set: (k: string, v: unknown) => void }) {
  const p = block.props;
  return (
    <>
      <Field label="Style">
        <select className="form-select" value={p.style} onChange={e => set('style', e.target.value)}>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </Field>
      <Field label="Label"><input className="form-input" value={p.label} onChange={e => set('label', e.target.value)} placeholder="Optional label" /></Field>
      <Field label="Color">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" className="form-color" value={p.color} onChange={e => set('color', e.target.value)} />
          <input className="form-input" value={p.color} onChange={e => set('color', e.target.value)} />
        </div>
      </Field>
    </>
  );
}

const PANELS: Partial<Record<BlockType, React.ComponentType<{ block: Block; set: (k: string, v: unknown) => void }>>> = {
  hero: HeroProps,
  text: TextPropsPanel,
  image: ImagePropsPanel,
  cards: CardsPropsPanel,
  button: ButtonPropsPanel,
  divider: DividerPropsPanel,
};

export default function PropertiesPanel({ block, onChange }: Props) {
  if (!block) {
    return (
      <div className="builder-props">
        <div className="props-header">Properties</div>
        <div className="props-empty">
          <span style={{ fontSize: 28 }}>👈</span>
          <span>Select a block to edit its properties</span>
        </div>
      </div>
    );
  }

  const set = (key: string, value: unknown) => {
    onChange({ ...block, props: { ...block.props, [key]: value } });
  };

  // Custom block gets Monaco editor
  if (block.type === 'custom') {
    return (
      <div className="builder-props">
        <div className="props-header">💻 CUSTOM CODE</div>
        <div className="props-body">
          <CustomCodePanel block={block} set={set} />
        </div>
      </div>
    );
  }

  const Panel = PANELS[block.type];
  if (!Panel) return null;

  return (
    <div className="builder-props">
      <div className="props-header">Properties — {block.type.toUpperCase()}</div>
      <div className="props-body">
        <Panel block={block} set={set} />
      </div>
    </div>
  );
}
