'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Block } from '@/types/Block';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Tab = 'html' | 'css' | 'js';

interface Props {
  block: Block;
  set: (k: string, v: unknown) => void;
}

const TAB_LABELS: { key: Tab; label: string; language: string }[] = [
  { key: 'html', label: 'HTML', language: 'html' },
  { key: 'css', label: 'CSS', language: 'css' },
  { key: 'js', label: 'JavaScript', language: 'javascript' },
];

export default function CustomCodePanel({ block, set }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('html');
  const p = block.props;

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 10,
          background: 'var(--bg-base)',
          borderRadius: 8,
          padding: 4,
        }}
      >
        {TAB_LABELS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: 6,
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === t.key ? 'var(--accent)' : 'transparent',
              color: activeTab === t.key ? '#fff' : 'var(--text-muted)',
              transition: 'all 150ms ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Monaco Editor */}
      {TAB_LABELS.map((t) => (
        <div key={t.key} style={{ display: activeTab === t.key ? 'block' : 'none' }}>
          <div
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
          >
            <MonacoEditor
              height="220px"
              language={t.language}
              value={p[t.key] as string || ''}
              onChange={(val) => set(t.key, val ?? '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 8, bottom: 8 },
              }}
            />
          </div>
        </div>
      ))}

      {/* Height control */}
      <div className="form-group" style={{ marginTop: 12 }}>
        <label className="form-label">Block Height (px)</label>
        <input
          className="form-input"
          type="number"
          min={100}
          max={2000}
          step={50}
          value={p.height || 200}
          onChange={(e) => set('height', Number(e.target.value))}
        />
      </div>

      {/* Hint */}
      <div
        style={{
          marginTop: 10,
          padding: '8px 10px',
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}
      >
        💡 Your code runs in a sandboxed iframe. You can use any HTML, CSS, and vanilla JavaScript.
      </div>
    </div>
  );
}
