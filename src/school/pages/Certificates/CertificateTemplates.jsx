import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IconCertificate, IconPlus, IconEdit, IconTrash, IconEye,
    IconFileText, IconDownload, IconCopy, IconSearch,
    IconLayoutGrid, IconList,
    IconTrendingUp, IconCheck, IconX, IconChevronRight,
    IconAward, IconActivity
} from '@tabler/icons-react';
import './Certificates.css';

const CATEGORY_CONFIG = {
    'Academic': { color: '#3d5ee1', bg: '#eef1fd', emoji: '🎓' },
    'Extra-curricular': { color: '#7367f0', bg: '#f0edff', emoji: '⚽' },
    'Behavior': { color: '#ff9f43', bg: '#fff5e6', emoji: '⭐' },
    'Achievement': { color: '#28c76f', bg: '#e8faf1', emoji: '🏆' },
};

const TEMPLATE_GRADIENTS = [
    'linear-gradient(135deg, #3d5ee1 0%, #6c8bf5 100%)',
    'linear-gradient(135deg, #ff9f43 0%, #ffbe76 100%)',
    'linear-gradient(135deg, #28c76f 0%, #48da89 100%)',
    'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)',
    'linear-gradient(135deg, #ea5455 0%, #f08080 100%)',
    'linear-gradient(135deg, #00cfe8 0%, #50e3f5 100%)',
];

