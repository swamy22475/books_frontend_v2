import React from 'react';
import { Phone, Mail, MoreHorizontal, Edit, Trash2 } from 'react-feather';

import { useNavigate } from 'react-router-dom';

const StudentCard = ({ student }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/school/student-list/profile/${student.id}`)}
            className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Field 1: Profile & Identity */}
                <div className="flex items-center gap-5 w-full md:w-1/3">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-cyan-400">
                            <img
                                src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=fff&color=007bff`}
                                alt={student.name}
                                className="w-full h-full rounded-full object-cover border-2 border-white"
                            />
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${student.status === 'Inactive' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                            {student.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                                {student.id}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Field 2: Academic Info */}
                <div className="flex flex-col items-start md:items-center w-full md:w-1/3 border-l border-r border-gray-100 px-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm w-full">
                        <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Class</span>
                            <p className="font-semibold text-gray-700">{student.class} - {student.section}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Roll No</span>
                            <p className="font-semibold text-gray-700">{student.rollNo}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Gender</span>
                            <p className="font-semibold text-gray-700">{student.gender}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Parent</span>
                            <p className="font-semibold text-gray-700">{student.fatherName || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Field 3: Actions & Contact */}
                <div className="flex items-center justify-end gap-3 w-full md:w-1/3">
                    <div className="flex gap-2 mr-4">
                        <button className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Call">
                            <Phone size={18} />
                        </button>
                        <button className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Email">
                            <Mail size={18} />
                        </button>
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-2"></div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <Edit size={16} />
                        Edit
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StudentCard;
