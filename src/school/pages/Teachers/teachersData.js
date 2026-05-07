const DEFAULT_TEACHERS = [
    {
        id: 'T849127', name: 'Teresa', class: 'III A', subject: 'Physics', email: 'teresa@example.com', phone: '+1 82392 37359', whatsapp: '+1 82392 37359', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Teresa', joinDate: '2024-03-25',
        fatherName: 'Francis Saviour', motherName: 'Stella Bruce', dob: '1992-01-25', maritalStatus: 'Single', qualification: 'MBA', experience: '2 Years',
        gender: 'Female', bloodGroup: 'O+', address: '3495 Red Hawk Road, Buffalo Lake, MN 55314', permanentAddress: '3495 Red Hawk Road, Buffalo Lake, MN 55314',
        epfNo: '34234340', basicSalary: '100000', contractType: 'Permanent', shift: 'Morning', workLocation: '2nd Floor',
        medicalLeaves: '0', casualLeaves: '02', maternityLeaves: '0', sickLeaves: '02',
        accountName: 'Teresa', accountNumber: '8120786500', bankName: 'Bank of America', branch: 'Cincinnati', ifsc: 'BOA83209832',
        route: 'Newyork', vehicleNo: 'AM 34346', pickupPoint: 'Cincinnati',
        hostel: 'Phoenix Residence', roomNo: '20',
        facebook: 'www.facebook.com', instagram: 'www.instagram.com', linkedin: 'www.linkedin.com', youtube: 'www.youtube.com', twitter: 'www.twitter.com',
        otherInfo: "Depending on the specific needs of your organization or system, additional information may be collected or tracked."
    },
    { id: 'T849126', name: 'Daniel', class: 'II (A)', subject: 'Computer', email: 'daniel@example.com', phone: '+1 56752 86742', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Daniel', joinDate: '2024-03-28' },
    { id: 'T849125', name: 'Hellana', class: 'VI (A)', subject: 'English', email: 'hellana@example.com', phone: '+1 23566 52683', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Hellana', joinDate: '2024-04-11' },
    { id: 'T849124', name: 'Erickson', class: 'I (A)', subject: 'Chemistry', email: 'erickson@example.com', phone: '+1 26267 80542', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=Erickson', joinDate: '2024-05-12' },
    { id: 'T849123', name: 'Morgan', class: 'VIII', subject: 'Env Science', email: 'morgan@example.com', phone: '+1 63204 35730', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Morgan', joinDate: '2024-05-20' },
    { id: 'T849122', name: 'Aaron', class: 'I (A)', subject: 'Chemistry', email: 'aaron@example.com', phone: '+1 26267 80542', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=Aaron', joinDate: '2024-05-12' },
    { id: 'T849121', name: 'Jacquelin', class: 'IV', subject: 'Maths', email: 'jacquelin@example.com', phone: '+1 77502 54845', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Jacquelin', joinDate: '2024-05-20' },
    { id: 'T849120', name: 'Raul', class: 'IV', subject: 'Biology', email: 'raul@example.com', phone: '+1 67845 78784', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Raul', joinDate: '2024-05-27' },
    { id: 'T849119', name: 'Elizabeth', class: 'VII', subject: 'Finance', email: 'elizabeth@example.com', phone: '+1 23566 52683', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Elizabeth', joinDate: '10 Jun 2024' },
    { id: 'T849118', name: 'Edward', class: 'IX (C), X (C)', subject: 'Economics', email: 'edward@example.com', phone: '+1 97846 84518', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Edward', joinDate: '18 Jun 2024' },
    { id: 'T849117', name: 'Maria', class: 'IX (C), X (C)', subject: 'Spanish', email: 'maria@example.com', phone: '+1 97846 84518', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Maria', joinDate: '22 Jul 2024' },
    { id: 'T849116', name: 'Jacky', class: 'VI (A)', subject: 'English', email: 'jacky@example.com', phone: '+1 98392 37378', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=Jacky', joinDate: '28 Jul 2024' },
];

export const getTeachers = () => {
    const saved = localStorage.getItem('school_teachers');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('school_teachers', JSON.stringify(DEFAULT_TEACHERS));
    return DEFAULT_TEACHERS;
};

export const saveTeacher = (teacher) => {
    const teachers = getTeachers();
    const existingIndex = teachers.findIndex(t => t.id === teacher.id);

    let updated;
    if (existingIndex >= 0) {
        updated = teachers.map((t, i) => i === existingIndex ? teacher : t);
    } else {
        updated = [teacher, ...teachers];
    }

    localStorage.setItem('school_teachers', JSON.stringify(updated));
    return updated;
};

export const deleteTeacher = (id) => {
    const teachers = getTeachers();
    const updated = teachers.filter(t => t.id !== id);
    localStorage.setItem('school_teachers', JSON.stringify(updated));
    return updated;
};

export const toggleTeacherStatus = (id) => {
    const teachers = getTeachers();
    const updated = teachers.map(t => {
        if (t.id === id) {
            return { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' };
        }
        return t;
    });
    localStorage.setItem('school_teachers', JSON.stringify(updated));
    return updated;
};

export const teachersData = getTeachers();
