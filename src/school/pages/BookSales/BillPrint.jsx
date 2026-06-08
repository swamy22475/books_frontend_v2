import React from 'react';
import './BillPrint.css';

/* ─────────────────── helpers ─────────────────── */
const fmt = (v) =>
    Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getSchool = () => {
    try {
        const raw = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
        const u = raw ? JSON.parse(raw) : {};
        const tid = sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id') || u.tenant_id || '';
        return {
            name: u.school_name || u.schoolName || u.tenant_name || u.tenantName || u.institution_name || u.name || 'ABC PUBLIC SCHOOL',
            address: u.school_address || u.address || u.full_address || '123, School Road, City',
            phone: u.school_phone || u.phone || u.contact || u.mobile || '0123-4567890',
            email: u.school_email || u.email || 'info@school.com',
            website: u.website || u.school_website || 'www.school.com',
        };
    } catch { return { name: 'ABC PUBLIC SCHOOL', address: '123, School Road, City', phone: '0123-4567890', email: 'info@school.com', website: 'www.school.com' }; }
};

const getLogo = () => { try { return localStorage.getItem('settings_logo') || null; } catch { return null; } };

const BillPrint = React.forwardRef(({ sale }, ref) => {
    if (!sale) return null;

    const school = getSchool();
    const logo = getLogo();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const invoiceNo = sale.id || sale.records?.[0]?.id || Math.floor(10000 + Math.random() * 89999);
    const items = sale.items || [];
    const subtotal = Number(sale.subtotalAmount ?? sale.totalAmount ?? 0);
    const concession = Number(sale.concession || 0);
    const otherCharges = Number(sale.otherCharges || 0);
    const netTotal = Math.max(subtotal - concession + otherCharges, 0);

    const paymentMode = sale.payment || 'Cash';
    const txId = sale.transactionId || sale.referenceNo || '';

    return (
        <div ref={ref} className="receipt-container">
            {/* Header Section */}
            <header className="receipt-header">
                <div className="logo-container">
                    <div className="logo-placeholder">
                        {logo ? (
                            <img src={logo} alt="School Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                        )}
                    </div>
                </div>
                <div className="school-info">
                    <h1 className="school-name">{school.name.toUpperCase()}</h1>
                    <p className="tagline">DISCIPLINE &bull; KNOWLEDGE &bull; EXCELLENCE</p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>{school.address}</span>
                        </div>
                        <div className="contact-row">
                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <span>{school.phone}</span>
                            </div>
                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span>{school.email}</span>
                            </div>
                            <div className="contact-item">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                <span>{school.website}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="receipt-title-container">
                <h2 className="receipt-title">BOOKS BILL RECEIPT</h2>
            </div>

            <div className="meta-info">
                <div className="meta-item">
                    <label>Receipt No. :</label>
                    <span className="dotted-span">{String(invoiceNo).padStart(6, '0')}</span>
                </div>
                <div className="meta-item">
                    <label>Date :</label>
                    <span className="dotted-span">{dateStr}</span>
                </div>
            </div>

            {/* Student Details Section */}
            <section className="section-box">
                <h3 className="section-badge">STUDENT DETAILS</h3>
                <div className="details-grid">
                    <div className="detail-group">
                        <label>Student Name :</label>
                        <span className="dotted-span full-width">{sale.student || ''}</span>
                    </div>
                    <div className="detail-group">
                        <label>Roll No. :</label>
                        <span className="dotted-span full-width">{sale.rollNo || ''}</span>
                    </div>
                    <div className="detail-group">
                        <label>Class & Section :</label>
                        <span className="dotted-span full-width">{(sale.class ? `Class ${sale.class}` : '') + (sale.section ? ` Sec ${sale.section}` : '')}</span>
                    </div>
                    <div className="detail-group">
                        <label>Academic Year :</label>
                        <span className="dotted-span full-width">{sale.academicYear || now.getFullYear() + '-' + (now.getFullYear() + 1).toString().slice(-2)}</span>
                    </div>
                    <div className="detail-group">
                        <label>Parent / Guardian Name :</label>
                        <span className="dotted-span full-width">{sale.parentName || ''}</span>
                    </div>
                    <div className="detail-group">
                        <label>Mobile No. :</label>
                        <span className="dotted-span full-width">{sale.phone || ''}</span>
                    </div>
                </div>
            </section>

            {/* Books Purchase Details Section */}
            <section className="section-box no-padding">
                <h3 className="section-badge badge-overlap">BOOKS PURCHASE DETAILS</h3>
                <table className="items-table">
                    <thead>
                        <tr>
                            <th width="5%">S.NO.</th>
                            <th width="30%">BOOK NAME</th>
                            <th width="20%">SUBJECT</th>
                            <th width="15%">PUBLISHER</th>
                            <th width="10%">QTY.</th>
                            <th width="10%">RATE (₹)</th>
                            <th width="10%">AMOUNT (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => {
                            const rate = item.total && item.qty ? (Number(item.total) / Number(item.qty)) : 0;
                            return (
                                <tr key={i}>
                                    <td className="text-center">{i + 1}</td>
                                    <td className="text-left pd-left">{item.name}</td>
                                    <td className="text-left pd-left">{item.subject || ''}</td>
                                    <td className="text-left pd-left">{item.publisher || ''}</td>
                                    <td className="text-center">{item.qty}</td>
                                    <td className="text-right pd-right">{fmt(rate)}</td>
                                    <td className="text-right pd-right">{fmt(item.total)}</td>
                                </tr>
                            );
                        })}
                        {/* Filler rows removed to allow dynamic height and better fitting on a single page */}
                    </tbody>
                </table>
                
                <div className="totals-section">
                    <div className="thank-you-graphics">
                        <div className="graphics-icon">📚</div>
                        <div className="graphics-text">
                            <h4>Thank You!</h4>
                            <p>We appreciate your trust in us.</p>
                        </div>
                    </div>
                    <div className="totals-table-container">
                        <table className="totals-table">
                            <tbody>
                                <tr>
                                    <td className="text-right label-cell">TOTAL BOOKS AMOUNT</td>
                                    <td className="currency-sym">₹</td>
                                    <td className="value-cell text-right pr-2 font-bold">{fmt(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right label-cell">DISCOUNT</td>
                                    <td className="currency-sym">₹</td>
                                    <td className="value-cell text-right pr-2 font-bold">{fmt(concession)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right label-cell">OTHER CHARGES</td>
                                    <td className="currency-sym">₹</td>
                                    <td className="value-cell text-right pr-2 font-bold">{fmt(otherCharges)}</td>
                                </tr>
                                <tr className="grand-total-row">
                                    <td className="text-right label-cell">GRAND TOTAL</td>
                                    <td className="currency-sym">₹</td>
                                    <td className="value-cell text-right pr-2 font-bold">{fmt(netTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Payment Details Section */}
            <section className="section-box">
                <h3 className="section-badge">PAYMENT DETAILS</h3>
                <div className="payment-modes">
                    <label>Payment Mode :</label>
                    {['Cash', 'UPI', 'Card', 'Bank Transfer'].map(mode => (
                        <label key={mode} className="checkbox-label">
                            <input type="checkbox" readOnly checked={paymentMode === mode} /> {mode}
                        </label>
                    ))}
                    <div className="other-mode">
                        <label className="checkbox-label">
                            <input type="checkbox" readOnly checked={!['Cash', 'UPI', 'Card', 'Bank Transfer'].includes(paymentMode)} /> Other
                        </label>
                        <span className="dotted-span short">{!['Cash', 'UPI', 'Card', 'Bank Transfer'].includes(paymentMode) ? paymentMode : ''}</span>
                    </div>
                </div>
                <div className="transaction-detail">
                    <label>Transaction / Reference No. :</label>
                    <span className="dotted-span full-width">{txId}</span>
                </div>
            </section>

            {/* Footer Notes Section */}
            <div className="footer-layout">
                <div className="notes-box section-box">
                    <h3 className="section-badge">IMPORTANT NOTES</h3>
                    <ul className="notes-list">
                        <li>Books once sold will not be exchanged or returned.</li>
                        <li>Please verify all books before leaving the counter.</li>
                        <li>Keep this receipt for future reference.</li>
                        <li>Damaged books should be reported immediately.</li>
                    </ul>
                </div>
                
                <div className="seal-box">
                    <div className="seal-circle">
                        <span className="star">★</span>
                        <span className="seal-text">SCHOOL<br/>SEAL</span>
                        <span className="star">★</span>
                    </div>
                </div>

                <div className="signatures-box">
                    <table className="sig-table">
                        <tbody>
                            <tr>
                                <th>ISSUED BY</th>
                                <th>PARENT / GUARDIAN</th>
                            </tr>
                            <tr>
                                <td className="sig-space"></td>
                                <td className="sig-space"></td>
                            </tr>
                            <tr>
                                <td className="sig-line"><span>Signature</span></td>
                                <td className="sig-line"><span>Signature</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="footer-greeting">
                <svg className="ornament" viewBox="0 0 100 20" width="60" height="15"><path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" stroke="#333" strokeWidth="1.5"/></svg>
                <span>Thank You! Visit Again!</span>
                <svg className="ornament" viewBox="0 0 100 20" width="60" height="15"><path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" stroke="#333" strokeWidth="1.5"/></svg>
            </div>
        </div>
    );
});

BillPrint.displayName = 'BillPrint';
export default BillPrint;
