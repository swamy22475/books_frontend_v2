import React from 'react';
import { Pencil } from 'lucide-react';

const teacherPhoto = 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-05.jpg';

const TeacherProfileCard = () => {
    return (
        <div
            className="relative overflow-hidden h-full"
            style={{
                background: '#1E293B',
                borderRadius: '12px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.08)',
            }}
        >
            {/* Decorative Background Circles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Large circle */}
                <div
                    style={{
                        position: 'absolute',
                        width: '180px',
                        height: '180px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        borderRadius: '50%',
                        top: '-50px',
                        right: '10%',
                    }}
                />
                {/* Medium circle */}
                <div
                    style={{
                        position: 'absolute',
                        width: '120px',
                        height: '120px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        borderRadius: '50%',
                        top: '40px',
                        right: '35%',
                    }}
                />
                {/* Small circle */}
                <div
                    style={{
                        position: 'absolute',
                        width: '60px',
                        height: '60px',
                        background: 'rgba(99, 102, 241, 0.06)',
                        borderRadius: '50%',
                        bottom: '-10px',
                        right: '25%',
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-5">
                <div className="flex items-center gap-4">
                    {/* Photo Container with Badge and Triangle */}
                    <div className="relative flex-shrink-0">
                        {/* ID Badge - positioned at top-left */}
                        <span
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '-10px',
                                zIndex: 20,
                                background: '#8B5CF6',
                                color: 'white',
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: '600',
                                borderRadius: '4px',
                            }}
                        >
                            #T594651
                        </span>

                        {/* Teacher Photo */}
                        <div
                            style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '10px',
                                border: '3px solid white',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            <img
                                src={teacherPhoto}
                                alt="Teacher"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Blue Triangle Decoration */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '-6px',
                                left: '-6px',
                                width: '0',
                                height: '0',
                                borderStyle: 'solid',
                                borderWidth: '0 0 24px 24px',
                                borderColor: 'transparent transparent #3B82F6 transparent',
                            }}
                        />
                    </div>

                    {/* Teacher Info */}
                    <div className="flex-1">
                        <h3
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: '700',
                                marginBottom: '4px',
                                lineHeight: '1.2',
                            }}
                        >
                            Henriques Morgan
                        </h3>
                        <p
                            className="flex items-center gap-2"
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '13px',
                            }}
                        >
                            Classes : I-A, V-B
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '7px',
                                    height: '7px',
                                    background: '#F59E0B',
                                    borderRadius: '50%',
                                }}
                            />
                            <span style={{ color: '#F59E0B', fontWeight: '500' }}>Physics</span>
                        </p>
                    </div>

                    {/* Edit Profile Button - Solid Blue */}
                    <button
                        className="flex items-center gap-2 flex-shrink-0"
                        style={{
                            background: '#3B82F6',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#2563EB'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#3B82F6'}
                    >
                        <Pencil size={14} />
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfileCard;
