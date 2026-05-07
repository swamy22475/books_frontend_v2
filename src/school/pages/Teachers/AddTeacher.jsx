import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    IconUser, IconCurrencyDollar, IconWalk, IconBuildingBank,
    IconBus, IconBuilding, IconBrandFacebook, IconFileText,
    IconLock, IconArrowLeft
} from '@tabler/icons-react';
import { getTeachers, saveTeacher } from './teachersData';
import './AddTeacher.css';

const AddTeacher = ({ onCancel }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Synchronous lookup since data is local
    const teachers = getTeachers();
    const teacher = isEditMode ? teachers.find(t => t.id === id) : null;

    const fileInputRef = useRef(null);
    const signatureInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(teacher?.avatar || null);
    const [selectedSignature, setSelectedSignature] = useState(teacher?.signature || null);
    const [selectedLanguage, setSelectedLanguage] = useState(teacher?.languages || '');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedSignature(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveSignature = () => {
        setSelectedSignature(null);
        if (signatureInputRef.current) {
            signatureInputRef.current.value = '';
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const newTeacher = {
            ...teacher,
            id: data.teacherId || teacher?.id || `T${Math.floor(Math.random() * 900000) + 100000}`,
            name: `${data.firstName} ${data.lastName}`.trim(),
            class: data.class,
            subject: data.subject,
            email: data.email,
            phone: data.phone,
            whatsapp: data.whatsapp,
            status: data.status || 'Active',
            avatar: selectedImage || 'https://i.pravatar.cc/150?u=' + (data.firstName || 'new'),
            signature: selectedSignature || null,
            joinDate: data.joinDate,
            fatherName: data.fatherName,
            motherName: data.motherName,
            dob: data.dob,
            maritalStatus: data.maritalStatus,
            bloodGroup: data.bloodGroup,
            qualification: data.qualification,
            experience: data.experience,
            prevSchool: data.prevSchool,
            prevSchoolAddress: data.prevSchoolAddress,
            prevSchoolPhone: data.prevSchoolPhone,
            address: data.address,
            permanentAddress: data.permanentAddress,
            panNo: data.panNo,
            otherInfo: data.otherInfo,
            languages: selectedLanguage, // Use the state for language
            employeeType: data.employeeType,
            epfNo: data.epfNo,
            basicSalary: data.basicSalary,
            contractType: data.contractType,
            shift: data.shift,
            workLocation: data.workLocation,
            leaveDate: data.leaveDate,
            medicalLeaves: data.medicalLeaves,
            casualLeaves: data.casualLeaves,
            maternityLeaves: data.maternityLeaves,
            sickLeaves: data.sickLeaves,
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            bankName: data.bankName,
            ifsc: data.ifsc,
            branch: data.branch,
            route: data.route,
            vehicleNo: data.vehicleNo,
            pickupPoint: data.pickupPoint,
            hostel: data.hostel,
            roomNo: data.roomNo,
            facebook: data.facebook,
            instagram: data.instagram,
            linkedin: data.linkedin,
            youtube: data.youtube,
            twitter: data.twitter
        };

        saveTeacher(newTeacher);
        navigate('/school/teachers/list');
    };

    // Helper to get default value safely
    const getVal = (field) => teacher ? teacher[field] : '';

    return (
        <div className="add-teacher-page">
            <div className="page-header">
                <div className="add-teacher-title-row">
                    <button type="button" className="back-btn" onClick={() => onCancel ? onCancel() : navigate(-1)}>
                        <IconArrowLeft size={20} />
                    </button>
                    <h2 className="page-title">{isEditMode ? 'Edit Teacher' : 'Add Teacher'}</h2>
                </div>
                <div className="breadcrumb">Dashboard / Teachers / {isEditMode ? 'Edit Teacher' : 'Add Teacher'}</div>
            </div>

            <form className="form-container" key={id || 'new'} onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="form-section">
                    <div className="section-header">
                        <IconUser size={20} />
                        <h3 className="section-title">Personal Information</h3>
                    </div>
                    <div className="section-body">
                        <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
                            <div className="image-upload-row" style={{ flex: 1, marginBottom: 0 }}>
                                <div className="image-preview">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                    ) : (
                                        <IconUser size={40} />
                                    )}
                                </div>
                                <div className="upload-actions">
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            style={{ padding: '6px 12px', fontSize: '12px', background: '#3b82f6', color: 'white' }}
                                            onClick={handleRemoveImage}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <span className="upload-text">Upload image size 4MB, Format JPG, PNG, SVG</span>
                                </div>
                            </div>

                            <div className="image-upload-row" style={{ flex: 1, marginBottom: 0 }}>
                                <div className="image-preview">
                                    {selectedSignature ? (
                                        <img src={selectedSignature} alt="Signature Preview" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                    ) : (
                                        <IconFileText size={40} />
                                    )}
                                </div>
                                <div className="upload-actions">
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="file"
                                            ref={signatureInputRef}
                                            onChange={handleSignatureChange}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => signatureInputRef.current.click()}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            style={{ padding: '6px 12px', fontSize: '12px', background: '#3b82f6', color: 'white' }}
                                            onClick={handleRemoveSignature}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <span className="upload-text">Upload Teacher Signature - Size 4MB, Format JPG, PNG, SVG</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Teacher ID <span className="required-star">*</span></label>
                                <input type="text" name="teacherId" className="form-control" defaultValue={getVal('id')} placeholder="T849127" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">First Name <span className="required-star">*</span></label>
                                <input type="text" name="firstName" className="form-control" defaultValue={teacher?.name?.split(' ')[0] || ''} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input type="text" name="lastName" className="form-control" defaultValue={teacher?.name?.split(' ').slice(1).join(' ') || ''} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Class <span className="required-star">*</span></label>
                                <select name="class" className="form-control" defaultValue={getVal('class')} required>
                                    <option value="">Select</option>
                                    <option value="I">I</option>
                                    <option value="II">II</option>
                                    <option value="III">III</option>
                                    <option value="IV">IV</option>
                                    <option value="V">V</option>
                                    <option value="VI">VI</option>
                                    <option value="VII">VII</option>
                                    <option value="VIII">VIII</option>
                                    <option value="IX">IX</option>
                                    <option value="X">X</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subject <span className="required-star">*</span></label>
                                <select name="subject" className="form-control" defaultValue={getVal('subject')} required>
                                    <option value="">Select</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Computer">Computer</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender <span className="required-star">*</span></label>
                                <select name="gender" className="form-control" defaultValue={getVal('gender')} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Contact Number <span className="required-star">*</span></label>
                                <input type="text" name="phone" className="form-control" defaultValue={getVal('phone')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Whatsapp Number <span className="required-star">*</span></label>
                                <input type="text" name="whatsapp" className="form-control" defaultValue={getVal('whatsapp')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address <span className="required-star">*</span></label>
                                <input type="email" name="email" className="form-control" defaultValue={getVal('email')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Blood Group</label>
                                <select name="bloodGroup" className="form-control" defaultValue={getVal('bloodGroup')}>
                                    <option value="">Select</option>
                                    <option value="O+">O+</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="AB+">AB+</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Joining <span className="required-star">*</span></label>
                                <input type="date" name="joinDate" className="form-control" defaultValue={teacher?.joinDate ? new Date(teacher.joinDate).toISOString().split('T')[0] : ''} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Father's Name <span className="required-star">*</span></label>
                                <input type="text" name="fatherName" className="form-control" defaultValue={getVal('fatherName')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mother's Name <span className="required-star">*</span></label>
                                <input type="text" name="motherName" className="form-control" defaultValue={getVal('motherName')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Birth</label>
                                <input type="date" name="dob" className="form-control" defaultValue={teacher?.dob ? new Date(teacher.dob).toISOString().split('T')[0] : ''} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Marital Status</label>
                                <select name="maritalStatus" className="form-control" defaultValue={getVal('maritalStatus')}>
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Language Known</label>
                                <select
                                    className="form-control"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Telugu">Telugu</option>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Qualification <span className="required-star">*</span></label>
                                <input type="text" name="qualification" className="form-control" defaultValue={getVal('qualification')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Work Experience</label>
                                <input type="text" name="experience" className="form-control" defaultValue={getVal('experience')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Previous School if Any</label>
                                <input type="text" name="prevSchool" className="form-control" defaultValue={getVal('prevSchool')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Previous School Address</label>
                                <input type="text" name="prevSchoolAddress" className="form-control" defaultValue={getVal('prevSchoolAddress')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Previous School Phone No</label>
                                <input type="text" name="prevSchoolPhone" className="form-control" defaultValue={getVal('prevSchoolPhone')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Employee Type</label>
                                <select name="employeeType" className="form-control" defaultValue={getVal('employeeType')}>
                                    <option value="">Select</option>
                                    <option value="Full time">Full time</option>
                                    <option value="Parttime">Parttime</option>
                                    <option value="specific Time">specific Time</option>
                                    <option value="visting time">visting time</option>
                                </select>
                            </div>
                            <div className="form-group grid-col-2">
                                <label className="form-label">Address <span className="required-star">*</span></label>
                                <input type="text" name="address" className="form-control" defaultValue={getVal('address')} required />
                            </div>
                            <div className="form-group grid-col-2">
                                <label className="form-label">Permanent Address <span className="required-star">*</span></label>
                                <input type="text" name="permanentAddress" className="form-control" defaultValue={getVal('permanentAddress')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">PAN Number / ID Number</label>
                                <input type="text" name="panNo" className="form-control" defaultValue={getVal('panNo')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select name="status" className="form-control" defaultValue={getVal('status')}>
                                    <option value="">Select</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label className="form-label">Notes</label>
                                <textarea name="otherInfo" className="form-control" rows="3" defaultValue={getVal('otherInfo')} placeholder="Other Information"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payroll */}
                <div className="form-section">
                    <div className="section-header">
                        <IconCurrencyDollar size={20} />
                        <h3 className="section-title">Payroll</h3>
                    </div>
                    <div className="section-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">EPF No</label>
                                <input type="text" name="epfNo" className="form-control" defaultValue={getVal('epfNo')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Basic Salary</label>
                                <input type="text" name="basicSalary" className="form-control" defaultValue={getVal('basicSalary')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contract Type</label>
                                <select name="contractType" className="form-control" defaultValue={getVal('contractType')}>
                                    <option value="">Select</option>
                                    <option value="Permanent">Permanent</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Work Shift</label>
                                <select name="shift" className="form-control" defaultValue={getVal('shift')}>
                                    <option value="">Select</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Work Location</label>
                                <input type="text" name="workLocation" className="form-control" defaultValue={getVal('workLocation')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Leaving</label>
                                <input type="date" name="leaveDate" className="form-control" defaultValue={teacher?.leaveDate ? new Date(teacher.leaveDate).toISOString().split('T')[0] : ''} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaves */}
                <div className="form-section">
                    <div className="section-header">
                        <IconWalk size={20} />
                        <h3 className="section-title">Leaves</h3>
                    </div>
                    <div className="section-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Medical Leaves</label>
                                <input type="text" name="medicalLeaves" className="form-control" defaultValue={getVal('medicalLeaves')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Casual Leaves</label>
                                <input type="text" name="casualLeaves" className="form-control" defaultValue={getVal('casualLeaves')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Maternity Leaves</label>
                                <input type="text" name="maternityLeaves" className="form-control" defaultValue={getVal('maternityLeaves')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Sick Leaves</label>
                                <input type="text" name="sickLeaves" className="form-control" defaultValue={getVal('sickLeaves')} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Account Detail */}
                <div className="form-section">
                    <div className="section-header">
                        <IconBuildingBank size={20} />
                        <h3 className="section-title">Bank Account Detail</h3>
                    </div>
                    <div className="section-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Account Name <span className="required-star">*</span></label>
                                <input type="text" name="accountName" className="form-control" defaultValue={getVal('accountName')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Account Number</label>
                                <input type="text" name="accountNumber" className="form-control" defaultValue={getVal('accountNumber')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bank Name <span className="required-star">*</span></label>
                                <input type="text" name="bankName" className="form-control" defaultValue={getVal('bankName')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">IFSC Code <span className="required-star">*</span></label>
                                <input type="text" name="ifsc" className="form-control" defaultValue={getVal('ifsc')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Branch Name <span className="required-star">*</span></label>
                                <input type="text" name="branch" className="form-control" defaultValue={getVal('branch')} required />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Documents */}
                <div className="form-section">
                    <div className="section-header">
                        <IconFileText size={20} />
                        <h3 className="section-title">Documents</h3>
                    </div>
                    <div className="section-body">
                        <div className="form-grid">
                            <div className="form-group grid-col-2">
                                <label className="form-label">Upload Resume <span className="required-star">*</span></label>
                                <div className="file-upload-control">
                                    <span className="file-hint">Upload image size of 4MB, Accepted Format PDF</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        <button type="button" className="btn btn-secondary" style={{ background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                                            <IconFileText size={16} /> Change
                                        </button>
                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Resume.pdf</span>
                                    </div>
                                    <input type="file" name="resume" className="form-control" style={{ display: 'none' }} />
                                </div>
                            </div>
                            <div className="form-group grid-col-2">
                                <label className="form-label">Upload Joining Letter</label>
                                <div className="file-upload-control">
                                    <span className="file-hint">Upload image size of 4MB, Accepted Format PDF</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        <button type="button" className="btn btn-secondary" style={{ background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                                            <IconFileText size={16} /> Upload Document
                                        </button>
                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Resume.pdf</span>
                                    </div>
                                    <input type="file" name="joiningLetter" className="form-control" style={{ display: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password - Only show if not edit mode? Or allow password reset. Usually optional in edit. */}
                {!isEditMode && (
                    <div className="form-section">
                        <div className="section-header">
                            <IconLock size={20} />
                            <h3 className="section-title">Password</h3>
                        </div>
                        <div className="section-body">
                            <div className="form-grid">
                                <div className="form-group grid-col-2">
                                    <label className="form-label">New Password <span className="required-star">*</span></label>
                                    <input type="password" className="form-control" required={!isEditMode} />
                                </div>
                                <div className="form-group grid-col-2">
                                    <label className="form-label">Confirm Password <span className="required-star">*</span></label>
                                    <input type="password" className="form-control" required={!isEditMode} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => onCancel ? onCancel() : navigate(-1)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        {isEditMode ? 'Update Teacher' : 'Add Teacher'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTeacher;
