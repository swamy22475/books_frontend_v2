import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BookSales.css';

const BookTypes = () => {
    const [types, setTypes] = useState([]);

    return (
        <div className="bs-page">
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">📚 Book Types</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="..">Dashboard</Link><span>/</span>
                        <Link to="..">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Book Types</span>
                    </nav>
                </div>
                <button className="bs-btn bs-btn-primary bs-btn-animated">＋ Add New Type</button>
            </div>

            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">Manage Book Classifications</h5>
                </div>
                <div className="bs-table-wrap">
                    <table className="bs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Type Name</th>
                                <th>Description</th>
                                <th>Active Items</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {types.map((t, i) => (
                                <tr key={t.id}>
                                    <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                                    <td style={{ color: 'var(--bs-muted)', maxWidth: 300 }}>{t.description}</td>
                                    <td style={{ fontWeight: 600 }}>{t.count}</td>
                                    <td>
                                        <span className={`bs-badge ${t.status === 'Active' ? 'bs-badge-green' : 'bs-badge-red'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="bs-btn-icon">✏️</button>
                                            <button className="bs-btn-icon" style={{ opacity: 0.5 }}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookTypes;
