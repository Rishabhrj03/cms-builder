'use client';

import { CustomProps } from '@/types/Block';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomBlock({ props: p }: { props: CustomProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PAGEFORGE_NAVIGATE' && event.data?.url) {
        const targetUrl = event.data.url;
        if (targetUrl.startsWith('/') || targetUrl.includes(window.location.origin)) {
          router.push(targetUrl);
        } else {
          window.location.href = targetUrl;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const srcDoc = useMemo(
    () => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  ${p.css || ''}
</style>
</head>
<body>
${p.html || ''}
${p.js ? `<script>${p.js}<\/script>` : ''}
<script>
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href')) {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) return;
      e.preventDefault();
      window.parent.postMessage({ type: 'PAGEFORGE_NAVIGATE', url: href }, '*');
    }
  });
</script>
</body>
</html>`,
    [p.css, p.html, p.js]
  );

  return (
    <section style={{ width: '100%' }}>
      <iframe
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{
          width: '100%',
          height: `${p.height || 200}px`,
          border: 'none',
          display: 'block',
        }}
        title="Custom HTML Block"
      />
    </section>
  );
}
