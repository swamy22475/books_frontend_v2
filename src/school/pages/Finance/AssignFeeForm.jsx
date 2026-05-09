import React, { useState } from 'react';
import './FeeTypes.css';

const DEFAULT_FEES = [
  { name: 'Admission', amount: 1000, enabled: true },
  { name: 'Tuition', amount: 200, enabled: true },
  { name: 'Books', amount: 500, enabled: true },
  { name: 'Transport', amount: 3000, enabled: true },
  { name: 'Uniform', amount: 1500, enabled: true },
];

const AssignFeeForm = ({ onAssign, onCancel }) => {
  const [cls, setCls] = useState('1');
  const [section, setSection] = useState('A');
  const [rows, setRows] = useState(() => DEFAULT_FEES.map(r => ({ ...r })));
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const addCustom = () => {
    if (!customName.trim()) { alert('Fee name required'); return; }
    if (!customAmount || Number(customAmount) <= 0) { alert('Amount required'); return; }
    setRows(r => [...r, { name: customName.trim(), amount: Number(customAmount), enabled: true, custom: true }]);
    setCustomName(''); setCustomAmount('');
  };

  const updateRow = (idx, key, value) => setRows(r => r.map((row, i) => i === idx ? { ...row, [key]: value } : row));
  const removeRow = (idx) => setRows(r => r.filter((_, i) => i !== idx));

  const handleAssign = () => {
    const enabled = rows.filter(r => r.enabled && r.name && r.amount).map(r => ({ name: r.name.trim(), amount: Number(r.amount) }));
    if (enabled.length === 0) { alert('Select at least one fee'); return; }
    onAssign({ cls, section, fees: enabled });
  };

  return (
    <div className="card soft-card" style={{padding:16, marginBottom:12}}>
      <div className="form-grid-two-col" style={{alignItems:'end'}}>
        <div className="form-group">
          <label>Select Class</label>
          <select value={cls} onChange={e=>setCls(e.target.value)} className="form-input" style={{maxWidth:220}}>
            {Array.from({length:12}).map((_,i)=>String(i+1)).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Select Section</label>
          <select value={section} onChange={e=>setSection(e.target.value)} className="form-input" style={{maxWidth:220}}>
            {['A','B','C'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <label style={{display:'block',marginBottom:8,fontWeight:600}}>Fees</label>
        <div className="fees-grid">
          {rows.map((row, idx) => (
            <div key={idx} className="fee-row">
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" checked={!!row.enabled} onChange={e=>updateRow(idx,'enabled', e.target.checked)} />
                <input className="form-input fee-name-input" value={row.name} onChange={e=>updateRow(idx,'name', e.target.value)} placeholder="Fee name" />
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="amount-input-wrap">
                  <span className="rupee">₹</span>
                  <input className="form-input fee-amount-input" type="number" min="0" value={row.amount} onChange={e=>updateRow(idx,'amount', e.target.value)} placeholder="Amount" disabled={!row.enabled} />
                </div>
                <button type="button" onClick={()=>removeRow(idx)} className="btn btn-outline btn-sm">❌</button>
              </div>
            </div>
          ))}

          <div className="fee-row fee-row-custom">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={true} readOnly />
              <input className="form-input fee-name-input" placeholder="Other Fee Name" value={customName} onChange={e=>setCustomName(e.target.value)} />
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="amount-input-wrap">
                <span className="rupee">₹</span>
                <input className="form-input fee-amount-input" placeholder="Amount" type="number" value={customAmount} onChange={e=>setCustomAmount(e.target.value)} />
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={addCustom}>+ Add Fee</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:14}}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={handleAssign}>Assign Fees</button>
      </div>
    </div>
  );
};

export default AssignFeeForm;
