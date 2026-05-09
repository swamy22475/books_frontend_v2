import React from 'react';
import { Archive, Edit, MoreHorizontal, Eye } from 'react-feather';

const StudentCard = ({ student }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            {/* Header: ID and Status */}
            <div className="flex justify-between items-center p-4 pb-0">
                <span className="text-blue-600 font-medium text-sm">{student.id}</span>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.status === 'Inactive' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                        {student.status || 'Active'}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div className="p-4 flex flex-col">
                {/* Main Profile Info */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <img
                            src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base">
                            <a href="#" className="hover:text-blue-600 transition-colors">
                                {student.name}
                            </a>
                        </h3>
                        <p className="text-sm text-gray-500">{student.class}, {student.section}</p>
                    </div>
                </div>

                {/* Detailed Info Grid */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                        <span className="text-gray-400 block text-xs mb-1">Roll No</span>
                        <span className="font-medium text-gray-700">{student.rollNo}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-xs mb-1">Gender</span>
                        <span className="font-medium text-gray-700">{student.gender}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-xs mb-1">Joined On</span>
                        <span className="font-medium text-gray-700">{student.joinedDate || '10 Jan 2015'}</span>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center gap-2">
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors" title="Message">
                        <MessageSquare size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors" title="Call">
                        <Phone size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors" title="Email">
                        <Mail size={14} />
                    </button>
                </div>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded hover:bg-gray-200 transition-colors">
                    Add Fees
                </button>
            </div>
        </div>
    );
};

export default StudentCard;
