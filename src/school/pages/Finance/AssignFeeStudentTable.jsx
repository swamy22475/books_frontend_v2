import React, { useMemo, useState, useEffect, useRef } from 'react';
import './FeeTypes.css';
import TableFilter from '../../../components/common/TableFilter';
import TableToolbar from '../../../components/common/TableToolbar';
import FilterPanel from '../../../components/common/FilterPanel';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';

const AssignFeeStudentTable = ({ students, fees, onSaveAssignments }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [studentFeeMap, setStudentFeeMap] = useState({}); // { id: { feeName: true/false } }
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set([
    'checkbox', 'admission', 'name', 'class', 'section', 'total', 'actions'
  ]));
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterButtonRef = useRef(null);
  const headerRef = React.useRef(null);
  
  // Get unique classes and sections
  const uniqueClasses = useMemo(() => {
    return [...new Set(students.map(s => s.class).filter(Boolean))].sort((a, b) => a - b);
  }, [students]);
  
  const uniqueSections = useMemo(() => {
    return [...new Set(students.map(s => s.section).filter(Boolean))].sort();
  }, [students]);
  
  // Column definitions
  const baseColumns = [
    { key: 'checkbox', label: 'Checkbox' },
    { key: 'admission', label: 'Admission No' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'section', label: 'Section' },
    ...fees.map(f => ({ key: `fee-${f.name}`, label: f.name })),
    { key: 'total', label: 'Total Fee' },
    { key: 'actions', label: 'Actions' }
  ];
  
  // Filter definitions
  const filterOptions = [
    { 
      key: 'class', 
      label: 'Class',
      type: 'select',
      options: uniqueClasses.map(c => String(c))
    },
    {
      key: 'section',
      label: 'Section',
      type: 'select',
      options: uniqueSections
    }
  ];
  
  // Filter students based on search and row filters
  const filteredStudents = useMemo(() => {
    let filtered = students.filter(s =>
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.admissionNo || s.id || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (selectedFilters.class) {
      filtered = filtered.filter(s => String(s.class) === selectedFilters.class);
    }
    
    if (selectedFilters.section) {
      filtered = filtered.filter(s => s.section === selectedFilters.section);
    }
    
    return filtered;
  }, [students, searchQuery, selectedFilters]);

  useEffect(() => {
    // initialize map
    const m = {};
    students.forEach(s => {
      m[s.id] = {};
      fees.forEach(f => m[s.id][f.name] = true);
    });
    setStudentFeeMap(m);
    setSelectedIds([]);
  }, [students, fees]);

  useEffect(() => {
    if (!headerRef.current) return;
    const all = filteredStudents.length > 0 && selectedIds.length === filteredStudents.length;
    const some = selectedIds.length > 0 && selectedIds.length < filteredStudents.length;
    headerRef.current.indeterminate = some;
    headerRef.current.checked = all;
  }, [selectedIds, filteredStudents]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) setSelectedIds([]);
    else setSelectedIds(filteredStudents.map(s => s.id));
  };

  const toggleRow = (id) => setSelectedIds(prev => {
    const set = new Set(prev);
    if (set.has(id)) set.delete(id); else set.add(id);
    return Array.from(set);
  });

  const toggleStudentFee = (sid, fname) => setStudentFeeMap(prev => {
    const copy = { ...prev };
    copy[sid] = { ...(copy[sid] || {}) };
    copy[sid][fname] = !copy[sid][fname];
    return copy;
  });

  const totals = useMemo(() => {
    const feeByName = fees.reduce((acc, f) => { acc[f.name] = f.amount; return acc; }, {});
    return students.reduce((acc, s) => {
      const sum = fees.reduce((suma, f) => suma + ((studentFeeMap[s.id] && studentFeeMap[s.id][f.name]) ? Number(f.amount) : 0), 0);
      acc[s.id] = sum;
      return acc;
    }, {});
  }, [students, fees, studentFeeMap]);

  const handleAssignSelected = () => {
    if (selectedIds.length === 0) { alert('Select students to assign'); return; }
    const assignments = {};
    selectedIds.forEach(id => {
      assignments[id] = {};
      fees.forEach(f => { if (!(studentFeeMap[id] && studentFeeMap[id][f.name]) === false) {};
        assignments[id][f.name] = !!(studentFeeMap[id] && studentFeeMap[id][f.name]);
      });
    });
    onSaveAssignments(assignments);
    alert('Assigned fees to selected students');
  };

  const getExportData = () => {
    const feeNames = fees.map(f => f.name);
    return students.map(s => {
      const row = { admissionNo: s.admissionNo || s.id, name: s.name, class: s.class, section: s.section };
      let total = 0;
      feeNames.forEach(fn => {
        const enabled = (studentFeeMap[s.id] && studentFeeMap[s.id][fn]) !== false;
        const amt = enabled ? (fees.find(f=>f.name===fn)?.amount||0) : 0;
        row[fn] = amt;
        total += amt;
      });
      row.totalFee = total;
      return row;
    });
  };

  const handleExport = async (type) => {
    const data = getExportData();
    const feeNames = fees.map(f => f.name);
    const columns = ['admissionNo','name','class','section', ...feeNames, 'totalFee'];
    const labels = { admissionNo: 'Adm No', name: 'Name', class: 'Class', section: 'Section', totalFee: 'Total Fee' };
    feeNames.forEach(fn => labels[fn] = fn);
    try {
      if (type === 'copy') await copyToClipboard(data, columns, labels);
      if (type === 'csv') await exportToCSV(data, columns, labels, 'assign-fees');
      if (type === 'excel') await exportToExcel(data, columns, labels, 'assign-fees', 'AssignFees');
      if (type === 'pdf') await exportToPDF(data, columns, labels, 'assign-fees', 'Assign Fees');
      if (type === 'print') await printTable(data, columns, labels, 'Assign Fees');
    } catch (err) { alert(err.message || 'Export failed'); }
  };

  return (
    <div className="card table-card soft-card" style={{padding:12, marginTop:12}}>
      {/* New Table Toolbar with FilterPanel */}
      <TableToolbar
        ref={filterButtonRef}
        title="Assign Fees"
        onColumnsClick={() => setShowFilterPanel(true)}
        onFilterClick={() => setShowFilterPanel(true)}
        showColumnsButton={true}
        showSortButton={false}
      />

      {/* FilterPanel Component */}
      <FilterPanel
        columns={baseColumns}
        visibleColumns={visibleColumns}
        onColumnsChange={setVisibleColumns}
        filterOptions={filterOptions}
        filterValues={selectedFilters}
        onFilterChange={setSelectedFilters}
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        triggerRef={filterButtonRef}
      />

      {/* Search Bar */}
      <div className="filter-bar">
        <div className="filter-inputs">
          <input
            type="text"
            placeholder="Search by student name or admission number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid var(--sl-border-color)',
              borderRadius: '6px',
              fontSize: '13px',
              color: 'var(--sl-text-color)',
              backgroundColor: 'var(--sl-input-bg)',
              outline: 'none'
            }}
          />
        </div>
      </div>
      
      <div className="table-toolbar">
        <div className="table-stats"><strong>{filteredStudents.length}</strong> students</div>
        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={()=>handleExport('copy')}>Copy</button>
          <button className="toolbar-btn" onClick={()=>handleExport('csv')}>CSV</button>
          <button className="toolbar-btn" onClick={()=>handleExport('excel')}>Excel</button>
          <button className="toolbar-btn" onClick={()=>handleExport('pdf')}>PDF</button>
          <button className="toolbar-btn" onClick={()=>handleExport('print')}>Print</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="fee-types-table">
          <thead>
            <tr>
              {visibleColumns.has('checkbox') && (<th className="checkbox-col"><input ref={headerRef} type="checkbox" onChange={toggleSelectAll} /></th>)}
              {visibleColumns.has('admission') && (<th>Admission No</th>)}
              {visibleColumns.has('name') && (<th>Name</th>)}
              {visibleColumns.has('class') && (<th>Class</th>)}
              {visibleColumns.has('section') && (<th>Section</th>)}
              {fees.map(f => visibleColumns.has(`fee-${f.name}`) && (<th key={f.name}>{f.name}</th>))}
              {visibleColumns.has('total') && (<th>Total Fee</th>)}
              {visibleColumns.has('actions') && (<th>Actions</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id}>
                {visibleColumns.has('checkbox') && (<td><input type="checkbox" checked={selectedIds.includes(s.id)} onChange={()=>toggleRow(s.id)} /></td>)}
                {visibleColumns.has('admission') && (<td>{s.admissionNo || s.id}</td>)}
                {visibleColumns.has('name') && (<td>{s.name}</td>)}
                {visibleColumns.has('class') && (<td>{s.class}</td>)}
                {visibleColumns.has('section') && (<td>{s.section}</td>)}
                {fees.map(f => visibleColumns.has(`fee-${f.name}`) && (
                  <td key={f.name}>
                    <label style={{display:'flex',alignItems:'center',gap:8}}>
                      <input type="checkbox" checked={(studentFeeMap[s.id] && studentFeeMap[s.id][f.name]) !== false} onChange={()=>toggleStudentFee(s.id, f.name)} />
                      <span>₹ {Number(f.amount).toFixed(2)}</span>
                    </label>
                  </td>
                ))}
                {visibleColumns.has('total') && (<td><span className="status-badge">₹ { (totals[s.id]||0).toFixed(2) }</span></td>)}
                {visibleColumns.has('actions') && (
                  <td>
                    <div style={{display:'flex',gap:8}}>
                      <button className="icon-btn" title="View">👁️</button>
                      <button className="icon-btn" title="Edit">✏️</button>
                      <button className="icon-btn" title="Remove">🗑️</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
        <div />
        <div>
          <button className="btn btn-primary" onClick={handleAssignSelected}>Assign Fees to Selected Students</button>
        </div>
      </div>
    </div>
  );
};

export default AssignFeeStudentTable;
