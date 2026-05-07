import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Camera, Pencil, Check, X, Lock, Eye, EyeOff } from 'lucide-react';
import { updateProfile, uploadAvatar } from '../../redux/slices/authSlice';
import authService from '../../services/auth.service';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editingName, setEditingName] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileRef = useRef();

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const handleSaveName = async () => {
    if (fullName.trim().length < 2) { setNameError('Tên tối thiểu 2 ký tự'); return; }
    setNameLoading(true); setNameError('');
    const res = await dispatch(updateProfile({ full_name: fullName.trim() }));
    setNameLoading(false);
    if (updateProfile.fulfilled.match(res)) setEditingName(false);
    else setNameError(res.payload?.message || 'Lỗi cập nhật tên');
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setAvatarError('Chỉ chấp nhận file ảnh'); return; }
    if (file.size > 2 * 1024 * 1024) { setAvatarError('Ảnh tối đa 2MB'); return; }
    setAvatarLoading(true); setAvatarError('');
    const res = await dispatch(uploadAvatar(file));
    setAvatarLoading(false);
    if (!uploadAvatar.fulfilled.match(res)) setAvatarError(res.payload?.message || 'Lỗi upload ảnh');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwError('Mật khẩu xác nhận không khớp'); return; }
    if (pwForm.next.length < 8) { setPwError('Mật khẩu mới tối thiểu 8 ký tự'); return; }
    setPwLoading(true); setPwError(''); setPwSuccess(false);
    try {
      await authService.changePassword(pwForm.current, pwForm.next);
      setPwSuccess(true);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwError(err.response?.data?.error?.message || 'Lỗi đổi mật khẩu');
    } finally {
      setPwLoading(false);
    }
  };

  const toggleShow = (field) => setShowPw(p => ({ ...p, [field]: !p[field] }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      {/* Avatar + Name */}
      <div className="card p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={avatarLoading}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{user?.email}</p>
            {avatarLoading && <p className="text-xs text-blue-500 mt-1">Đang upload...</p>}
            {avatarError && <p className="text-xs text-red-500 mt-1">{avatarError}</p>}
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Đổi ảnh đại diện
            </button>
          </div>
        </div>

        {/* Full name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Họ và tên</label>
          {editingName ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setEditingName(false); setFullName(user?.full_name || ''); } }}
                className="input flex-1"
              />
              <button onClick={handleSaveName} disabled={nameLoading} className="p-2 text-green-600 hover:bg-green-50 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setEditingName(false); setFullName(user?.full_name || ''); }} className="p-2 text-gray-400 hover:bg-gray-100 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1 group">
              <span className="text-gray-900">{user?.full_name}</span>
              <button onClick={() => setEditingName(true)} className="p-1.5 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
        </div>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-gray-500" />
          <h2 className="text-base font-semibold text-gray-900">Đổi mật khẩu</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'current', label: 'Mật khẩu hiện tại' },
            { key: 'next', label: 'Mật khẩu mới' },
            { key: 'confirm', label: 'Xác nhận mật khẩu mới' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <div className="relative mt-1">
                <input
                  type={showPw[key] ? 'text' : 'password'}
                  value={pwForm[key]}
                  onChange={(e) => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                  className="input pr-10 w-full"
                  required
                />
                <button type="button" onClick={() => toggleShow(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {pwError && <p className="text-sm text-red-500">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-green-600">Đổi mật khẩu thành công!</p>}

          <button type="submit" disabled={pwLoading} className="btn-primary w-full">
            {pwLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
