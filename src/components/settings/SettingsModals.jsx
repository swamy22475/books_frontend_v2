import React, { useRef, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import './SettingsModals.css';

/* ─── shared helper ─────────────────────────────────────────── */
function ImageUploadField({ label, value, onChange, hint }) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const readFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        readFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="sm-field">
            <label className="sm-field-label">{label}</label>
            {hint && <p className="sm-field-hint">{hint}</p>}

            <div
                className={`sm-dropzone ${dragOver ? 'drag-over' : ''} ${value ? 'has-image' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                {value ? (
                    <img src={value} alt={label} className="sm-preview-img" />
                ) : (
                    <div className="sm-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Click or drag &amp; drop PNG here</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/*"
                    className="sm-file-input"
                    onChange={(e) => readFile(e.target.files[0])}
                />
            </div>

            {value && (
                <button
                    className="sm-remove-btn"
                    onClick={(e) => { e.stopPropagation(); onChange(null); }}
                >
                    ✕ Remove image
                </button>
            )}
        </div>
    );
}

/* ─── Modal wrapper ─────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
    return (
        <div className="sm-overlay" onClick={onClose}>
            <div className="sm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="sm-dialog-header">
                    <h2 className="sm-dialog-title">{title}</h2>
                    <button className="sm-close-btn" onClick={onClose} aria-label="Close">✕</button>
                </div>
                <div className="sm-dialog-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ─── Printer Settings Modal ────────────────────────────────── */
export function PrinterSettingsModal({ onClose }) {
    const { printHeader, printFooter, setPrintHeader, setPrintFooter } = useSettings();
    const [localHeader, setLocalHeader] = useState(printHeader);
    const [localFooter, setLocalFooter] = useState(printFooter);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setPrintHeader(localHeader);
        setPrintFooter(localFooter);
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 800);
    };

    return (
        <Modal title="🖨️ Printer Settings" onClose={onClose}>
            <p className="sm-section-desc">
                Upload PNG images to appear in the <strong>header</strong> and <strong>footer</strong> of every printed bill.
            </p>

            <ImageUploadField
                label="Header Image"
                value={localHeader}
                onChange={setLocalHeader}
                hint="Appears at the top of the printed bill (e.g. school letterhead, banner)"
            />

            <div className="sm-divider" />

            <ImageUploadField
                label="Footer Image"
                value={localFooter}
                onChange={setLocalFooter}
                hint="Appears at the bottom of the printed bill (e.g. terms, stamp)"
            />

            <div className="sm-actions">
                <button className="sm-btn sm-btn-secondary" onClick={onClose}>Cancel</button>
                <button
                    className={`sm-btn sm-btn-primary ${saved ? 'sm-btn-saved' : ''}`}
                    onClick={handleSave}
                >
                    {saved ? '✓ Saved!' : 'Save Settings'}
                </button>
            </div>
        </Modal>
    );
}

/* ─── Logo Settings Modal ───────────────────────────────────── */
export function LogoSettingsModal({ onClose }) {
    const { logo, setLogo } = useSettings();
    const [localLogo, setLocalLogo] = useState(logo);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setLogo(localLogo);
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 800);
    };

    return (
        <Modal title="🏫 Logo Settings" onClose={onClose}>
            <p className="sm-section-desc">
                Upload your school logo (PNG). It will appear in the <strong>top-left header</strong> across all screens.
            </p>

            <ImageUploadField
                label="School Logo"
                value={localLogo}
                onChange={setLocalLogo}
                hint="Recommended: transparent PNG, at least 200×80 px"
            />

            {localLogo && (
                <div className="sm-logo-preview-wrap">
                    <span className="sm-preview-label">Preview in header:</span>
                    <div className="sm-logo-header-preview">
                        <img src={localLogo} alt="Logo preview" className="sm-logo-preview-img" />
                    </div>
                </div>
            )}

            <div className="sm-actions">
                <button className="sm-btn sm-btn-secondary" onClick={onClose}>Cancel</button>
                <button
                    className={`sm-btn sm-btn-primary ${saved ? 'sm-btn-saved' : ''}`}
                    onClick={handleSave}
                >
                    {saved ? '✓ Saved!' : 'Save Logo'}
                </button>
            </div>
        </Modal>
    );
}
