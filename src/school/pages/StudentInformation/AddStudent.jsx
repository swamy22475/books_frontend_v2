import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import { AcademicsContext } from '../../../context/AcademicsContext';
import StudentAddress from './sections/StudentAddress';
import ReferenceDetails from './sections/ReferenceDetails';
import StudentPageContainer from './components/StudentPageContainer';
import './AddStudent.css';

const AddStudent = () => {
    const navigate = useNavigate();
    const { addStudent } = useContext(StudentContext);
    const { classes } = useContext(AcademicsContext);

    // Initial Form State
    const [formData, setFormData] = useState({
        // Admission
        admissionNo: '',
        admissionDate: new Date().toISOString().split('T')[0],
        penNumber: '',
        childId: '',
        medium: 'english',
        rfId: '',
        class: '',
        section: '',
        rollNo: '',
        joinedClass: '',
        group: '',
        remarks: '',
        motherTongue: '',
        addAdmissionFee: false,

        // Student Details
        firstName: '',
        lastName: '',
        idCardName: '',
        gender: '',
        bloodGroup: '',
        dob: '',
        religion: '',
        caste: '',
        subCaste: '',
        fatherName: '',
        fatherAadhaar: '',
        motherName: '',
        motherAadhaar: '',
        phone: '',
        alternatePhone: '',
        alternatePhone2: '',
        email: '',
        mole1: '',
        mole2: '',
        photo: null,
        photoPreview: null,

        // Address
        address: '',
        village: '',
        state: 'Andhra Pradesh',
        country: 'India',
        aadhaarCardNumber: '',
        rationCardNumber: '',
        accountNo: '',
        bankName: '',
        ifscCode: '',
        branchName: '',
        studentType: '',

        // Reference
        referredBy: '',
        // Reference / Guardian (extracted)
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        referenceContact: '',
        referenceAddress: '',
        localGuardian: ''
    });

    const [loading, setLoading] = useState(true);
    const [errorsState, setErrorsState] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    photo: file,
                    photoPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMultiSelect = (name, value) => {
        setFormData(prev => {
            const current = prev[name] || [];
            if (current.includes(value)) {
                return { ...prev, [name]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [name]: [...current, value] };
            }
        });
    };

    const handleRemoveChip = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: (prev[name] || []).filter(v => v !== value) }));
    };

    const handleSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        // client-side validation for required fields
        const errs = {};
        if (!formData.class) errs.class = 'Class is required';
        if (!formData.section) errs.section = 'Section is required';
        if (!formData.rollNo) errs.rollNo = 'Roll number is required';
        if (!formData.joinedClass) errs.joinedClass = 'Joined Class is required';
        if (!formData.fatherName) errs.fatherName = 'Father name is required';
        if (!formData.phone) errs.phone = 'Phone is required';

        setErrorsState(errs);
        if (Object.keys(errs).length > 0) {
            window.scrollTo({ top: 160, behavior: 'smooth' });
            return;
        }

        setSubmitting(true);
        // simulate server save
        setTimeout(() => {
            const studentPayload = {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                id: `STU${Math.floor(Math.random() * 100000)}`
            };
            addStudent(studentPayload);
            setSubmitting(false);
            setSaved(true);
            setTimeout(() => navigate('/school/student-list'), 1100);
        }, 1000);
    };

    return (
        <StudentPageContainer
            title="Add Student"
            breadcrumb={<><span>Student List</span> / <span className="current">Add Student</span></>}
            backTitle="Go back to Student List"
            showDashboard={true}
            pageClass="add-student-page"
        >

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="add-student-form">

                {/* SECTION 1: ADMISSION FORM */}
                <div className="form-section">
                    <div className="section-header">
                        <h5>Admission Form</h5>
                        <span className="section-description">Enter admission details and academic information</span>
                    </div>

                    <div className="form-grid-two-col">
                        <div className="form-group">
                            <label>Admission No</label>
                            <input
                                type="text"
                                name="admissionNo"
                                value={formData.admissionNo}
                                onChange={handleChange}
                                placeholder="e.g., ADM-2025-001"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Admission Date</label>
                            <input
                                type="date"
                                name="admissionDate"
                                value={formData.admissionDate}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>PEN Number</label>
                            <input
                                type="text"
                                name="penNumber"
                                value={formData.penNumber}
                                onChange={handleChange}
                                placeholder="Permanent Education Number"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Child ID</label>
                            <input
                                type="text"
                                name="childId"
                                value={formData.childId}
                                onChange={handleChange}
                                placeholder="Unique Child ID"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Medium</label>
                            <select
                                name="medium"
                                value={formData.medium}
                                onChange={handleChange}
                                className="form-input"
                            >

                                <option value="english">English</option>
                                <option value="telugu">Telugu</option>
                                <option value="hindi">Hindi</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>RF ID</label>
                            <input
                                type="text"
                                name="rfId"
                                value={formData.rfId}
                                onChange={handleChange}
                                placeholder="RF ID Card No"
                                className="form-input"
                            />
                        </div>

                        <div className={"form-group required " + (errorsState.class ? 'has-error' : '')}>
                            <label>Class <span className="label-required">*</span></label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Class</option>
                                {classes?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errorsState.class && <div className="error-text">{errorsState.class}</div>}
                        </div>

                        <div className={"form-group required " + (errorsState.section ? 'has-error' : '')}>
                            <label>Section <span className="label-required">*</span></label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Section</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                            {errorsState.section && <div className="error-text">{errorsState.section}</div>}
                        </div>

                        <div className={"form-group required " + (errorsState.rollNo ? 'has-error' : '')}>
                            <label>Roll No <span className="label-required">*</span></label>
                            <input
                                type="number"
                                name="rollNo"
                                value={formData.rollNo}
                                onChange={handleChange}
                                placeholder="Class Roll Number"
                                className="form-input"
                            />
                            {errorsState.rollNo && <div className="error-text">{errorsState.rollNo}</div>}
                        </div>

                        <div className={"form-group required " + (errorsState.joinedClass ? 'has-error' : '')}>
                            <label>Joined Class <span className="label-required">*</span></label>
                            <select
                                name="joinedClass"
                                value={formData.joinedClass}
                                onChange={handleChange}
                                className="form-input"
                            >
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
                            <select
                                name="group"
                                value={formData.group}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Group</option>
                                <option value="arts">Arts</option>
                                <option value="science">Science</option>
                                <option value="commerce">Commerce</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mother Tongue</label>
                            <select
                                name="motherTongue"
                                value={formData.motherTongue}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Mother Tongue</option>
                                <option value="telugu">Telugu</option>
                                <option value="hindi">Hindi</option>
                                <option value="urdu">Urdu</option>
                            </select>
                        </div>

                        <div className="form-group-full">
                            <label>Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Any additional notes about the student"
                                className="form-input form-textarea"
                                rows="2"
                            />
                        </div>

                        <div className="form-group">
                            <label>Optional Subject</label>
                            <input
                                type="text"
                                className="form-input"
                                disabled
                                placeholder="Field is disabled - no input allowed"
                            />
                        </div>

                        <div className="form-group-full toggle-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    name="addAdmissionFee"
                                    checked={formData.addAdmissionFee}
                                    onChange={handleChange}
                                    className="toggle-input"
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-text">Add Admission Fee to Invoice</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: STUDENT DETAILS */}
                <div className="form-section">
                    <div className="section-header">
                        <h5>Student Personal Details</h5>
                        <span className="section-description">Personal information about the student</span>
                    </div>

                    <div className="form-grid-two-col">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>ID Card Name</label>
                            <input
                                type="text"
                                name="idCardName"
                                value={formData.idCardName}
                                onChange={handleChange}
                                placeholder="Name as per ID card"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="form-input"
                            >
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
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Religion</label>
                            <input
                                type="text"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                placeholder="Enter religion"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Caste</label>
                            <select
                                name="caste"
                                value={formData.caste}
                                onChange={handleChange}
                                className="form-input"
                            >
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
                            <input
                                type="text"
                                name="subCaste"
                                value={formData.subCaste}
                                onChange={handleChange}
                                placeholder="Enter sub caste"
                                className="form-input"
                            />
                        </div>

                        <div className={"form-group required " + (errorsState.fatherName ? 'has-error' : '')}>
                            <label>Father Name <span className="label-required">*</span></label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                placeholder="Enter father's name"
                                className="form-input"
                            />
                            {errorsState.fatherName && <div className="error-text">{errorsState.fatherName}</div>}
                        </div>

                        <div className="form-group">
                            <label>Father Aadhaar</label>
                            <input
                                type="text"
                                name="fatherAadhaar"
                                value={formData.fatherAadhaar}
                                onChange={handleChange}
                                placeholder="Enter father's Aadhaar number"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mother Name</label>
                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                placeholder="Enter mother's name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mother Aadhaar</label>
                            <input
                                type="text"
                                name="motherAadhaar"
                                value={formData.motherAadhaar}
                                onChange={handleChange}
                                placeholder="Enter mother's Aadhaar number"
                                className="form-input"
                            />
                        </div>

                        <div className={"form-group required " + (errorsState.phone ? 'has-error' : '')}>
                            <label>Phone <span className="label-required">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter 10-digit phone number"
                                className="form-input"
                            />
                            {errorsState.phone && <div className="error-text">{errorsState.phone}</div>}
                        </div>

                        <div className="form-group">
                            <label>WhatsApp Number</label>
                            <input
                                type="tel"
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleChange}
                                placeholder="Enter WhatsApp number"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Alternate Phone Number</label>
                            <input
                                type="tel"
                                name="alternatePhone2"
                                value={formData.alternatePhone2}
                                onChange={handleChange}
                                placeholder="Enter second alternate phone"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mole 1 (Distinguish Mark)</label>
                            <input
                                type="text"
                                name="mole1"
                                value={formData.mole1}
                                onChange={handleChange}
                                placeholder="First distinguish mark"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mole 2 (Distinguish Mark)</label>
                            <input
                                type="text"
                                name="mole2"
                                value={formData.mole2}
                                onChange={handleChange}
                                placeholder="Second distinguish mark"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group-full">
                            <label>Student Photo</label>
                            <div className="file-upload-container">
                                <input
                                    type="file"
                                    id="photo-upload"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="file-input"
                                />
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
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, photo: null, photoPreview: null }))}
                                            className="preview-remove"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: ADDRESS & BANK DETAILS (Component) */}
                <StudentAddress formData={formData} handleChange={handleChange} />

                {/* SECTION 4: REFERENCE DETAILS (Component) */}
                <ReferenceDetails formData={formData} handleChange={handleChange} />

                {/* FOOTER NOTE */}
                <div className="footer-note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span><strong>Note:</strong> Create teacher, class, section before creating a new student.</span>
                </div>
            </form>

            {/* STICKY ACTION BAR */}
            <div className="action-bar-sticky">
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className={"btn btn-primary btn-large " + (submitting ? 'btn-loading' : '')}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        'Saving...'
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Student
                        </>
                    )}
                </button>
            </div>
            {saved && <div className="success-badge">Saved ✓</div>}
        </StudentPageContainer>
    );
};

export default AddStudent;
