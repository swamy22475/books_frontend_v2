import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GeneralSetting.css';

/* ── Toast ─────────────────────────────────────────────────────── */
const toast = (msg, type = 'success') => {
  const el = document.getElementById('gs-toast');
  if (el) el.remove();
  const t = document.createElement('div');
  t.id = 'gs-toast';
  const bg = type === 'success' ? '#28c76f' : type === 'error' ? '#ea5455' : '#3d5ee1';
  const ic = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  Object.assign(t.style, { background: bg });
  t.innerHTML = `<span style="font-size:16px">${ic}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 320); }, 2800);
};

/* ── Toggle Switch ──────────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
  <label className="gs-switch">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className="gs-slider" />
  </label>
);

/* ── Section Divider ─────────────────────────────────────────── */
const Divider = ({ label }) => (
  <div className="gs-section-divider">
    <span className="gs-section-divider-label">{label}</span>
    <span className="gs-section-divider-line" />
  </div>
);

/* ── Toggle Row ─────────────────────────────────────────────── */
const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div className="gs-toggle-row">
    <div className="gs-toggle-info">
      <div className="gs-toggle-label">{label}</div>
      {desc && <div className="gs-toggle-desc">{desc}</div>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   TAB PANELS
   ═══════════════════════════════════════════════════════════════ */

/* ① General Setting */
const TabGeneral = ({ data, set }) => (
  <>
    <div className="gs-card">
      <div className="gs-card-head">
        <div className="gs-card-icon blue">🏫</div>
        <div>
          <p className="gs-card-title">School Information</p>
          <p className="gs-card-sub">Basic details about your institution</p>
        </div>
      </div>
      <div className="gs-card-body">
        <div className="gs-grid-2">
          <div className="gs-field">
            <label className="gs-label">School Name</label>
            <input className="gs-input" value={data.schoolName} placeholder="e.g. Mount Carmel School"
              onChange={e => set('schoolName', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">School Code</label>
            <input className="gs-input" value={data.schoolCode} placeholder="e.g. MCS001"
              onChange={e => set('schoolCode', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">Phone Number</label>
            <input className="gs-input" type="tel" value={data.phone} placeholder="+91 98765 43210"
              onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">Email Address</label>
            <input className="gs-input" type="email" value={data.email} placeholder="admin@school.edu"
              onChange={e => set('email', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">Website</label>
            <input className="gs-input" value={data.website} placeholder="https://school.edu"
              onChange={e => set('website', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">Board / Affiliation</label>
            <select className="gs-select" value={data.board} onChange={e => set('board', e.target.value)}>
              <option value="">Select Board</option>
              <option>CBSE</option><option>ICSE</option><option>State Board</option>
              <option>IB</option><option>IGCSE</option>
            </select>
          </div>
        </div>
        <div className="gs-field">
          <label className="gs-label">Address</label>
          <textarea className="gs-textarea" value={data.address} rows={3} placeholder="Full school address"
            onChange={e => set('address', e.target.value)} />
        </div>
        <div className="gs-grid-3">
          <div className="gs-field">
            <label className="gs-label">City</label>
            <input className="gs-input" value={data.city} placeholder="Hyderabad"
              onChange={e => set('city', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">State</label>
            <input className="gs-input" value={data.state} placeholder="Telangana"
              onChange={e => set('state', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">PIN Code</label>
            <input className="gs-input" value={data.pin} placeholder="500001"
              onChange={e => set('pin', e.target.value)} />
          </div>
        </div>
      </div>
    </div>

    <div className="gs-card">
      <div className="gs-card-head">
        <div className="gs-card-icon green">🌍</div>
        <div>
          <p className="gs-card-title">Locale &amp; Regional</p>
          <p className="gs-card-sub">Timezone, currency and language preferences</p>
        </div>
      </div>
      <div className="gs-card-body">
        <div className="gs-grid-3">
          <div className="gs-field">
            <label className="gs-label">Timezone</label>
            <select className="gs-select" value={data.timezone} onChange={e => set('timezone', e.target.value)}>
              <option value="Asia/Kolkata">IST (India)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST (US East)</option>
              <option value="America/Chicago">CST (US Central)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Asia/Dubai">GST (Dubai)</option>
            </select>
          </div>
          <div className="gs-field">
            <label className="gs-label">Currency</label>
            <select className="gs-select" value={data.currency} onChange={e => set('currency', e.target.value)}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED</option>
            </select>
          </div>
          <div className="gs-field">
            <label className="gs-label">Language</label>
            <select className="gs-select" value={data.language} onChange={e => set('language', e.target.value)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          <div className="gs-field">
            <label className="gs-label">Date Format</label>
            <select className="gs-select" value={data.dateFormat} onChange={e => set('dateFormat', e.target.value)}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="gs-field">
            <label className="gs-label">Academic Year Start</label>
            <select className="gs-select" value={data.yearStart} onChange={e => set('yearStart', e.target.value)}>
              <option>January</option><option>April</option><option>June</option><option>July</option>
            </select>
          </div>
          <div className="gs-field">
            <label className="gs-label">Week Starts On</label>
            <select className="gs-select" value={data.weekStart} onChange={e => set('weekStart', e.target.value)}>
              <option>Sunday</option><option>Monday</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </>
);

/* ② Logo */
const TabLogo = ({ logos, setLogo }) => {
  const logos_config = [
    { key: 'print', label: 'Print Logo', hint: '170px × 184px', emoji: '🖨️' },
    { key: 'admin', label: 'Admin Logo', hint: '290px × 51px', emoji: '🛡️' },
    { key: 'adminSmall', label: 'Admin Small Logo', hint: '32px × 32px', emoji: '🔹' },
    { key: 'app', label: 'App Logo', hint: '290px × 51px', emoji: '📱' },
  ];
  const refs = { print: useRef(), admin: useRef(), adminSmall: useRef(), app: useRef() };

  const handleFile = (key, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo(key, url);
    toast(`${logos_config.find(l => l.key === key).label} updated!`);
  };

  return (
    <div className="gs-card">
      <div className="gs-card-head">
        <div className="gs-card-icon orange">🖼️</div>
        <div>
          <p className="gs-card-title">School Logos</p>
          <p className="gs-card-sub">Upload logos for different contexts (JPG, PNG, SVG)</p>
        </div>
      </div>
      <div className="gs-card-body">
        <div className="gs-logo-grid">
          {logos_config.map(({ key, label, hint, emoji }) => (
            <div className="gs-logo-card" key={key}>
              <div className="gs-logo-preview">
                {logos[key]
                  ? <img src={logos[key]} alt={label} style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} />
                  : <span>{emoji}</span>
                }
              </div>
              <div className="gs-logo-name">{label}</div>
              <div className="gs-logo-hint">{hint}</div>
              <input
                type="file"
                accept="image/*"
                ref={refs[key]}
                style={{ display: 'none' }}
                onChange={e => handleFile(key, e.target.files[0])}
              />
              <button
                className="gs-logo-upload-btn"
                onClick={() => refs[key].current.click()}
              >
                ⬆ Update
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ③ Fees */
const TabFees = ({ fees, setFee }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon green">💰</div>
      <div>
        <p className="gs-card-title">Fees Settings</p>
        <p className="gs-card-sub">Configure fee collection and late fine rules</p>
      </div>
    </div>
    <div className="gs-card-body">
      <Divider label="Collection" />
      <ToggleRow label="Enable Online Fee Payment" desc="Allow parents to pay fees via payment gateway"
        checked={fees.onlinePayment} onChange={v => setFee('onlinePayment', v)} />
      <ToggleRow label="Send Payment Receipt via SMS" desc="Auto-send receipt SMS on successful payment"
        checked={fees.smsReceipt} onChange={v => setFee('smsReceipt', v)} />
      <ToggleRow label="Send Payment Receipt via Email"
        checked={fees.emailReceipt} onChange={v => setFee('emailReceipt', v)} />

      <Divider label="Late Fine" />
      <ToggleRow label="Enable Late Fine" desc="Apply penalty for overdue fee payments"
        checked={fees.lateFine} onChange={v => setFee('lateFine', v)} />
      {fees.lateFine && (
        <div className="gs-grid-2">
          <div className="gs-field">
            <label className="gs-label">Fine Amount per Day (₹)</label>
            <input className="gs-input" type="number" value={fees.finePerDay}
              placeholder="10" onChange={e => setFee('finePerDay', e.target.value)} />
          </div>
          <div className="gs-field">
            <label className="gs-label">Grace Period (days)</label>
            <input className="gs-input" type="number" value={fees.gracePeriod}
              placeholder="5" onChange={e => setFee('gracePeriod', e.target.value)} />
          </div>
        </div>
      )}

      <Divider label="Due Fees" />
      <ToggleRow label="Show Due Fees Alert on Login" desc="Display banner when student/parent logs in"
        checked={fees.dueAlert} onChange={v => setFee('dueAlert', v)} />
      <ToggleRow label="Block Student Portal on Dues" desc="Restrict access until fees are cleared"
        checked={fees.blockOnDue} onChange={v => setFee('blockOnDue', v)} />
    </div>
  </div>
);

/* ④ ID Auto Generation / Generator */
const TabIDGen = () => {
  const [type, setType] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', className: '', section: '', rollNo: '',
    bloodGroup: '', doj: '', phone: '', photo: '', department: '', designation: ''
  });
  const [generatedCard, setGeneratedCard] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
    }
  };

  const handleGenerate = () => {
    if (!formData.firstName || !formData.lastName) {
      toast('Please enter at least First and Last Name', 'error');
      return;
    }
    setGeneratedCard({ ...formData, type });
    toast('ID Card Generated Successfully!');
  };

  const setField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="gs-card">
      <div className="gs-card-head">
        <div className="gs-card-icon purple">🪪</div>
        <div>
          <p className="gs-card-title">ID Card Generator</p>
          <p className="gs-card-sub">Quickly create, generate, and view ID cards</p>
        </div>
      </div>
      <div className="gs-card-body" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* FORM SECTION */}
        <div style={{ flex: '1 1 400px' }}>
          <div className="gs-field">
            <label className="gs-label">Entity Type</label>
            <div className="gs-att-pills">
              {['student', 'teacher', 'staff'].map(t => (
                <button key={t} className={`gs-att-pill ${type === t ? 'active' : ''}`}
                  onClick={() => { setType(t); setGeneratedCard(null); }}
                  style={{ textTransform: 'capitalize' }}>{t}</button>
              ))}
            </div>
          </div>

          <div className="gs-grid-2">
            <div className="gs-field">
              <label className="gs-label">First Name</label>
              <input className="gs-input" value={formData.firstName} placeholder="John"
                onChange={e => setField('firstName', e.target.value)} />
            </div>
            <div className="gs-field">
              <label className="gs-label">Last Name</label>
              <input className="gs-input" value={formData.lastName} placeholder="Doe"
                onChange={e => setField('lastName', e.target.value)} />
            </div>

            {type === 'student' && (
              <>
                <div className="gs-field">
                  <label className="gs-label">Class</label>
                  <input className="gs-input" value={formData.className} placeholder="e.g. 10"
                    onChange={e => setField('className', e.target.value)} />
                </div>
                <div className="gs-field">
                  <label className="gs-label">Section</label>
                  <input className="gs-input" value={formData.section} placeholder="e.g. A"
                    onChange={e => setField('section', e.target.value)} />
                </div>
                <div className="gs-field">
                  <label className="gs-label">Roll No</label>
                  <input className="gs-input" value={formData.rollNo} placeholder="e.g. 104"
                    onChange={e => setField('rollNo', e.target.value)} />
                </div>
              </>
            )}

            {(type === 'teacher' || type === 'staff') && (
              <>
                <div className="gs-field">
                  <label className="gs-label">Department</label>
                  <input className="gs-input" value={formData.department} placeholder="e.g. Mathematics"
                    onChange={e => setField('department', e.target.value)} />
                </div>
                <div className="gs-field">
                  <label className="gs-label">Designation</label>
                  <input className="gs-input" value={formData.designation} placeholder="e.g. Senior Teacher"
                    onChange={e => setField('designation', e.target.value)} />
                </div>
              </>
            )}
            
            <div className="gs-field">
              <label className="gs-label">Blood Group</label>
              <select className="gs-select" value={formData.bloodGroup} onChange={e => setField('bloodGroup', e.target.value)}>
                <option value="">Select...</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div className="gs-field">
              <label className="gs-label">Date of Joining</label>
              <input className="gs-input" type="date" value={formData.doj}
                onChange={e => setField('doj', e.target.value)} />
            </div>
            <div className="gs-field">
              <label className="gs-label">Phone Number</label>
              <input className="gs-input" type="tel" value={formData.phone} placeholder="+1 234 567 890"
                onChange={e => setField('phone', e.target.value)} />
            </div>
            <div className="gs-field">
              <label className="gs-label">Photo upload</label>
              <input type="file" accept="image/*" onChange={handleFile} className="gs-input" style={{ padding: '6px' }} />
            </div>
          </div>
          
          <button onClick={handleGenerate} 
            style={{ 
              marginTop: 24, background: 'linear-gradient(135deg, #3d5ee1, #60a5fa)', 
              color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 8, 
              cursor: 'pointer', fontWeight: 600, fontSize: 16, width: '100%',
              boxShadow: '0 4px 12px rgba(61, 94, 225, 0.3)', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
            Generate ID Card
          </button>
        </div>

        {/* OUTPUT SECTION */}
        <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <label className="gs-label" style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
            {generatedCard ? 'Generated ID Card' : 'Fill details and Generate'}
          </label>
          
          {!generatedCard ? (
            <div style={{
              width: 300, height: 460, borderRadius: 16, background: '#f8f9fc', border: '2px dashed #cbd5e1',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'
            }}>
              <span style={{ fontSize: 48, marginBottom: 16 }}>🪪</span>
              <p>Card will appear here</p>
            </div>
          ) : (
            <div style={{
              width: 300, height: 480, borderRadius: 16, background: '#fff', boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
              overflow: 'hidden', position: 'relative', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
              fontFamily: "'Inter', sans-serif"
            }}>
              
              {/* TOP PATTERN & HEADER */}
              <div style={{ 
                height: 140, 
                background: generatedCard.type === 'student' ? 'linear-gradient(135deg, #3d5ee1 0%, #1e3a8a 100%)' :
                            generatedCard.type === 'teacher' ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' :
                            'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                position: 'relative', isolation: 'isolate'
              }}>
                {/* Overlay Pattern */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.1, zIndex: -1,
                  backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '16px 16px'
                }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px' }}>
                  <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    🏫
                  </div>
                  <div style={{ color: '#fff' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>MINDWHILE SCHOOL</div>
                    <div style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Empowering Minds</div>
                  </div>
                </div>

                {/* Role Badge */}
                <div style={{ 
                  position: 'absolute', bottom: -18, right: 20,
                  background: '#fff', padding: '6px 16px', borderRadius: 20, 
                  fontSize: 11, fontWeight: 800, color: '#1e293b', 
                  textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  border: '2px solid #f8f9fc', letterSpacing: 1
                }}>
                  {generatedCard.type}
                </div>
              </div>

              {/* PHOTO AVATAR */}
              <div style={{ position: 'absolute', top: 90, left: 24 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: '#f1f5f9', border: '4px solid #fff',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.12)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {generatedCard.photo ? (
                    <img src={generatedCard.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 44, color: '#cbd5e1' }}>👤</span>
                  )}
                </div>
              </div>

              {/* DETAILS SECTION */}
              <div style={{ padding: '60px 24px 20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: 22, color: '#0f172a', fontWeight: 800, textTransform: 'capitalize', lineHeight: 1.2 }}>
                  {generatedCard.firstName} {generatedCard.lastName}
                </h2>
                
                {generatedCard.type === 'student' && (
                   <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                     Class {generatedCard.className || '-'} &nbsp;•&nbsp; Sec {generatedCard.section || '-'} &nbsp;•&nbsp; Roll No: {generatedCard.rollNo || '-'}
                   </p>
                )}
                {(generatedCard.type === 'teacher' || generatedCard.type === 'staff') && (
                   <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                     {generatedCard.department || 'Department N/A'} &nbsp;•&nbsp; {generatedCard.designation || 'Role N/A'}
                   </p>
                )}

                <div style={{ width: '100%', height: 1, background: '#e2e8f0', marginBottom: 16 }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, max-content) 1fr', gap: '10px 12px', fontSize: 13, color: '#334155' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>Blood Grp:</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>{generatedCard.bloodGroup || '-'}</span>
                  
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>DOJ:</span>
                  <span style={{ fontWeight: 600 }}>{generatedCard.doj ? new Date(generatedCard.doj).toLocaleDateString() : '-'}</span>
                  
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>Phone:</span>
                  <span style={{ fontWeight: 600 }}>{generatedCard.phone || '-'}</span>
                </div>
              </div>

              {/* FOOTER BARCODE */}
              <div style={{ 
                background: '#f8f9fc', padding: '16px 0', borderTop: '1px solid #f1f5f9',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
              }}>
                 {/* Simulated Barcode */}
                 <div style={{ 
                   height: 28, width: '180px', background: '#334155',
                   WebkitMaskImage: 'repeating-linear-gradient(to right, transparent, transparent 1px, black 1px, black 3px, transparent 3px, transparent 5px, black 5px, black 6px, transparent 6px, transparent 8px, black 8px, black 11px, transparent 11px, transparent 12px, black 12px, black 13px)',
                   maskImage: 'repeating-linear-gradient(to right, transparent, transparent 1px, black 1px, black 3px, transparent 3px, transparent 5px, black 5px, black 6px, transparent 6px, transparent 8px, black 8px, black 11px, transparent 11px, transparent 12px, black 12px, black 13px)'
                 }}></div>
                 <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 2, fontFamily: 'monospace' }}>
                   * {generatedCard.phone?.replace(/\s+/g, '') || Math.floor(10000000 + Math.random() * 90000000)} *
                 </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

/* ⑤ Attendance Type */
const TabAttendance = ({ att, setAtt }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon teal">📅</div>
      <div>
        <p className="gs-card-title">Attendance Configuration</p>
        <p className="gs-card-sub">Define how attendance is tracked and displayed</p>
      </div>
    </div>
    <div className="gs-card-body">
      <div className="gs-field">
        <label className="gs-label">Default Attendance Mode</label>
        <div className="gs-att-pills">
          {['Daily', 'Period-wise', 'Subject-wise'].map(mode => (
            <button key={mode} className={`gs-att-pill ${att.mode === mode ? 'active' : ''}`}
              onClick={() => setAtt('mode', mode)}>{mode}</button>
          ))}
        </div>
      </div>

      <ToggleRow label="Mark Half-Day Attendance"
        desc="Allow half-day present/absent marking"
        checked={att.halfDay} onChange={v => setAtt('halfDay', v)} />
      <ToggleRow label="Late Arrival Marking"
        desc="Allow marking students as 'Late' separately"
        checked={att.late} onChange={v => setAtt('late', v)} />
      <ToggleRow label="SMS Alert on Absence"
        desc="Send SMS to parent when child is absent"
        checked={att.smsAlert} onChange={v => setAtt('smsAlert', v)} />
      <ToggleRow label="Notify on Consecutive Absences"
        desc="Alert when student is absent for 3+ consecutive days"
        checked={att.consecutiveAlert} onChange={v => setAtt('consecutiveAlert', v)} />
      {att.consecutiveAlert && (
        <div className="gs-field">
          <label className="gs-label">Consecutive Days Threshold</label>
          <input className="gs-input" type="number" value={att.threshold} placeholder="3"
            onChange={e => setAtt('threshold', e.target.value)} style={{ maxWidth: 120 }} />
        </div>
      )}
      <ToggleRow label="Show Attendance % on Student Dashboard"
        checked={att.showPercentage} onChange={v => setAtt('showPercentage', v)} />

      <Divider label="Working Days" />
      <div className="gs-field">
        <label className="gs-label">Weekly Off Days</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => {
            const active = att.weekOff?.includes(d);
            return (
              <button key={d} className={`gs-att-pill ${active ? 'active' : ''}`}
                onClick={() => {
                  const curr = att.weekOff || [];
                  setAtt('weekOff', active ? curr.filter(x => x !== d) : [...curr, d]);
                }} style={{ padding: '6px 14px', fontSize: 12 }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

/* ⑥ Student / Guardian Panel + Chat */
const TabChat = ({ chat, setChat }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon blue">💬</div>
      <div>
        <p className="gs-card-title">Student / Guardian Panel</p>
        <p className="gs-card-sub">Control chat permissions for different user roles</p>
      </div>
    </div>
    <div className="gs-card-body">
      <div className="gs-chat-info">
        ℹ️ These settings control what students, guardians and staff can do inside the in-app chat module.
      </div>
      <ToggleRow label="Allow Student to Delete Chat"
        desc="Students can remove their own messages"
        checked={chat.studentDelete} onChange={v => setChat('studentDelete', v)} />
      <ToggleRow label="Allow Guardian to Delete Chat"
        desc="Parents/guardians can remove their own messages"
        checked={chat.guardianDelete} onChange={v => setChat('guardianDelete', v)} />
      <ToggleRow label="Allow Staff to Delete Chat"
        desc="Teachers and staff can remove their own messages"
        checked={chat.staffDelete} onChange={v => setChat('staffDelete', v)} />
      <ToggleRow label="Enable Group Chat"
        desc="Allow class-wide group conversations"
        checked={chat.groupChat} onChange={v => setChat('groupChat', v)} />
      <ToggleRow label="Allow File Attachments"
        desc="Users can share images and documents in chat"
        checked={chat.attachments} onChange={v => setChat('attachments', v)} />
    </div>
  </div>
);

/* ⑦ Maintenance */
const TabMaintenance = ({ maint, setMaint }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon orange">🔧</div>
      <div>
        <p className="gs-card-title">Maintenance Mode</p>
        <p className="gs-card-sub">Temporarily take the system offline for updates</p>
      </div>
    </div>
    <div className="gs-card-body">
      <div className="gs-maintenance-banner">
        <span className="gs-maintenance-icon">⚠️</span>
        <div>
          <div className="gs-maintenance-banner-title">Caution — Maintenance Mode</div>
          <div className="gs-maintenance-banner-sub">
            When enabled, all users except Super Admins will see a maintenance page instead
            of the normal system. Use this only during scheduled downtime.
          </div>
        </div>
      </div>
      <ToggleRow
        label="Enable Maintenance Mode"
        desc="Show maintenance page to all non-admin users"
        checked={maint.enabled} onChange={v => setMaint('enabled', v)} />
      {maint.enabled && (
        <>
          <div className="gs-field">
            <label className="gs-label">Maintenance Message</label>
            <textarea className="gs-textarea"
              value={maint.message}
              placeholder="We're performing scheduled maintenance. We'll be back shortly!"
              onChange={e => setMaint('message', e.target.value)} />
          </div>
          <div className="gs-grid-2">
            <div className="gs-field">
              <label className="gs-label">Expected Back Online</label>
              <input className="gs-input" type="datetime-local" value={maint.eta}
                onChange={e => setMaint('eta', e.target.value)} />
            </div>
            <div className="gs-field">
              <label className="gs-label">Contact Email</label>
              <input className="gs-input" type="email" value={maint.contact}
                placeholder="tech@school.edu" onChange={e => setMaint('contact', e.target.value)} />
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

/* ⑧ Miscellaneous */
const TabMisc = ({ misc, setMisc }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon purple">⚙️</div>
      <div>
        <p className="gs-card-title">Miscellaneous Settings</p>
        <p className="gs-card-sub">Additional system-wide configuration options</p>
      </div>
    </div>
    <div className="gs-card-body">
      <Divider label="Online Examination" />
      <ToggleRow label="Show Me Only My Questions"
        desc="Students see only their assigned question set"
        checked={misc.onlyMyQ} onChange={v => setMisc('onlyMyQ', v)} />

      <Divider label="ID Card Scan Code" />
      <div className="gs-field">
        <label className="gs-label">Scan Type</label>
        <div className="gs-radio-group">
          {['Barcode', 'QR Code'].map(t => (
            <label key={t} className="gs-radio-item">
              <input type="radio" name="scanType" value={t}
                checked={misc.scanType === t}
                onChange={() => setMisc('scanType', t)} />
              {t}
            </label>
          ))}
        </div>
      </div>

      <Divider label="Examinations" />
      <ToggleRow label="Exam Result Page in Front Site"
        desc="Make result page publicly accessible"
        checked={misc.resultFrontSite} onChange={v => setMisc('resultFrontSite', v)} />
      <ToggleRow label="Download Admit Card in Student / Parent Panel"
        checked={misc.admitCardDownload} onChange={v => setMisc('admitCardDownload', v)} />

      <Divider label="Access Control" />
      <ToggleRow label="Teacher Restricted Mode"
        desc="Limit teacher access to only their assigned classes"
        checked={misc.teacherRestricted} onChange={v => setMisc('teacherRestricted', v)} />
      <ToggleRow label="Superadmin Visibility"
        desc="Show superadmin in user lists and logs"
        checked={misc.superadminVisible} onChange={v => setMisc('superadminVisible', v)} />
      <ToggleRow label="Event Reminder Notifications"
        checked={misc.eventReminder} onChange={v => setMisc('eventReminder', v)} />

      <Divider label="Leave" />
      <div className="gs-field">
        <label className="gs-label">Staff Leave Notification Email</label>
        <input className="gs-input" type="email" value={misc.leaveEmail}
          placeholder="hr@school.edu" onChange={e => setMisc('leaveEmail', e.target.value)} />
      </div>

      <Divider label="Multi Class" />
      <ToggleRow label="Enable Multi Class Selection in Student Admission Form"
        desc="Allow a student to be assigned to multiple classes"
        checked={misc.multiClass} onChange={v => setMisc('multiClass', v)} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   EXTRA TABS
   ═══════════════════════════════════════════════════════════════ */

/* ⑨ Login Page Background */
const TabLoginBg = ({ bg, setBg }) => {
  const fileRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBg('preview', URL.createObjectURL(file));
    toast('Login background updated!');
  };
  return (
    <div className="gs-card">
      <div className="gs-card-head">
        <div className="gs-card-icon blue">🖼️</div>
        <div>
          <p className="gs-card-title">Login Page Background</p>
          <p className="gs-card-sub">Customize the image shown on the login / sign-in screen</p>
        </div>
      </div>
      <div className="gs-card-body">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{
            flex: '1 1 280px', minHeight: 200, background: '#f8f9fc', borderRadius: 12,
            border: '2px dashed #e5e9f0', display: 'flex', alignItems: 'center',
            justifyContent: 'center', overflow: 'hidden', position: 'relative'
          }}>
            {bg.preview
              ? <img src={bg.preview} alt="bg" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              : <div style={{ textAlign: 'center', color: '#ccc' }}><div style={{ fontSize: 48 }}>🏫</div><div style={{ fontSize: 13 }}>No image set</div></div>
            }
          </div>
          {/* Controls */}
          <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="gs-field">
              <label className="gs-label">Background Type</label>
              <div className="gs-att-pills">
                {['Image', 'Gradient', 'Solid Color'].map(t => (
                  <button key={t} className={`gs-att-pill ${bg.type === t ? 'active' : ''}`}
                    onClick={() => setBg('type', t)}>{t}</button>
                ))}
              </div>
            </div>
            {bg.type === 'Image' && (
              <>
                <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
                <button className="gs-logo-upload-btn" onClick={() => fileRef.current.click()}
                  style={{ alignSelf: 'flex-start' }}>⬆ Upload Image</button>
                <div className="gs-field">
                  <label className="gs-label">Or Image URL</label>
                  <input className="gs-input" value={bg.url} placeholder="https://..." onChange={e => setBg('url', e.target.value)} />
                </div>
                <div className="gs-field">
                  <label className="gs-label">Overlay Opacity (%)</label>
                  <input className="gs-input" type="range" min={0} max={90} value={bg.opacity}
                    onChange={e => setBg('opacity', e.target.value)} />
                  <span style={{ fontSize: 12, color: '#aaa' }}>{bg.opacity}%</span>
                </div>
              </>
            )}
            {bg.type === 'Gradient' && (
              <div className="gs-grid-2">
                <div className="gs-field">
                  <label className="gs-label">Color From</label>
                  <input className="gs-input" type="color" value={bg.gradFrom}
                    onChange={e => setBg('gradFrom', e.target.value)} style={{ height: 44, padding: 4 }} />
                </div>
                <div className="gs-field">
                  <label className="gs-label">Color To</label>
                  <input className="gs-input" type="color" value={bg.gradTo}
                    onChange={e => setBg('gradTo', e.target.value)} style={{ height: 44, padding: 4 }} />
                </div>
              </div>
            )}
            {bg.type === 'Solid Color' && (
              <div className="gs-field">
                <label className="gs-label">Background Color</label>
                <input className="gs-input" type="color" value={bg.solidColor}
                  onChange={e => setBg('solidColor', e.target.value)} style={{ height: 44, padding: 4 }} />
              </div>
            )}
          </div>
        </div>
        <ToggleRow label="Show School Logo on Login Page"
          desc="Display school logo over the background"
          checked={bg.showLogo} onChange={v => setBg('showLogo', v)} />
        <ToggleRow label="Show Tagline / Welcome Text"
          checked={bg.showTagline} onChange={v => setBg('showTagline', v)} />
        {bg.showTagline && (
          <div className="gs-field">
            <label className="gs-label">Welcome Text</label>
            <input className="gs-input" value={bg.tagline} placeholder="Welcome to our school portal"
              onChange={e => setBg('tagline', e.target.value)} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ⑩ Backend Theme */
const THEMES = [
  { key: 'light', label: 'Light', bg: '#f8f9fc', accent: '#3d5ee1' },
  { key: 'dark', label: 'Dark', bg: '#0f172a', accent: '#60a5fa' },
  { key: 'blue', label: 'Blue', bg: '#1e3a8a', accent: '#93c5fd' },
  { key: 'green', label: 'Green', bg: '#14532d', accent: '#86efac' },
];
const ACCENTS = ['#3d5ee1', '#7367f0', '#28c76f', '#ea5455', '#ff9f43', '#00bad1', '#e83e8c'];

const TabTheme = ({ theme, setTheme }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon purple">🎨</div>
      <div>
        <p className="gs-card-title">Backend Theme</p>
        <p className="gs-card-sub">Choose the admin panel appearance</p>
      </div>
    </div>
    <div className="gs-card-body">
      <Divider label="Theme Preset" />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {THEMES.map(t => (
          <button key={t.key} onClick={() => setTheme('preset', t.key)}
            style={{
              border: theme.preset === t.key ? '2px solid #3d5ee1' : '2px solid #e5e9f0',
              borderRadius: 12, padding: '14px 20px', background: t.bg, color: '#fff',
              cursor: 'pointer', transition: 'all .2s', minWidth: 90, fontWeight: 600,
              fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
            }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: t.accent, display: 'block' }} />
            {t.label}
          </button>
        ))}
      </div>

      <Divider label="Accent Color" />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {ACCENTS.map(c => (
          <button key={c} onClick={() => setTheme('accent', c)}
            style={{
              width: 36, height: 36, borderRadius: 50, background: c,
              border: theme.accent === c ? '3px solid #333' : '3px solid transparent',
              cursor: 'pointer', transition: 'transform .2s'
            }}
            title={c} />
        ))}
      </div>

      <Divider label="Layout" />
      <div className="gs-field">
        <label className="gs-label">Sidebar Style</label>
        <div className="gs-att-pills">
          {['Expanded', 'Collapsed', 'Mini'].map(s => (
            <button key={s} className={`gs-att-pill ${theme.sidebar === s ? 'active' : ''}`}
              onClick={() => setTheme('sidebar', s)}>{s}</button>
          ))}
        </div>
      </div>
      <ToggleRow label="Compact Mode" desc="Reduce padding and font size throughout the admin"
        checked={theme.compact} onChange={v => setTheme('compact', v)} />
      <ToggleRow label="RTL (Right-to-Left) Layout"
        checked={theme.rtl} onChange={v => setTheme('rtl', v)} />
      <ToggleRow label="Enable Custom Scrollbar Styling"
        checked={theme.customScroll} onChange={v => setTheme('customScroll', v)} />
    </div>
  </div>
);

/* ⑪ Mobile App */
const TabMobileApp = ({ app, setApp }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon teal">📱</div>
      <div>
        <p className="gs-card-title">Mobile App Settings</p>
        <p className="gs-card-sub">Configure parent/student mobile application</p>
      </div>
    </div>
    <div className="gs-card-body">
      <Divider label="App Identity" />
      <div className="gs-grid-2">
        <div className="gs-field">
          <label className="gs-label">App Name</label>
          <input className="gs-input" value={app.appName} placeholder="MySchool"
            onChange={e => setApp('appName', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">App Bundle ID</label>
          <input className="gs-input" value={app.bundleId} placeholder="com.school.myapp"
            onChange={e => setApp('bundleId', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">Google Play URL</label>
          <input className="gs-input" value={app.playUrl} placeholder="https://play.google.com/store/apps/..."
            onChange={e => setApp('playUrl', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">App Store URL</label>
          <input className="gs-input" value={app.storeUrl} placeholder="https://apps.apple.com/..."
            onChange={e => setApp('storeUrl', e.target.value)} />
        </div>
      </div>

      <Divider label="Push Notifications" />
      <div className="gs-field">
        <label className="gs-label">Firebase Server Key (FCM)</label>
        <input className="gs-input" type="password" value={app.fcmKey} placeholder="AAAAx…"
          onChange={e => setApp('fcmKey', e.target.value)} />
      </div>
      <div className="gs-field">
        <label className="gs-label">Firebase Sender ID</label>
        <input className="gs-input" value={app.fcmSenderId} placeholder="123456789"
          onChange={e => setApp('fcmSenderId', e.target.value)} />
      </div>
      <ToggleRow label="Enable Push Notifications"
        desc="Send push alerts to student/parent mobile app"
        checked={app.pushEnabled} onChange={v => setApp('pushEnabled', v)} />
      <ToggleRow label="Enable In-App Chat"
        checked={app.chatEnabled} onChange={v => setApp('chatEnabled', v)} />
      <ToggleRow label="Enable Biometric Login (Fingerprint / Face ID)"
        checked={app.biometric} onChange={v => setApp('biometric', v)} />
      <ToggleRow label="Force App Update on Version Mismatch"
        desc="Redirect users to store if app version is outdated"
        checked={app.forceUpdate} onChange={v => setApp('forceUpdate', v)} />

      <Divider label="App Download Banner" />
      <ToggleRow label="Show Download App Banner on Student Portal"
        checked={app.showBanner} onChange={v => setApp('showBanner', v)} />
    </div>
  </div>
);

/* ⑫ Google Drive Setting */
const TabGdrive = ({ gdrive, setGdrive }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon green">📂</div>
      <div>
        <p className="gs-card-title">Google Drive Setting</p>
        <p className="gs-card-sub">Store student documents and files on Google Drive</p>
      </div>
    </div>
    <div className="gs-card-body">
      <div style={{
        background: '#f0f4ff', borderRadius: 10, padding: '12px 16px',
        fontSize: 13, color: '#3d5ee1', marginBottom: 4
      }}>
        ℹ️ Create a project in <strong>Google Cloud Console</strong>, enable the Drive API,
        and paste the credentials below.
      </div>

      <div className="gs-field">
        <label className="gs-label">Client ID <span style={{ color: '#ea5455' }}>*</span></label>
        <input className="gs-input" value={gdrive.clientId}
          placeholder="xxxxxxxx-xxxx.apps.googleusercontent.com"
          onChange={e => setGdrive('clientId', e.target.value)} />
      </div>

      <div className="gs-field">
        <label className="gs-label">API Key <span style={{ color: '#ea5455' }}>*</span></label>
        <input className="gs-input" type="password" value={gdrive.apiKey}
          placeholder="AIzaSy…"
          onChange={e => setGdrive('apiKey', e.target.value)} />
      </div>

      <div className="gs-field">
        <label className="gs-label">Project Number / APP ID <span style={{ color: '#ea5455' }}>*</span></label>
        <input className="gs-input" value={gdrive.projectId}
          placeholder="987654321"
          onChange={e => setGdrive('projectId', e.target.value)} />
      </div>

      <ToggleRow label="Status — Enable Google Drive Integration"
        desc="When disabled, all uploads go to local server storage"
        checked={gdrive.enabled} onChange={v => setGdrive('enabled', v)} />

      <Divider label="Upload Permissions" />
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {['Student', 'Guardian', 'Staff'].map(role => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: '#555', minWidth: 72 }}>{role}</span>
            <Toggle
              checked={gdrive.roles?.[role] ?? true}
              onChange={v => setGdrive('roles', { ...gdrive.roles, [role]: v })}
            />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
        Allow students, parents and staff to upload student documents through Google Drive.
      </div>

      <Divider label="Folder Structure" />
      <div className="gs-field">
        <label className="gs-label">Root Folder Name</label>
        <input className="gs-input" value={gdrive.rootFolder} placeholder="SchoolDocs"
          onChange={e => setGdrive('rootFolder', e.target.value)} />
      </div>
      <ToggleRow label="Auto-create Year-wise Sub-folders"
        desc="Organise uploads into /2024-25/ClassName/ subfolders"
        checked={gdrive.autoFolders} onChange={v => setGdrive('autoFolders', v)} />
    </div>
  </div>
);

/* ⑬ WhatsApp Settings */
const TabWhatsApp = ({ wa, setWa }) => (
  <div className="gs-card">
    <div className="gs-card-head">
      <div className="gs-card-icon green" style={{ background: '#e6fff2' }}>💬</div>
      <div>
        <p className="gs-card-title">WhatsApp Settings</p>
        <p className="gs-card-sub">Configure official WhatsApp Business API integration</p>
      </div>
    </div>
    <div className="gs-card-body">
      <div className="gs-field">
        <label className="gs-label">Provider</label>
        <div className="gs-att-pills">
          {['Twilio', 'Gupshup', 'WATI', 'Meta (Official)', 'Custom'].map(p => (
            <button key={p} className={`gs-att-pill ${wa.provider === p ? 'active' : ''}`}
              onClick={() => setWa('provider', p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="gs-grid-2">
        <div className="gs-field">
          <label className="gs-label">API URL / Endpoint</label>
          <input className="gs-input" value={wa.apiUrl} placeholder="https://api.provider.com/v1"
            onChange={e => setWa('apiUrl', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">API Key / Access Token</label>
          <input className="gs-input" type="password" value={wa.apiKey}
            placeholder="Bearer ey…"
            onChange={e => setWa('apiKey', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">WhatsApp Business Number</label>
          <input className="gs-input" value={wa.number} placeholder="+91 98765 43210"
            onChange={e => setWa('number', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">Phone Number ID (Meta)</label>
          <input className="gs-input" value={wa.phoneId} placeholder="123456789012345"
            onChange={e => setWa('phoneId', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">Business Account ID</label>
          <input className="gs-input" value={wa.wabaId} placeholder="WABA ID"
            onChange={e => setWa('wabaId', e.target.value)} />
        </div>
        <div className="gs-field">
          <label className="gs-label">Webhook Verify Token</label>
          <input className="gs-input" type="password" value={wa.webhookToken}
            placeholder="your_verify_token"
            onChange={e => setWa('webhookToken', e.target.value)} />
        </div>
      </div>

      <Divider label="Delivery Options" />
      <ToggleRow label="Enable WhatsApp Messaging" desc="Send notifications via WhatsApp"
        checked={wa.enabled} onChange={v => setWa('enabled', v)} />
      <ToggleRow label="Send Delivery Reports"
        desc="Log message delivery and read status"
        checked={wa.deliveryReports} onChange={v => setWa('deliveryReports', v)} />
      <ToggleRow label="Allow Two-way Messaging (Incoming)"
        desc="Process incoming WhatsApp replies from parents/students"
        checked={wa.incoming} onChange={v => setWa('incoming', v)} />

      <Divider label="Test Connection" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="gs-field" style={{ flex: 1, minWidth: 200 }}>
          <label className="gs-label">Test Phone Number</label>
          <input className="gs-input" value={wa.testNumber} placeholder="+91 99999 00000"
            onChange={e => setWa('testNumber', e.target.value)} />
        </div>
        <button className="gs-btn-save"
          style={{ marginTop: 22, padding: '10px 20px', fontSize: 13 }}
          onClick={() => toast('Test WhatsApp sent to ' + (wa.testNumber || 'number not set'), 'info')}>
          📤 Send Test
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const TABS = [
  { key: 'general', label: '⚙️  General Setting' },
  { key: 'logo', label: '🖼️  Logo' },
  { key: 'loginbg', label: '🖌️  Login Page Background' },
  { key: 'theme', label: '🎨  Backend Theme' },
  { key: 'mobileapp', label: '📱  Mobile App' },
  { key: 'fees', label: '💰  Fees' },
  { key: 'idgen', label: '🪪  ID Auto Generation' },
  { key: 'attendance', label: '📅  Attendance Type' },
  { key: 'gdrive', label: '📂  Google Drive Setting' },
  { key: 'whatsapp', label: '💬  WhatsApp Settings' },
  { key: 'chat', label: '💬  Student / Guardian Panel' },
  { key: 'maintenance', label: '🔧  Maintenance' },
  { key: 'misc', label: '⚙️  Miscellaneous' },
];

export default function GeneralSetting() {
  const [activeTab, setActiveTab] = useState('general');

  /* Per-section state */
  const [general, setGeneralRaw] = useState({
    schoolName: 'Mount Carmel School', schoolCode: 'MCS001',
    phone: '+91 98765 43210', email: 'admin@mountcarmel.edu',
    website: 'https://mountcarmel.edu', board: 'CBSE',
    address: '123, MG Road, Begumpet', city: 'Hyderabad',
    state: 'Telangana', pin: '500003',
    timezone: 'Asia/Kolkata', currency: 'INR', language: 'en',
    dateFormat: 'DD/MM/YYYY', yearStart: 'April', weekStart: 'Monday',
  });

  const [logos, setLogosRaw] = useState({ print: '', admin: '', adminSmall: '', app: '' });

  const [loginBg, setLoginBgRaw] = useState({
    type: 'Image', preview: '', url: '', opacity: '30',
    gradFrom: '#3d5ee1', gradTo: '#7367f0', solidColor: '#3d5ee1',
    showLogo: true, showTagline: true, tagline: 'Welcome to School Portal',
  });

  const [theme, setThemeRaw] = useState({
    preset: 'light', accent: '#3d5ee1', sidebar: 'Expanded',
    compact: false, rtl: false, customScroll: true,
  });

  const [mobileApp, setMobileAppRaw] = useState({
    appName: 'MindWhile School', bundleId: 'com.mindwhile.school',
    playUrl: '', storeUrl: '', fcmKey: '', fcmSenderId: '',
    pushEnabled: true, chatEnabled: true, biometric: false,
    forceUpdate: false, showBanner: true,
  });

  const [gdrive, setGdriveRaw] = useState({
    clientId: '', apiKey: '', projectId: '',
    enabled: false, roles: { Student: true, Guardian: true, Staff: true },
    rootFolder: 'SchoolDocs', autoFolders: true,
  });

  const [wa, setWaRaw] = useState({
    provider: 'Meta (Official)', apiUrl: '', apiKey: '', number: '',
    phoneId: '', wabaId: '', webhookToken: '',
    enabled: false, deliveryReports: true, incoming: false, testNumber: '',
  });

  const [fees, setFeesRaw] = useState({
    onlinePayment: true, smsReceipt: true, emailReceipt: true,
    lateFine: true, finePerDay: '10', gracePeriod: '5',
    dueAlert: true, blockOnDue: false,
  });

  const [idData, setIdRaw] = useState({
    stuPrefix: 'STU', stuStart: '1001', stuSep: '/', stuYear: 'yes',
    empPrefix: 'EMP', empStart: '100', autoAssign: true,
  });

  const [att, setAttRaw] = useState({
    mode: 'Daily', halfDay: true, late: true, smsAlert: true,
    consecutiveAlert: true, threshold: '3', showPercentage: true,
    weekOff: ['Sun'],
  });

  const [chat, setChatRaw] = useState({
    studentDelete: true, guardianDelete: true, staffDelete: true,
    groupChat: false, attachments: true,
  });

  const [maint, setMaintRaw] = useState({
    enabled: false, message: '🔧 We\'re performing scheduled maintenance. We\'ll be back shortly!',
    eta: '', contact: 'tech@school.edu',
  });

  const [misc, setMiscRaw] = useState({
    onlyMyQ: false, scanType: 'Barcode', resultFrontSite: true,
    admitCardDownload: true, teacherRestricted: false, superadminVisible: true,
    eventReminder: true, leaveEmail: '', multiClass: false,
  });

  /* Generic setters */
  const mkSet = (setter) => (key, val) => setter(prev => ({ ...prev, [key]: val }));
  const setGeneral = mkSet(setGeneralRaw);
  const setLogo = (k, v) => setLogosRaw(p => ({ ...p, [k]: v }));
  const setLoginBg = mkSet(setLoginBgRaw);
  const setTheme = mkSet(setThemeRaw);
  const setMobileApp = mkSet(setMobileAppRaw);
  const setGdrive = mkSet(setGdriveRaw);
  const setWa = mkSet(setWaRaw);
  const setFee = mkSet(setFeesRaw);
  const setId = mkSet(setIdRaw);
  const setAtt = mkSet(setAttRaw);
  const setChat = mkSet(setChatRaw);
  const setMaint = mkSet(setMaintRaw);
  const setMisc = mkSet(setMiscRaw);

  const handleSave = () => {
    toast(`"${TABS.find(t => t.key === activeTab)?.label.replace(/^.{2}\s*/, '')}" settings saved successfully!`);
  };

  return (
    <>
      {/* Page Header */}
      <div className="gs-page-header">
        <div>
          <h4 className="gs-page-title">⚙️ General Settings</h4>
          <nav className="gs-breadcrumb">
            <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
            <span className="gs-breadcrumb-current">System Settings</span>
          </nav>
        </div>
      </div>

      <div className="gs-page">
        {/* ── Left Nav ── */}
        <nav className="gs-nav">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`gs-nav-item ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <div className="gs-content">
          {activeTab === 'general' && <TabGeneral data={general} set={setGeneral} />}
          {activeTab === 'logo' && <TabLogo logos={logos} setLogo={setLogo} />}
          {activeTab === 'loginbg' && <TabLoginBg bg={loginBg} setBg={setLoginBg} />}
          {activeTab === 'theme' && <TabTheme theme={theme} setTheme={setTheme} />}
          {activeTab === 'mobileapp' && <TabMobileApp app={mobileApp} setApp={setMobileApp} />}
          {activeTab === 'fees' && <TabFees fees={fees} setFee={setFee} />}
          {activeTab === 'idgen' && <TabIDGen id={idData} setId={setId} />}
          {activeTab === 'attendance' && <TabAttendance att={att} setAtt={setAtt} />}
          {activeTab === 'gdrive' && <TabGdrive gdrive={gdrive} setGdrive={setGdrive} />}
          {activeTab === 'whatsapp' && <TabWhatsApp wa={wa} setWa={setWa} />}
          {activeTab === 'chat' && <TabChat chat={chat} setChat={setChat} />}
          {activeTab === 'maintenance' && <TabMaintenance maint={maint} setMaint={setMaint} />}
          {activeTab === 'misc' && <TabMisc misc={misc} setMisc={setMisc} />}

          {/* Save Footer */}
          <div className="gs-footer">
            <button className="gs-btn-cancel">Cancel</button>
            <button className="gs-btn-save" onClick={handleSave}>💾 Save Changes</button>
          </div>
        </div>
      </div>
    </>
  );
}
