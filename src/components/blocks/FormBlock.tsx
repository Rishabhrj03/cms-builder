'use client';

import { useState } from 'react';
import { FormProps } from '@/types/Block';

export default function FormBlock({ props }: { props: FormProps }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const title = props.title || 'Get In Touch';
  const subheading = props.subheading || 'Fill out the form below';
  const buttonLabel = props.buttonLabel || 'Submit Form';
  const successMessage = props.successMessage || 'Thank you! Your message has been submitted.';
  const accentColor = props.accentColor || '#7c3aed';
  const bgColor = props.bgColor || '#ffffff';
  const borderColor = props.borderColor || '#e2e8f0';
  const fields = props.fields || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (id: string, val: string) => {
    setFormData((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: '32px 28px',
        maxWidth: 640,
        margin: '0 auto',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>{title}</h3>
        {subheading && <p style={{ margin: '8px 0 0', fontSize: 14, color: '#6b7280' }}>{subheading}</p>}
      </div>

      {submitted ? (
        <div
          style={{
            padding: 24,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 12,
            textAlign: 'center',
            color: '#065f46',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {successMessage}
          <button
            onClick={() => setSubmitted(false)}
            style={{
              display: 'block',
              margin: '16px auto 0',
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 600,
              color: '#065f46',
              background: 'transparent',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Submit Another Response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {fields.map((field) => {
            const fieldId = field.id || field.label;
            return (
              <div key={fieldId} style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[fieldId] || ''}
                    onChange={(e) => handleChange(fieldId, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: 14,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={formData[fieldId] || ''}
                    onChange={(e) => handleChange(fieldId, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: 14,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#ffffff',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">Select option...</option>
                    {(field.options || '')
                      .split(',')
                      .map((opt) => opt.trim())
                      .filter(Boolean)
                      .map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      required={field.required}
                      checked={formData[fieldId] === 'true'}
                      onChange={(e) => handleChange(fieldId, e.target.checked ? 'true' : 'false')}
                      style={{ width: 16, height: 16, accentColor }}
                    />
                    {field.placeholder || field.label}
                  </label>
                ) : (
                  <input
                    type={field.type || 'text'}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[fieldId] || ''}
                    onChange={(e) => handleChange(fieldId, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: 14,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            style={{
              marginTop: 10,
              width: '100%',
              padding: '12px 24px',
              fontSize: 15,
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: accentColor,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'opacity 150ms ease',
            }}
          >
            {buttonLabel}
          </button>
        </form>
      )}
    </div>
  );
}
