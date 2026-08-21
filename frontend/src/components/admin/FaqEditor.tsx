'use client';

import React from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqEditorProps {
  value: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
}

export default function FaqEditor({ value, onChange }: FaqEditorProps) {
  const faqs: FaqItem[] = Array.isArray(value) ? value : [];

  const update = (index: number, field: keyof FaqItem, text: string) => {
    const next = faqs.map((f, i) => (i === index ? { ...f, [field]: text } : f));
    onChange(next);
  };

  const add = () => {
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const remove = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1',
    fontSize: '0.9rem', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' };

  const validCount = faqs.filter((f) => f.question.trim() && f.answer.trim()).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {faqs.length === 0 && (
        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
          <HelpCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
          No FAQs added yet. Click “Add FAQ” to create question &amp; answer pairs — the FAQPage schema is generated automatically.
        </div>
      )}

      {faqs.map((faq, index) => (
        <div key={index} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', background: '#ede9fe', padding: '4px 10px', borderRadius: '9999px' }}>
              FAQ #{index + 1}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} style={navBtnStyle(index === 0)}>↑</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === faqs.length - 1} style={navBtnStyle(index === faqs.length - 1)}>↓</button>
              <button
                type="button"
                onClick={() => remove(index)}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Remove FAQ"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Question</label>
            <input
              style={inputStyle}
              value={faq.question}
              onChange={(e) => update(index, 'question', e.target.value)}
              placeholder="e.g. What is the best time to visit Kyoto?"
            />
          </div>
          <div>
            <label style={labelStyle}>Answer</label>
            <textarea
              style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
              value={faq.answer}
              onChange={(e) => update(index, 'answer', e.target.value)}
              placeholder="Provide a clear, detailed 2–3 sentence answer."
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        style={{
          padding: '11px 16px', borderRadius: '12px', border: '1px dashed #cbd5e1', background: '#f8fafc',
          color: '#7c3aed', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s',
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#a78bfa'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
      >
        <Plus size={16} /> Add FAQ
      </button>

      <p style={{ fontSize: '0.78rem', color: validCount > 0 ? '#059669' : '#94a3b8', margin: 0 }}>
        {validCount} valid FAQ{validCount === 1 ? '' : 's'} → FAQPage JSON-LD schema {validCount > 0 ? 'will be generated automatically on save.' : 'appears once you add a question and answer.'}
      </p>
    </div>
  );
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
    color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
  };
}