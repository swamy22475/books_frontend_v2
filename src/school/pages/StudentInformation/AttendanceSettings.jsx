import React, { useEffect, useState } from 'react';

export default function AttendanceSettings(){
  const [settings, setSettings] = useState({day_wise:true, period_wise:false, session_wise:false, biometric:false, school_start_time:'09:00', periods_per_day:6});
  useEffect(()=>{ fetch('/api/attendance/settings').then(r=>r.json()).then(data=>setSettings(data)).catch(()=>{}); },[]);
  const save = async () => { await fetch('/api/attendance/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(settings)}); alert('Saved'); }
  return (
    <div className="attendance-settings-page">
      <div className="page-header">
        <h3>Attendance Settings</h3>
      </div>
      <div className="card soft-card" style={{padding:16}}>
        <label><input type="checkbox" checked={settings.day_wise} onChange={e=>setSettings(s=>({...s,day_wise:e.target.checked}))}/> Day Wise</label>
        <label style={{marginLeft:12}}><input type="checkbox" checked={settings.period_wise} onChange={e=>setSettings(s=>({...s,period_wise:e.target.checked}))}/> Period Wise</label>
        <label style={{marginLeft:12}}><input type="checkbox" checked={settings.session_wise} onChange={e=>setSettings(s=>({...s,session_wise:e.target.checked}))}/> Session Wise</label>
        <label style={{marginLeft:12}}><input type="checkbox" checked={settings.biometric} onChange={e=>setSettings(s=>({...s,biometric:e.target.checked}))}/> Biometric Sync</label>
        <div style={{marginTop:12}}>
          <label>School Start Time: <input value={settings.school_start_time} onChange={e=>setSettings(s=>({...s,school_start_time:e.target.value}))} /></label>
          <label style={{marginLeft:12}}>Periods per day: <input type="number" value={settings.periods_per_day} min={1} max={12} onChange={e=>setSettings(s=>({...s,periods_per_day:parseInt(e.target.value||6)}))} /></label>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
