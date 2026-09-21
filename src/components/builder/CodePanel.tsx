'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Block } from '@/types/Block';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Props {
  block: Block;
  set: (key: string, value: unknown) => void;
  onOverride: (enabled: boolean) => void;
}

type Tab = 'html' | 'css' | 'js';

export default function CodePanel({ block, set, onOverride }: Props) {
  const [tab, setTab] = useState<Tab>('html');
  const [editorHeight, setEditorHeight] = useState<number>(380);
  const p = block.props;

  // For non-custom blocks, the code panel works in "override" mode
  const isCustom = block.type === 'custom';
  const isOverridden = isCustom || p._codeOverride === true;

  const html = (p.html as string) ?? '';
  const css = (p.css as string) ?? '';
  const js = (p.js as string) ?? '';

  const handleToggleOverride = () => {
    if (isCustom) return; // custom blocks always use code
    const next = !p._codeOverride;
    onOverride(next);
    if (next && !p.html) {
      // Seed with a starter template
      set('html', `<div class="custom-block">\n  <!-- Add your HTML here -->\n</div>`);
      set('css', `.custom-block {\n  padding: 40px 20px;\n  text-align: center;\n  font-family: sans-serif;\n}`);
      set('js', `// JavaScript runs after block loads\n// window.PageForge is available for cart/state`);
    }
    set('_codeOverride', next);
  };

  return (
    <div className="code-panel">
      {/* Override toggle for non-custom blocks */}
      {!isCustom && (
        <div className="code-panel-override">
          <label className="override-toggle">
            <input
              type="checkbox"
              checked={!!p._codeOverride}
              onChange={handleToggleOverride}
            />
            <span>Override with custom code</span>
          </label>
          {!p._codeOverride && (
            <p className="override-hint">
              Enable to replace this block entirely with your own HTML/CSS/JS.
            </p>
          )}
        </div>
      )}

      {isOverridden && (
        <>
          {/* Tab bar & Height controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="code-tabs" style={{ marginBottom: 0 }}>
              {(['html', 'css', 'js'] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={`code-tab ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="btn-group" style={{ gap: 2 }}>
              {[
                { label: '240', h: 240 },
                { label: '380', h: 380 },
                { label: '520', h: 520 },
                { label: '650', h: 650 },
              ].map((preset) => (
                <button
                  key={preset.h}
                  type="button"
                  className={`btn-group-btn ${editorHeight === preset.h ? 'active' : ''}`}
                  onClick={() => setEditorHeight(preset.h)}
                  style={{ fontSize: 10, padding: '2px 5px' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monaco editor */}
          <div className="code-editor-wrap">
            <MonacoEditor
              height={`${editorHeight}px`}
              language={tab === 'html' ? 'html' : tab === 'css' ? 'css' : 'javascript'}
              value={tab === 'html' ? html : tab === 'css' ? css : js}
              theme="vs-dark"
              options={{
                fontSize: 12,
                minimap: { enabled: false },
                lineNumbers: 'on',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                padding: { top: 8, bottom: 8 },
              }}
              onChange={(val) => {
                if (tab === 'html') set('html', val ?? '');
                if (tab === 'css') set('css', val ?? '');
                if (tab === 'js') set('js', val ?? '');
              }}
            />
          </div>

          {/* Height slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>200px</span>
            <input
              type="range"
              min="200"
              max="850"
              step="20"
              value={editorHeight}
              onChange={(e) => setEditorHeight(Number(e.target.value))}
              style={{ flex: 1, cursor: 'pointer', accentColor: 'var(--accent)' }}
              title="Drag slider to adjust Code Editor height"
            />
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>850px</span>
          </div>

          {/* Height control for iframe */}
          <div className="code-panel-height">
            <label className="form-label">Preview Height (px)</label>
            <input
              type="number"
              className="form-input"
              value={(p.height as number) ?? 300}
              min={100}
              step={50}
              onChange={(e) => set('height', Number(e.target.value))}
            />
          </div>

          <div className="code-panel-tip">
            💡 <strong>window.PageForge</strong> is available — use it to open the cart, trigger events, or communicate with native blocks.
          </div>
        </>
      )}
    </div>
  );
}
