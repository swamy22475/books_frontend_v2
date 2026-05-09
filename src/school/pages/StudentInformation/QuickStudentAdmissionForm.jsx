import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import { AcademicsContext } from '../../../context/AcademicsContext';
import StudentPageContainer from './components/StudentPageContainer';
import './QuickStudentAdmissionForm.css';

const QuickStudentAdmissionForm = () => {
    const navigate = useNavigate();
    const { id: editId } = useParams();
    const { addQuickAdmissionStudent, updateQuickAdmissionStudent, quickAdmissionStudents } = useContext(StudentContext);
    const { classes } = useContext(AcademicsContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        fatherName: '',
        dob: '',
        gender: '',
        joinedClass: '',
        class: '',
        section: '',
        rollNo: '',
        photo: null,
        photoPreview: null,
    });

    const [errorsState, setErrorsState] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // If editing, load the student data
        if (editId) {
            const student = quickAdmissionStudents.find(s => s.id === editId);
            if (student) {
                setTimeout(() => {
                    setFormData({
                        firstName: student.firstName || '',
                        lastName: student.lastName || '',
                        phone: student.phone || '',
                        fatherName: student.fatherName || '',
                        dob: student.dob || '',
                        gender: student.gender || '',
                        joinedClass: student.joinedClass || '',
                        class: student.class || '',
                        section: student.section || '',
                        rollNo: student.rollNo || '',
                        photo: student.photo || null,
                        photoPreview: student.photoPreview || null,
                    });
                }, 0);
            }
        }
    }, [editId, quickAdmissionStudents]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errorsState[name]) {
            setErrorsState(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
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

    const handleRemovePhoto = () => {
        setFormData(prev => ({
            ...prev,
            photo: null,
            photoPreview: null
        }));
    };

    const handleSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Validation for all required fields
        const errs = {};
        if (!formData.firstName?.trim()) errs.firstName = 'First Name is required';
        if (!formData.lastName?.trim()) errs.lastName = 'Last Name is required';
        if (!formData.phone?.trim()) errs.phone = 'Phone is required';
        if (!formData.fatherName?.trim()) errs.fatherName = 'Father Name is required';
        if (!formData.dob) errs.dob = 'Date of Birth is required';
        if (!formData.gender) errs.gender = 'Gender is required';
        if (!formData.joinedClass) errs.joinedClass = 'Joined Class is required';
        if (!formData.class) errs.class = 'Class is required';
        if (!formData.section) errs.section = 'Section is required';
        if (!formData.rollNo) errs.rollNo = 'Roll No is required';

        setErrorsState(errs);
        if (Object.keys(errs).length > 0) {
            window.scrollTo({ top: 160, behavior: 'smooth' });
            return;
        }

        setSubmitting(true);
        // Simulate server save
        setTimeout(() => {
            const payload = {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                id: editId || `QA${Math.floor(Math.random() * 100000)}`,
                isQuickAdmission: true
            };

            if (editId) {
                updateQuickAdmissionStudent(editId, payload);
            } else {
                addQuickAdmissionStudent(payload);
            }

            setSubmitting(false);
            setSaved(true);
            setTimeout(() => navigate('/school/quick-admission'), 1100);
        }, 1000);
    };

    return (
        <StudentPageContainer
            title={editId ? 'Edit Student' : 'Add Student'}
            breadcrumb={<><span>Quick Admission</span> / <span className="current">{editId ? 'Edit' : 'Add'}</span></>}
            backTitle="Go back to Quick Admission"
            pageClass="qa-form-page"
        >

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="qa-form">

                {/* QUICK ADMISSION FORM */}
                <div className="form-section">
                    <div className="section-header">
                        <h5>Student Information</h5>
                        <span className="section-description">Enter basic student details</span>
                    </div>

                    {/* Photo Upload Section */}
                    <div className="form-group-full qa-photo-section">
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
                                <div className="photo-preview-compact">
                                    <img src={formData.photoPreview} alt="Photo Preview" />
                                    <button
                                        type="button"
                                        onClick={handleRemovePhoto}
                                        className="preview-remove"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Grid - 3 columns */}
                    <div className="form-grid-three-col">
                        {/* Row 1: First Name, Last Name, Phone */}
                        <div className={"form-group " + (errorsState.firstName ? 'has-error' : '')}>
                            <label>First Name <span className="label-required">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="form-input"
                            />
                            {errorsState.firstName && <div className="error-text">{errorsState.firstName}</div>}
                        </div>

                        <div className={"form-group " + (errorsState.lastName ? 'has-error' : '')}>
                            <label>Last Name <span className="label-required">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="form-input"
                            />
                            {errorsState.lastName && <div className="error-text">{errorsState.lastName}</div>}
                        </div>

                        <div className={"form-group " + (errorsState.phone ? 'has-error' : '')}>
                            <label>Phone <span className="label-required">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="10-digit phone"
                                className="form-input"
                            />
                            {errorsState.phone && <div className="error-text">{errorsState.phone}</div>}
                        </div>

                        {/* Row 2: Father Name, DOB, Gender */}
                        <div className={"form-group " + (errorsState.fatherName ? 'has-error' : '')}>
                            <label>Father Name <span className="label-required">*</span></label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                placeholder="Father's name"
                                className="form-input"
                            />
                            {errorsState.fatherName && <div className="error-text">{errorsState.fatherName}</div>}
                        </div>

                        <div className={"form-group " + (errorsState.dob ? 'has-error' : '')}>
                            <label>Date of Birth <span className="label-required">*</span></label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="form-input"
                            />
                            {errorsState.dob && <div className="error-text">{errorsState.dob}</div>}
                        </div>

                        <div className={"form-group " + (errorsState.gender ? 'has-error' : '')}>
                            <label>Gender <span className="label-required">*</span></label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errorsState.gender && <div className="error-text">{errorsState.gender}</div>}
                        </div>

                        {/* Row 3: Joined Class, Class, Section */}
                        <div className={"form-group " + (errorsState.joinedClass ? 'has-error' : '')}>
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

                        <div className={"form-group " + (errorsState.class ? 'has-error' : '')}>
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

                        <div className={"form-group " + (errorsState.section ? 'has-error' : '')}>
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

                        {/* Row 4: Roll No */}
                        <div className={"form-group " + (errorsState.rollNo ? 'has-error' : '')}>
                            <label>Roll No <span className="label-required">*</span></label>
                            <input
                                type="number"
                                name="rollNo"
                                value={formData.rollNo}
                                onChange={handleChange}
                                placeholder="Class roll number"
                                className="form-input"
                            />
                            {errorsState.rollNo && <div className="error-text">{errorsState.rollNo}</div>}
                        </div>
                    </div>
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
                            {editId ? 'Update' : 'Add'} Student
                        </>
                    )}
                </button>
            </div>
            {saved && <div className="success-badge">Saved ✓</div>}
        </StudentPageContainer>
    );
};

export default QuickStudentAdmissionForm;
