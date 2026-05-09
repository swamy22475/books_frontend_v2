import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import { AcademicsContext } from '../../../context/AcademicsContext';
import './BehaviorRecords.css';
import StudentPageContainer from './components/StudentPageContainer';

const AddBehaviorRecordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { students, staff, addBehaviorRecord, behaviorRecords } = useContext(StudentContext);
  const { classes, sections } = useContext(AcademicsContext);
  const search = new URLSearchParams(location.search);
  const editId = search.get('edit');

  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], classId: '', sectionId: '', studentId: '', reportedBy: '', type: '', title: '', description: '', actionTaken: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editId) {
      const existing = behaviorRecords.find(b => b.id === editId);
      if (existing) {
        const classObj = classes.find(c => String(c.id) === String(existing.classId)) || classes.find(c => c.name === existing.className) || {};
        const sectionObj = sections.find(s => String(s.id) === String(existing.sectionId)) || sections.find(s => s.name === existing.section) || {};
        const studentObj = students.find(s => s.id === existing.studentId) || {};
        setForm({ date: existing.date || '', classId: classObj.id || '', sectionId: sectionObj.id || '', studentId: studentObj.id || existing.studentId || '', reportedBy: existing.reportedBy || '', type: existing.type || '', title: existing.title || '', description: existing.description || '', actionTaken: existing.actionTaken || '' });
      }
    }
  }, [editId, behaviorRecords]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.date) err.date = 'Required';
    if (!form.classId) err.classId = 'Required';
    if (!form.sectionId) err.sectionId = 'Required';
    if (!form.studentId) err.studentId = 'Required';
    if (!form.reportedBy) err.reportedBy = 'Required';
    if (!form.type) err.type = 'Required';
    if (!form.title) err.title = 'Required';
    if (!form.description) err.description = 'Required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    setSubmitting(true);
    // compose record: resolve names from ids
    const classObj = classes.find(c => String(c.id) === String(form.classId)) || {};
    const sectionObj = sections.find(s => String(s.id) === String(form.sectionId)) || {};
    const studentObj = students.find(s => s.id === form.studentId) || {};

    const payload = {
      ...form,
      className: classObj.name || '',
      section: sectionObj.name || '',
      studentName: studentObj.name || '',
      studentId: studentObj.id || form.studentId
    };

    setTimeout(() => {
      addBehaviorRecord(payload);
      setSubmitting(false);
      setSaved(true);
      setTimeout(() => navigate('/school/behavior-records'), 900);
    }, 900);
  };

  return (
    <StudentPageContainer
      title="Add Behavior Record"
      breadcrumb={<><span>Dashboard</span> &gt; <span>Students</span> &gt; <span>Behavior Records</span> &gt; <span className="current">Add</span></>}
      backTitle="Go back"
      pageClass="behavior-page animate-fade"
    >
      <form className="card soft-card form-card" onSubmit={handleSubmit}>
        <div className="form-grid-two-col">
          <div className="form-group">
            <label>Class *</label>
            <select name="classId" value={form.classId} onChange={handleChange} className={errors.classId ? 'form-input error' : 'form-input'}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.classId && <div className="error-text">{errors.classId}</div>}
          </div>

          <div className="form-group">
            <label>Section *</label>
            <select name="sectionId" value={form.sectionId} onChange={handleChange} className={errors.sectionId ? 'form-input error' : 'form-input'}>
              <option value="">Select Section</option>
              {sections.filter(s => ['A', 'B', 'C'].includes(s.name)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.sectionId && <div className="error-text">{errors.sectionId}</div>}
          </div>

          <div className="form-group">
            <label>Student *</label>
            <select name="studentId" value={form.studentId} onChange={handleChange} className={errors.studentId ? 'form-input error' : 'form-input'}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} {s.id}</option>)}
            </select>
            {errors.studentId && <div className="error-text">{errors.studentId}</div>}
          </div>

          <div className="form-group">
            <label>Record Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className={errors.date ? 'form-input error' : 'form-input'} />
            {errors.date && <div className="error-text">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label>Reported By *</label>
            <select name="reportedBy" value={form.reportedBy} onChange={handleChange} className={errors.reportedBy ? 'form-input error' : 'form-input'}>
              <option value="">Select Staff</option>
              {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            {errors.reportedBy && <div className="error-text">{errors.reportedBy}</div>}
          </div>

          <div className="form-group">
            <label>Incident Type *</label>
            <div className="radio-group">
              <label className={"radio-label " + (form.type === 'Positive' ? 'active' : '')}>
                <input type="radio" name="type" value="Positive" checked={form.type === 'Positive'} onChange={handleChange} />
                <span>Positive / Achievement</span>
              </label>
              <label className={"radio-label " + (form.type === 'Negative' ? 'active' : '')}>
                <input type="radio" name="type" value="Negative" checked={form.type === 'Negative'} onChange={handleChange} />
                <span>Negative / Misconduct</span>
              </label>
            </div>
            {errors.type && <div className="error-text">{errors.type}</div>}
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input type="text" name="title" placeholder="e.g., Helped a classmate, Disruptive in class" value={form.title} onChange={handleChange} className={errors.title ? 'form-input error' : 'form-input'} />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>

          <div className="form-group-full">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} className={errors.description ? 'form-input form-textarea error' : 'form-input form-textarea'} rows={5} />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          <div className="form-group-full">
            <label>Action Taken (Optional)</label>
            <textarea name="actionTaken" value={form.actionTaken} onChange={handleChange} className="form-input form-textarea" rows={3} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/school/behavior-records')}>Cancel</button>
          <button type="submit" className={"btn btn-primary " + (submitting ? 'btn-loading' : '')} disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Record'}
          </button>
        </div>
        {saved && <div className="snackbar success">Record saved successfully</div>}
      </form>
    </StudentPageContainer>
  );
};

export default AddBehaviorRecordPage;
