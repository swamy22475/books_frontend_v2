import React from 'react';

const AdmissionForm = ({ formData, classes, handleChange, handleMultiSelect, handleRemoveChip, errorsState }) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h5>Admission Form</h5>
        <span className="section-description">Enter admission details and academic information</span>
      </div>

      <div className="form-grid-two-col">
        <div className="form-group">
          <label>Admission No</label>
          <input type="text" name="admissionNo" value={formData.admissionNo} onChange={handleChange} placeholder="e.g., ADM-2025-001" className="form-input" />
        </div>

        <div className="form-group">
          <label>Admission Date</label>
          <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>PEN Number</label>
          <input type="text" name="penNumber" value={formData.penNumber} onChange={handleChange} placeholder="Permanent Education Number" className="form-input" />
        </div>

        <div className="form-group">
          <label>Child ID</label>
          <input type="text" name="childId" value={formData.childId} onChange={handleChange} placeholder="Unique Child ID" className="form-input" />
        </div>

        <div className="form-group">
          <label>Medium</label>
          <select name="medium" value={formData.medium} onChange={handleChange} className="form-input">
            <option value="">Select Medium</option>
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>

        <div className="form-group">
          <label>RF ID</label>
          <input type="text" name="rfId" value={formData.rfId} onChange={handleChange} placeholder="RF ID Card No" className="form-input" />
        </div>

        <div className={"form-group required " + (errorsState.class ? 'has-error' : '')}>
          <label>Class *</label>
          <select name="class" value={formData.class} onChange={handleChange} className="form-input">
            <option value="">Select Class</option>
            {classes?.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          {errorsState.class && <div className="error-text">{errorsState.class}</div>}
        </div>

        <div className={"form-group required " + (errorsState.section ? 'has-error' : '')}>
          <label>Section *</label>
          <select name="section" value={formData.section} onChange={handleChange} className="form-input">
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          {errorsState.section && <div className="error-text">{errorsState.section}</div>}
        </div>

        <div className={"form-group required " + (errorsState.rollNo ? 'has-error' : '')}>
          <label>Roll No *</label>
          <input type="number" name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Class Roll Number" className="form-input" />
          {errorsState.rollNo && <div className="error-text">{errorsState.rollNo}</div>}
        </div>

        <div className={"form-group required " + (errorsState.joinedClass ? 'has-error' : '')}>
          <label>Joined Class *</label>
          <select name="joinedClass" value={formData.joinedClass} onChange={handleChange} className="form-input">
            <option value="">Select Class</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
          </select>
          {errorsState.joinedClass && <div className="error-text">{errorsState.joinedClass}</div>}
        </div>

        <div className="form-group">
          <label>Group</label>
          <select name="group" value={formData.group} onChange={handleChange} className="form-input">
            <option value="">Select Group</option>
            <option value="arts">Arts</option>
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mother Tongue</label>
          <select name="motherTongue" value={formData.motherTongue} onChange={handleChange} className="form-input">
            <option value="">Select Mother Tongue</option>
            <option value="telugu">Telugu</option>
            <option value="hindi">Hindi</option>
            <option value="urdu">Urdu</option>
          </select>
        </div>

        <div className="form-group-full">
          <label>Remarks</label>
          <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Any additional notes about the student" className="form-input form-textarea" rows="2" />
        </div>

        <div className="form-group">
          <label>Optional Subject</label>
          <input type="text" className="form-input" disabled placeholder="Field is disabled - no input allowed" />
        </div>

        <div className="form-group-full toggle-group">
          <label className="toggle-label">
            <input type="checkbox" name="addAdmissionFee" checked={formData.addAdmissionFee} onChange={handleChange} className="toggle-input" />
            <span className="toggle-slider"></span>
            <span className="toggle-text">Add Admission Fee to Invoice</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
