import React from 'react';
import './BillPrint.css';

const formatMoney = (value) => Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const twoDigitsToWords = (num) => {
    if (num < 20) return ones[num];
    return `${tens[Math.floor(num / 10)]}${num % 10 ? ` ${ones[num % 10]}` : ''}`;
};

const numberToWords = (value) => {
    const num = Math.floor(Number(value || 0));
    if (num === 0) return 'Zero Rupees Only';

    const parts = [];
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const rest = num % 100;

    if (crore) parts.push(`${twoDigitsToWords(crore)} Crore`);
    if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
    if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
    if (hundred) parts.push(`${ones[hundred]} Hundred`);
    if (rest) parts.push(twoDigitsToWords(rest));

    return `${parts.join(' ')} Rupees Only`;
};

const getPaymentStatus = (paid, netTotal) => {
    if (paid <= 0) return 'Unpaid';
    if (paid >= netTotal) return 'Paid';
    return 'Partially Paid';
};

const titleCaseTenant = (tenantId) => {
    if (!tenantId || tenantId === 'default') return 'School';
    return tenantId
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

const getSchoolProfile = () => {
    try {
        const savedUser = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
        const user = savedUser ? JSON.parse(savedUser) : {};
        const tenantId = sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id') || user.tenant_id;

        return {
            name: user.school_name || user.schoolName || user.tenant_name || user.tenantName || user.institution_name || user.organization_name || user.name || titleCaseTenant(tenantId),
            address: user.school_address || user.address || user.full_address || '',
            phone: user.school_phone || user.phone || user.contact || user.mobile || '',
            email: user.school_email || user.email || '',
            website: user.website || user.school_website || user.url || ''
        };
    } catch {
        return { name: 'School', address: '', phone: '', email: '', website: '' };
    }
};

const BillPrint = React.forwardRef(({ sale }, ref) => {
    if (!sale) return null;

    const school = getSchoolProfile();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const invoiceNo = sale.id || sale.records?.[0]?.id || Math.floor(1000 + Math.random() * 9000);
    const items = sale.items || [];
    const totalAmount = Number(sale.subtotalAmount ?? sale.totalAmount ?? 0);
    const concession = Number(sale.concession || 0);
    const paid = Number(sale.paid || 0);
    const netTotal = Math.max(totalAmount - concession, 0);
    const balance = Math.max(netTotal - paid, 0);
    const status = getPaymentStatus(paid, netTotal);

    return (
        <div ref={ref} className="bill-print-container">
            <div className="bill-topline">
                <div></div>
                <h1>{school.name}</h1>
                <div className="bill-created-date">Create Date : {formattedDate}</div>
            </div>

            <div className="bill-party-grid">
                <div className="bill-party-block">
                    <div className="bill-party-title">From</div>
                    <div className="bill-strong">{school.name}</div>
                    {school.address && <div>{school.address}</div>}
                    {school.phone && <div>Phone : {school.phone}</div>}
                    {school.email && <div>Email : {school.email}</div>}
                    {school.website && <div>{school.website}</div>}
                </div>

                <div className="bill-party-block">
                    <div className="bill-party-title">To</div>
                    <div className="bill-strong">{sale.student || '-'}</div>
                    <div>Class : {sale.class || '-'}</div>
                    <div>Section : {sale.section || '-'}</div>
                    <div>Phone : {sale.phone || '-'}</div>
                    <div>Payment Method : {sale.payment || '-'}</div>
                </div>

                <div className="bill-invoice-block">
                    <div className="bill-invoice-no">Invoice #{invoiceNo}</div>
                    <div>
                        Payment Status :{' '}
                        <span className={`bill-status bill-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>

            <table className="bill-items-table">
                <thead>
                    <tr>
                        <th className="bill-col-index">#</th>
                        <th>Book Type</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Discount</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={`${item.name}-${idx}`}>
                            <td>{idx + 1}</td>
                            <td className="bill-item-name">{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{formatMoney(Number(item.total || 0))}</td>
                            <td>{idx === 0 ? formatMoney(concession) : '0.00'}</td>
                            <td>{formatMoney(Math.max(Number(item.total || 0) - (idx === 0 ? concession : 0), 0))}</td>
                        </tr>
                    ))}

                    <tr className="bill-total-row">
                        <td colSpan={5}>Total Amount</td>
                        <td>{formatMoney(netTotal)}</td>
                    </tr>
                    <tr className="bill-total-row">
                        <td colSpan={5}>Paid</td>
                        <td>{formatMoney(paid)}</td>
                    </tr>
                    <tr className="bill-total-row">
                        <td colSpan={5}>Balance</td>
                        <td>{formatMoney(balance)}</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="bill-amount-words">
                            {numberToWords(netTotal)}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="bill-sign-row">
                <div>Received By</div>
                <div>Authorized Signature</div>
            </div>
        </div>
    );
});

BillPrint.displayName = 'BillPrint';

export default BillPrint;
