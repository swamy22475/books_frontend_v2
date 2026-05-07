/**
 * Reusable export utilities for tables
 * Can be used across all modules: Fee Types, Fee Groups, Fees Master, Student List, etc.
 */

/**
 * Export data to clipboard in clean tabular format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column keys to include in export
 * @param {Object} columnLabels - Map of column keys to display labels
 */
export const copyToClipboard = (data, columns, columnLabels = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to copy');
  }

  // Create headers
  const headers = columns.map(col => columnLabels[col] || col).join('\t');
  
  // Create rows
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col];
      // Handle different data types
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    }).join('\t')
  );

  // Combine and copy
  const text = [headers, ...rows].join('\n');
  
  return navigator.clipboard.writeText(text).then(() => ({
    success: true,
    message: `${data.length} row(s) copied to clipboard`
  }));
};

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column keys to include in export
 * @param {Object} columnLabels - Map of column keys to display labels
 * @param {String} filename - Output filename (without extension)
 */
export const exportToCSV = (data, columns, columnLabels = {}, filename = 'export') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Create headers
  const headers = columns.map(col => columnLabels[col] || col);
  
  // Create CSV rows
  const rows = data.map(item =>
    columns.map(col => {
      let value = item[col];
      
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      
      // Handle objects
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }
      
      // Escape quotes and wrap in quotes if contains comma, quotes, or newline
      if (value.includes('"') || value.includes(',') || value.includes('\n')) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      
      return value;
    }).join(',')
  );

  // Combine headers and rows
  const csvContent = [
    headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows
  ].join('\n');

  // Download file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  
  return {
    success: true,
    message: `${data.length} row(s) exported to CSV`
  };
};

/**
 * Export data to Excel format
 * Requires 'xlsx' library to be installed: npm install xlsx
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column keys to include in export
 * @param {Object} columnLabels - Map of column keys to display labels
 * @param {String} filename - Output filename (without extension)
 * @param {String} sheetName - Excel sheet name
 */
export const exportToExcel = (data, columns, columnLabels = {}, filename = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  try {
    // Try to use xlsx library if available
    const XLSX = window.XLSX || require('xlsx');
    
    // Create headers
    const headers = columns.map(col => columnLabels[col] || col);
    
    // Transform data to match columns
    const rowData = data.map(item =>
      columns.reduce((row, col) => {
        row[columns.indexOf(col)] = item[col] ?? '';
        return row;
      }, {})
    );

    // Create worksheet
    const worksheetData = [headers, ...rowData.map(row => Object.values(row))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Style header row if possible
    if (worksheet['!cols']) {
      worksheet['!cols'] = columns.map(() => ({ wch: 15 }));
    }

    // Create workbook and add sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Write file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return {
      success: true,
      message: `${data.length} row(s) exported to Excel`
    };
  } catch (error) {
    // Fallback: Export as CSV if xlsx not available
    console.warn('xlsx library not available, falling back to CSV format');
    return exportToCSV(data, columns, columnLabels, filename);
  }
};

/**
 * Export data to PDF format
 * Requires 'jspdf' and 'html2canvas' libraries to be installed
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column keys to include in export
 * @param {Object} columnLabels - Map of column keys to display labels
 * @param {String} filename - Output filename (without extension)
 * @param {String} title - PDF title
 */
export const exportToPDF = (data, columns, columnLabels = {}, filename = 'export', title = 'Report') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  try {
    const jsPDF = window.jsPDF || require('jspdf');
    const html2canvas = window.html2canvas || require('html2canvas');
    
    // Create a temporary table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Add headers
    const headerRow = table.insertRow();
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = columnLabels[col] || col;
      th.style.border = '1px solid #000';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f0f0f0';
      th.style.fontWeight = 'bold';
      headerRow.appendChild(th);
    });
    
    // Add data rows
    data.forEach(item => {
      const row = table.insertRow();
      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = item[col] ?? '';
        td.style.border = '1px solid #ddd';
        td.style.padding = '8px';
        row.appendChild(td);
      });
    });
    
    // Add table to hidden div
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.appendChild(table);
    document.body.appendChild(container);
    
    // Convert to canvas and PDF
    html2canvas(table).then(canvas => {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.text(title, 14, 15);
      pdf.addImage(imgData, 'PNG', 10, 25, pdfWidth - 20, imgHeight);
      pdf.save(`${filename}.pdf`);
      
      // Cleanup
      document.body.removeChild(container);
    });
    
    return {
      success: true,
      message: `${data.length} row(s) exported to PDF`
    };
  } catch (error) {
    throw new Error('PDF export requires jspdf and html2canvas libraries. Please install: npm install jspdf html2canvas');
  }
};

/**
 * Prepare table content for printing
 * Creates a print-friendly view with only the table
 * @param {Array} data - Array of objects to print
 * @param {Array} columns - Column keys to include
 * @param {Object} columnLabels - Map of column keys to display labels
 * @param {String} title - Document title
 */
export const printTable = (data, columns, columnLabels = {}, title = 'Report') => {
  if (!data || data.length === 0) {
    throw new Error('No data to print');
  }

  // Create HTML content
  let html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #fff;
          }
          h1 {
            color: #333;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #f0f0f0;
            border: 1px solid #999;
            padding: 10px;
            text-align: left;
            font-weight: bold;
          }
          td {
            border: 1px solid #999;
            padding: 8px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .print-footer {
            margin-top: 20px;
            text-align: right;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
            }
            .print-footer {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${columnLabels[col] || col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${columns.map(col => `<td>${item[col] ?? ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="print-footer">
          <p>Printed on ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

  // Open print preview
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Delay print dialog to allow document to load
  setTimeout(() => {
    printWindow.print();
  }, 250);

  return {
    success: true,
    message: `Print preview opened for ${data.length} row(s)`
  };
};

/**
 * Helper function to download file
 * @param {String} content - File content
 * @param {String} filename - Filename
 * @param {String} type - MIME type
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${type}charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Helper function to format table data for export
 * Extracts specified columns from data objects
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column keys to extract
 * @returns {Array} Formatted data
 */
export const formatExportData = (data, columns) => {
  return data.map(item =>
    columns.reduce((row, col) => {
      row[col] = item[col];
      return row;
    }, {})
  );
};
