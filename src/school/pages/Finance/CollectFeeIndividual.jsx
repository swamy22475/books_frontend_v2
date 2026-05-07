import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    IconArrowLeft, IconCreditCard, IconCash, IconBuildingBank,
    IconCheck, IconUser, IconSchool, IconCalendar, IconChartPie,
    IconCurrencyRupee, IconPercentage, IconCalendarStats, IconWallet,
    IconBriefcase, IconAlertCircle
} from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './CollectFeeIndividual.css';

const CollectFeeIndividual = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    // Mock student data
    const student = {
        id: studentId || 'STU-2023-002',
        name: 'Priya Patel',
        class: '9-B',
        admissionNo: 'ADM/2023/128',
        fatherName: 'Rajesh Patel',
        phone: '+91 98765 43210',
        totalFee: 42000,
        paid: 30000,
        due: 12000,
        concession: 0,
        status: 'Partial',
        image: 'https://i.pravatar.cc/150?u=2',
        fees: [
            { type: 'Tuition Fee', amount: 30000, paid: 20000, due: 10000 },
            { type: 'Transport', amount: 8000, paid: 8000, due: 0 },
            { type: 'Hostel', amount: 4000, paid: 2000, due: 2000 },
        ]
    };

    // Form state
    const [concession, setConcession] = useState(0);
    const [selectedFeeType, setSelectedFeeType] = useState('Tuition Fee');
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        transactionId: ''
    });

    // Chart data
    const chartData = [
        { name: 'Collected', value: student.paid, color: '#28c76f' },
        { name: 'Due', value: student.due - concession, color: '#ea5455' },
        { name: 'Concession', value: Number(concession), color: '#3d5ee1' }
    ];

    const COLORS = ['#28c76f', '#ea5455', '#3d5ee1'];

    const handlePayment = () => {
        // Validation
        if (paymentMethod === 'Bank') {
            if (!bankDetails.bankName || !bankDetails.transactionId) {
                alert('Bank details are mandatory for Bank/UPI/DD payments');
                return;
            }
        }

        if (paymentAmount <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        alert(`Processing payment of ₹${paymentAmount} for ${selectedFeeType} via ${paymentMethod}`);
        // Here you would call an API
    };

    return (
        <div className="collect-individual-container">
            <div className="collect-header">
                <div className="header-title">
                    <h1>Collect Fees: {student.name}</h1>
                    <p>Finance / Individual Payment / <span style={{ color: '#3d5ee1' }}>{student.id}</span></p>
                </div>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <IconArrowLeft size={18} /> Back Overall
                </button>
            </div>

            <div className="collect-grid">
                {/* Left Column: Student Detail & Summary */}
                <div className="collect-left">
                    <div className="collect-card student-summary-card">
                        <div className="student-profile-header">
                            <img src={student.image} alt="" className="profile-large-avatar" />
                            <div className="profile-text">
                                <h2>{student.name}</h2>
                                <div className="student-badge">{student.id}</div>
                                <div className="student-meta">
                                    <div className="meta-item"><IconSchool size={16} /> Class {student.class}</div>
                                    <div className="meta-item"><IconUser size={16} /> Father: {student.fatherName}</div>
                                </div>
                            </div>
                        </div>

                        <div className="summary-stats">
                            <div className="summary-card total">
                                <IconCurrencyRupee size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Total Assigned</span>
                                    <span className="stat-value">₹{student.totalFee.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="summary-card collected">
                                <IconCheck size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Collected</span>
                                    <span className="stat-value">₹{student.paid.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="summary-card due">
                                <IconAlertCircle size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Total Due</span>
                                    <span className="stat-value">₹{(student.due - concession).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="chart-section">
                            <div className="chart-header">
                                <IconChartPie size={20} />
                                <h3>Fee Distribution</h3>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Form */}
                <div className="collect-right">
                    <div className="collect-card payment-form-card">
                        <div className="card-header">
                            <IconWallet size={20} />
                            <h3>Collect Payment</h3>
                        </div>

                        <div className="payment-form">
                            <div className="form-group">
                                <label><IconPercentage size={16} /> Concession Amount</label>
                                <div className="input-with-icon">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={concession}
                                        onChange={(e) => setConcession(e.target.value)}
                                        placeholder="Enter concession if any"
                                    />
                                </div>
                                {concession > 0 && <span className="helper-text text-success">₹{concession} will be deducted from due amount</span>}
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label><IconBriefcase size={16} /> Select Fee Type</label>
                                    <select
                                        value={selectedFeeType}
                                        onChange={(e) => setSelectedFeeType(e.target.value)}
                                    >
                                        {student.fees.filter(f => f.due > 0).map(f => (
                                            <option key={f.type} value={f.type}>{f.type} (Due: ₹{f.due})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><IconCurrencyRupee size={16} /> Payment Amount</label>
                                    <div className="input-with-icon">
                                        <span>₹</span>
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder="Amount to pay"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label><IconCalendar size={16} /> Collection Date</label>
                                <input
                                    type="date"
                                    value={collectionDate}
                                    onChange={(e) => setCollectionDate(e.target.value)}
                                />
                            </div>

                            <div className="payment-options">
                                <label>Payment Method</label>
                                <div className="options-grid">
                                    <button
                                        className={`option-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('Cash')}
                                    >
                                        <IconCash size={18} /> Cash
                                    </button>
                                    <button
                                        className={`option-btn ${paymentMethod === 'Bank' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('Bank')}
                                    >
                                        <IconBuildingBank size={18} /> Bank / UPI / DD
                                    </button>
                                </div>
                            </div>

                            {paymentMethod === 'Bank' && (
                                <div className="bank-details-section">
                                    <div className="form-group">
                                        <label>Bank Name / Platform <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="e.g. SBI, HDFC, GPay"
                                            value={bankDetails.bankName}
                                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Transaction ID / Ref No <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter transaction reference"
                                            value={bankDetails.transactionId}
                                            onChange={(e) => setBankDetails({ ...bankDetails, transactionId: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <button className="btn-pay-now" onClick={handlePayment}>
                                <IconCreditCard size={18} /> Pay ₹{paymentAmount || 0} Now
                            </button>
                        </div>
                    </div>

                    <div className="collect-card recent-transactions">
                        <div className="card-header">
                            <IconCalendarStats size={20} />
                            <h3>Fee Breakdown</h3>
                        </div>
                        <div className="breakdown-list">
                            {student.fees.map((fee, idx) => (
                                <div className="breakdown-item" key={idx}>
                                    <div className="breakdown-title">{fee.type}</div>
                                    <div className="breakdown-amounts">
                                        <div className="amount-col">
                                            <span className="label">Amount</span>
                                            <span className="value">₹{fee.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="amount-col">
                                            <span className="label">Paid</span>
                                            <span className="value text-success">₹{fee.paid.toLocaleString()}</span>
                                        </div>
                                        <div className="amount-col">
                                            <span className="label">Due</span>
                                            <span className="value text-danger">₹{fee.due.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectFeeIndividual;
