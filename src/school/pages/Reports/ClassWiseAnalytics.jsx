import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from '../../../api/sales';
import { inventoryService } from '../../../api/inventory';
import { AcademicsContext } from '../../../context/AcademicsContext';
import './Reports.css';

/**
 * ClassWiseAnalytics - View students in a class with their complete data
 * Similar to Sales Entry UI but focused on class-wise student analytics
 */
const ClassWiseAnalytics = () => {
    const { classes, sections } = useContext(AcademicsContext);

    // State
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 15;

    // Get active classes
    const classOptions = useMemo(
        () => classes.filter(c => (c.academicStatus || 'Active') === 'Active').sort((a, b) =>
            String(a.name).localeCompare(String(b.name), undefined, { numeric: true })
        ),
        [classes]
    );

    // Get sections for selected class
    const sectionOptions = useMemo(() => {
        if (!selectedClass) return [];
        const selectedClassMeta = classOptions.find(c => c.name === selectedClass);
        if (!selectedClassMeta) return [];
        return sections
            .filter(s => Number(s.classId) === Number(selectedClassMeta.id) && (s.academicStatus || 'Active') === 'Active')
            .sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true }));
    }, [selectedClass, classOptions, sections]);

    // Reset section when class changes
    useEffect(() => {
        setSelectedSection('');
        setPage(1);
    }, [selectedClass]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sData, iData] = await Promise.all([
                    salesService.getAll(),
                    inventoryService.getAll()
                ]);
                setSales(Array.isArray(sData) ? sData : []);
                setInventory(Array.isArray(iData) ? iData : []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setSales([]);
                setInventory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Extract unique students in selected class/section
    const studentsInClass = useMemo(() => {
        let filtered = sales;

        if (selectedClass) {
            filtered = filtered.filter(s =>
                (s.student_class || s.class) === selectedClass
            );
        }

        if (selectedSection) {
            filtered = filtered.filter(s =>
                (s.student_section || '') === selectedSection
            );
        }

        // Get unique students
        const uniqueStudents = {};
        filtered.forEach(sale => {
            const studentName = sale.student_name || 'Unknown';
            if (!uniqueStudents[studentName]) {
                uniqueStudents[studentName] = {
                    name: studentName,
                    phone: sale.student_phone || 'N/A',
                    class: sale.student_class || sale.class || 'N/A',
                    section: sale.student_section || 'N/A',
                    admissionNo: sale.admission_no || 'N/A',
                    rollNo: sale.roll_no || 'N/A',
                    email: sale.email || 'N/A',
                    guardianName: sale.guardian_name || 'N/A',
                    guardianPhone: sale.guardian_phone || 'N/A',
                    books: [],
                    totalAmount: 0,
                    paidAmount: 0,
                    dueAmount: 0,
                    billCount: 0,
                    lastPurchaseDate: '',
                };
            }

            // Aggregate books and amounts
            if (sale.book_name) {
                uniqueStudents[studentName].books.push({
                    name: sale.book_name,
                    qty: sale.qty,
                    price: sale.unit_price,
                    total: (sale.total_amount || 0)
                });
            }
            uniqueStudents[studentName].totalAmount += (sale.total_amount || 0);
            uniqueStudents[studentName].paidAmount += (sale.paid_amount || 0);
            uniqueStudents[studentName].dueAmount += ((sale.total_amount || 0) - (sale.paid_amount || 0));
            uniqueStudents[studentName].billCount += 1;

            if (!uniqueStudents[studentName].lastPurchaseDate ||
                sale.date > uniqueStudents[studentName].lastPurchaseDate) {
                uniqueStudents[studentName].lastPurchaseDate = sale.date;
            }
        });

        let students = Object.values(uniqueStudents);

        // Apply search filter
        if (searchText) {
            students = students.filter(s =>
                s.name.toLowerCase().includes(searchText.toLowerCase()) ||
                s.phone.includes(searchText) ||
                s.admissionNo.includes(searchText) ||
                s.rollNo.includes(searchText)
            );
        }

        return students.sort((a, b) => a.name.localeCompare(b.name));
    }, [sales, selectedClass, selectedSection, searchText]);

    // Calculate class-wise aggregate
    const classAggregate = useMemo(() => {
        if (!selectedClass || studentsInClass.length === 0) return null;

        return {
            class: selectedClass,
            section: selectedSection || 'All',
            bills: studentsInClass.reduce((sum, s) => sum + s.billCount, 0),
            students: studentsInClass.length,
            books: studentsInClass.reduce((sum, s) => {
                return sum + s.books.reduce((bsum, b) => bsum + b.qty, 0);
            }, 0),
            revenue: studentsInClass.reduce((sum, s) => sum + s.totalAmount, 0),
            paid: studentsInClass.reduce((sum, s) => sum + s.paidAmount, 0),
            due: studentsInClass.reduce((sum, s) => sum + s.dueAmount, 0),
            profit: studentsInClass.reduce((sum, s) => sum + (s.totalAmount - s.paidAmount), 0),
        };
    }, [selectedClass, selectedSection, studentsInClass]);

    // Paginate
    const totalPages = Math.ceil(studentsInClass.length / perPage);
    const paginatedStudents = studentsInClass.slice((page - 1) * perPage, page * perPage);

    // Summary stats
    const stats = useMemo(() => ({
        totalStudents: studentsInClass.length,
        totalRevenue: studentsInClass.reduce((sum, s) => sum + s.totalAmount, 0),
        totalPaid: studentsInClass.reduce((sum, s) => sum + s.paidAmount, 0),
        totalDue: studentsInClass.reduce((sum, s) => sum + s.dueAmount, 0),
    }), [studentsInClass]);

    return (
        <div className="rpt-report-page">
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">📚 Class-wise Student Analytics</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports & Analytics</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">Class-wise Analytics</span>
                    </nav>
                </div>
            </div>

            {/* Filters Section */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Select Class & Section</h6>
                <div className="rpt-filter-grid">
                    <div className="rpt-filter-group">
                        <label>Class <span style={{ color: '#ea5455' }}>*</span></label>
                        <select
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            style={{ borderColor: selectedClass ? '#3d5ee1' : '#ddd' }}
                        >
                            <option value="">-- Select Class --</option>
                            {classOptions.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="rpt-filter-group">
                        <label>Section</label>
                        <select
                            value={selectedSection}
                            onChange={e => { setSelectedSection(e.target.value); setPage(1); }}
                            disabled={!selectedClass}
                            style={{ borderColor: selectedSection ? '#28c76f' : '#ddd', opacity: selectedClass ? 1 : 0.5 }}
                        >
                            <option value="">-- All Sections --</option>
                            {sectionOptions.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="rpt-filter-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Name, Phone, Adm No..."
                            value={searchText}
                            onChange={e => { setSearchText(e.target.value); setPage(1); }}
                            className="rpt-search-input"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            {selectedClass && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                    {[
                        { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', color: '#3d5ee1', bg: '#eef1fd' },
                        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: '#28c76f', bg: '#e8faf1' },
                        { label: 'Total Paid', value: `₹${stats.totalPaid.toLocaleString()}`, icon: '✓', color: '#00cfe8', bg: '#e6fafe' },
                        { label: 'Total Due', value: `₹${stats.totalDue.toLocaleString()}`, icon: '₹', color: '#ff9f43', bg: '#fff5e6' },
                    ].map((card, i) => (
                        <div key={i} style={{ background: card.bg, padding: 12, borderRadius: 8, borderLeft: `4px solid ${card.color}` }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{card.icon}</div>
                            <p style={{ fontSize: 11, color: 'var(--bs-muted)', margin: '0 0 4px' }}>{card.label}</p>
                            <h5 style={{ color: card.color, margin: 0, fontWeight: 700, fontSize: 16 }}>{card.value}</h5>
                        </div>
                    ))}
                </div>
            )}

            {/* Class-wise Summary Table */}
            {selectedClass && classAggregate && (
                <div className="rpt-table-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">📋 Class Summary</h5>
                    </div>
                    <div className="rpt-table-wrap">
                        <table className="rpt-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Bills</th>
                                    <th>Students</th>
                                    <th>Books Sold</th>
                                    <th>Revenue</th>
                                    <th>Paid</th>
                                    <th>Due</th>
                                    <th>Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#f8f9fb', fontWeight: 700 }}>
                                    <td style={{ color: 'var(--bs-muted)' }}>1</td>
                                    <td><span style={{ background: '#eef1fd', color: '#3d5ee1', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>{classAggregate.class}</span></td>
                                    <td><span style={{ background: '#f0edff', color: '#7367f0', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>{classAggregate.section}</span></td>
                                    <td>{classAggregate.bills}</td>
                                    <td style={{ fontWeight: 700 }}>{classAggregate.students}</td>
                                    <td style={{ fontWeight: 700 }}>{classAggregate.books}</td>
                                    <td style={{ fontWeight: 700, color: '#28c76f' }}>Rs {classAggregate.revenue.toLocaleString()}</td>
                                    <td style={{ fontWeight: 700, color: '#3d5ee1' }}>Rs {classAggregate.paid.toLocaleString()}</td>
                                    <td style={{ fontWeight: 700, color: classAggregate.due > 0 ? '#ea5455' : '#28c76f' }}>Rs {classAggregate.due.toLocaleString()}</td>
                                    <td style={{ fontWeight: 700, color: '#7367f0' }}>Rs {classAggregate.profit.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="rpt-table-card">
                <div className="rpt-card-header">
                    <div>
                        <h5 className="rpt-card-title">
                            � Individual Student Details
                            {selectedClass && ` - ${selectedClass}${selectedSection ? ` (${selectedSection})` : ''}`}
                        </h5>
                        <span style={{ fontSize: 12, color: 'var(--bs-muted)' }}>
                            {paginatedStudents.length} of {studentsInClass.length} students shown
                        </span>
                    </div>
                </div>

                {!selectedClass ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--bs-muted)' }}>
                        <p style={{ fontSize: 14 }}>👈 Please select a class to view students</p>
                    </div>
                ) : loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--bs-muted)' }}>
                        <p>Loading...</p>
                    </div>
                ) : studentsInClass.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--bs-muted)' }}>
                        <p>No students found in this class</p>
                    </div>
                ) : (
                    <>
                        <div className="rpt-table-wrap">
                            <table className="rpt-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student Name</th>
                                        <th>Section</th>
                                        <th>Phone</th>
                                        <th>Admission No</th>
                                        <th>Roll No</th>
                                        <th>Books</th>
                                        <th>Bills</th>
                                        <th>Total Amount</th>
                                        <th>Paid</th>
                                        <th>Due</th>
                                        <th>Last Purchase</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedStudents.map((student, idx) => (
                                        <tr key={student.name}>
                                            <td style={{ color: 'var(--bs-muted)', fontSize: 12 }}>
                                                {(page - 1) * perPage + idx + 1}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{student.name}</td>
                                            <td><span style={{ background: '#f0edff', color: '#7367f0', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{student.section}</span></td>
                                            <td style={{ fontSize: 12 }}>{student.phone}</td>
                                            <td style={{ fontSize: 11, color: '#7367f0', fontWeight: 600 }}>{student.admissionNo}</td>
                                            <td style={{ fontSize: 11, background: '#f0f2f7', padding: '4px 8px', borderRadius: 4, textAlign: 'center' }}>
                                                {student.rollNo}
                                            </td>
                                            <td style={{ fontSize: 11, color: 'var(--bs-muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {student.books.map((b, i) => `${b.name} (${b.qty})`).join(', ')}
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{student.billCount}</td>
                                            <td style={{ fontWeight: 700, color: '#28c76f' }}>
                                                Rs {student.totalAmount.toLocaleString()}
                                            </td>
                                            <td style={{ fontWeight: 700, color: '#3d5ee1' }}>
                                                Rs {student.paidAmount.toLocaleString()}
                                            </td>
                                            <td style={{
                                                fontWeight: 700,
                                                color: student.dueAmount > 0 ? '#ea5455' : '#28c76f'
                                            }}>
                                                Rs {student.dueAmount.toLocaleString()}
                                            </td>
                                            <td style={{ fontSize: 11, color: 'var(--bs-muted)' }}>
                                                {student.lastPurchaseDate ?
                                                    new Date(student.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {paginatedStudents.length > 0 && (
                                    <tfoot style={{ background: '#f8f9fb', fontWeight: 800 }}>
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: 'right', padding: '12px' }}>
                                                PAGE TOTALS ({paginatedStudents.length} students):
                                            </td>
                                            <td style={{ color: '#28c76f' }}>
                                                Rs {paginatedStudents.reduce((a, s) => a + s.totalAmount, 0).toLocaleString()}
                                            </td>
                                            <td style={{ color: '#3d5ee1' }}>
                                                Rs {paginatedStudents.reduce((a, s) => a + s.paidAmount, 0).toLocaleString()}
                                            </td>
                                            <td style={{ color: '#ea5455' }}>
                                                Rs {paginatedStudents.reduce((a, s) => a + s.dueAmount, 0).toLocaleString()}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="rpt-pagination" style={{ marginTop: 16, textAlign: 'center', padding: '12px 0', borderTop: '1px solid #f0f2f7' }}>
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    style={{ padding: '6px 10px', marginRight: 4, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                                >
                                    ⏮
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ padding: '6px 10px', marginRight: 4, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                                >
                                    ◀
                                </button>

                                <span style={{ margin: '0 8px', fontWeight: 600 }}>
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{ padding: '6px 10px', marginLeft: 4, marginRight: 4, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
                                >
                                    ▶
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    style={{ padding: '6px 10px', marginLeft: 4, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
                                >
                                    ⏭
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClassWiseAnalytics;
