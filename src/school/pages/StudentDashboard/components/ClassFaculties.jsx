import React from 'react';
import { IconMail, IconMessageCircle } from '@tabler/icons-react';

const ClassFaculties = () => {
    const faculties = [
        {
            name: 'Aaron',
            subject: 'Chemistry',
            img: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-01.jpg'
        },
        {
            name: 'Hellana',
            subject: 'English',
            img: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-02.jpg'
        },
        {
            name: 'Morgan',
            subject: 'Physics',
            img: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-03.jpg'
        },
        {
            name: 'Daniel Josua',
            subject: 'Spanish',
            img: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-04.jpg'
        },
        {
            name: 'Teresa',
            subject: 'Maths',
            img: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-05.jpg'
        },
        {
            name: 'Jacquelin',
            subject: 'Biology',
            img: 'https://preskool.dreamstechnologies.com/html/template/assets/img/teachers/teacher-06.jpg'
        }
    ];

    return (
        <div className="dashboard-card class-faculties-card">
            <div className="card-header">
                <h5>Class Faculties</h5>
            </div>
            <div className="card-body">
                <div className="faculties-horizontal">
                    {faculties.map((faculty, index) => (
                        <div key={index} className="faculty-card">
                            <img src={faculty.img} alt={faculty.name} className="faculty-avatar-lg" />
                            <h6 className="faculty-name">{faculty.name}</h6>
                            <span className="faculty-subject">{faculty.subject}</span>
                            <div className="faculty-actions-row">
                                <button className="action-icon-btn email">
                                    <IconMail size={16} />
                                </button>
                                <button className="action-icon-btn chat">
                                    <IconMessageCircle size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassFaculties;
