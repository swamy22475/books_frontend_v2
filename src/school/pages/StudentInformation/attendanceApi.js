// Student Attendance API Helper - Dummy/Simulation Layer
// Replace fetch calls with real API endpoints when backend is ready

const STUDENT_NAMES = [
  'Aarav Patel', 'Sara Sharma', 'Rohan Kumar', 'Maya Verma', 'Isha Singh',
  'Vikram Rao', 'Neha Joshi', 'Aditya Nair', 'Priya Das', 'Kunal Mehta',
  'Ananya Mishra', 'Dev Gupta', 'Shreya Mitra', 'Arjun Verma', 'Nisha Kapoor',
  'Kabir Sharma', 'Riya Singh', 'Rahul Chopra', 'Divya Nair', 'Aryan Patel'
];

/**
 * Fetch students list for a given class and section
 * @param {string} classId - Class number (e.g., "1", "2")
 * @param {string} section - Section (e.g., "A", "B")
 * @returns {Promise<Array>} - Promise resolving to array of student objects
 */
export async function fetchStudentsMock(classId, section) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const studentCount = 20 + Math.floor(Math.random() * 10);
      const students = Array.from({ length: studentCount }).map((_, idx) => {
        const id = parseInt(classId) * 1000 + parseInt(section.charCodeAt(0)) * 100 + idx + 1;
        const name = STUDENT_NAMES[idx % STUDENT_NAMES.length];
        const admissionNo = `PRE${100000 + id}`;
        const phone = `98${String(9000 + Math.floor(Math.random() * 999)).padStart(4, '0')}`;
        
        return {
          id,
          admission_no: admissionNo,
          name,
          phone: `+91 ${phone}`,
          class: classId,
          section,
          photo: null, // Will use placeholder avatar
        };
      });
      resolve(students);
    }, 400);
  });
}

/**
 * Post attendance records to backend
 * @param {object} payload - Attendance payload with date, class, section, and records
 * @returns {Promise<object>} - API response
 */
export async function postAttendance(payload) {
  console.log('POST /api/student-attendance', payload);
  
  // Simulate network delay and validation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload.date || !payload.class || !payload.section || !payload.records) {
        reject(new Error('Invalid payload: missing required fields'));
        return;
      }
      
      if (!payload.records.length) {
        reject(new Error('No attendance records to save'));
        return;
      }

      // Validate each record has required fields
      const validStatus = ['P', 'A', 'L'];
      for (const record of payload.records) {
        if (!record.student_id || !validStatus.includes(record.status)) {
          reject(new Error('Invalid record: missing student_id or invalid status'));
          return;
        }
      }

      // Simulate successful save
      console.log(`Saved ${payload.records.length} attendance records for ${payload.date}`);
      resolve({
        ok: true,
        status: 200,
        data: {
          message: 'Attendance saved successfully',
          date: payload.date,
          class: payload.class,
          section: payload.section,
          recordsCount: payload.records.length
        }
      });
    }, 600);
  });
}

/**
 * Get unique class list
 * @returns {Array<string>} - Array of class numbers
 */
export function getUniqueClasses() {
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
}

/**
 * Get unique section list
 * @returns {Array<string>} - Array of section names
 */
export function getUniqueSections() {
  return ['A', 'B', 'C', 'D'];
}

/**
 * Export attendance data to CSV format
 * @param {Array} records - Attendance records
 * @returns {string} - CSV formatted string
 */
export function generateCSV(records) {
  const headers = ['Adm No', 'Name', 'Class', 'Section', 'Status', 'Late Minutes'];
  const rows = records.map(r => [
    r.admission_no,
    r.name,
    r.class,
    r.section,
    r.status,
    r.late_minutes || 0
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
}

/**
 * Download file helper
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export function downloadFile(content, filename, type) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
