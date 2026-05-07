import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './FeeTypes.css';

const FEE_TYPES = ['Tuition', 'Transport', 'Library', 'Exam Fee', 'Activities'];

const loadAssignedFees = () => {
  try { return JSON.parse(localStorage.getItem('assignedFees') || '{}'); } catch(e){ return {}; }
};
const saveAssignedFees = (data) => localStorage.setItem('assignedFees', JSON.stringify(data));

const AssignFeesEdit = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([{ type: '', amount: '' }]);

  useEffect(()=>{
    const map = loadAssignedFees();
    if (map[studentId] && Array.isArray(map[studentId]) && map[studentId].length>0) {
      setRows(map[studentId].map(r=>({ type: r.type, amount: String(r.amount) })));
    }
  },[studentId]);

  const addRow = () => setRows(r => [...r, { type: '', amount: '' }]);
  const removeRow = (idx) => setRows(r => r.filter((_, i) => i !== idx));
  const updateRow = (idx, key, value) => setRows(r => r.map((row,i)=> i===idx ? {...row, [key]: value } : row));

  const validate = () => {
    if (rows.length === 0) return 'At least one fee row required';
    const seen = new Set();
    for (let i=0;i<rows.length;i++){
      const { type, amount } = rows[i];
      if (!type) return `Fee type required for row ${i+1}`;
      if (seen.has(type)) return `Duplicate fee type: ${type}`;
      seen.add(type);
      if (!amount || Number(amount) <= 0) return `Amount must be > 0 for row ${i+1}`;
    }
    return null;
  };

  const handleSave = () => {
    const err = validate(); if (err) { alert(err); return; }
    const map = loadAssignedFees();
    map[studentId] = rows.map(r=>({ type: r.type, amount: Number(r.amount) }));
    saveAssignedFees(map);
    alert('Assigned fees updated');
    navigate('/school/finance/assign-fees');
  };

  return (
    <div className="fee-types-page">
      <div className="container">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Assigned Fees</h4>
            <nav className="breadcrumb"><span>Finance</span> / <span className="current">Assign Fees</span></nav>
          </div>
        </div>

        <div className="card table-card soft-card">
          <div className="form-card">
            <div className="form-grid-two-col">
              <div className="form-group-full">
                <label>Fees for student: {studentId}</label>
                <div>
                  {rows.map((row, idx)=> (
                    <div key={idx} style={{display:'grid',gridTemplateColumns:'1fr 160px 40px',gap:8,alignItems:'center',marginBottom:8}}>
                      <select className="form-input" value={row.type} onChange={e=>updateRow(idx,'type', e.target.value)}>
                        <option value="">Select fee type</option>
                        {FEE_TYPES.map(t=> <option key={t} value={t} disabled={rows.some((r,i)=>i!==idx && r.type===t)}>{t}</option>)}
                      </select>
                      <input className="form-input" type="number" min="1" value={row.amount} onChange={e=>updateRow(idx,'amount', e.target.value)} placeholder="Amount" />
                      <div>
                        {idx===0 ? (
                          <button type="button" onClick={addRow} className="btn btn-outline" style={{padding:'8px 10px'}}>+</button>
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

export default AssignFeesEdit;
