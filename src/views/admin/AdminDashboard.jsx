import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  IconPlus, 
  IconUsers, 
  IconSchool, 
  IconPhone, 
  IconLock, 
  IconUser,
  IconLogout,
  IconCheck,
  IconDeviceLaptop,
  IconAlertCircle,
  IconMail,
  IconEdit,
  IconTrash,
  IconX,
  IconExternalLink,
  IconDatabase,
  IconCalendar
} from '@tabler/icons-react';
import apiClient from '../../lib/api-client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [impersonatingUserId, setImpersonatingUserId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    email: '',
    schoolName: ''
  });
  const [editFormData, setEditFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    email: '',
    schoolName: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const deletedUserIdsRef = useRef(new Set());

  useEffect(() => {
    if (!authLoading && (!user || user.tenant_id !== 'default' || user.role !== 'admin')) {
      navigate('/admin/login');
      return;
    }
  }, [user, navigate, authLoading]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/v1/auth/users', {
        headers: { 'X-Tenant-ID': 'default' }
      });
      
      // Map API response to UI format
      const mappedUsers = response
        .filter((u) => u.tenant_id !== 'default' && !deletedUserIdsRef.current.has(u.id))
        .map(u => ({
          id: u.id,
          username: u.username,
          mobile: u.mobile,
          schoolName: u.school_name,
          email: u.email,
          createdAt: u.created_at,
          tenantId: u.tenant_id,
          isAdmin: false
        }));
      
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setErrorMsg("Could not load users from server.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const openEditModal = (schoolUser) => {
    setEditingUser(schoolUser);
    setEditFormData({
      username: schoolUser.username || '',
      password: '',
      mobile: schoolUser.mobile || '',
      email: schoolUser.email || '',
      schoolName: schoolUser.schoolName || ''
    });
    setErrorMsg('');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const response = await apiClient.post('/api/v1/auth/register', {
        username: formData.username.trim(),
        password: formData.password.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        school_name: formData.schoolName.trim()
      });

      const newUser = response.user || response;
      const tenantId = response.tenant_id;
      
      setSuccessMsg(`School "${formData.schoolName}" created successfully! Tenant ID: ${tenantId}`);
      setFormData({ username: '', password: '', mobile: '', email: '', schoolName: '' });
      
      // Refresh user list from DB
      await fetchUsers();
      
      setTimeout(() => {
        setSuccessMsg('');
        setShowAddForm(false);
      }, 4000);
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.message || "Failed to create user/school";
      setErrorMsg(errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser?.id) return;

    try {
      setActionLoadingId(editingUser.id);
      setErrorMsg('');

      const payload = {
        username: editFormData.username.trim(),
        mobile: editFormData.mobile.trim(),
        email: editFormData.email.trim(),
        school_name: editFormData.schoolName.trim()
      };
      if (editFormData.password.trim()) {
        payload.password = editFormData.password.trim();
      }

      await apiClient.put(`/api/v1/auth/users/${editingUser.id}`, payload, {
        headers: { 'X-Tenant-ID': 'default' }
      });
      setSuccessMsg(`Updated ${payload.school_name || payload.username} successfully.`);
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.message || 'Failed to update user.';
      setErrorMsg(errorDetail);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser?.id) return;

    const userToDelete = deletingUser;

    try {
      setActionLoadingId(userToDelete.id);
      setErrorMsg('');
      setDeletingUser(null);
      deletedUserIdsRef.current.add(userToDelete.id);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userToDelete.id));

      await apiClient.delete(`/api/v1/auth/users/${userToDelete.id}`, {
        headers: { 'X-Tenant-ID': 'default' }
      });
      setSuccessMsg(`Deleted ${userToDelete.schoolName || userToDelete.username}.`);
      await fetchUsers();
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.message || 'Failed to delete user.';
      if (err.response?.status === 404) {
        setSuccessMsg(`${userToDelete.schoolName || userToDelete.username} was already removed.`);
        await fetchUsers();
        return;
      }
      setErrorMsg(errorDetail);
      await fetchUsers();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLoginAsSchool = async (schoolUser) => {
    if (!schoolUser?.id || !schoolUser?.tenantId) return;

    try {
      setErrorMsg('');
      setImpersonatingUserId(schoolUser.id);

      const response = await apiClient.post(`/api/v1/auth/impersonate/${schoolUser.id}`, null, {
        headers: { 'X-Tenant-ID': 'default' }
      });
      const schoolSessionUser = {
        ...response.user,
        tenant_id: response.tenant_id || response.user?.tenant_id || schoolUser.tenantId,
        role: 'school_admin'
      };

      const adminBackup = {
        token: localStorage.getItem('auth_token'),
        user: localStorage.getItem('auth_user'),
        tenantId: localStorage.getItem('tenant_id')
      };
      localStorage.setItem('admin_session_backup', JSON.stringify(adminBackup));

      sessionStorage.setItem('auth_token', response.access_token);
      sessionStorage.setItem('auth_user', JSON.stringify(schoolSessionUser));
      sessionStorage.setItem('tenant_id', schoolSessionUser.tenant_id);
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(schoolSessionUser));
      localStorage.setItem('tenant_id', schoolSessionUser.tenant_id);

      window.location.assign(`/${schoolSessionUser.tenant_id}/books`);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Could not open this school.';
      setErrorMsg(`Could not login as ${schoolUser.schoolName || schoolUser.username}: ${detail}`);
      await fetchUsers();
    } finally {
      setImpersonatingUserId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

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
        
        {user && (
          <div className="p-4 border-b border-gray-100">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Logged in as:</p>
              <p className="text-sm font-bold text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-600 mt-1">{user.school_name}</p>
            </div>
          </div>
        )}
        
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
          <h2 className="text-xl font-bold text-gray-800">School Management</h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <IconPlus size={18} />
            Create School
          </button>
        </header>

        <main className="p-8">
          {successMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <IconCheck size={14} />
              </div>
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                <IconAlertCircle size={16} />
              </div>
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Schools</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{users.length}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <IconSchool size={22} />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Users</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">1</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <IconUsers size={22} />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tenant Storage</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">Live</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <IconDatabase size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <IconUsers size={32} />
                </div>
                <h3 className="text-gray-500 font-medium">No schools found</h3>
                <p className="text-gray-400 text-sm mt-1">Start by creating a new school account</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <IconSchool size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                        title="Edit user"
                      >
                        <IconEdit size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingUser(user)}
                        className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                        title="Delete user"
                      >
                        <IconTrash size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-gray-900 truncate">{user.schoolName || 'Unnamed School'}</h4>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                      USER
                    </span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <IconUser size={16} />
                      <span>{user.username}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <IconMail size={16} />
                        <span className="truncate">{user.email}</span>
                      </div>
                    )}
                    {user.mobile && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <IconPhone size={16} />
                        <span>{user.mobile}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="text-[11px] text-gray-400 font-medium min-w-0">
                      <p className="truncate">ID: {user.tenantId}</p>
                      <p className="flex items-center gap-1 mt-1">
                        <IconCalendar size={13} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleLoginAsSchool(user)}
                      disabled={impersonatingUserId === user.id}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                    >
                      {impersonatingUserId === user.id ? 'Opening...' : <>Login <IconExternalLink size={14} /></>}
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
                  <h3 className="text-2xl font-bold text-gray-900">Create New School</h3>
                  <p className="text-gray-500 text-sm mt-1">Setup permanent school account with empty database</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  ×
                </button>
              </div>

              {successMsg && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                  <IconCheck size={16} />
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                  <IconAlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                    <div className="relative">
                      <IconUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                        placeholder="admin_user"
                        required
                        disabled={isLoading}
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
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                      placeholder="admin@school.com"
                      required
                      disabled={isLoading}
                    />
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                      placeholder="+91 9876543210"
                      disabled={isLoading}
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                      placeholder="e.g. St. Xavier's High School"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-70`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <IconPlus size={18} />
                      Create School Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edit School User</h3>
                  <p className="text-gray-500 text-sm mt-1">{editingUser.tenantId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                    <div className="relative">
                      <IconUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100"
                        required
                        disabled={actionLoadingId === editingUser.id}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                    <div className="relative">
                      <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={editFormData.password}
                        onChange={handleEditInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100"
                        placeholder="Leave blank"
                        disabled={actionLoadingId === editingUser.id}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100"
                      required
                      disabled={actionLoadingId === editingUser.id}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
                  <div className="relative">
                    <IconPhone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={editFormData.mobile}
                      onChange={handleEditInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100"
                      disabled={actionLoadingId === editingUser.id}
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
                      value={editFormData.schoolName}
                      onChange={handleEditInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100"
                      required
                      disabled={actionLoadingId === editingUser.id}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                    disabled={actionLoadingId === editingUser.id}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-70 transition-colors"
                    disabled={actionLoadingId === editingUser.id}
                  >
                    {actionLoadingId === editingUser.id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeletingUser(null)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                <IconTrash size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Delete School User?</h3>
              <p className="text-gray-500 text-sm mt-2">
                This will remove {deletingUser.schoolName || deletingUser.username} from the admin list and deactivate its school account.
              </p>
              <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{deletingUser.username}</p>
                <p className="truncate mt-1">{deletingUser.tenantId}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  disabled={actionLoadingId === deletingUser.id}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-70 transition-colors"
                  disabled={actionLoadingId === deletingUser.id}
                >
                  {actionLoadingId === deletingUser.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
