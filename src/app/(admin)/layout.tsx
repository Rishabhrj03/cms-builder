'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const NAV = [
  { href: '/dashboard', icon: '⬡', label: 'Dashboard' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          <span className="sidebar-logo-text">PAGEFORGE</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Menu</div>
          <nav className="sidebar-nav">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <button className={`sidebar-item ${active ? 'active' : ''}`}>
                    <span className="sidebar-item-icon">{item.icon}</span>
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          {/* User info */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 4px',
                borderBottom: '1px solid var(--border)',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}

          <button
            className="sidebar-item"
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ width: '100%', color: 'var(--danger)' }}
          >
            <span className="sidebar-item-icon">🚪</span>
            Sign Out
          </button>

          <div className="sidebar-version" style={{ marginTop: 10 }}>PAGEFORGE v2.0.0</div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">{children}</div>
    </div>
  );
}
