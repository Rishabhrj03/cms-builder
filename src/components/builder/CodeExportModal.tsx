'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Page } from '@/types/Page';
import { Block } from '@/types/Block';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Lang = 'react' | 'node' | 'python' | 'html';

interface Props {
  page: Page;
  blocks: Block[];
  onClose: () => void;
}

function generateStandaloneJSX(blocks: Block[]) {
  if (!blocks || blocks.length === 0) return '      <p>No content available.</p>';

  return blocks.map((b) => {
    const p = b.props || {};
    switch (b.type) {
      case 'heading': {
        const Tag = p.tag || 'h2';
        return `      {/* Heading Element */}
      <div style={{ textAlign: '${p.align || 'left'}', margin: '16px 0' }}>
        <${Tag} style={{ fontSize: '${p.fontSize || '32px'}', fontWeight: '${p.fontWeight || 'bold'}', color: '${p.textColor || '#111827'}', margin: 0, lineHeight: 1.2 }}>
          ${p.text || 'Heading'}
        </${Tag}>
        ${p.subtitle ? `<p style={{ color: '#6b7280', fontSize: '16px', margin: '8px 0 0' }}>${p.subtitle}</p>` : ''}
      </div>`;
      }

      case 'text':
        return `      {/* Paragraph Text Element */}
      <p style={{ textAlign: '${p.align || 'left'}', fontSize: '16px', color: '#374151', lineHeight: 1.6, margin: '12px 0' }}>
        ${p.content || ''}
      </p>`;

      case 'button':
        return `      {/* Button CTA Element */}
      <div style={{ textAlign: '${p.align || 'center'}', margin: '16px 0' }}>
        <a href="${p.url || '#'}" style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          ${p.label || 'Click Here'}
        </a>
      </div>`;

      case 'badge':
        return `      {/* Badge Pill Element */}
      <div style={{ textAlign: '${p.align || 'center'}', margin: '8px 0' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '999px', backgroundColor: '${p.bgColor || '#7c3aed'}18', color: '${p.textColor || '#7c3aed'}', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
          ${p.icon ? p.icon + ' ' : ''}${p.text || 'BADGE'}
        </span>
      </div>`;

      case 'alert':
        return `      {/* Alert Callout Element */}
      <div style={{ padding: '16px 20px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', color: '#1e40af', margin: '12px 0', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '20px' }}>${p.icon || 'ℹ️'}</span>
        <div>
          <h5 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700 }}>${p.title || 'Notice'}</h5>
          <p style={{ margin: 0, fontSize: '14px' }}>${p.message || ''}</p>
        </div>
      </div>`;

      case 'hero':
        return `      {/* Hero Banner Section */}
      <section style={{ backgroundColor: '${p.bgColor || '#1a1a2e'}', color: '${p.textColor || '#ffffff'}', padding: '60px 24px', textAlign: '${p.align || 'center'}', borderRadius: '16px', margin: '16px 0' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 16px' }}>${p.title || ''}</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, margin: '0 0 24px' }}>${p.subtitle || ''}</p>
        <a href="${p.ctaUrl || '#'}" style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#7c3aed', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>${p.ctaLabel || 'Get Started'}</a>
      </section>`;

      case 'custom':
      case 'rich-html':
        return `      {/* Custom HTML Code Block */}
      <div dangerouslySetInnerHTML={{ __html: \`${p.html || ''}\` }} />`;

      default:
        return `      {/* ${b.type.toUpperCase()} Element */}
      <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', margin: '12px 0' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>${(p.heading || p.title || b.type).toUpperCase()}</h4>
        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>${p.subheading || p.subtitle || p.content || ''}</p>
      </div>`;
    }
  }).join('\n\n');
}

