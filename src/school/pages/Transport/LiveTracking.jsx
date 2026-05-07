import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconBus, IconChevronRight, IconMapPin, IconUser,
    IconPhone, IconRoute, IconCircleFilled, IconRefresh,
    IconSearch, IconClock, IconSpeedboat, IconAlertTriangle
} from '@tabler/icons-react';

const SEED_VEHICLES = [
    { id: 1, vehicleNo: 'VH-1001', model: 'Volvo Bus 2023', driver: 'Rajesh Kumar', phone: '9876543210', route: 'North Zone', status: 'Moving', speed: 42, lat: 28.6139, lng: 77.2090 },
    { id: 2, vehicleNo: 'VH-1002', model: 'Tata Starbus', driver: 'Suresh Singh', phone: '9123456780', route: 'South Zone', status: 'Stopped', speed: 0, lat: 28.5355, lng: 77.3910 },
    { id: 3, vehicleNo: 'VH-1003', model: 'Force Traveler', driver: 'Amit Verma', phone: '9988776655', route: 'East Corridor', status: 'Moving', speed: 35, lat: 28.6692, lng: 77.4538 },
    { id: 4, vehicleNo: 'VH-1004', model: 'Ashok Leyland', driver: 'Priya Sharma', phone: '9871234560', route: 'West Route', status: 'Idle', speed: 0, lat: 28.6280, lng: 77.1025 },
];

const STATUS_COLOR = {
    Moving: { dot: '#10b981', bg: '#ecfdf5', text: '#059669', label: 'Active' },
    Stopped: { dot: '#6b7280', bg: '#f3f4f6', text: '#374151', label: 'Inactive' },
    Idle: { dot: '#f59e0b', bg: '#fffbeb', text: '#d97706', label: 'Idle' },
};

