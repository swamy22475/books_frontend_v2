import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    IconArrowLeft, IconCheck, IconDeviceFloppy,
    IconRoute, IconMapPin, IconBus, IconUser, IconHash, IconRoad
} from '@tabler/icons-react';

const FIELDS = [
    { key: 'routeNo', label: 'Route Number', type: 'text', required: true },
    { key: 'routeName', label: 'Route Name', type: 'text', required: true },
    { key: 'startPoint', label: 'Start Point', type: 'text', required: false },
    { key: 'endPoint', label: 'End Point', type: 'text', required: false },
    { key: 'stops', label: 'Number of Stops', type: 'number', required: false },
    { key: 'distance', label: 'Distance (km)', type: 'text', required: false },
    { key: 'vehicle', label: 'Assigned Vehicle', type: 'text', required: false },
    { key: 'driver', label: 'Driver Name', type: 'text', required: false },
];

const STATUS_OPTIONS = [
    { value: 'Active', label: 'Active', color: '#10b981', bg: '#ecfdf5', border: '#6ee7b7' },
    { value: 'Inactive', label: 'Inactive', color: '#6b7280', bg: '#f9fafb', border: '#d1d5db' },
];

const EMPTY = { routeNo: '', routeName: '', startPoint: '', endPoint: '', stops: '', distance: '', vehicle: '', driver: '', status: 'Active' };

