import React from 'react';

const StudentDetails = ({ formData, handleChange, handlePhotoChange, errorsState }) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h5>Student Personal Details</h5>
        <span className="section-description">Personal information about the student</span>
      </div>

      <div className="form-grid-two-col">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" className="form-input" />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" className="form-input" />
        </div>

        <div className="form-group">
          <label>ID Card Name</label>
          <input type="text" name="idCardName" value={formData.idCardName} onChange={handleChange} placeholder="Name as per ID card" className="form-input" />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <div className="radio-group">
            <label className="radio-label"><input type="radio" name="gender" value="male" checked={formData.gender==='male'} onChange={handleChange} className="radio-input"/> <span>Male</span></label>
            <label className="radio-label"><input type="radio" name="gender" value="female" checked={formData.gender==='female'} onChange={handleChange} className="radio-input"/> <span>Female</span></label>
          </div>
        </div>

        <div className="form-group">
          <label>Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-input">
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>Religion</label>
          <input type="text" name="religion" value={formData.religion} onChange={handleChange} placeholder="Enter religion" className="form-input" />
        </div>

        <div className="form-group">
          <label>Caste</label>
          <select name="caste" value={formData.caste} onChange={handleChange} className="form-input">
            <option value="">Select Caste</option>
            <option value="OC">OC</option>
            <option value="BC-A">BC-A</option>
            <option value="BC-B">BC-B</option>
            <option value="BC-C">BC-C</option>
            <option value="BC-D">BC-D</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>

        <div className="form-group">
          <label>Sub Caste</label>
          <input type="text" name="subCaste" value={formData.subCaste} onChange={handleChange} placeholder="Enter sub caste" className="form-input" />
        </div>

        <div className={"form-group required " + (errorsState.fatherName ? 'has-error' : '')}>
          <label>Father Name *</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" className="form-input" />
          {errorsState.fatherName && <div className="error-text">{errorsState.fatherName}</div>}
        </div>

        <div className={"form-group required " + (errorsState.fatherAadhaar ? 'has-error' : '')}>
          <label>Father Aadhaar *</label>
          <input type="text" name="fatherAadhaar" value={formData.fatherAadhaar} onChange={handleChange} placeholder="Enter father's Aadhaar number" className="form-input" />
          {errorsState.fatherAadhaar && <div className="error-text">{errorsState.fatherAadhaar}</div>}
        </div>

        <div className={"form-group required " + (errorsState.motherName ? 'has-error' : '')}>
          <label>Mother Name *</label>
          <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother's name" className="form-input" />
          {errorsState.motherName && <div className="error-text">{errorsState.motherName}</div>}
        </div>

        <div className={"form-group required " + (errorsState.motherAadhaar ? 'has-error' : '')}>
          <label>Mother Aadhaar *</label>
          <input type="text" name="motherAadhaar" value={formData.motherAadhaar} onChange={handleChange} placeholder="Enter mother's Aadhaar number" className="form-input" />
          {errorsState.motherAadhaar && <div className="error-text">{errorsState.motherAadhaar}</div>}
        </div>

        <div className={"form-group required " + (errorsState.phone ? 'has-error' : '')}>
          <label>Phone *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter 10-digit phone number" className="form-input" />
          {errorsState.phone && <div className="error-text">{errorsState.phone}</div>}
        </div>

        <div className="form-group">
          <label>Alternate Phone</label>
          <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} placeholder="Enter alternate phone" className="form-input" />
        </div>

        <div className="form-group">
          <label>Alternate Phone 2</label>
          <input type="tel" name="alternatePhone2" value={formData.alternatePhone2} onChange={handleChange} placeholder="Enter second alternate phone" className="form-input" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="form-input" />
        </div>

        <div className="form-group">
          <label>Mole 1 (Distinguish Mark)</label>
          <input type="text" name="mole1" value={formData.mole1} onChange={handleChange} placeholder="First distinguish mark" className="form-input" />
        </div>

        <div className="form-group">
          <label>Mole 2 (Distinguish Mark)</label>
          <input type="text" name="mole2" value={formData.mole2} onChange={handleChange} placeholder="Second distinguish mark" className="form-input" />
        </div>

        <div className="form-group-full">
          <label>Student Photo</label>
          <div className="file-upload-container">
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="file-input" />
            <label htmlFor="photo-upload" className="file-upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Click to upload photo or drag and drop</span>
            </label>
            {formData.photoPreview && (
              <div className="photo-preview">
                <img src={formData.photoPreview} alt="Photo Preview" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
