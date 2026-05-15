import React from 'react';
import './BillPrint.css';

/* ─────────────────── helpers ─────────────────── */
const fmt = (v) =>
    Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tensW = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const twoD = (n) => (n < 20 ? ones[n] : `${tensW[Math.floor(n / 10)]}${n % 10 ? ' ' + ones[n % 10] : ''}`);
const toWords = (val) => {
    const n = Math.floor(Number(val || 0));
    if (n === 0) return 'Zero Rupees Only';
    const p = [];
    const cr = Math.floor(n / 1e7);
    const lk = Math.floor((n % 1e7) / 1e5);
    const th = Math.floor((n % 1e5) / 1e3);
    const hu = Math.floor((n % 1e3) / 100);
    const re = n % 100;
    if (cr) p.push(`${twoD(cr)} Crore`);
    if (lk) p.push(`${twoD(lk)} Lakh`);
    if (th) p.push(`${twoD(th)} Thousand`);
    if (hu) p.push(`${ones[hu]} Hundred`);
    if (re) p.push(twoD(re));
    return `${p.join(' ')} Rupees Only`;
};

const payStatus = (paid, net) => {
    if (paid <= 0) return { label: 'UNPAID', color: '#ef4444', bg: '#fef2f2' };
    if (paid >= net) return { label: 'PAID', color: '#16a34a', bg: '#f0fdf4' };
    return { label: 'PARTIAL', color: '#d97706', bg: '#fffbeb' };
};