export default function CodeExportModal({ page, blocks, onClose }: Props) {
  const slug = page.slug?.replace(/^\//, '') || 'page';

  // 1. React / Next.js generator (Standalone JSX Component - Zero CMS dependencies!)
  const getReactCode = () => {
    const standaloneJSX = generateStandaloneJSX(blocks);
    return `// ⚛️ Standalone React Component (Zero CMS dependencies required!)
import React from 'react';

export default function ${page.title ? page.title.replace(/[^a-zA-Z0-9]/g, '') + 'Page' : 'CMSPage'}() {
  return (
    <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', boxSizing: 'border-box' }}>
${standaloneJSX}
    </main>
  );
}
`;
  };

  // 2. Node.js / Express generator
  const getNodeCode = () => {
    return `// 🟢 Node.js / Express API Integration
const express = require('express');
const axios = require('axios');
const app = express();

const CMS_API_ENDPOINT = "http://localhost:3000/api/pages/${slug}";

// Express route to serve PageForge CMS Page
app.get('/api/site/${slug}', async (req, res) => {
  try {
    const response = await axios.get(CMS_API_ENDPOINT);
    const page = response.data;

    res.json({
      status: 'success',
      id: page._id,
      title: page.title,
      slug: page.slug,
      blocksCount: page.blocks ? page.blocks.length : 0,
      blocks: page.blocks,
    });
  } catch (error) {
    console.error('Failed to fetch CMS page:', error.message);
    res.status(500).json({ error: 'Failed to retrieve page from PageForge CMS' });
  }
});

app.listen(4000, () => {
  console.log('🚀 Node.js Express server running on http://localhost:4000');
});
`;
  };

  // 3. Python (Flask / FastAPI) generator
  const getPythonCode = () => {
    return `# 🐍 Python Flask / FastAPI Integration
import requests
from flask import Flask, jsonify, render_template_string

app = Flask(__name__)

CMS_URL = "http://localhost:3000/api/pages/${slug}"

@app.route("/site/${slug}")
def fetch_cms_page():
    try:
        response = requests.get(CMS_URL, timeout=5)
        response.raise_for_status()
        page_data = response.json()
        
        blocks = page_data.get("blocks", [])
        
        return jsonify({
            "status": "success",
            "page_id": page_data.get("_id"),
            "title": page_data.get("title"),
            "slug": page_data.get("slug"),
            "blocks_count": len(blocks),
            "blocks": blocks
        })
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
`;
  };

  // 4. HTML / Embed code generator
  const getHtmlCode = () => {
    return `<!-- 🌐 Embed PageForge CMS Page into any website -->
<div id="pageforge-embed-container" style="width: 100%; min-height: 600px;">
  <iframe 
    src="http://localhost:3000/site/${slug}" 
    width="100%" 
    height="100%" 
    style="border: none; min-height: 800px; width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
    title="${page.title}"
  ></iframe>
</div>
`;
  };

  const [lang, setLang] = useState<Lang>('react');
  const [copied, setCopied] = useState(false);

  // Maintain editable code state per language tab
  const [codes, setCodes] = useState<Record<Lang, string>>({
    react: getReactCode(),
    node: getNodeCode(),
    python: getPythonCode(),
    html: getHtmlCode(),
  });

  const handleCodeChange = (val: string | undefined) => {
    if (val !== undefined) {
      setCodes((prev) => ({ ...prev, [lang]: val }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[lang] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBeforeMount = (monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit?.ReactJSX ?? 4,
      allowNonTsExtensions: true,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  };

  return (
    <div className="drawer-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 750, maxWidth: '92vw', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              💻 Code Export & Integration Snippets
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Integrate <strong>{page.title}</strong> seamlessly into React, Node.js, Python, or embed via HTML.
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Tab selector bar */}
        <div style={{ padding: '12px 24px 0', display: 'flex', gap: 8, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
          {[
            { id: 'react', label: '⚛️ React / Next.js', mode: 'typescript' },
            { id: 'node', label: '🟢 Node.js / Express', mode: 'javascript' },
            { id: 'python', label: '🐍 Python (Flask/FastAPI)', mode: 'python' },
            { id: 'html', label: '🌐 Static HTML / Embed', mode: 'html' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setLang(item.id as Lang)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                borderBottom: lang === item.id ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'transparent',
                color: lang === item.id ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Editor body */}
        <div style={{ flex: 1, padding: 16, background: '#1e1e1e' }}>
          <MonacoEditor
            height="100%"
            language={lang === 'python' ? 'python' : lang === 'react' ? 'typescript' : lang === 'node' ? 'javascript' : 'html'}
            value={codes[lang]}
            onChange={handleCodeChange}
            beforeMount={handleBeforeMount}
            theme="vs-dark"
            options={{
              fontSize: 13,
              readOnly: false,
              minimap: { enabled: false },
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            API Endpoint: <code style={{ padding: '2px 6px', background: 'var(--bg-base)', borderRadius: 4 }}>http://localhost:3000/api/pages/{slug}</code>
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                handleCopy();
                onClose();
              }}
              title="Copy code to clipboard and close"
            >
              Done & Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
