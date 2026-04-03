import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Users, UserPlus, Edit2, Trash2, Shield, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'analyst'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', role: 'analyst' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, { 
          role: formData.role, 
          ...(formData.password ? { password: formData.password } : {}) 
        });
      } else {
        await api.createUser(formData);
      }
      handleCloseModal();
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading && users.length === 0) {
    return <div className="p-8 text-soc-muted">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-soc-text flex items-center gap-2">
            <Users className="w-6 h-6 text-soc-blue" />
            User Management
          </h2>
          <p className="text-soc-muted text-sm mt-1">Manage system access and roles</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-soc-blue text-white rounded-lg hover:bg-soc-blue/90 transition-colors font-bold text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="p-4 bg-soc-red/10 border border-soc-red/20 text-soc-red rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-soc-surface border border-soc-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-soc-bg border-b border-soc-border text-soc-muted">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Username</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Created</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-soc-bg/50 transition-colors">
                <td className="px-6 py-4 font-medium text-soc-text">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.role === 'admin' ? 'bg-soc-red/10 text-soc-red' : 'bg-soc-blue/10 text-soc-blue'
                  }`}>
                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-soc-muted">
                  {formatDistanceToNow(new Date(user.created_at))} ago
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-1.5 text-soc-muted hover:text-soc-blue hover:bg-soc-blue/10 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 text-soc-muted hover:text-soc-red hover:bg-soc-red/10 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-soc-surface border border-soc-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-soc-border flex justify-between items-center bg-soc-bg/50">
                <h3 className="font-bold flex items-center gap-2 text-soc-text">
                  {editingUser ? <Edit2 className="w-5 h-5 text-soc-blue" /> : <UserPlus className="w-5 h-5 text-soc-blue" />}
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button onClick={handleCloseModal} className="p-1 hover:bg-soc-border rounded-md transition-colors text-soc-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-soc-muted tracking-widest ml-1">Username</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-soc-bg border border-soc-border rounded-xl px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-blue/50 disabled:opacity-50"
                    placeholder="Enter username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-soc-muted tracking-widest ml-1">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-soc-bg border border-soc-border rounded-xl px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-blue/50"
                    placeholder="Enter password"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-soc-muted tracking-widest ml-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-soc-bg border border-soc-border rounded-xl px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-blue/50"
                  >
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-bold text-soc-text hover:bg-soc-border rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold bg-soc-blue text-white hover:bg-soc-blue/90 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
