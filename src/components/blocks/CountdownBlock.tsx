'use client';
import { useEffect, useState } from 'react';
import { CountdownProps } from '@/types/Block';

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function calc(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Unit({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <div style={{
        fontSize: 'clamp(2rem,5vw,3.5rem)',
        fontWeight: 800,
        background: accent,
        color: '#fff',
        borderRadius: 12,
        padding: '12px 20px',
        minWidth: 80,
        lineHeight: 1,
        display: 'inline-block',
        letterSpacing: '-0.02em',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
        {label}
      </div>
    </div>
  );
}

export default function CountdownBlock({ props: p }: { props: CountdownProps }) {
  const [time, setTime] = useState<TimeLeft>(calc(p.targetDate));

  useEffect(() => {
    const t = setInterval(() => setTime(calc(p.targetDate)), 1000);
    return () => clearInterval(t);
  }, [p.targetDate]);

  const expired = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  return (
    <section style={{
      background: p.bgColor || '#1a1a2e',
      color: p.textColor || '#fff',
      padding: '72px 40px',
      textAlign: 'center',
    }}>
      {p.heading && (
        <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 12 }}>{p.heading}</h2>
      )}
      {p.subheading && (
        <p style={{ fontSize: 16, opacity: 0.75, maxWidth: 520, margin: '0 auto 40px' }}>{p.subheading}</p>
      )}
      {expired ? (
        <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.6 }}>⏰ Sale Ended</div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Unit value={time.days} label="Days" accent={p.accentColor || '#7c3aed'} />
          <div style={{ fontSize: 40, fontWeight: 300, alignSelf: 'flex-start', marginTop: 14, opacity: 0.4 }}>:</div>
          <Unit value={time.hours} label="Hours" accent={p.accentColor || '#7c3aed'} />
          <div style={{ fontSize: 40, fontWeight: 300, alignSelf: 'flex-start', marginTop: 14, opacity: 0.4 }}>:</div>
          <Unit value={time.minutes} label="Minutes" accent={p.accentColor || '#7c3aed'} />
          <div style={{ fontSize: 40, fontWeight: 300, alignSelf: 'flex-start', marginTop: 14, opacity: 0.4 }}>:</div>
          <Unit value={time.seconds} label="Seconds" accent={p.accentColor || '#7c3aed'} />
        </div>
      )}
    </section>
  );
}
