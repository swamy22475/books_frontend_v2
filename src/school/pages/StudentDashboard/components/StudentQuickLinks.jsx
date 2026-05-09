import { IconCash, IconClipboardCheck, IconCalendar, IconUserCheck, IconDeviceLaptop } from '@tabler/icons-react';

const StudentQuickLinks = () => {
    const links = [
        {
            title: 'Pay Fees',
            icon: IconCash,
            color: '#3d5ee1',
            bgColor: '#e8f0ff',
            link: '/student-fees'
        },
        {
            title: 'Online Exam',
            icon: IconDeviceLaptop,
            color: '#7367f0',
            bgColor: '#ebe9fe',
            link: '/school/examination/online-exam'
        },
        {
            title: 'Exam Result',
            icon: IconClipboardCheck,
            color: '#28c76f',
            bgColor: '#e5f8ed',
            link: '/student-result'
        },
        {
            title: 'Calendar',
            icon: IconCalendar,
            color: '#ff9f43',
            bgColor: '#fff5e8',
            link: '/student-time-table'
        },
        {
            title: 'Attendance',
            icon: IconUserCheck,
            color: '#ea5455',
            bgColor: '#fce8e8',
            link: '/student-leaves'
        }
    ];

    return (
        <div className="quicklinks-grid-2x2">
            {links.map((item, index) => (
                <a key={index} href={item.link} className="quicklink-card-mini">
                    <div
                        className="quicklink-icon-mini"
                        style={{ backgroundColor: item.bgColor, color: item.color }}
                    >
                        <item.icon size={22} />
                    </div>
                    <span className="quicklink-title-mini">{item.title}</span>
                </a>
            ))}
        </div>
    );
};

export default StudentQuickLinks;
