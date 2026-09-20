export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              margin: '0 auto 14px',
              boxShadow: '0 0 32px rgba(124,58,237,0.4)',
            }}
          >
            ⚡
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #a78bfa, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.05em',
            }}
          >
            PAGEFORGE
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Visual Page Builder
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
