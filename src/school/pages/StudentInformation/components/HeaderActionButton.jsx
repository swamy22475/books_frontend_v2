import React from 'react'
import { useNavigate } from 'react-router-dom'

// Compact header action button that matches dashboard style
export default function HeaderActionButton({ to, label = 'Back', icon, onClick, variant = 'secondary', title }) {
  const navigate = useNavigate()

  const handle = (e) => {
    if (onClick) return onClick(e)
    if (to) return navigate(to)
    navigate(-1)
  }

  return (
    <button
      type="button"
      className={`header-action-btn ${variant}`}
      onClick={handle}
      title={title || label}
      aria-label={label}
    >
      <span className="header-action-icon" aria-hidden>
        {icon || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="header-action-label">{label}</span>
    </button>
  )
}