export default function LiveTracking() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('vehicles') || '[]');
        return stored.length > 0
            ? stored.map((v, i) => ({ ...SEED_VEHICLES[i % SEED_VEHICLES.length], ...v, id: v.id }))
            : SEED_VEHICLES;
    });

    // Default select first moving vehicle or first vehicle
    const [selected, setSelected] = useState(vehicles.find(v => v.status === 'Moving' || v.status === 'Active')?.id || vehicles[0]?.id || null);
    const [search, setSearch] = useState('');
    const [tick, setTick] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Simulate live movement
    useEffect(() => {
        const t = setInterval(() => {
            setVehicles(prev => prev.map(v => {
                const isMoving = v.status === 'Moving' || v.status === 'Active';
                if (isMoving) {
                    return {
                        ...v,
                        lat: v.lat + (Math.random() - 0.5) * 0.0005,
                        lng: v.lng + (Math.random() - 0.5) * 0.0005,
                        speed: Math.max(30, Math.min(60, v.speed + (Math.random() - 0.5) * 5))
                    };
                }
                return v;
            }));
            setTick(n => n + 1);
            setLastUpdated(new Date());
        }, 4000);
        return () => clearInterval(t);
    }, []);

    const filtered = vehicles.filter(v =>
        v.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
        (v.driver || '').toLowerCase().includes(search.toLowerCase()) ||
        (v.route || '').toLowerCase().includes(search.toLowerCase())
    );

    const selectedVehicle = vehicles.find(v => v.id === selected);

    const getStatusInfo = (v) => {
        const isMoving = v.status === 'Moving' || v.status === 'Active';
        if (isMoving) return STATUS_COLOR.Moving;
        if (v.status === 'Stopped' || v.status === 'Inactive') return STATUS_COLOR.Stopped;
        return STATUS_COLOR.Idle;
    };

    const sc = selectedVehicle ? getStatusInfo(selectedVehicle) : null;

    return (
        <div className="student-list-page">
            <style>{`
                @keyframes slideLeft { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
                @keyframes popIn     { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
                @keyframes pulse     { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.6); opacity:.4; } }
                @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
                .lt-panel  { animation: slideLeft .3s ease both; }
                .lt-map    { animation: popIn .35s ease .06s both; }
                .lt-item   { transition: all .2s ease; cursor: pointer; border-left: 3px solid transparent; }
                .lt-item:hover { background: #f8fafc !important; }
                .lt-item.active { background: #f0f4ff !important; border-left-color: #4F46E5; }
                .pulse-dot { animation: pulse 1.8s ease-in-out infinite; }
            `}</style>

            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div className="page-header !mb-6 lt-panel">
                    <div className="page-title">
                        <div>
                            <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '20px' }}>Live Vehicle Tracking</h4>
                            <nav className="breadcrumb">
                                <span style={{ color: '#6b7280' }}>Transport</span> / <span className="current" style={{ color: '#4F46E5', fontWeight: 500 }}>Live Tracking</span>
                            </nav>
                        </div>
                    </div>
                    <div className="page-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <IconClock size={13} />
                            Updated {lastUpdated.toLocaleTimeString()}
                        </span>
                        <button onClick={() => setLastUpdated(new Date())}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <IconRefresh size={15} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="lt-panel" style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Vehicles', val: vehicles.length, color: '#4F46E5', bg: '#eef2ff' },
                        { label: 'Moving', val: vehicles.filter(v => v.status === 'Moving' || v.status === 'Active').length, color: '#10b981', bg: '#f0fdf4' },
                        { label: 'Stopped', val: vehicles.filter(v => v.status === 'Stopped' || v.status === 'Inactive').length, color: '#ef4444', bg: '#fef2f2' },
                        { label: 'Idle', val: vehicles.filter(v => v.status === 'Idle').length, color: '#f59e0b', bg: '#fffbeb' },
                    ].map(({ label, val, color, bg }) => (
                        <div key={label} style={{ flex: '1 1 180px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: '18px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '26px', fontWeight: 700, color }}>{val}</div>
                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Layout */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Vehicle List Panel */}
                    <div className="lt-panel" style={{ width: 340, flexShrink: 0, background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #f1f5f9' }}>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Select a Vehicle to Track</p>
                            <div style={{ position: 'relative' }}>
                                <IconSearch size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search vehicle, driver, route..."
                                    style={{ width: '100%', padding: '11px 16px 11px 44px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b', transition: 'border-color 0.2s' }}
                                    onFocus={e => e.target.style.borderColor = '#4F46E5'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>
                        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>No vehicles found</div>
                            ) : filtered.map(v => {
                                const info = getStatusInfo(v);
                                const isSel = selected === v.id;
                                return (
                                    <div key={v.id}
                                        className={`lt-item${isSel ? ' active' : ''}`}
                                        onClick={() => setSelected(v.id)}
                                        style={{ padding: '18px 20px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: 16, background: '#fff' }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 14, background: isSel ? '#eef2ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                            <IconBus size={24} color={isSel ? '#4F46E5' : '#64748b'} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{v.vehicleNo}</span>
                                                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: info.bg, color: info.text, border: `1px solid ${info.dot}22` }}>
                                                    {info.label}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{v.model}</div>
                                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, fontWeight: 500 }}>Driver: <span style={{ color: '#475569' }}>{v.driver || '—'}</span></div>
                                        </div>
                                        <IconChevronRight size={18} color={isSel ? '#4F46E5' : '#cbd5e1'} style={{ transition: 'transform 0.2s', transform: isSel ? 'translateX(4px)' : 'none' }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Map + Detail Panel */}
                    <div className="lt-map" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Google Maps View */}
                        <div style={{ position: 'relative', background: '#f1f5f9', borderRadius: 20, overflow: 'hidden', height: 440, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${selectedVehicle?.lat || 28.6139},${selectedVehicle?.lng || 77.2090}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            ></iframe>

                            {/* Overlay for "Live" status */}
                            <div style={{ position: 'absolute', top: 20, left: 24, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', letterSpacing: '0.02em' }}>LIVE TRACKING</span>
                            </div>

                            {/* Open in Google Maps Button */}
                            {selected && (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${selectedVehicle?.lat},${selectedVehicle?.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ position: 'absolute', top: 20, right: 24, background: '#fff', padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#4F46E5', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.15)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}
                                >
                                    <IconMapPin size={16} /> Open in Maps
                                </a>
                            )}

                            {/* No vehicle selected hint */}
                            {!selected && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                    <div style={{ background: '#fff', padding: '16px 32px', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', fontWeight: 700, color: '#4F46E5', border: '1px solid #eef2ff', fontSize: 15 }}>
                                        ← Select a vehicle to start tracking
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Vehicle Detail Card */}
                        {selectedVehicle ? (
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', animation: 'fadeIn .25s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconBus size={28} color="#4F46E5" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>{selectedVehicle.vehicleNo}</div>
                                            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{selectedVehicle.model}</div>
                                        </div>
                                    </div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 700, background: sc.bg, color: sc.text, border: `1px solid ${sc.dot}22` }}>
                                        <span className={selectedVehicle.status === 'Moving' || selectedVehicle.status === 'Active' ? 'pulse-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                                        {sc.label}
                                        {(selectedVehicle.status === 'Moving' || selectedVehicle.status === 'Active') && ` · ${Math.round(selectedVehicle.speed)} km/h`}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                                    {[
                                        { icon: IconUser, label: 'Driver', val: selectedVehicle.driver || '—' },
                                        { icon: IconPhone, label: 'Phone', val: selectedVehicle.phone || '—' },
                                        { icon: IconRoute, label: 'Route', val: selectedVehicle.route || '—' },
                                        { icon: IconMapPin, label: 'Location', val: `${(selectedVehicle.lat || 28.61).toFixed(4)}°N, ${(selectedVehicle.lng || 77.20).toFixed(4)}°E` },
                                        { icon: IconSpeedboat, label: 'Speed', val: `${Math.round(selectedVehicle.speed || 0)} km/h` },
                                        { icon: IconClock, label: 'Last Ping', val: lastUpdated.toLocaleTimeString() },
                                    ].map(({ icon: Icon, label, val }) => (
                                        <div key={label} style={{ background: '#f8fafc', borderRadius: 16, padding: '14px 18px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                <Icon size={14} color="#6366f1" />
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</span>
                                            </div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, padding: 48, textAlign: 'center', color: '#94a3b8', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <IconBus size={48} style={{ opacity: .15, marginBottom: 12 }} />
                                <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Select a vehicle to see details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
