'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Save, KeyRound, User as UserIcon } from 'lucide-react';

type ProfileForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountPage() {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
  } = useForm<PasswordForm>();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmitProfile = async (data: ProfileForm) => {
    setLoadingProfile(true);
    setMessage(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Update failed');
      setMessage('✅ Profil berhasil diperbarui');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoadingProfile(false);
    }
  };

  const onSubmitPassword = async (data: PasswordForm) => {
    setLoadingPass(true);
    setMessage(null);
    if (data.newPassword !== data.confirmPassword) {
      setMessage('❌ Password baru dan konfirmasi tidak sama');
      setLoadingPass(false);
      return;
    }

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Password update failed');
      setMessage('✅ Password berhasil diubah');
      resetPass();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Manajemen Akun</h1>
      </div>

      {message && <div className="mb-4 p-3 rounded bg-gray-100 text-sm">{message}</div>}

      {/* Edit Profil */}
      <form onSubmit={handleSubmit(onSubmitProfile)} className="mb-10 border-b pb-8">
        <h2 className="text-lg font-semibold mb-4">Edit Profil</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            {...register('name', { required: true })}
            disabled={loadingProfile}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email', { required: true })}
            disabled={loadingProfile}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            type="email"
          />
        </div>
        <button
          type="submit"
          disabled={loadingProfile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>

      {/* Ganti Password */}
      <form onSubmit={handleSubmitPass(onSubmitPassword)} className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Ganti Password</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password Lama</label>
          <input
            {...registerPass('oldPassword', { required: true })}
            disabled={loadingPass}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password Baru</label>
          <input
            {...registerPass('newPassword', { required: true, minLength: 8 })}
            disabled={loadingPass}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
          <input
            {...registerPass('confirmPassword', { required: true })}
            disabled={loadingPass}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loadingPass}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <KeyRound className="w-4 h-4" />
          {loadingPass ? 'Mengubah...' : 'Ganti Password'}
        </button>
      </form>

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
