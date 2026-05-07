import React from 'react';

const StudentAddress = ({ formData, handleChange }) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h5>Address & Banking Information</h5>
        <span className="section-description">Residential and bank account details</span>
      </div>

      <div className="form-grid-two-col">
        <div className="form-group-full">
          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter complete residential address" className="form-input form-textarea" rows="2" />
        </div>

        <div className="form-group">
          <label>Village</label>
          <select name="village" value={formData.village} onChange={handleChange} className="form-input">
            <option value="">Select Village</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="secunderabad">Secunderabad</option>
            <option value="vijayawada">Vijayawada</option>
            <option value="visakhapatnam">Visakhapatnam</option>
            <option value="tirupati">Tirupati</option>
            <option value="warangal">Warangal</option>
            <option value="nellore">Nellore</option>
            <option value="kadapa">Kadapa</option>
          </select>
        </div>

        <div className="form-group">
          <label>State</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="form-input" />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="form-input" />
        </div>

        <div className="form-group">
          <label>Aadhaar Card Number</label>
          <input type="text" name="aadhaarCardNumber" value={formData.aadhaarCardNumber} onChange={handleChange} placeholder="Enter Aadhaar number" className="form-input" />
        </div>

        <div className="form-group">
          <label>Ration Card Number</label>
          <input type="text" name="rationCardNumber" value={formData.rationCardNumber} onChange={handleChange} placeholder="Enter Ration card number" className="form-input" />
        </div>

        <div className="form-group">
          <label>Bank Account No</label>
          <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Enter bank account number" className="form-input" />
        </div>

        <div className="form-group">
          <label>Bank Name</label>
          <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Enter bank name" className="form-input" />
        </div>

        <div className="form-group">
          <label>IFSC Code</label>
          <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="Enter IFSC code" className="form-input" />
        </div>

        <div className="form-group">
          <label>Branch Name</label>
          <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="Enter branch name" className="form-input" />
        </div>

        <div className="form-group">
          <label>Student Type</label>
          <select name="studentType" value={formData.studentType} onChange={handleChange} className="form-input">
            <option value="">Select Student Type</option>
            <option value="day-scholar">Day Scholar</option>
            <option value="hosteller">Hosteller</option>
            <option value="transport">Transport</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentAddress;
