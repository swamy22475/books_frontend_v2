import React from 'react';

const copy = {
    vendor: {
        savingTitle: 'Saving Vendor...',
        successTitle: 'Saved Successfully!',
        detail: 'Vendor details have been stored.'
    },
    inventory: {
        savingTitle: 'Saving Book...',
        successTitle: 'Book Saved Successfully!',
        detail: 'Book inventory details have been stored.'
    },
    sale: {
        savingTitle: 'Saving Sale...',
        successTitle: 'Sale Saved Successfully!',
        detail: 'Sale details have been recorded.'
    }
};

const SaveFeedbackOverlay = ({ state, type = 'vendor' }) => {
    if (!state || state === 'idle') return null;

    const text = copy[type] || copy.vendor;

    return (
        <div className="bs-save-overlay">
            <div className="bs-save-card">
                {state === 'saving' && (
                    <>
                        <div className="bs-save-spinner" />
                        <div>
                            <div className="bs-save-title">{text.savingTitle}</div>
                            <div className="bs-save-detail">Please wait while we store your data</div>
                        </div>
                    </>
                )}

                {state === 'success' && (
                    <>
                        <div className="bs-save-check-wrap">
                            <div className="bs-save-pulse" />
                            <svg viewBox="0 0 90 90" width="90" height="90">
                                <circle
                                    cx="45"
                                    cy="45"
                                    r="40"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray="251"
                                    strokeDashoffset="251"
                                    className="bs-save-circle"
                                />
                                <polyline
                                    points="26,47 39,60 64,32"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="5.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="60"
                                    strokeDashoffset="60"
                                    className="bs-save-check"
                                />
                            </svg>
                        </div>
                        <div className="bs-save-success-copy">
                            <div className="bs-save-success-title">{text.successTitle}</div>
                            <div className="bs-save-detail">{text.detail}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SaveFeedbackOverlay;
