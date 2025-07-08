import React, { useEffect, useState } from 'react';
import { listUsers, setKycStatus, setUserRole, listAssets, approveAsset } from '../api/canister';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      listUsers(),
      listAssets()
    ])
      .then(([u, a]) => {
        setUsers(u);
        setAssets(a);
      })
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleKyc = async (user_id, status) => {
    await setKycStatus(user_id, status);
    setUsers(users => users.map(u => u.id === user_id ? { ...u, kyc_status: status } : u));
  };

  const handleRole = async (user_id, role) => {
    await setUserRole(user_id, role);
    setUsers(users => users.map(u => u.id === user_id ? { ...u, role } : u));
  };

  const handleApproveAsset = async (asset_id) => {
    await approveAsset(asset_id);
    setAssets(assets => assets.map(a => a.id === asset_id ? { ...a, status: 'Approved' } : a));
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <table className="w-full border rounded mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">KYC</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.kyc_status}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleKyc(u.id, 'Approved')} className="px-2 py-1 bg-green-600 text-white rounded">Approve KYC</button>
                  <button onClick={() => handleKyc(u.id, 'Rejected')} className="px-2 py-1 bg-red-600 text-white rounded">Reject KYC</button>
                  <button onClick={() => handleRole(u.id, 'Admin')} className="px-2 py-1 bg-purple-600 text-white rounded">Make Admin</button>
                  <button onClick={() => handleRole(u.id, 'User')} className="px-2 py-1 bg-gray-600 text-white rounded">Make User</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Assets</h3>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.owner_id}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">
                  {a.status !== 'Approved' && (
                    <button onClick={() => handleApproveAsset(a.id)} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 