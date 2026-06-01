import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../../lib/api-client';
import './UserSettingsModal.css';

const UserSettingsModal = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        schoolName: '',
        password: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || '',
                email: currentUser.email || '',
                mobile: currentUser.mobile || '',
                schoolName: currentUser.school_name || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrorMsg('');
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setErrorMsg('Username is required');
            return false;
        }
        if (!formData.email.trim()) {
            setErrorMsg('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrorMsg('Please enter a valid email address');
            return false;
        }
        if (formData.mobile && formData.mobile.length < 10) {
            setErrorMsg('Mobile number must be at least 10 digits');
            return false;
        }
        if (!formData.schoolName.trim()) {
            setErrorMsg('School name is required');
            return false;
        }
        if (formData.password && formData.password.length < 6) {
            setErrorMsg('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                mobile: formData.mobile.trim(),
                school_name: formData.schoolName.trim()
            };

            if (formData.password.trim()) {
                payload.password = formData.password.trim();
            }

            const response = await apiClient.put(
                `/api/v1/auth/users/${currentUser.id}`,
                payload,
                {
                    headers: { 'X-Tenant-ID': currentUser.tenant_id }
                }
            );

            setSuccessMsg('Profile updated successfully!');
            
            setTimeout(() => {
                onUpdateSuccess(response);
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                }));
                setTimeout(() => {
                    onClose();
                }, 500);
            }, 1500);
        } catch (err) {
            const errorDetail = err.response?.data?.detail || err.message || 'Failed to update profile';
            setErrorMsg(errorDetail);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="user-settings-modal-overlay" onClick={onClose}>
            <div className="user-settings-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="user-settings-modal-header">
                    <div>
                        <h2 className="user-settings-modal-title">Settings</h2>
                        <p className="user-settings-modal-subtitle">Update your profile information</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="user-settings-close-btn"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                {successMsg && (
                    <div className="user-settings-message user-settings-message-success">
                        <CheckCircle size={18} />
                        <span>{successMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div className="user-settings-message user-settings-message-error">
                        <AlertCircle size={18} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="user-settings-form">
                    <div className="user-settings-form-group">
                        <label htmlFor="username" className="user-settings-label">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                            disabled={isLoading}
                            className="user-settings-input"
                            required
                        />
                    </div>

                    <div className="user-settings-form-group">
                        <label htmlFor="email" className="user-settings-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            disabled={isLoading}
                            className="user-settings-input"
                            required
                        />
                    </div>

                    <div className="user-settings-form-group">
                        <label htmlFor="mobile" className="user-settings-label">Mobile Number</label>
                        <input
                            id="mobile"
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="Enter mobile number"
                            disabled={isLoading}
                            className="user-settings-input"
                        />
                    </div>

                    <div className="user-settings-form-group">
                        <label htmlFor="schoolName" className="user-settings-label">School Name</label>
                        <input
                            id="schoolName"
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleInputChange}
                            placeholder="Enter school name"
                            disabled={isLoading}
                            className="user-settings-input"
                            required
                        />
                    </div>

                    <div className="user-settings-divider"></div>

                    <div className="user-settings-password-section">
                        <p className="user-settings-password-label">Change Password (Optional)</p>
                        <p className="user-settings-password-hint">Leave blank to keep current password</p>
                    </div>

                    <div className="user-settings-form-group">
                        <label htmlFor="password" className="user-settings-label">New Password</label>
                        <div className="user-settings-password-input-wrapper">
                            <input
                                id="password"
                                type={showPasswords.password ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter new password (min. 6 characters)"
                                disabled={isLoading}
                                className="user-settings-input user-settings-input-with-icon"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('password')}
                                className="user-settings-password-toggle"
                                disabled={isLoading}
                            >
                                {showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="user-settings-form-group">
                        <label htmlFor="confirmPassword" className="user-settings-label">Confirm Password</label>
                        <div className="user-settings-password-input-wrapper">
                            <input
                                id="confirmPassword"
                                type={showPasswords.confirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your new password"
                                disabled={isLoading}
                                className="user-settings-input user-settings-input-with-icon"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                className="user-settings-password-toggle"
                                disabled={isLoading}
                            >
                                {showPasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="user-settings-button-group">
                        <button
                            type="button"
                            onClick={onClose}
                            className="user-settings-btn user-settings-btn-cancel"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="user-settings-btn user-settings-btn-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="user-settings-spinner"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserSettingsModal;
