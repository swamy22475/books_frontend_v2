import React, { useState } from 'react';
import StudentCard from './StudentCard';
import { Plus, Download, Grid, List, Search, ChevronDown } from 'react-feather';

const Students = () => {
    // Mock Data matching the reference style
    const [students] = useState([
        { id: 'PRE2209', name: 'Aaliyah', class: '10', section: 'A', rollNo: '1001', gender: 'Female', image: '' },
        { id: 'PRE2213', name: 'Malynne', class: '8', section: 'A', rollNo: '1002', gender: 'Female', image: '' },
        { id: 'PRE2143', name: 'Levell Scott', class: '10', section: 'B', rollNo: '1003', gender: 'Male', image: '' },
        { id: 'PRE2431', name: 'Minnie', class: '11', section: 'C', rollNo: '1004', gender: 'Female', image: '' },
        { id: 'PRE1534', name: 'Lois A', class: '10', section: 'A', rollNo: '1005', gender: 'Female', image: '' },
        { id: 'PRE2153', name: 'Calvin', class: '9', section: 'B', rollNo: '1006', gender: 'Male', image: '' },
        { id: 'PRE1234', name: 'Joe Kelley', class: '10', section: 'B', rollNo: '1007', gender: 'Female', image: '' },
        { id: 'PRE2123', name: 'Charles', class: '8', section: 'A', rollNo: '1008', gender: 'Male', image: '' },
    ]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Students</h1>
                    <div className="text-sm text-gray-500 mt-1">
                        <span className="hover:text-blue-500 cursor-pointer">Dashboard</span>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-gray-700">Students</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
                        <Download size={16} />
                        Download
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
                        <Plus size={16} />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by ID, Name, Phone..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                            />
                        </div>
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                                <option>Sort by: ID</option>
                                <option>Sort by: Name</option>
                                <option>Sort by: Class</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                                <option>Class: All</option>
                                <option>Class 10</option>
                                <option>Class 9</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                        <button className="p-2 bg-white rounded shadow-sm text-gray-800">
                            <Grid size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-end mt-8 gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 text-sm">Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 text-sm">2</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 text-sm">Next</button>
            </div>
        </div>
    );
};

export default Students;
