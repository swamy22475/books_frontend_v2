import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconPlus, 
  IconUsers, 
  IconSchool, 
  IconPhone, 
  IconLock, 
  IconUser,
  IconLogout,
  IconCheck,
  IconDeviceLaptop
} from '@tabler/icons-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    schoolName: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Check authentication
    const isAdmin = localStorage.getItem('admin_authenticated');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    // Load existing users
    const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    setUsers(storedUsers);
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: Date.now(),
      tenantId: formData.schoolName.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    setSuccessMsg(`User ${formData.username} created successfully!`);
    setFormData({ username: '', password: '', mobile: '', schoolName: '' });
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <IconDeviceLaptop size={20} />
            </div>
            <span className="font-bold text-gray-900 text-lg">Mindwhile</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-11">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold transition-all">
            <IconUsers size={20} />
            User Management
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
          >
            <IconLogout size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <IconPlus size={18} />
            Create New User
          </button>
        </header>

        <main className="p-8">
          {successMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-bounce">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <IconCheck size={14} />
              </div>
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <IconUsers size={32} />
                </div>
                <h3 className="text-gray-500 font-medium">No users found</h3>
                <p className="text-gray-400 text-sm mt-1">Start by creating a new user instance</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <IconSchool size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                      ID: {String(user.id).slice(-4)}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{user.schoolName}</h4>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <IconUser size={16} />
                      <span>{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <IconPhone size={16} />
                      <span>{user.mobile}</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => window.open('/auth/login', '_blank')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Login Link &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Create New Instance</h3>
                  <p className="text-gray-500 text-sm mt-1">Configure the login credentials for the school</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                    <div className="relative">
                      <IconUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="admin_school"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <div className="relative">
                      <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
                  <div className="relative">
                    <IconPhone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" 
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="+91 00000 00000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">School Name</label>
                  <div className="relative">
                    <IconSchool size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="e.g. St. Xavier's International"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] mt-4"
                >
                  Create User Instance
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
