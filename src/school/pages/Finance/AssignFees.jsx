import React, { useState, useContext, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconUserPlus, IconUsers, IconChevronLeft, IconChevronRight,
    IconCheck, IconTrendingUp, IconSearch, IconPencil,
    IconTrash, IconPlus, IconBriefcase, IconFileTypeDoc,
    IconCalendarEvent, IconLayoutDashboard, IconArrowRight,
    IconCurrencyRupee, IconFileText, IconTable, IconDownload, IconPrinter, IconArrowBackUp
} from '@tabler/icons-react';
import { StudentContext } from '../../../context/StudentContext';
import { FeeContext } from '../../../context/FeeContext';
import { PlaceholderAvatar } from '../../../components/Icons';
import './AssignFees.css';

const DEFAULT_FEES = [
    { name: 'Admission', amount: 1000, enabled: true },
    { name: 'Tuition', amount: 5000, enabled: true },
    { name: 'Books', amount: 1500, enabled: true },
    { name: 'Transport', amount: 3000, enabled: true },
];

const AssignFees = () => {
    const navigate = useNavigate();
    const { students } = useContext(StudentContext);
    const [phase, setPhase] = useState('select');
    const [cls, setCls] = useState('10');
    const [section, setSection] = useState('A');
    const [feeRows, setFeeRows] = useState(() => DEFAULT_FEES.map(r => ({ ...r })));
    const [isLoading, setIsLoading] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [studentFeeMap, setStudentFeeMap] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const enabledFees = useMemo(() =>
        feeRows
            .filter(r => r.enabled && r.name.trim() && Number(r.amount) > 0)
            .map(r => ({ name: r.name.trim(), amount: Number(r.amount) })),
        [feeRows]);

    const feeTotalPerStudent = useMemo(() =>
        enabledFees.reduce((s, f) => s + f.amount, 0), [enabledFees]);

    const handleLoad = () => {
        setIsLoading(true);
        setTimeout(() => {
            const matched = students.filter(s => String(s.class) === String(cls) && s.section === section);
            setStudentList(matched);
            const map = {};
            matched.forEach(s => {
                map[s.id] = {};
                enabledFees.forEach(f => { map[s.id][f.name] = true; });
            });
            setStudentFeeMap(map);
            setSelectedIds(new Set(matched.map(s => s.id)));
            setPhase('assign');
            setIsLoading(false);
        }, 800);
    };

    const getTotal = useCallback(sid => {
        const map = studentFeeMap[sid] || {};
        return enabledFees.reduce((s, f) => s + (map[f.name] ? f.amount : 0), 0);
    }, [studentFeeMap, enabledFees]);

    const grandTotal = useMemo(() => {
        let t = 0; selectedIds.forEach(id => { t += getTotal(id); }); return t;
    }, [selectedIds, getTotal]);

    const toggleFee = (sid, fname) => {
        setStudentFeeMap(prev => ({
            ...prev,
            [sid]: { ...(prev[sid] || {}), [fname]: !(prev[sid] || {})[fname] }
        }));
    };

    const toggleRow = id => {
        setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    };

    const toggleAll = () => {
        if (selectedIds.size === studentList.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(studentList.map(s => s.id)));
        }
    };

    return (
        <div className="af-page">
            <header className="af-header">
                <div>
                    <div className="af-title">Assign Fee</div>
                    <nav className="af-breadcrumb">
                        Finance / <span>Assign Fees</span>
                    </nav>
                </div>
                <div className="af-steps">
                    <div className={`af-step ${phase === 'select' ? 'af-step-active' : 'af-step-done'}`}>
                        <div className="af-step-num">{phase === 'assign' ? <IconCheck size={14} /> : '1'}</div>
                        Configuration
                    </div>
                    <div className="af-step-line" />
                    <div className={`af-step ${phase === 'assign' ? 'af-step-active' : ''}`}>
                        <div className="af-step-num">2</div>
                        Targeting
                    </div>
                </div>
            </header>

            <div className={`af-card ${phase === 'assign' ? 'collapsed' : ''}`}>
                <div className="af-card-head">
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div className="af-badge-num">1</div>
                        <div>
                            <div className="af-card-title">Select Demographic & Billing</div>
                            <div className="af-card-subtitle">Define the fee structure for specific classes and sections.</div>
                        </div>
                    </div>
                    {phase === 'assign' && (
                        <button className="btn-premium btn-premium-outline" onClick={() => setPhase('select')}>
                            <IconArrowBackUp size={18} /> Modify Scope
                        </button>
                    )}
                </div>

                {phase === 'select' && (
                    <div className="af-step1-body">
                        <div className="af-form-row">
                            <div className="af-field">
                                <label className="af-label">Target Class</label>
                                <select className="af-select" value={cls} onChange={e => setCls(e.target.value)}>
                                    {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(c => (
                                        <option key={c} value={c}>Grade {c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="af-field">
                                <label className="af-label">Section / Batch</label>
                                <select className="af-select" value={section} onChange={e => setSection(e.target.value)}>
                                    {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="af-fees-section">
                            <h4 className="af-label">Active Fee Entities</h4>
                            <div className="af-fee-list">
                                {feeRows.map((row, idx) => (
                                    <div className="af-fee-row" key={idx}>
                                        <label className="af-fee-toggle">
                                            <input
                                                type="checkbox"
                                                checked={row.enabled}
                                                onChange={e => {
                                                    const nr = [...feeRows];
                                                    nr[idx].enabled = e.target.checked;
                                                    setFeeRows(nr);
                                                }}
                                            />
                                            <span className="af-toggle-slider" />
                                        </label>
                                        <input
                                            className="af-input"
                                            style={{ flex: 1 }}
                                            value={row.name}
                                            placeholder="Fee Strategy Name"
                                            onChange={e => {
                                                const nr = [...feeRows];
                                                nr[idx].name = e.target.value;
                                                setFeeRows(nr);
                                            }}
                                        />
                                        <div style={{ position: 'relative', width: 140 }}>
                                            <IconCurrencyRupee size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="number"
                                                className="af-input"
                                                style={{ paddingLeft: '2.5rem' }}
                                                value={row.amount}
                                                onChange={e => {
                                                    const nr = [...feeRows];
                                                    nr[idx].amount = Number(e.target.value);
                                                    setFeeRows(nr);
                                                }}
                                            />
                                        </div>
                                        <button className="action-circle bg-danger-light" onClick={() => setFeeRows(feeRows.filter((_, i) => i !== idx))}>
                                            <IconTrash size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button className="af-fee-row af-fee-row-add" onClick={() => setFeeRows([...feeRows, { name: '', amount: 0, enabled: true }])}>
                                    <IconPlus size={20} color="#3d5ee1" />
                                    <span style={{ fontWeight: 600, color: '#3d5ee1', fontSize: 13 }}>Register New Fee Entity</span>
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '0 2rem 2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-premium btn-premium-primary" style={{ padding: '1rem 3rem', fontSize: 15 }} onClick={handleLoad}>
                                <IconUsers size={20} /> Initialize Student Mapping <IconArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {phase === 'assign' && (
                <main className="af-card animate-in">
                    <div className="af-card-head">
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div className="af-badge-num">2</div>
                            <div>
                                <div className="af-card-title">Identify Target Students</div>
                                <div className="af-card-subtitle">Confirm mapping for {studentList.length} entities in Grade {cls}-{section}.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="ft-search-wrap" style={{ width: 250 }}>
                                <IconSearch size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    className="ft-search-input"
                                    placeholder="Filter search..."
                                    style={{ padding: '0.625rem 1rem 0.625rem 2.5rem', fontSize: 13 }}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="ft-export-buttons">
                                <button className="ft-export-btn"><IconFileText /> Copy</button>
                                <button className="ft-export-btn"><IconDownload /> CSV</button>
                                <button className="ft-export-btn"><IconTable /> Excel</button>
                                <button className="ft-export-btn"><IconFileText color="#ea5455" /> PDF</button>
                                <button className="ft-export-btn"><IconPrinter /> Print</button>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxHeight: 600, overflow: 'auto' }}>
                        <table className="af-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 60 }}>
                                        <input type="checkbox" checked={selectedIds.size === studentList.length} onChange={toggleAll} />
                                    </th>
                                    <th>Student Identity</th>
                                    <th>Billing Strategy Coverage</th>
                                    <th>Allocated Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(student.id)}
                                                onChange={() => toggleRow(student.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="student-profile">
                                                <img src={`https://i.pravatar.cc/150?u=${student.id}`} alt="" style={{ width: 44, height: 44, borderRadius: 12 }} />
                                                <div>
                                                    <div className="student-info-name">{student.name}</div>
                                                    <div className="student-info-id">{student.admissionNo || student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                {enabledFees.map(f => (
                                                    <span
                                                        key={f.name}
                                                        className={`af-tag ${studentFeeMap[student.id]?.[f.name] ? 'af-tag-on' : 'af-tag-off'}`}
                                                        onClick={() => toggleFee(student.id, f.name)}
                                                    >
                                                        {f.name} (₹{f.amount})
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                                                ₹{getTotal(student.id).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            )}

            {phase === 'assign' && (
                <div className="af-footer">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Consolidated Receivables</span>
                        <div className="af-footer-total">
                            <IconCurrencyRupee size={28} />
                            {grandTotal.toLocaleString()}
                            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600, marginLeft: 8 }}>({selectedIds.size} Students Selected)</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn-premium btn-premium-outline" onClick={() => setPhase('select')}>Cancel</button>
                        <button className="btn-premium btn-premium-primary" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} onClick={() => {
                            alert(`Successfully assigned fees totaling ₹${grandTotal.toLocaleString()}`);
                            navigate('/school/finance/collect-fees');
                        }}>
                            Initialize Billing Cycles <IconArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignFees;
