import React from 'react';
import { Bell } from 'lucide-react';


const TeacherWelcomeBanner = () => {
    return (
        <div
            className="relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                borderRadius: '10px',
                padding: '24px 28px',
                minHeight: '120px',
                margin: '10px 0px'
            }}
        >
            {/* Decorative Illustration on the right */}
            <div className="absolute right-0 top-0 h-full pointer-events-none z-10">
                <img
                    src="https://preskool.dreamstechnologies.com/html/template/assets/img/bg/bg-01.png"
                    alt="Decorative Illustration"
                    className="h-full w-auto object-contain object-right"
                />
            </div>

            {/* Content with breathing room */}
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-2xl md:text-2xl font-bold text-white mb-2 font-family-roboto">Good Morning Ms.Teena</h1>
                <p className="text-white/80 text-base mb-4 font-family-roboto">Have a Good day at work</p>
                <p className="text-white/90 text-sm flex items-center gap-2 font-family-roboto">
                    <Bell size={18} className="flex-shrink-0" />
                    <span><strong className="text-white">Notice :</strong> There is a staff meeting at 9AM today, Don't forget to Attend!!!</span>
                </p>
            </div>
        </div>
    );
};

export default TeacherWelcomeBanner;
