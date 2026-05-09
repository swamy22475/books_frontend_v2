import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconHome,
    IconClock,
    IconPlus
} from '@tabler/icons-react';
import './Academics.css';

const AddPeriod = () => {
    const { addPeriod } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [newPeriod, setNewPeriod] = useState({ name: '', startTime: '', endTime: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPeriod.name && newPeriod.startTime && newPeriod.endTime) {
            addPeriod(newPeriod);
            navigate('/school/academics/manage-periods');
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Area styled like the reference screenshot */}
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconClock size={18} stroke={2.5} />
                        <h5>Manage Periods</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/academics/manage-periods">Academics</Link>
                        <span>/</span>
                        <span className="text-gray-400">Create Period Slot</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Add School Period</h4>
                        <p className="text-gray-400 text-sm italic">Configure new academic time slots for your timetable</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Period Name Slot <span>*</span></label>
                            <input
                                type="text"
                                className="academics-form-control"
                                placeholder="e.g. 1st Period, Lunch Break"
                                value={newPeriod.name}
                                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="academics-form-field">
                                <label>Start Time <span>*</span></label>
                                <input
                                    type="time"
                                    className="academics-form-control"
                                    value={newPeriod.startTime}
                                    onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="academics-form-field">
                                <label>End Time <span>*</span></label>
                                <input
                                    type="time"
                                    className="academics-form-control"
                                    value={newPeriod.endTime}
                                    onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-10 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/academics/manage-periods')}
                                className="px-8 py-4 font-medium text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="academics-submit-btn min-w-[200px]">
                                Save Configuration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPeriod;
