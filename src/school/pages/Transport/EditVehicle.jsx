import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    IconArrowLeft, IconCheck, IconBus, IconUser,
    IconId, IconPhone, IconArmchair, IconHash, IconDeviceFloppy
} from '@tabler/icons-react';

const FIELDS = [
    { key: 'vehicleNo', label: 'Vehicle Number', type: 'text', required: true },
    { key: 'model', label: 'Vehicle Model', type: 'text', required: false },
    { key: 'driver', label: 'Driver Name', type: 'text', required: false },
    { key: 'license', label: 'License Number', type: 'text', required: false },
    { key: 'phone', label: 'Phone Number', type: 'text', required: false },
    { key: 'capacity', label: 'Seating Capacity', type: 'number', required: false },
];

const STATUS_OPTIONS = [
    { value: 'Active', label: 'Active', color: '#10b981', bg: '#ecfdf5', border: '#6ee7b7' },
    { value: 'Inactive', label: 'Inactive', color: '#6b7280', bg: '#f9fafb', border: '#d1d5db' },
    { value: 'Repair', label: 'Under Repair', color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
];

export default function EditVehicle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [focused, setFocused] = useState(null);
    const [dirty, setDirty] = useState({});

    useEffect(() => {
        setTimeout(() => setVehicle({
            id: id || '1', vehicleNo: 'VH-1001', model: 'Volvo Bus 2023',
            driver: 'Rajesh Kumar', license: 'DL-04-2021-12345',
            phone: '9876543210', capacity: 40, status: 'Active',
        }), 250);
    }, [id]);

    const update = (key, val) => {
        setVehicle(v => ({ ...v, [key]: val }));
        setDirty(d => ({ ...d, [key]: true }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => navigate('/school/transport/vehicles'), 900); }, 1000);
    };

    if (!vehicle) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #e0e7ff', borderTopColor: '#4F46E5', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading...</p>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const statusInfo = STATUS_OPTIONS.find(s => s.value === vehicle.status) || STATUS_OPTIONS[0];
    const editedCount = Object.keys(dirty).length;

    return (
        <div className="student-list-page">
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes slideLeft {
                    from { opacity:0; transform:translateX(-16px); }
                    to   { opacity:1; transform:translateX(0); }
                }
                @keyframes popIn {
                    from { opacity:0; transform:scale(0.96); }
                    to   { opacity:1; transform:scale(1); }
                }
                .ev-hdr  { animation: slideLeft .3s ease both; }
                .ev-side { animation: slideLeft .35s ease .05s both; }
                .ev-form { animation: popIn .35s ease .08s both; }
                .ev-f0   { animation: slideUp .3s ease .12s both; }
                .ev-f1   { animation: slideUp .3s ease .16s both; }
                .ev-f2   { animation: slideUp .3s ease .20s both; }
                .ev-f3   { animation: slideUp .3s ease .24s both; }
                .ev-f4   { animation: slideUp .3s ease .28s both; }
                .ev-f5   { animation: slideUp .3s ease .32s both; }
                .ev-fst  { animation: slideUp .3s ease .36s both; }
                .ev-foot { animation: slideUp .3s ease .40s both; }

                /* Floating label input */
                .fl-wrap { position:relative; }
                .fl-label {
                    position:absolute; left:14px; top:50%; transform:translateY(-50%);
                    font-size:13px; color:#9ca3af; font-weight:500;
                    pointer-events:none; transition:all .15s ease; white-space:nowrap;
                }
                .fl-label.up {
                    top:10px; transform:none; font-size:10px; font-weight:700;
                    color:#4F46E5; letter-spacing:.06em; text-transform:uppercase;
                }
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

                /* Status pill buttons */
                .st-btn {
                    flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
                    padding:11px 8px; border-radius:10px; border:1.5px solid #e5e7eb;
                    font-size:13px; font-weight:600; cursor:pointer; background:#fff;
                    transition:all .18s ease;
                }
                .st-btn:hover { transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,0,0,.07); }

                /* Sidebar info row */
                .si-row {
                    display:flex; align-items:flex-start; gap:10px;
                    padding:9px 10px; border-radius:9px; transition:background .15s;
                }
                .si-row:hover { background:#f5f3ff; }

                /* Save button */
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

                {/* Page Header */}
                <div className="page-header !mb-6 ev-hdr">
                    <div className="page-title">
                        <div className="back-button-wrapper">
                            <button onClick={() => navigate('/school/transport/vehicles')}
                                style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', boxShadow: '0 1px 4px rgba(0,0,0,.06)', cursor: 'pointer', transition: 'all .2s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.borderColor = 'rgba(79,70,229,.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#f3f4f6'; }}>
                                <IconArrowLeft size={20} />
                            </button>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Edit Vehicle
                                    {editedCount > 0 && (
                                        <span style={{ fontSize: 10, fontWeight: 700, background: '#ede9fe', color: '#4F46E5', padding: '2px 8px', borderRadius: 20, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                                            {editedCount} unsaved
                                        </span>
                                    )}
                                </h4>
                                <nav className="breadcrumb">
                                    <span>Transport</span> / <span>Vehicles</span> / <span className="current">Edit</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* ── Sidebar ── */}
                    <div className="ev-side" style={{ width: 220, flexShrink: 0, background: '#fff', border: '1px solid #f3f4f6', borderRadius: 18, boxShadow: '0 1px 6px rgba(0,0,0,.05)', overflow: 'hidden' }}>
                        {/* Top */}
                        <div style={{ padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, borderBottom: '1px solid #f9fafb' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(79,70,229,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconBus size={26} color="#4F46E5" />
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>{vehicle.vehicleNo}</p>
                                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{vehicle.model}</p>
                            </div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.border}` }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusInfo.color }} />
                                {vehicle.status === 'Repair' ? 'Under Repair' : vehicle.status}
                            </span>
                        </div>
                        {/* Info rows */}
                        <div style={{ padding: '12px 12px 16px' }}>
                            {[
                                { icon: IconUser, label: 'Driver', val: vehicle.driver },
                                { icon: IconPhone, label: 'Phone', val: vehicle.phone },
                                { icon: IconArmchair, label: 'Capacity', val: `${vehicle.capacity} seats` },
                                { icon: IconId, label: 'License', val: vehicle.license },
                            ].map(({ icon: Icon, label, val }) => (
                                <div key={label} className="si-row">
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(79,70,229,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={13} color="#4F46E5" />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: 9, fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>{label}</p>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Form Card ── */}
                    <div className="ev-form" style={{ flex: 1, minWidth: 0, background: '#fff', border: '1px solid #f3f4f6', borderRadius: 18, boxShadow: '0 1px 6px rgba(0,0,0,.05)', padding: 32 }}>

                        {/* Form header */}
                        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Update Vehicle Information</h2>
                                <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Sidebar updates live as you type</p>
                            </div>
                        </div>

                        {/* Fields 2-col grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                            {FIELDS.map(({ key, label, type, required }, i) => {
                                const val = String(vehicle[key] ?? '');
                                const isUp = focused === key || val.length > 0;
                                return (
                                    <div key={key} className={`ev-f${i} fl-wrap`}>
                                        <label className={`fl-label${isUp ? ' up' : ''}`}>
                                            {label}{required && <span style={{ color: '#f87171' }}> *</span>}
                                        </label>
                                        <input
                                            type={type}
                                            className={`fl-input${val.length > 0 ? ' filled' : ''}`}
                                            value={val}
                                            onFocus={() => setFocused(key)}
                                            onBlur={() => setFocused(null)}
                                            onChange={e => update(key, e.target.value)}
                                        />
                                        {dirty[key] && (
                                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#4F46E5' }} />
                                        )}
                                    </div>
                                );
                            })}

                            {/* Status — full width */}
                            <div className="ev-fst" style={{ gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Status</p>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {STATUS_OPTIONS.map(({ value, label, color, bg, border }) => {
                                        const active = vehicle.status === value;
                                        return (
                                            <button key={value} type="button"
                                                className="st-btn"
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
                        <div className="ev-foot" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f9fafb', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                            <button onClick={() => navigate('/school/transport/vehicles')}
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