const titleCase = (id) => {
    if (!id || id === 'default') return 'School';
    return id.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const getSchool = () => {
    try {
        const raw = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
        const u = raw ? JSON.parse(raw) : {};
        const tid = sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id') || u.tenant_id;
        return {
            name: u.school_name || u.schoolName || u.tenant_name || u.tenantName || u.institution_name || u.name || titleCase(tid),
            address: u.school_address || u.address || u.full_address || '',
            phone: u.school_phone || u.phone || u.contact || u.mobile || '',
            email: u.school_email || u.email || '',
            website: u.website || u.school_website || '',
        };
    } catch { return { name: 'School', address: '', phone: '', email: '', website: '' }; }
};

const getLogo = () => { try { return localStorage.getItem('settings_logo') || null; } catch { return null; } };

/* ══════════════════════════════════════════════
   BILL PRINT  —  Premium A4 Invoice
══════════════════════════════════════════════ */
const BillPrint = React.forwardRef(({ sale }, ref) => {
    if (!sale) return null;

    const school = getSchool();
    const logo = getLogo();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const invoiceNo = sale.id || sale.records?.[0]?.id || Math.floor(10000 + Math.random() * 89999);
    const items = sale.items || [];
    const subtotal = Number(sale.subtotalAmount ?? sale.totalAmount ?? 0);
    const concession = Number(sale.concession || 0);
    const paid = Number(sale.paid || 0);
    const netTotal = Math.max(subtotal - concession, 0);
    const balance = Math.max(netTotal - paid, 0);
    const status = payStatus(paid, netTotal);

    return (
        <div ref={ref} className="inv-root">

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DARK HEADER BAND
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-header">
                {/* Left: logo + school info */}
                <div className="inv-header-brand">
                    {logo
                        ? <img src={logo} alt="logo" className="inv-logo" />
                        : (
                            <div className="inv-logo-init">
                                {school.name.slice(0, 2).toUpperCase()}
                            </div>
                        )
                    }
                    <div className="inv-brand-text">
                        <div className="inv-school-name">{school.name}</div>
                        <div className="inv-school-meta">
                            {[school.address, school.phone && `Ph: ${school.phone}`, school.email]
                                .filter(Boolean).join(' • ')}
                        </div>
                    </div>
                </div>

                {/* Right: INVOICE title + number */}
                <div className="inv-header-id">
                    <div className="inv-title-word">INVOICE</div>
                    <div className="inv-number">#{String(invoiceNo).padStart(6, '0')}</div>
                    <div className="inv-header-dates">
                        <span>{dateStr}</span>
                        <span className="inv-dot">•</span>
                        <span>{timeStr}</span>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DIAGONAL CUT DIVIDER
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-divider-cut" />

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                BILL-TO + PAYMENT INFO
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-info-row">
                <div className="inv-info-card inv-bill-to">
                    <div className="inv-card-label">
                        <span className="inv-label-dot" />
                        BILLED TO
                    </div>
                    <div className="inv-student-name">{sale.student || '—'}</div>
                    <div className="inv-student-meta">
                        {sale.class && <span className="inv-pill inv-pill-blue">Class {sale.class}</span>}
                        {sale.section && <span className="inv-pill inv-pill-purple">Sec {sale.section}</span>}
                    </div>
                    {sale.phone && <div className="inv-student-phone">📞 {sale.phone}</div>}
                </div>

                <div className="inv-info-card inv-payment-info">
                    <div className="inv-card-label">
                        <span className="inv-label-dot" />
                        PAYMENT INFO
                    </div>
                    <div className="inv-info-kv">
                        <span>Method</span>
                        <span className="inv-kv-val">{sale.payment || 'Cash'}</span>
                    </div>
                    <div className="inv-info-kv">
                        <span>Date</span>
                        <span className="inv-kv-val">{dateStr}</span>
                    </div>
                    <div className="inv-info-kv">
                        <span>Status</span>
                        <span
                            className="inv-status-badge"
                            style={{ color: status.color, background: status.bg, borderColor: status.color }}
                        >
                            {status.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ITEMS TABLE
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-table-section">
                <table className="inv-table">
                    <thead>
                        <tr className="inv-thead-row">
                            <th className="inv-th inv-th-sl">SL</th>
                            <th className="inv-th inv-th-desc">Book / Description</th>
                            <th className="inv-th inv-th-type">Type</th>
                            <th className="inv-th inv-th-qty">Qty</th>
                            <th className="inv-th inv-th-rate">Unit Price</th>
                            <th className="inv-th inv-th-total">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => {
                            const rate = item.total && item.qty
                                ? (Number(item.total) / Number(item.qty)) : 0;
                            return (
                                <tr key={i} className={`inv-tr ${i % 2 === 1 ? 'inv-tr-alt' : ''}`}>
                                    <td className="inv-td inv-td-center inv-td-sl">{i + 1}</td>
                                    <td className="inv-td inv-td-name">{item.name}</td>
                                    <td className="inv-td inv-td-center">
                                        <span className={`inv-type-badge ${item.type === 'Set' ? 'inv-type-set' : 'inv-type-single'}`}>
                                            {item.type || 'Set'}
                                        </span>
                                    </td>
                                    <td className="inv-td inv-td-center">{item.qty}</td>
                                    <td className="inv-td inv-td-right">₹ {fmt(rate)}</td>
                                    <td className="inv-td inv-td-right inv-td-amt">₹ {fmt(item.total)}</td>
                                </tr>
                            );
                        })}
                        {/* filler rows */}
                        {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
                            <tr key={`f${i}`} className={`inv-tr inv-tr-filler ${(items.length + i) % 2 === 1 ? 'inv-tr-alt' : ''}`}>
                                <td className="inv-td" colSpan={6}>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TOTALS + WORDS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-bottom-row">
                {/* Left: words + note */}
                <div className="inv-bottom-left">
                    <div className="inv-words-box">
                        <div className="inv-words-label">Amount in Words</div>
                        <div className="inv-words-val">{toWords(netTotal)}</div>
                    </div>
                    <div className="inv-note">
                        <strong>Note:</strong> Books once sold are non-refundable unless defective.
                        Please retain this invoice for your records.
                    </div>
                </div>

                {/* Right: totals */}
                <div className="inv-totals">
                    <div className="inv-totals-row">
                        <span>Subtotal</span>
                        <span>₹ {fmt(subtotal)}</span>
                    </div>
                    {concession > 0 && (
                        <div className="inv-totals-row inv-tr-disc">
                            <span>Discount / Concession</span>
                            <span>– ₹ {fmt(concession)}</span>
                        </div>
                    )}
                    <div className="inv-totals-sep" />
                    <div className="inv-totals-row inv-tr-net">
                        <span>Net Payable</span>
                        <span>₹ {fmt(netTotal)}</span>
                    </div>
                    <div className="inv-totals-row inv-tr-paid">
                        <span>Amount Paid</span>
                        <span>₹ {fmt(paid)}</span>
                    </div>
                    <div className={`inv-totals-row ${balance > 0 ? 'inv-tr-due' : 'inv-tr-clear'}`}>
                        <span>{balance > 0 ? 'Balance Due' : '✓ Cleared'}</span>
                        <span>₹ {fmt(balance)}</span>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FOOTER  — signature + thank you
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-footer">
                <div className="inv-sig-area">
                    <div className="inv-sig-line" />
                    <div className="inv-sig-label">Authorised Signatory</div>
                    <div className="inv-sig-for">For {school.name}</div>
                </div>

                <div className="inv-thankyou">
                    <div className="inv-ty-main">Thank You!</div>
                    <div className="inv-ty-sub">We appreciate your trust in us. 🎓</div>
                    {school.website && <div className="inv-ty-web">{school.website}</div>}
                </div>

                <div className="inv-received-area">
                    <div className="inv-sig-line" />
                    <div className="inv-sig-label">Receiver's Signature</div>
                    <div className="inv-sig-for">Student / Parent</div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                BOTTOM STRIP
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="inv-strip">
                <span>Invoice #{String(invoiceNo).padStart(6, '0')}</span>
                <span>•</span>
                <span>{school.name}</span>
                <span>•</span>
                <span>{dateStr}</span>
            </div>

        </div>
    );
});

BillPrint.displayName = 'BillPrint';
export default BillPrint;
