import React from 'react';

const ReferenceDetails = ({ formData, handleChange }) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h5>Reference Details</h5>
        <span className="section-description">Reference information</span>
      </div>

      <div className="form-grid-two-col">
        <div className="form-group">
          <label>Reference Name</label>
          <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Enter reference name" className="form-input" />
        </div>

        <div className="form-group">
          <label>Reference Contact</label>
          <input type="text" name="referenceContact" value={formData.referenceContact} onChange={handleChange} placeholder="Reference phone or email" className="form-input" />
        </div>

        <div className="form-group-full">
          <label>Reference Address</label>
          <input type="text" name="referenceAddress" value={formData.referenceAddress} onChange={handleChange} placeholder="Reference address" className="form-input" />
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetails;