const CertificateTemplates = () => {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Study Certificate', type: 'Study Certificate', description: 'Official study certificate for students', category: 'Academic', status: 'Active', createdAt: '2024-01-15', lastModified: '2024-02-10', usageCount: 156 },
        { id: 2, name: 'Transfer Certificate', type: 'Transfer Certificate', description: 'Transfer certificate for students leaving the school', category: 'Academic', status: 'Active', createdAt: '2024-01-20', lastModified: '2024-02-05', usageCount: 89 },
        { id: 3, name: 'Promotion Certificate', type: 'Promotion Certificate', description: 'Certificate for student promotion to next class', category: 'Academic', status: 'Active', createdAt: '2024-01-25', lastModified: '2024-01-25', usageCount: 234 },
        { id: 4, name: 'Sports Certificate', type: 'Sports Certificate', description: 'Certificate for sports achievements', category: 'Extra-curricular', status: 'Active', createdAt: '2024-02-01', lastModified: '2024-02-15', usageCount: 67 },
        { id: 5, name: 'Attendance Certificate', type: 'Attendance Certificate', description: 'Certificate for perfect attendance', category: 'Academic', status: 'Inactive', createdAt: '2024-02-10', lastModified: '2024-02-10', usageCount: 0 },
        { id: 6, name: 'Achievement Certificate', type: 'Achievement Certificate', description: 'Certificate recognizing outstanding achievement', category: 'Achievement', status: 'Active', createdAt: '2024-02-12', lastModified: '2024-02-20', usageCount: 42 },
    ]);

    const [searchText, setSearchText] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const categories = ['Academic', 'Extra-curricular', 'Behavior', 'Achievement'];
    const statuses = ['Active', 'Inactive'];

    const [newTemplate, setNewTemplate] = useState({
        name: '', type: '', description: '', category: 'Academic', status: 'Active'
    });

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => {
            const q = searchText.toLowerCase();
            const searchMatch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.type.toLowerCase().includes(q);
            return searchMatch && (!filterCategory || t.category === filterCategory) && (!filterStatus || t.status === filterStatus);
        });
    }, [templates, searchText, filterCategory, filterStatus]);

    const stats = useMemo(() => ({
        total: templates.length,
        active: templates.filter(t => t.status === 'Active').length,
        inactive: templates.filter(t => t.status === 'Inactive').length,
        totalUse: templates.reduce((s, t) => s + t.usageCount, 0),
    }), [templates]);

    const handleCreateTemplate = () => {
        if (!newTemplate.name || !newTemplate.type) return;
        const t = { id: Date.now(), ...newTemplate, createdAt: new Date().toISOString().split('T')[0], lastModified: new Date().toISOString().split('T')[0], usageCount: 0 };
        setTemplates([...templates, t]);
        setNewTemplate({ name: '', type: '', description: '', category: 'Academic', status: 'Active' });
        setShowNewModal(false);
    };

    const handleDeleteTemplate = id => {
        if (window.confirm('Are you sure you want to delete this template?'))
            setTemplates(templates.filter(t => t.id !== id));
    };

    const handleDuplicateTemplate = template => {
        const dup = { ...template, id: Date.now(), name: `${template.name} (Copy)`, createdAt: new Date().toISOString().split('T')[0], lastModified: new Date().toISOString().split('T')[0], usageCount: 0 };
        setTemplates([...templates, dup]);
    };

    const handlePreviewTemplate = template => {
        setSelectedTemplate(template);
        setShowPreviewModal(true);
    };

    const getGradient = id => TEMPLATE_GRADIENTS[(id - 1) % TEMPLATE_GRADIENTS.length];

    const getCatConfig = cat => CATEGORY_CONFIG[cat] || { color: '#9b9b9b', bg: '#f0f0f0', emoji: '📄' };

    return (
        <div className="cert-page">

            {/* ── Header ─────────────────────────────── */}
            <div className="cert-page-header">
                <div>
                    <h4 className="cert-page-title">
                        <span className="cert-title-icon"><IconAward size={22} /></span>
                        Certificate Templates
                    </h4>
                    <nav className="cert-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link>
                        <IconChevronRight size={12} style={{ margin: '0 4px', opacity: 0.5 }} />
                        <span className="cert-breadcrumb-current">Certificate Templates</span>
                    </nav>
                </div>
                <button className="cert-btn-primary" onClick={() => setShowNewModal(true)}>
                    <IconPlus size={18} /> New Template
                </button>
            </div>

            {/* ── KPI Stats ──────────────────────────── */}
            <div className="ct-stats-row">
                <div className="ct-stat-card ct-stat-blue">
                    <div className="ct-stat-icon"><IconFileText size={22} /></div>
                    <div className="ct-stat-body">
                        <p className="ct-stat-label">Total Templates</p>
                        <h3 className="ct-stat-value">{stats.total}</h3>
                    </div>
                    <div className="ct-stat-glow" />
                </div>
                <div className="ct-stat-card ct-stat-green">
                    <div className="ct-stat-icon"><IconCheck size={22} /></div>
                    <div className="ct-stat-body">
                        <p className="ct-stat-label">Active</p>
                        <h3 className="ct-stat-value">{stats.active}</h3>
                    </div>
                    <div className="ct-stat-glow" />
                </div>
                <div className="ct-stat-card ct-stat-red">
                    <div className="ct-stat-icon"><IconX size={22} /></div>
                    <div className="ct-stat-body">
                        <p className="ct-stat-label">Inactive</p>
                        <h3 className="ct-stat-value">{stats.inactive}</h3>
                    </div>
                    <div className="ct-stat-glow" />
                </div>
                <div className="ct-stat-card ct-stat-purple">
                    <div className="ct-stat-icon"><IconTrendingUp size={22} /></div>
                    <div className="ct-stat-body">
                        <p className="ct-stat-label">Total Usage</p>
                        <h3 className="ct-stat-value">{stats.totalUse}</h3>
                    </div>
                    <div className="ct-stat-glow" />
                </div>
            </div>

            {/* ── Filters ────────────────────────────── */}
            <div className="ct-filter-bar">
                <div className="ct-search-box">
                    <IconSearch size={15} className="ct-search-icon" />
                    <input
                        type="text"
                        placeholder="Search templates…"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>
                <div className="ct-filter-selects">
                    <div className="ct-select-wrap">
                        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="ct-select-wrap">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">All Status</option>
                            {statuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="ct-view-toggle">
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="Grid view"><IconLayoutGrid size={16} /></button>
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} title="List view"><IconList size={16} /></button>
                </div>
            </div>

            {/* ── Category Tabs ───────────────────────── */}
            <div className="ct-category-tabs">
                <button className={`ct-cat-tab ${!filterCategory ? 'active-all' : ''}`} onClick={() => setFilterCategory('')}>
                    All <span>{templates.length}</span>
                </button>
                {categories.map(cat => {
                    const cfg = getCatConfig(cat);
                    const cnt = templates.filter(t => t.category === cat).length;
                    return (
                        <button
                            key={cat}
                            className={`ct-cat-tab ${filterCategory === cat ? 'active' : ''}`}
                            style={filterCategory === cat ? { '--tab-color': cfg.color, '--tab-bg': cfg.bg } : {}}
                            onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
                        >
                            {cfg.emoji} {cat} <span>{cnt}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Grid / List ─────────────────────────── */}
            {filteredTemplates.length === 0 ? (
                <div className="cert-empty-state">
                    <IconFileText size={52} color="#ccc" />
                    <h5>No Templates Found</h5>
                    <p>Try adjusting your search or <button className="ct-inline-link" onClick={() => setShowNewModal(true)}>create a new template</button>.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="ct-cards-grid">
                    {filteredTemplates.map(template => {
                        const cfg = getCatConfig(template.category);
                        const grad = getGradient(template.id);
                        return (
                            <div key={template.id} className="ct-card">
                                {/* Gradient top strip */}
                                <div className="ct-card-header" style={{ background: grad }}>
                                    <div className="ct-card-icon">
                                        <IconCertificate size={28} />
                                    </div>
                                    <span className={`ct-status-pill ${template.status === 'Active' ? 'active' : 'inactive'}`}>
                                        {template.status === 'Active' ? <IconCheck size={11} /> : <IconX size={11} />}
                                        {template.status}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="ct-card-body">
                                    <h5 className="ct-card-name">{template.name}</h5>
                                    <p className="ct-card-type">{template.type}</p>
                                    <p className="ct-card-desc">{template.description}</p>

                                    <div className="ct-card-meta">
                                        <span className="ct-cat-badge" style={{ color: cfg.color, background: cfg.bg }}>
                                            {cfg.emoji} {template.category}
                                        </span>
                                        <span className="ct-usage-chip">
                                            <IconActivity size={12} /> {template.usageCount} uses
                                        </span>
                                    </div>

                                    <div className="ct-card-dates">
                                        <span>Created: {template.createdAt}</span>
                                        <span>Modified: {template.lastModified}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="ct-card-actions">
                                    <button className="ct-action-btn preview" onClick={() => handlePreviewTemplate(template)} title="Preview"><IconEye size={15} /></button>
                                    <button className="ct-action-btn duplicate" onClick={() => handleDuplicateTemplate(template)} title="Duplicate"><IconCopy size={15} /></button>
                                    <button className="ct-action-btn edit" title="Edit"><IconEdit size={15} /></button>
                                    <button className="ct-action-btn delete" onClick={() => handleDeleteTemplate(template.id)} title="Delete"><IconTrash size={15} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <div className="ct-list-table-wrap">
                    <table className="ct-list-table">
                        <thead>
                            <tr>
                                <th>Template</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Usage</th>
                                <th>Modified</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTemplates.map(template => {
                                const cfg = getCatConfig(template.category);
                                const grad = getGradient(template.id);
                                return (
                                    <tr key={template.id}>
                                        <td>
                                            <div className="ct-list-name-cell">
                                                <div className="ct-list-avatar" style={{ background: grad }}><IconCertificate size={16} /></div>
                                                <div>
                                                    <div className="ct-list-name">{template.name}</div>
                                                    <div className="ct-list-desc">{template.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="ct-cat-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.emoji} {template.category}</span></td>
                                        <td><span className={`ct-status-pill ${template.status === 'Active' ? 'active' : 'inactive'}`}>{template.status === 'Active' ? <IconCheck size={11} /> : <IconX size={11} />}{template.status}</span></td>
                                        <td><span className="ct-usage-chip"><IconActivity size={12} />{template.usageCount}</span></td>
                                        <td className="ct-list-date">{template.lastModified}</td>
                                        <td>
                                            <div className="ct-list-actions">
                                                <button className="ct-action-btn preview" onClick={() => handlePreviewTemplate(template)} title="Preview"><IconEye size={15} /></button>
                                                <button className="ct-action-btn duplicate" onClick={() => handleDuplicateTemplate(template)} title="Duplicate"><IconCopy size={15} /></button>
                                                <button className="ct-action-btn edit" title="Edit"><IconEdit size={15} /></button>
                                                <button className="ct-action-btn delete" onClick={() => handleDeleteTemplate(template.id)} title="Delete"><IconTrash size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Create Template Modal ───────────────── */}
            {showNewModal && (
                <div className="cert-modal-overlay" onClick={e => e.target === e.currentTarget && setShowNewModal(false)}>
                    <div className="cert-modal-content">
                        <div className="cert-modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3d5ee1,#7367f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    <IconCertificate size={18} />
                                </div>
                                <h4>Create New Template</h4>
                            </div>
                            <button className="cert-modal-close" onClick={() => setShowNewModal(false)}>×</button>
                        </div>
                        <div className="cert-modal-body">
                            <div className="cert-form-group" style={{ marginBottom: 14 }}>
                                <label>Template Name</label>
                                <input type="text" value={newTemplate.name} onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })} placeholder="e.g., Study Certificate" />
                            </div>
                            <div className="cert-form-group" style={{ marginBottom: 14 }}>
                                <label>Certificate Type</label>
                                <input type="text" value={newTemplate.type} onChange={e => setNewTemplate({ ...newTemplate, type: e.target.value })} placeholder="e.g., Study Certificate" />
                            </div>
                            <div className="cert-form-group" style={{ marginBottom: 14 }}>
                                <label>Description</label>
                                <textarea value={newTemplate.description} onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })} placeholder="Brief description of the template..." rows={3} />
                            </div>
                            <div className="cert-form-grid">
                                <div className="cert-form-group">
                                    <label>Category</label>
                                    <select value={newTemplate.category} onChange={e => setNewTemplate({ ...newTemplate, category: e.target.value })}>
                                        {categories.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="cert-form-group">
                                    <label>Status</label>
                                    <select value={newTemplate.status} onChange={e => setNewTemplate({ ...newTemplate, status: e.target.value })}>
                                        {statuses.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="cert-modal-footer">
                            <button className="cert-btn-secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
                            <button className="cert-btn-primary" onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.type}>
                                <IconPlus size={16} /> Create Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Preview Modal ───────────────────────── */}
            {showPreviewModal && selectedTemplate && (
                <div className="cert-modal-overlay" onClick={e => e.target === e.currentTarget && setShowPreviewModal(false)}>
                    <div className="cert-modal-content cert-modal-large">
                        <div className="cert-modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: getGradient(selectedTemplate.id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    <IconCertificate size={18} />
                                </div>
                                <h4>Preview: {selectedTemplate.name}</h4>
                            </div>
                            <button className="cert-modal-close" onClick={() => setShowPreviewModal(false)}>×</button>
                        </div>
                        <div className="cert-modal-body">
                            {/* Meta grid */}
                            <div className="cert-preview-meta" style={{ marginBottom: 20 }}>
                                {[
                                    { label: 'Category', value: selectedTemplate.category },
                                    { label: 'Status', value: selectedTemplate.status },
                                    { label: 'Used', value: `${selectedTemplate.usageCount} times` },
                                    { label: 'Created', value: selectedTemplate.createdAt },
                                    { label: 'Modified', value: selectedTemplate.lastModified },
                                ].map(m => (
                                    <div key={m.label} className="cert-preview-meta-item">
                                        <div className="cert-preview-meta-label">{m.label}</div>
                                        <div className="cert-preview-meta-value">{m.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Sample cert */}
                            <div className="ct-sample-cert" style={{ borderColor: TEMPLATE_GRADIENTS[(selectedTemplate.id - 1) % TEMPLATE_GRADIENTS.length].match(/#[0-9a-f]{6}/i)?.[0] || '#3d5ee1' }}>
                                <div className="ct-sample-cert-header" style={{ background: getGradient(selectedTemplate.id) }}>
                                    <div style={{ fontSize: 13, opacity: 0.85, letterSpacing: 2 }}>MINDWHILE INTERNATIONAL SCHOOL</div>
                                    <h3>{selectedTemplate.type.toUpperCase()}</h3>
                                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Certificate of Excellence</div>
                                </div>
                                <div className="ct-sample-cert-body">
                                    <p style={{ color: '#6e6b7b', fontSize: 13 }}>This is to certify that</p>
                                    <h4 className="ct-cert-student-name">[Student Name]</h4>
                                    <p style={{ fontSize: 13, color: '#555', maxWidth: 420, margin: '0 auto 16px' }}>
                                        {selectedTemplate.description}
                                    </p>
                                    <div className="ct-cert-seal">🏅</div>
                                </div>
                                <div className="ct-sample-cert-footer">
                                    <div className="ct-cert-sign">
                                        <div className="ct-cert-sign-line" />
                                        <p>Principal's Signature</p>
                                    </div>
                                    <div className="ct-cert-school-stamp">
                                        <div className="ct-stamp-circle">MW</div>
                                    </div>
                                    <div className="ct-cert-sign">
                                        <div className="ct-cert-sign-line" />
                                        <p>Date: [Date]</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cert-modal-footer">
                            <button className="cert-btn-secondary" onClick={() => setShowPreviewModal(false)}>Close</button>
                            <button className="cert-btn-primary"><IconDownload size={16} /> Download Sample</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateTemplates;
