'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    const { signIn } = await import('next-auth/react');
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push('/dashboard');
  };

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
        Create your account
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Free forever — no credit card required
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
          <label className="form-label">Full Name</label>
          <input
            suppressHydrationWarning
            className="form-input"
            placeholder="Rishabh Joshi"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            autoFocus
          />
        </div>
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
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            suppressHydrationWarning
            className="form-input"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '11px' }}
        >
          {loading ? 'Creating account…' : 'Get Started Free →'}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </>
  );
}
