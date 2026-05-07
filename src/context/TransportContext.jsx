import React, { createContext, useState, useEffect } from 'react';

export const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
    // Initial Seed Data for Vehicles (matches ManageVehicles.jsx)
    const VEHICLE_SEED = [
        { id: 1, vehicleNo: 'VH-1001', model: 'Volvo Bus 2023', driver: 'Rajesh Kumar', license: 'DL-04-2021-12345', phone: '9876543210', capacity: 40, status: 'Active' },
        { id: 2, vehicleNo: 'VH-1002', model: 'Tata Starbus', driver: 'Suresh Singh', license: 'DL-04-2020-67890', phone: '9123456780', capacity: 35, status: 'Inactive' },
        { id: 3, vehicleNo: 'VH-1003', model: 'Force Traveler', driver: 'Amit Verma', license: 'DL-04-2022-54321', phone: '9988776655', capacity: 20, status: 'Active' },
    ];

    // Initial Seed Data for Routes (matches ManageRoutes.jsx)
    const ROUTE_SEED = [
        { id: 1, routeNo: 'RT-001', routeName: 'North Zone', startPoint: 'City Center', endPoint: 'North Campus', stops: 8, distance: '12 km', vehicle: 'VH-1001', driver: 'Rajesh Kumar', status: 'Active' },
        { id: 2, routeNo: 'RT-002', routeName: 'South Zone', startPoint: 'South Market', endPoint: 'South Campus', stops: 6, distance: '9 km', vehicle: 'VH-1002', driver: 'Suresh Singh', status: 'Inactive' },
        { id: 3, routeNo: 'RT-003', routeName: 'East Corridor', startPoint: 'East Station', endPoint: 'East Campus', stops: 10, distance: '15 km', vehicle: 'VH-1003', driver: 'Amit Verma', status: 'Active' },
    ];

    // Initial Seed Data for Student Transports
    const STUDENT_TRANSPORT_SEED = [
        { id: 101, studentId: 'PRE2209', admissionNo: 'PRE2209', classId: '10', sectionId: 'A', vehicleId: '1', routeId: '1', pickupPoint: 'Main Gate', driverName: 'Rajesh Kumar', transportFee: '1500', status: 'Active' },
        { id: 102, studentId: 'PRE2213', admissionNo: 'PRE2213', classId: '8', sectionId: 'A', vehicleId: '2', routeId: '2', pickupPoint: 'Cross Road', driverName: 'Suresh Singh', transportFee: '1200', status: 'Active' },
        { id: 103, studentId: 'PRE2143', admissionNo: 'PRE2143', classId: '10', sectionId: 'B', vehicleId: '1', routeId: '1', pickupPoint: 'City Mall', driverName: 'Rajesh Kumar', transportFee: '1500', status: 'Active' },
        { id: 104, studentId: 'PRE1534', admissionNo: 'PRE1534', classId: '10', sectionId: 'A', vehicleId: '3', routeId: '3', pickupPoint: 'East Station', driverName: 'Amit Verma', transportFee: '1800', status: 'Active' },
        { id: 105, studentId: 'PRE2153', admissionNo: 'PRE2153', classId: '9', sectionId: 'B', vehicleId: '2', routeId: '2', pickupPoint: 'Post Office', driverName: 'Suresh Singh', transportFee: '1200', status: 'Active' },
    ];

    const [vehicles, setVehicles] = useState(() => {
        const stored = localStorage.getItem('vehicles');
        return stored ? JSON.parse(stored) : VEHICLE_SEED;
    });

    const [routes, setRoutes] = useState(() => {
        const stored = localStorage.getItem('routes');
        return stored ? JSON.parse(stored) : ROUTE_SEED;
    });

    const [studentTransports, setStudentTransports] = useState(() => {
        const stored = localStorage.getItem('studentTransports');
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((t, i) => ({
                ...t,
                photoBase64: t.photoBase64 || `https://i.pravatar.cc/150?img=${(i * 3 + 1) % 70}`
            }));
        }
        return STUDENT_TRANSPORT_SEED.map((t, i) => ({
            ...t,
            photoBase64: t.photoBase64 || `https://i.pravatar.cc/150?img=${(i * 3 + 1) % 70}`
        }));
    });

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    useEffect(() => {
        localStorage.setItem('routes', JSON.stringify(routes));
    }, [routes]);

    useEffect(() => {
        localStorage.setItem('studentTransports', JSON.stringify(studentTransports));
    }, [studentTransports]);

    const addStudentTransport = (assignment) => {
        const newAssignment = {
            ...assignment,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        setStudentTransports(prev => [newAssignment, ...prev]);
    };

    const updateStudentTransport = (id, updatedData) => {
        setStudentTransports(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    };

    const deleteStudentTransport = (id) => {
        setStudentTransports(prev => prev.filter(t => t.id !== id));
    };

    return (
        <TransportContext.Provider value={{
            vehicles,
            routes,
            studentTransports,
            addStudentTransport,
            updateStudentTransport,
            deleteStudentTransport,
            setVehicles,
            setRoutes
        }}>
            {children}
        </TransportContext.Provider>
    );
};
