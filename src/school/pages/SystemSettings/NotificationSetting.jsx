import React, { useState, useEffect, useRef } from 'react';
import { NOTIFICATION_EVENTS } from './notificationData';
import './NotificationSetting.css';

/* ── Toast helper ─────────────────────────────────────────────── */
const showToast = (message, type = 'success') => {
  const existing = document.getElementById('ns-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ns-toast';
  const bg = type === 'success' ? '#28c76f' : type === 'error' ? '#ea5455' : '#3d5ee1';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  Object.assign(toast.style, {
    position: 'fixed', top: '80px', right: '24px',
    background: bg, color: '#fff', padding: '12px 20px',
    borderRadius: '10px', fontFamily: 'Inter,sans-serif', fontSize: '13.5px',
    fontWeight: '600', boxShadow: '0 8px 24px rgba(0,0,0,.18)',
    zIndex: '9999', display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'opacity .3s', opacity: '1',
  });
  toast.innerHTML = `<span style="font-size:16px">${icon}</span> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 320);
  }, 3000);
};

/* ── Copy helper ──────────────────────────────────────────────── */
const copyText = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
};
const fallbackCopy = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

/* ── Channel icon map ─────────────────────────────────────────── */
const CH = {
  email: { label: 'Email', emoji: '📧', key: 'email', cls: 'email' },
  sms: { label: 'SMS', emoji: '💬', key: 'sms', cls: 'sms' },
  wa: { label: 'WA', emoji: '💚', key: 'whatsapp', cls: 'wa' },
};

/* ═══════════════════════════════════════════════════════════════
   EDIT MODAL
   ═══════════════════════════════════════════════════════════════ */
const EditModal = ({ event, onSave, onClose }) => {
  const [data, setData] = useState({ ...event });

  const set = (key, val) => setData(p => ({ ...p, [key]: val }));

  const handleVarClick = (tag) => {
    const v = `{{${tag}}}`;
    copyText(v);
    showToast(`Copied ${v}`, 'info');
  };

  return (
    <div className="ns-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ns-modal">
        {/* Head */}
        <div className="ns-modal-head">
          <div className="ns-modal-head-info">
            <div className="ns-modal-icon edit">✏️</div>
            <div>
              <p className="ns-modal-title">{data.event}</p>
              <p className="ns-modal-sub">Edit notification template &amp; channel settings</p>
            </div>
          </div>
          <button className="ns-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="ns-modal-body">
          {/* Channel toggles */}
          <div>
            <label className="ns-field-label">Active Channels</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.values(CH).map(ch => (
                <button
                  key={ch.key}
                  className={`ns-ch-pill ${data[ch.key] ? `active-${ch.cls}` : ''}`}
                  onClick={() => set(ch.key, !data[ch.key])}
                  style={{ fontSize: 13, padding: '7px 16px' }}
                >
                  {ch.emoji} {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template IDs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="ns-field-label">SMS Template ID (DLT)</label>
              <input
                className={`ns-field-input ${data.sms && !data.sms_template_id ? 'warn' : ''}`}
                value={data.sms_template_id || ''}
                disabled={!data.sms}
                placeholder="Enter DLT ID"
                onChange={e => set('sms_template_id', e.target.value)}
              />
            </div>
            <div>
              <label className="ns-field-label">WhatsApp Template Name</label>
              <input
                className={`ns-field-input ${data.whatsapp && !data.whatsapp_template_id ? 'warn' : ''}`}
                value={data.whatsapp_template_id || ''}
                disabled={!data.whatsapp}
                placeholder="Enter Template Name"
                onChange={e => set('whatsapp_template_id', e.target.value)}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <label className="ns-field-label" style={{ margin: 0 }}>Message Content</label>
              <span style={{ fontSize: 11, color: '#aaa' }}>{(data.sample_message || '').length} chars</span>
            </div>
            <textarea
              className="ns-field-textarea"
              value={data.sample_message || ''}
              onChange={e => set('sample_message', e.target.value)}
              placeholder="Type your notification message here, use {{variables}} for dynamic data..."
            />
          </div>

          {/* Variables */}
          <div className="ns-var-box">
            <div className="ns-var-title">
              <span>🔖</span> Available Variables — click to copy
            </div>
            <div className="ns-var-chips">
              {['student_name', 'admission_no', 'class', 'section', 'date', 'amount',
                'subject', 'staff_name', 'meeting_link', 'time', 'username', 'password',
                'exam_name', 'course_name'].map(tag => (
                  <button key={tag} className="ns-var-chip" onClick={() => handleVarClick(tag)}>
                    {`{{${tag}}}`}
                  </button>
                ))}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="ns-field-label">Send To</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Student', 'Guardian', 'Staff'].map(role => {
                const recipients = Array.isArray(data.recipient) ? data.recipient
                  : (typeof data.recipient === 'string' ? [data.recipient] : []);
                const active = recipients.includes(role);
                const toggle = () => {
                  const next = active
                    ? recipients.filter(r => r !== role)
                    : [...recipients, role];
                  set('recipient', next);
                };
                return (
                  <button
                    key={role}
                    className={`ns-rcpt-chip ${active ? 'active' : ''}`}
                    onClick={toggle}
                    style={{ padding: '7px 16px', fontSize: 13 }}
                  >
                    <span className="ns-tick">{active ? '✓' : ''}</span>
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ns-modal-foot">
          <button className="ns-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="ns-btn-save"
            onClick={() => { onSave(data); onClose(); showToast('Template updated successfully!'); }}
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PREVIEW MODAL (WhatsApp Phone Frame)
   ═══════════════════════════════════════════════════════════════ */
const DUMMY = {
  '{{student_name}}': 'Aarav Sharma', '{{admission_no}}': 'ADM2024001',
  '{{class}}': '10', '{{section}}': 'A', '{{date}}': '19-Feb-2025',
  '{{amount}}': '₹5,000', '{{subject}}': 'Mathematics',
  '{{staff_name}}': 'Rajesh Kumar', '{{meeting_link}}': 'https://zoom.us/j/123456',
  '{{time}}': '10:00 AM', '{{username}}': 'aarav.sharma', '{{password}}': '••••••••',
  '{{exam_name}}': 'Mid-Term 2025', '{{course_name}}': 'Advanced Physics',
};

const PreviewModal = ({ event, onClose }) => {
  const rendered = Object.entries(DUMMY).reduce(
    (msg, [k, v]) => msg.split(k).join(v),
    event?.sample_message || ''
  );
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="ns-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ns-modal ns-preview-modal">
        <div className="ns-phone">
          <div className="ns-phone-notch" />
          <div className="ns-phone-bar">
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>←</button>
            <div className="ns-phone-bar-avatar">Sch</div>
            <div className="ns-phone-bar-info">
              <div className="ns-phone-bar-name">School Admin</div>
              <div className="ns-phone-bar-status">Official Channel</div>
            </div>
            <span style={{ fontSize: 20 }}>📞</span>
          </div>

          <div className="ns-phone-chat">
            <div className="ns-phone-date-separator">Today</div>
            <div className="ns-chat-bubble">
              {rendered}
              <span className="ns-chat-time">{now} ✓✓</span>
            </div>
          </div>

          <div className="ns-phone-input-bar">
            <div className="ns-phone-input-fake" />
            <div className="ns-phone-send-btn">▶</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
const NotificationSetting = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modals
  const [editEvent, setEditEvent] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);

  useEffect(() => {
    setTimeout(() => { setEvents(NOTIFICATION_EVENTS); setLoading(false); }, 500);
  }, []);

  /* ── Derived ── */
  const filtered = events.filter(ev => {
    const matchSearch = ev.event.toLowerCase().includes(search.toLowerCase());
    const matchRecipient = recipientFilter === 'all' || (
      Array.isArray(ev.recipient)
        ? ev.recipient.includes(recipientFilter)
        : ev.recipient === recipientFilter
    );
    return matchSearch && matchRecipient;
  });

  /* ── Handlers ── */
  const mark = () => setHasChanges(true);

  const toggleChannel = (id, field) => {
    mark();
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: !e[field] } : e));
  };

  const toggleRecipient = (id, role) => {
    mark();
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const list = Array.isArray(e.recipient) ? e.recipient
        : (typeof e.recipient === 'string' ? [e.recipient] : []);
      const next = list.includes(role) ? list.filter(r => r !== role) : [...list, role];
      return { ...e, recipient: next };
    }));
  };

  const handleInput = (id, field, val) => {
    mark();
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleSaveEdit = (updated) => {
    mark();
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleSaveAll = () => {
    const bad = events.filter(e => e.whatsapp && !e.whatsapp_template_id);
    if (bad.length) {
      showToast(`⚠️ WA Template ID missing for: ${bad[0].event}`, 'error');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      showToast('All notification settings saved!');
    }, 1200);
  };

  const selectAll = (checked) =>
    setSelectedIds(checked ? new Set(filtered.map(e => e.id)) : new Set());
  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  /* ── Export helpers ── */
  const toMatrix = () => {
    const cols = ['Event', 'Email', 'SMS', 'App', 'WhatsApp', 'Recipient', 'SMS ID', 'WA ID', 'Sample Message'];
    const rows = filtered.map(e => [
      e.event,
      e.email ? 'Yes' : 'No',
      e.sms ? 'Yes' : 'No',
      e.app ? 'Yes' : 'No',
      e.whatsapp ? 'Yes' : 'No',
      Array.isArray(e.recipient) ? e.recipient.join(', ') : e.recipient,
      e.sms_template_id || '',
      e.whatsapp_template_id || '',
      e.sample_message || '',
    ]);
    return [cols, ...rows];
  };

  const handleCopy = () => {
    const text = toMatrix().map(r => r.join('\t')).join('\n');
    copyText(text);
    setCopied(true);
    showToast('Table data copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (name, mime, content) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleCSV = () => {
    const csv = '\uFEFF' + toMatrix().map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile('notification-settings.csv', 'text/csv;charset=utf-8;', csv);
    showToast('CSV downloaded!');
  };

  const handleExcel = () => {
    const tsv = toMatrix().map(r => r.join('\t')).join('\n');
    downloadFile('notification-settings.xls', 'application/vnd.ms-excel', tsv);
    showToast('Excel file downloaded!');
  };

  /* ── Render ── */
  return (
    <div className="ns-page">
      {/* ── Header ── */}
      <div className="ns-page-header">
        <div>
          <h4 className="ns-page-title">🔔 Notification Settings</h4>
          <nav className="ns-breadcrumb">
            <a href="#">System Settings</a> /&nbsp;
            <span className="ns-breadcrumb-current">Notifications</span>
          </nav>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="ns-filter-card">
        <div className="ns-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="ns-search-input"
            type="text"
            placeholder="Search by event name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="ns-select"
          value={recipientFilter}
          onChange={e => setRecipientFilter(e.target.value)}
        >
          <option value="all">All Recipients</option>
          <option value="Student">Student</option>
          <option value="Guardian">Guardian</option>
          <option value="Staff">Staff</option>
        </select>
      </div>

      {/* ── Table Card ── */}
      <div className="ns-table-card">
        <div className="ns-table-header">
          <h5 className="ns-table-title">
            Notification Events
            <span className="ns-table-count">({filtered.length} events)</span>
          </h5>
          <div className="ns-export-toolbar">
            <button className={`ns-export-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              📋 {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="ns-export-btn" onClick={handleCSV}>📄 CSV</button>
            <button className="ns-export-btn" onClick={handleExcel}>📊 Excel</button>
            <button className="ns-export-btn" onClick={() => window.print()}>🖨️ PDF</button>
            <button className="ns-export-btn" onClick={() => window.print()}>🖨️ Print</button>
          </div>
        </div>

        <div className="ns-table-wrap">
          <table className="ns-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>
                  <input
                    type="checkbox"
                    className="ns-checkbox"
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={e => selectAll(e.target.checked)}
                  />
                </th>
                <th style={{ minWidth: 160 }}>Event Name</th>
                <th style={{ minWidth: 160 }}>Channels</th>
                <th style={{ minWidth: 140 }}>Recipients</th>
                <th style={{ minWidth: 90 }}>SMS ID</th>
                <th style={{ minWidth: 100 }}>WA Template</th>
                <th>Sample Message</th>
                <th style={{ width: 90, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8}>
                      <div className="ns-empty">
                        <div style={{ fontSize: 13, color: '#aaa' }}>Loading events…</div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="ns-empty">
                      <div className="ns-empty-icon">🔍</div>
                      <p>No events match your search.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(item => {
                const recipients = Array.isArray(item.recipient)
                  ? item.recipient
                  : (typeof item.recipient === 'string' ? [item.recipient] : []);

                return (
                  <tr key={item.id} className={selectedIds.has(item.id) ? 'ns-row-selected' : ''}>
                    {/* Checkbox */}
                    <td>
                      <input
                        type="checkbox"
                        className="ns-checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>

                    {/* Event Name */}
                    <td>
                      <strong style={{ color: '#333448', fontSize: 13.5 }}>{item.event}</strong>
                    </td>

                    {/* Channels */}
                    <td>
                      <div className="ns-channels">
                        {Object.values(CH).map(ch => (
                          <button
                            key={ch.key}
                            className={`ns-ch-pill ${item[ch.key] ? `active-${ch.cls}` : ''}`}
                            onClick={() => toggleChannel(item.id, ch.key)}
                            title={`Toggle ${ch.label}`}
                          >
                            {ch.emoji} {ch.label}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Recipients */}
                    <td>
                      <div className="ns-recipients">
                        {['Student', 'Guardian', 'Staff'].map(role => (
                          <button
                            key={role}
                            className={`ns-rcpt-chip ${recipients.includes(role) ? 'active' : ''}`}
                            onClick={() => toggleRecipient(item.id, role)}
                          >
                            <span className="ns-tick">{recipients.includes(role) ? '✓' : ''}</span>
                            {role}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* SMS ID */}
                    <td>
                      <input
                        className="ns-id-input"
                        value={item.sms_template_id || ''}
                        disabled={!item.sms}
                        placeholder="DLT ID"
                        onChange={e => handleInput(item.id, 'sms_template_id', e.target.value)}
                      />
                    </td>

                    {/* WA ID */}
                    <td>
                      <input
                        className={`ns-id-input ${item.whatsapp && !item.whatsapp_template_id ? 'ns-warn' : ''}`}
                        value={item.whatsapp_template_id || ''}
                        disabled={!item.whatsapp}
                        placeholder="Template Name"
                        onChange={e => handleInput(item.id, 'whatsapp_template_id', e.target.value)}
                      />
                    </td>

                    {/* Sample Message */}
                    <td>
                      <div className="ns-msg-preview">
                        {item.sample_message || <span style={{ color: '#ccc', fontStyle: 'italic' }}>No message</span>}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="ns-action-group">
                        <button
                          className="ns-action-btn view"
                          title="Preview message"
                          onClick={() => setPreviewEvent(item)}
                        >👁️</button>
                        <button
                          className="ns-action-btn edit"
                          title="Edit template"
                          onClick={() => setEditEvent(item)}
                        >✏️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Sticky Footer ── */}
      <div className="ns-footer">
        {hasChanges && (
          <span className="ns-unsaved-badge">
            ⚠️ Unsaved Changes
          </span>
        )}
        <button
          className="ns-btn-cancel"
          disabled={!hasChanges}
          onClick={() => window.location.reload()}
        >
          Cancel
        </button>
        <button
          className="ns-btn-save"
          disabled={!hasChanges || isSaving}
          onClick={handleSaveAll}
        >
          {isSaving
            ? <><span className="ns-spin" /> Saving…</>
            : <>💾 Save Changes</>
          }
        </button>
      </div>

      {/* ── Modals ── */}
      {editEvent && (
        <EditModal
          event={editEvent}
          onSave={handleSaveEdit}
          onClose={() => setEditEvent(null)}
        />
      )}
      {previewEvent && (
        <PreviewModal
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
        />
      )}
    </div>
  );
};

export default NotificationSetting;
