import React from 'react'

type TextboxProps = {
  id: string
  label?: string
  value: number | string
  type?: string
  step?: number
  min?: number
  max?: number
  onChange: (v: any) => void
  placeholder?: string
  style?: React.CSSProperties
}

export default function Textbox({ id, label, value, type = 'text', step, min, max, onChange, placeholder, style }: TextboxProps) {
  const baseStyle: React.CSSProperties = {
    // keep a minimal fallback style; main styling is provided by CSS (.app-textbox)
    padding: '4px 8px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 6,
    fontSize: '0.82rem',
  }

  return (
    <div style={{ marginBottom: 8, ...style }}>
      {label ? (
        <label htmlFor={id} style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          {label}
        </label>
      ) : null}

      <input
        className="app-textbox"
        id={id}
        type={type}
        step={step}
        min={min}
        max={max}
        value={value as any}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={baseStyle}
      />
    </div>
  )
}
