import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import profileImg from "src/assets/images/profile/user-1.jpg";
import { Button } from "src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { api } from "src/lib/api-client";
import apiClient from "src/lib/api-client";
import './UserProfile.css';

const UserProfile = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    const BCrumb = [
        {
            to: "/",
            title: "Home"
        },
        {
            title: "Userprofile"
        }];


    const [isLoading, setIsLoading] = useState(true);
    const [personal, setPersonal] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        facebook: "",
        twitter: "",
        github: "",
        dribbble: ""
    });

    const [address, setAddress] = useState({
        location: "",
        state: "",
        pin: "",
        zip: "",
        taxNo: ""
    });

    const [tempPersonal, setTempPersonal] = useState(personal);
    const [tempAddress, setTempAddress] = useState(address);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/super-admin/me');

                // Parse names
                const nameParts = (response.full_name || '').split(' ');
                const fName = nameParts[0] || '';
                const lName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                setPersonal({
                    firstName: fName,
                    lastName: lName,
                    email: response.email || '',
                    phone: response.phone || '',
                    position: response.position || '',
                    facebook: response.facebook_url || '',
                    twitter: response.twitter_url || '',
                    github: response.github_url || '',
                    dribbble: response.dribbble_url || ''
                });

                setAddress({
                    location: response.location || '',
                    state: response.state || '',
                    pin: response.pin || '',
                    zip: response.zip || '',
                    taxNo: response.tax_no || ''
                });
            } catch (err) {
                console.error("Failed to load user profile", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (openModal && modalType === "personal") {
            setTempPersonal(personal);
        }
        if (openModal && modalType === "address") {
            setTempAddress(address);
        }
    }, [openModal, modalType, personal, address]);

    const handleSave = async () => {
        try {
            // Build the update payload mapped to the SuperAdminUpdateRequest schema
            const updatePayload = {
                full_name: modalType === "personal"
                    ? `${tempPersonal.firstName || ''} ${tempPersonal.lastName || ''}`.trim()
                    : `${personal.firstName || ''} ${personal.lastName || ''}`.trim(),
                phone: modalType === "personal" ? (tempPersonal.phone || '') : (personal.phone || ''),
                position: modalType === "personal" ? (tempPersonal.position || '') : (personal.position || ''),
                facebook_url: modalType === "personal" ? (tempPersonal.facebook || '') : (personal.facebook || ''),
                twitter_url: modalType === "personal" ? (tempPersonal.twitter || '') : (personal.twitter || ''),
                github_url: modalType === "personal" ? (tempPersonal.github || '') : (personal.github || ''),
                dribbble_url: modalType === "personal" ? (tempPersonal.dribbble || '') : (personal.dribbble || ''),

                location: modalType === "address" ? (tempAddress.location || '') : (address.location || ''),
                state: modalType === "address" ? (tempAddress.state || '') : (address.state || ''),
                pin: modalType === "address" ? (tempAddress.pin || '') : (address.pin || ''),
                zip: modalType === "address" ? (tempAddress.zip || '') : (address.zip || ''),
                tax_no: modalType === "address" ? (tempAddress.taxNo || '') : (address.taxNo || ''),
            };

            await api.put('/super-admin/me', updatePayload);

            // Update local state on success
            if (modalType === "personal") {
                setPersonal(tempPersonal);
            } else if (modalType === "address") {
                setAddress(tempAddress);
            }
            setOpenModal(false);
        } catch (err) {
            console.error("Failed to save profile changes", err);
            alert("Failed to save changes. Please try again.");
        }
    };

    const socialLinks = [
        { href: "https://www.facebook.com/wrappixel", icon: "streamline-logos:facebook-logo-2-solid" },
        { href: "https://twitter.com/wrappixel", icon: "streamline-logos:x-twitter-logo-solid" },
        { href: "https://github.com/wrappixel", icon: "ion:logo-github" },
        { href: "https://dribbble.com/wrappixel", icon: "streamline-flex:dribble-logo-remix" }];


    return (
        <div className="user-profile-container">
            {/* Header Section */}
            <div className="user-profile-header">
                <div className="header-background"></div>
                
                <div className="user-profile-header-content">
                    <div className="user-avatar-large">
                        {personal.firstName.charAt(0).toUpperCase()}{personal.lastName.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="user-header-info">
                        <h1 className="user-profile-name">{personal.firstName} {personal.lastName}</h1>
                        <p className="user-profile-position">{personal.position || 'User'}</p>
                        <p className="user-profile-location">{address.location || 'Location not specified'}</p>
                    </div>

                    <button 
                        onClick={() => { setModalType("personal"); setOpenModal(true); }}
                        className="edit-profile-btn"
                    >
                        <Icon icon="ic:outline-edit" width="18" height="18" /> Edit Profile
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="user-profile-content">
                {/* Personal Information Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2 className="card-title">Personal Information</h2>
                        <button 
                            onClick={() => { setModalType("personal"); setOpenModal(true); }}
                            className="card-edit-btn"
                            title="Edit"
                        >
                            <Icon icon="ic:outline-edit" width="16" height="16" />
                        </button>
                    </div>
                    
                    <div className="card-content">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{personal.email || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{personal.phone || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Position</span>
                                <span className="info-value">{personal.position || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Social</span>
                                <div className="social-links">
                                    {personal.facebook && <a href={personal.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">f</a>}
                                    {personal.twitter && <a href={personal.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">𝕏</a>}
                                    {personal.github && <a href={personal.github} target="_blank" rel="noopener noreferrer" title="GitHub">gh</a>}
                                    {personal.dribbble && <a href={personal.dribbble} target="_blank" rel="noopener noreferrer" title="Dribbble">dr</a>}
                                    {!personal.facebook && !personal.twitter && !personal.github && !personal.dribbble && <span>Not specified</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Details Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2 className="card-title">Address Details</h2>
                        <button 
                            onClick={() => { setModalType("address"); setOpenModal(true); }}
                            className="card-edit-btn"
                            title="Edit"
                        >
                            <Icon icon="ic:outline-edit" width="16" height="16" />
                        </button>
                    </div>
                    
                    <div className="card-content">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Location</span>
                                <span className="info-value">{address.location || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">State</span>
                                <span className="info-value">{address.state || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">PIN Code</span>
                                <span className="info-value">{address.pin || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">ZIP</span>
                                <span className="info-value">{address.zip || 'Not specified'}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">Tax Number</span>
                                <span className="info-value">{address.taxNo || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="profile-dialog">
                    <DialogHeader>
                        <DialogTitle className="dialog-title">
                            {modalType === "personal" ? "✏️ Edit Personal Information" : "✏️ Edit Address Details"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="dialog-content">
                        {modalType === "personal" ?
                            <div className="dialog-form-grid">
                                <div className="form-group">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Enter first name"
                                        value={tempPersonal.firstName}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, firstName: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Enter last name"
                                        value={tempPersonal.lastName}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, lastName: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email"
                                        value={tempPersonal.email}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, email: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Enter phone number"
                                        value={tempPersonal.phone}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, phone: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        placeholder="Enter position"
                                        value={tempPersonal.position}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, position: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                        id="facebook"
                                        placeholder="Facebook URL"
                                        value={tempPersonal.facebook}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, facebook: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        placeholder="Twitter URL"
                                        value={tempPersonal.twitter}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, twitter: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="github">GitHub</Label>
                                    <Input
                                        id="github"
                                        placeholder="GitHub URL"
                                        value={tempPersonal.github}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, github: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="dribbble">Dribbble</Label>
                                    <Input
                                        id="dribbble"
                                        placeholder="Dribbble URL"
                                        value={tempPersonal.dribbble}
                                        onChange={(e) => setTempPersonal({ ...tempPersonal, dribbble: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div> :
                            <div className="dialog-form-grid">
                                <div className="form-group">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="Enter location"
                                        value={tempAddress.location}
                                        onChange={(e) => setTempAddress({ ...tempAddress, location: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="Enter state"
                                        value={tempAddress.state}
                                        onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="pin">PIN Code</Label>
                                    <Input
                                        id="pin"
                                        placeholder="Enter PIN code"
                                        value={tempAddress.pin}
                                        onChange={(e) => setTempAddress({ ...tempAddress, pin: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="zip">ZIP</Label>
                                    <Input
                                        id="zip"
                                        placeholder="Enter ZIP"
                                        value={tempAddress.zip}
                                        onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <Label htmlFor="taxNo">Tax Number</Label>
                                    <Input
                                        id="taxNo"
                                        placeholder="Enter tax number"
                                        value={tempAddress.taxNo}
                                        onChange={(e) => setTempAddress({ ...tempAddress, taxNo: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        }
                    </div>

                    <DialogFooter className="dialog-footer">
                        <Button 
                            color={"lighterror"} 
                            className="btn-cancel"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            color={"primary"} 
                            className="btn-save"
                            onClick={handleSave}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};