export default function EditRoute() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [original, setOriginal] = useState(EMPTY);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [focused, setFocused] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('routes') || '[]');
        const route = stored.find(r => String(r.id) === String(id));
        if (route) {
            const data = { ...EMPTY, ...route, stops: String(route.stops ?? '') };
            setOriginal(data);
            setForm(data);
        }
    }, [id]);

    const isDirty = JSON.stringify(form) !== JSON.stringify(original);

    const update = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
        setSaved(false);
    };

    const validate = () => {
        const errs = {};
        if (!form.routeNo.trim()) errs.routeNo = 'Route number is required';
        if (!form.routeName.trim()) errs.routeName = 'Route name is required';
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
        setTimeout(() => {
            const stored = JSON.parse(localStorage.getItem('routes') || '[]');
            const updated = stored.map(r =>
                String(r.id) === String(id) ? { ...r, ...form, stops: Number(form.stops) || 0 } : r
            );
            localStorage.setItem('routes', JSON.stringify(updated));
            setOriginal(form);
            setSaving(false);
            setSaved(true);
            setTimeout(() => navigate('/school/transport/routes'), 900);
        }, 900);
    };

    const statusInfo = STATUS_OPTIONS.find(s => s.value === form.status) || STATUS_OPTIONS[0];

    return (
        <div className="student-list-page">
            <style>{`
                @keyframes spin      { to { transform: rotate(360deg); } }
                @keyframes slideUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes slideLeft { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
                @keyframes popIn     { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
                .er-hdr  { animation: slideLeft .3s ease both; }
                .er-side { animation: slideLeft .35s ease .05s both; }
                .er-form { animation: popIn .35s ease .08s both; }
                .er-f0   { animation: slideUp .3s ease .12s both; }
                .er-f1   { animation: slideUp .3s ease .16s both; }
                .er-f2   { animation: slideUp .3s ease .20s both; }
                .er-f3   { animation: slideUp .3s ease .24s both; }
                .er-f4   { animation: slideUp .3s ease .28s both; }
                .er-f5   { animation: slideUp .3s ease .32s both; }
                .er-f6   { animation: slideUp .3s ease .36s both; }
                .er-f7   { animation: slideUp .3s ease .40s both; }
                .er-fst  { animation: slideUp .3s ease .44s both; }
                .er-foot { animation: slideUp .3s ease .48s both; }
                .fl-wrap  { position: relative; }
                .fl-label {
                    position:absolute; left:14px; top:50%; transform:translateY(-50%);
                    font-size:13px; color:#9ca3af; font-weight:500;
                    pointer-events:none; transition:all .15s ease; white-space:nowrap;
                }
                .fl-label.up {
                    top:10px; transform:none; font-size:10px; font-weight:700;
                    color:#4F46E5; letter-spacing:.06em; text-transform:uppercase;
                }
                .fl-label.err { color:#ef4444; }
                .fl-input {
                    width:100%; padding:24px 14px 8px; border:1.5px solid #e5e7eb;
                    border-radius:10px; font-size:14px; font-weight:500; color:#111827;
                    background:#fff; outline:none;
                    transition:border-color .15s, box-shadow .15s, background .15s;
                    box-sizing:border-box;
                }
                .fl-input:hover:not(:focus) { border-color:#c7d2fe; }
                .fl-input:focus { border-color:#4F46E5; box-shadow:0 0 0 3px rgba(79,70,229,.1); background:#fafafe; }
                .fl-input.filled:not(:focus) { border-color:#e0e7ff; background:#fafafe; }
                .fl-input.error { border-color:#fca5a5; }
                .fl-input.error:focus { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,.1); }
                .st-btn {
                    flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
                    padding:11px 8px; border-radius:10px; border:1.5px solid #e5e7eb;
                    font-size:13px; font-weight:600; cursor:pointer; background:#fff;
                    transition:all .18s ease;
                }
                .st-btn:hover { transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,0,0,.07); }
                .si-row { display:flex; align-items:flex-start; gap:10px; padding:9px 10px; border-radius:9px; transition:background .15s; }
                .si-row:hover { background:#f5f3ff; }
                .sv-btn {
                    display:flex; align-items:center; justify-content:center; gap:9px;
                    padding:13px 36px; min-width:170px; border-radius:12px;
                    font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
                    border:none; cursor:pointer;
                    transition:transform .15s, box-shadow .15s, background .2s;
                }
                .sv-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(79,70,229,.18); }
                .sv-btn:active:not(:disabled) { transform:scale(.97); }
                .sv-btn:disabled { opacity:.65; cursor:not-allowed; }
            `}</style>

            <div className="container">

                {/* Header */}
                <div className="page-header !mb-6 er-hdr">
                    <div className="page-title">
                        <div className="back-button-wrapper">
                            <button onClick={() => navigate('/school/transport/routes')}
                                style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', boxShadow: '0 1px 4px rgba(0,0,0,.06)', cursor: 'pointer', transition: 'all .2s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.borderColor = 'rgba(79,70,229,.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#f3f4f6'; }}>
                                <IconArrowLeft size={20} />
                            </button>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Edit Route
                                    {isDirty && (
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: 'rgba(245,158,11,.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,.2)' }}>
                                            ● Unsaved changes
                                        </span>
                                    )}
                                </h4>
                                <nav className="breadcrumb">
                                    <span>Transport</span> / <span>Routes</span> / <span className="current">Edit</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Sidebar Preview */}
                    <div className="er-side" style={{ width: 220, flexShrink: 0, background: '#fff', border: '1px solid #f3f4f6', borderRadius: 18, boxShadow: '0 1px 6px rgba(0,0,0,.05)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, borderBottom: '1px solid #f9fafb' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(79,70,229,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconRoute size={26} color="#4F46E5" />
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: 15, color: form.routeNo ? '#111827' : '#d1d5db', margin: 0 }}>
                                    {form.routeNo || 'Route Number'}
                                </p>
                                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
                                    {form.routeName || 'Route name'}
                                </p>
                            </div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.border}` }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusInfo.color }} />
                                {form.status}
                            </span>
                        </div>
                        <div style={{ padding: '12px 12px 16px' }}>
                            {[
                                { icon: IconMapPin, label: 'Start', val: form.startPoint || '—' },
                                { icon: IconMapPin, label: 'End', val: form.endPoint || '—' },
                                { icon: IconRoad, label: 'Distance', val: form.distance ? `${form.distance} km` : '—' },
                                { icon: IconHash, label: 'Stops', val: form.stops ? `${form.stops} stops` : '—' },
                                { icon: IconBus, label: 'Vehicle', val: form.vehicle || '—' },
                                { icon: IconUser, label: 'Driver', val: form.driver || '—' },
                            ].map(({ icon: Icon, label, val }) => (
                                <div key={label} className="si-row">
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(79,70,229,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={13} color="#4F46E5" />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: 9, fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>{label}</p>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: val === '—' ? '#d1d5db' : '#374151', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="er-form" style={{ flex: 1, minWidth: 0, background: '#fff', border: '1px solid #f3f4f6', borderRadius: 18, boxShadow: '0 1px 6px rgba(0,0,0,.05)', padding: 32 }}>

                        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f9fafb' }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Update Route Information</h2>
                            <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Sidebar updates live as you type</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                            {FIELDS.map(({ key, label, type, required }, i) => {
                                const val = String(form[key] ?? '');
                                const isUp = focused === key || val.length > 0;
                                const hasErr = !!errors[key];
                                return (
                                    <div key={key} className={`er-f${i} fl-wrap`}>
                                        <label className={`fl-label${isUp ? ' up' : ''}${hasErr ? ' err' : ''}`}>
                                            {label}{required && <span style={{ color: '#f87171' }}> *</span>}
                                        </label>
                                        <input
                                            type={type}
                                            className={`fl-input${val.length > 0 ? ' filled' : ''}${hasErr ? ' error' : ''}`}
                                            value={val}
                                            onFocus={() => setFocused(key)}
                                            onBlur={() => setFocused(null)}
                                            onChange={e => update(key, e.target.value)}
                                        />
                                        {hasErr && (
                                            <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 500 }}>{errors[key]}</p>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Status */}
                            <div className="er-fst" style={{ gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Status</p>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {STATUS_OPTIONS.map(({ value, label, color, bg, border }) => {
                                        const active = form.status === value;
                                        return (
                                            <button key={value} type="button" className="st-btn"
                                                onClick={() => update('status', value)}
                                                style={active ? { borderColor: border, background: bg, color, boxShadow: `0 3px 10px ${color}22` } : {}}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? color : '#d1d5db', transition: 'background .15s' }} />
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="er-foot" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f9fafb', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                            <button onClick={() => navigate('/school/transport/routes')}
                                style={{ padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', background: '#f9fafb', color: '#6b7280', border: 'none', cursor: 'pointer', transition: 'all .15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#6b7280'; }}>
                                Cancel
                            </button>
                            <button className="sv-btn" onClick={handleSave} disabled={saving || saved}
                                style={{ background: saved ? 'rgba(16,185,129,.1)' : 'rgba(79,70,229,.1)', color: saved ? '#059669' : '#4F46E5' }}>
                                {saving ? (
                                    <>
                                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(79,70,229,.2)', borderTopColor: '#4F46E5', animation: 'spin .7s linear infinite' }} />
                                        Saving...
                                    </>
                                ) : saved ? (
                                    <><IconCheck size={18} stroke={3} /> Saved!</>
                                ) : (
                                    <><IconDeviceFloppy size={18} /> Save Changes</>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
