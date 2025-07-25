import React, { useEffect, useState } from 'react';
import { useWalletConnect } from '../hooks/useWallet';
import { registerUser, getUser, updateProfile, setKycStatus } from '../api/canister';

export default function Profile() {
  const { principal, isConnected } = useWalletConnect();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [kycStatus, setKycStatus] = useState('');
  const [kycSubmitting, setKycSubmitting] = useState(false);

  useEffect(() => {
    if (!principal) return;
    setLoading(true);
    setError('');
    getUser(principal)
      .then(async (u) => {
        if (!u) {
          // Auto-register user with principal as username/email/wallet for demo
          const reg = await registerUser(principal, `${principal}@icp`, principal);
          setUser(reg);
          setBio(reg?.profile?.bio || '');
          setAvatar(reg?.profile?.avatar || '');
          setKycStatus(reg?.kyc_status || 'Not Submitted');
        } else {
          setUser(u);
          setBio(u?.profile?.bio || '');
          setAvatar(u?.profile?.avatar || '');
          setKycStatus(u?.kyc_status || 'Not Submitted');
        }
      })
      .catch((e) => {
        console.error('getUser error:', e);
        setError('Failed to load user');
      })
      .finally(() => setLoading(false));
  }, [principal]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await updateProfile(bio, avatar);
      setUser(updated);
    } catch (e) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleKycSubmit = async () => {
    setKycSubmitting(true);
    setError('');
    try {
      await setKycStatus(user.id, 'Pending');
      setKycStatus('Pending');
    } catch (e) {
      setError('Failed to submit KYC request');
    } finally {
      setKycSubmitting(false);
    }
  };

  if (!isConnected) return <div className="p-8">Connect your wallet to view your profile.</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">User not found or registered.</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4 flex items-center gap-4">
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>
        )}
        <div>
          <div className="font-semibold">{user.username}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
          <div className="text-xs text-gray-500">Principal: {user.id}</div>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            className="w-full border rounded p-2 mt-1"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Avatar URL</label>
          <input
            className="w-full border rounded p-2 mt-1"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
      {/* KYC Section */}
      <div className="mt-8 p-4 border rounded">
        <div className="font-semibold mb-2">KYC Status: <span className="text-blue-600">{kycStatus}</span></div>
        {kycStatus === 'Not Submitted' || kycStatus === 'Rejected' ? (
          <button
            onClick={handleKycSubmit}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            disabled={kycSubmitting}
          >
            {kycSubmitting ? 'Submitting...' : 'Submit KYC Request'}
          </button>
        ) : kycStatus === 'Pending' ? (
          <div className="text-yellow-600">Your KYC is under review.</div>
        ) : kycStatus === 'Approved' ? (
          <div className="text-green-600">Your KYC is approved!</div>
        ) : null}
      </div>
    </div>
  );
} 