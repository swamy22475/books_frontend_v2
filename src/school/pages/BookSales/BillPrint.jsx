import React from 'react';
import './BillPrint.css';

const BillPrint = React.forwardRef(({ sale }, ref) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = currentDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    if (!sale) return null;

    return (
        <div ref={ref} className="bill-print-container">
            <div className="bill-print-header">
                <div className="bill-header-brand">
                    <h1 className="bill-school-name">📚 SCHOOL BOOKS STORE</h1>
                    <p className="bill-tagline">Complete Educational Resources</p>
                </div>
                <div className="bill-header-info">
                    <p><strong>Invoice #:</strong> INV-{Math.floor(Math.random() * 1000000)}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Time:</strong> {formattedTime}</p>
                </div>
            </div>

            <div className="bill-divider"></div>

            <div className="bill-customer-info">
                <div className="bill-section">
                    <h3 className="bill-section-title">📋 Bill To</h3>
                    <div className="bill-info-grid">
                        <div className="bill-info-row">
                            <span className="bill-label">Student Name:</span>
                            <span className="bill-value">{sale.student}</span>
                        </div>
                        <div className="bill-info-row">
                            <span className="bill-label">Phone Number:</span>
                            <span className="bill-value">{sale.phone || 'N/A'}</span>
                        </div>
                        <div className="bill-info-row">
                            <span className="bill-label">Class:</span>
                            <span className="bill-value">{sale.class}</span>
                        </div>
                        <div className="bill-info-row">
                            <span className="bill-label">Section:</span>
                            <span className="bill-value">{sale.section || 'N/A'}</span>
                        </div>
                        <div className="bill-info-row">
                            <span className="bill-label">Payment Method:</span>
                            <span className="bill-value bill-payment-method">{sale.payment}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bill-divider"></div>

            <div className="bill-items-section">
                <table className="bill-items-table">
                    <thead>
                        <tr className="bill-table-header">
                            <th className="bill-col-sn">SN</th>
                            <th className="bill-col-item">Book Name</th>
                            <th className="bill-col-type">Type</th>
                            <th className="bill-col-qty">Qty</th>
                            <th className="bill-col-price">Unit Price</th>
                            <th className="bill-col-total">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.items && sale.items.map((item, idx) => (
                            <tr key={idx} className="bill-table-row">
                                <td className="bill-col-sn">{idx + 1}</td>
                                <td className="bill-col-item">{item.name}</td>
                                <td className="bill-col-type">
                                    <span className="bill-badge">{item.type || 'Set'}</span>
                                </td>
                                <td className="bill-col-qty">{item.qty}</td>
                                <td className="bill-col-price">₹{Number(item.price).toFixed(2)}</td>
                                <td className="bill-col-total">₹{Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bill-divider"></div>

            <div className="bill-summary-section">
                <div className="bill-summary-row">
                    <span className="bill-summary-label">Sub Total (Sum of all items)</span>
                    <span className="bill-summary-value">₹{Number(sale.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {Number(sale.concession || 0) > 0 && (
                    <div className="bill-summary-row">
                        <span className="bill-summary-label">Concession/Discount</span>
                        <span className="bill-summary-value">-₹{Number(sale.concession).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                )}
                <div className="bill-summary-row bill-net-row">
                    <span className="bill-summary-label">Net Total (After Discount)</span>
                    <span className="bill-summary-value">₹{(Number(sale.totalAmount) - Number(sale.concession || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="bill-summary-row">
                    <span className="bill-summary-label">Amount Paid</span>
                    <span className="bill-summary-value bill-paid">₹{Number(sale.paid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="bill-summary-row bill-balance-row">
                    <span className="bill-summary-label">Balance Due</span>
                    <span className={`bill-summary-value ${sale.balance > 0 ? 'bill-due' : 'bill-paid'}`}>
                        ₹{Number(sale.balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <div className="bill-divider"></div>

            <div className="bill-footer">
                <div className="bill-footer-notes">
                    <p className="bill-footer-title">📌 Notes:</p>
                    <ul className="bill-footer-list">
                        <li>Please keep this bill for your records</li>
                        <li>Books are sold as per condition shown</li>
                        <li>Returns accepted within 7 days with receipt</li>
                        <li>For queries, contact the school office</li>
                    </ul>
                </div>
                <div className="bill-footer-thanks">
                    <p className="bill-thanks-text">Thank You! 🙏</p>
                    <p className="bill-signature">School Books Store</p>
                </div>
            </div>

            <div className="bill-print-footer">
                <p>This is a computer-generated receipt. No signature required.</p>
            </div>
        </div>
    );
});

BillPrint.displayName = 'BillPrint';

export default BillPrint;
