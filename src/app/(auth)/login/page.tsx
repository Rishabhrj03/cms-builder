'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
        Welcome back
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Sign in to your PAGEFORGE account
      </p>

      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            suppressHydrationWarning
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '11px' }}
        >
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
          Create one free
        </Link>
      </p>
    </>
  );
}
