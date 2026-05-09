import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeeTypes.css';

const loadAssignedFees = () => {
  try { return JSON.parse(localStorage.getItem('assignedFees') || '{}'); } catch(e){ return {}; }
};
const saveAssignedFees = (data) => localStorage.setItem('assignedFees', JSON.stringify(data));

const CLASSES = Array.from({ length: 10 }, (_, i) => String(i + 1));
const SECTIONS = ['A','B','C'];

const AssignFeesEditGlobal = () => {
  const navigate = useNavigate();
  const [cls, setCls] = useState('1');
  const [section, setSection] = useState('A');
  const [rows, setRows] = useState([{ name: '', amount: '' }]);

  useEffect(()=>{
    const map = loadAssignedFees();
    const key = `${cls}-${section}`;
    const data = map[key];
    if (data && typeof data === 'object') {
      const loaded = Object.entries(data).map(([name,amount])=>({ name, amount: String(amount) }));
      setRows(loaded.length? loaded : [{ name:'', amount:'' }]);
    } else {
      setRows([{ name:'', amount:'' }]);
    }
  }, [cls, section]);

  const addRow = () => setRows(r=>[...r, { name:'', amount:'' }]);
  const removeRow = (idx) => setRows(r => r.filter((_,i)=>i!==idx));
  const updateRow = (idx,key,value) => setRows(r=> r.map((row,i)=> i===idx? {...row,[key]:value}:row));

  const validate = () => {
    if (rows.length === 0) return 'At least one fee row required';
    const seen = new Set();
    for (let i=0;i<rows.length;i++){
      const { name, amount } = rows[i];
      if (!name || !name.trim()) return `Fee name required for row ${i+1}`;
      const n = name.trim();
      if (seen.has(n.toLowerCase())) return `Duplicate fee name: ${n}`;
      seen.add(n.toLowerCase());
      if (!amount || Number(amount) <= 0) return `Amount must be > 0 for row ${i+1}`;
    }
    return null;
  };

  const handleSave = () => {
    const err = validate(); if (err) { alert(err); return; }
    const key = `${cls}-${section}`;
    const map = loadAssignedFees();
    const obj = {};
    rows.forEach(r=> obj[r.name.trim()] = Number(r.amount));
    map[key] = obj;
    saveAssignedFees(map);
    alert('Assigned fees updated');
    navigate('/school/finance/assign-fees');
  };

  return (
    <div className="fee-types-page">
      <div className="container">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Assigned Fees (Global)</h4>
            <nav className="breadcrumb"><span>Finance</span> / <span className="current">Assign Fees</span></nav>
          </div>
        </div>

        <div className="card table-card soft-card">
          <div className="form-card">
            <div className="form-grid-two-col">
              <div className="form-group">
                <label>Select Class</label>
                <select value={cls} onChange={e=>setCls(e.target.value)} className="form-input">
                  {CLASSES.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Select Section</label>
                <select value={section} onChange={e=>setSection(e.target.value)} className="form-input">
                  {SECTIONS.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group-full">
                <label>Fees</label>
                <div>
                  {rows.map((row, idx) => (
                    <div key={idx} style={{display:'grid',gridTemplateColumns:'1fr 160px 40px',gap:8,alignItems:'center',marginBottom:8}}>
                      <input className="form-input" value={row.name} onChange={e=>updateRow(idx,'name', e.target.value)} placeholder="Fee name" />
                      <input className="form-input" type="number" min="1" value={row.amount} onChange={e=>updateRow(idx,'amount', e.target.value)} placeholder="Amount" />
                      <div>
                        {idx===0 ? (
                          <button type="button" onClick={addRow} className="btn btn-outline" style={{padding:'8px 10px'}}>+ </button>
                        ) : (
                          <button type="button" onClick={()=>removeRow(idx)} className="btn btn-outline" style={{padding:'8px 10px'}}>x</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
              <button className="btn btn-outline" onClick={()=>navigate('/school/finance/assign-fees')}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignFeesEditGlobal;
