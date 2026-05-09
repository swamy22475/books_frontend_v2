import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconHome,
    IconClock,
    IconDeviceFloppy
} from '@tabler/icons-react';
import './Academics.css';

const EditPeriod = () => {
    const { id } = useParams();
    const { periods, updatePeriod } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [period, setPeriod] = useState({ name: '', startTime: '', endTime: '' });

    useEffect(() => {
        const found = periods.find(p => p.id === parseInt(id));
        if (found) {
            setPeriod(found);
        } else {
            alert('Period not found!');
            navigate('/school/academics/manage-periods');
        }
    }, [id, periods, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (period.name && period.startTime && period.endTime) {
            updatePeriod(id, period);
            alert('Period updated successfully!');
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
                        <span className="text-gray-400">Edit Period Slot</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Edit School Period</h4>
                        <p className="text-gray-400 text-sm italic">Modify existing academic time slot configuration</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Period Name Slot <span>*</span></label>
                            <input
                                type="text"
                                className="academics-form-control"
                                placeholder="e.g. 1st Period, Lunch Break"
                                value={period.name}
                                onChange={(e) => setPeriod({ ...period, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="academics-form-field">
                                <label>Start Time <span>*</span></label>
                                <input
                                    type="time"
                                    className="academics-form-control"
                                    value={period.startTime}
                                    onChange={(e) => setPeriod({ ...period, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="academics-form-field">
                                <label>End Time <span>*</span></label>
                                <input
                                    type="time"
                                    className="academics-form-control"
                                    value={period.endTime}
                                    onChange={(e) => setPeriod({ ...period, endTime: e.target.value })}
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
                                <IconDeviceFloppy size={18} className="inline mr-2" />
                                Update Period
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPeriod;
