import { useState, useEffect, useRef  } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User, Mail, Shield, Camera, Check, Lock, Eye, EyeOff, Leaf, Star, ImagePlus, Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
  const { user, setUser, ecoCredits, trustScore, logout } = useAppContext();
  const navigate = useNavigate();

  const [name,      setName]      = useState(user?.name  || '');
  const [email,     setEmail]     = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [toast,     setToast]     = useState(null);

  const [oldPass,   setOldPass]   = useState('');
  const [newPass,   setNewPass]   = useState('');
  const [showOld,   setShowOld]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);

  // Avatar & cover state
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || null);
  const [coverSrc,  setCoverSrc]  = useState(user?.cover  || null);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput,     setDeleteInput]     = useState('');

  const avatarInputRef = useRef(null);
  const coverInputRef  = useRef(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── handlers ── */
  const showToast = (type, msg) => setToast({ type, msg });

  const onSave = () => {
    if (!name.trim()) { showToast('error', 'Name cannot be empty.'); return; }
    setUser({ ...user, name, email, avatar: avatarSrc, cover: coverSrc });
    setIsEditing(false);
    showToast('success', 'Profile updated successfully!');
  };

  const onCancel = () => {
    setName(user?.name  || '');
    setEmail(user?.email || '');
    setAvatarSrc(user?.avatar || null);
    setCoverSrc(user?.cover   || null);
    setIsEditing(false);
  };

  const onPasswordSave = () => {
    if (!oldPass || !newPass) { showToast('error', 'Please fill both password fields.'); return; }
    if (newPass.length < 6)   { showToast('error', 'Password must be at least 6 characters.'); return; }
    setOldPass(''); setNewPass('');
    showToast('success', 'Password changed successfully!');
  };

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('error', 'Please select an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onAvatarDelete = () => {
    setAvatarSrc(null);
    showToast('success', 'Avatar removed successfully!');
  };

  const onCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('error', 'Please select an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCoverSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

const onDeleteAccount = () => {
  if (deleteInput !== 'DELETE') {
    showToast('error', 'Type DELETE to confirm.');
    return;
  }

  logout?.();

  setShowDeleteModal(false);
  showToast('success', 'Account deleted successfully.');

  // 👇 redirect to home
  setTimeout(() => {
    navigate('/');
  }, 500);
};

  /* ── helpers ── */
  const initials = name.trim()
    ? name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const roleLabel = user?.roles?.map(r =>
    r === 'buyer' ? 'Buyer' : r === 'seller' ? 'Seller' : 'Creator'
  ).join(' · ') || (user?.role === 'admin' ? 'Admin' : 'Member');

  const passStrength = newPass.length === 0 ? 0 : newPass.length < 4 ? 1 : newPass.length < 7 ? 2 : newPass.length < 10 ? 3 : 4;
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'][passStrength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passStrength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 py-10 px-4">

      {/* ── Toast ── */}
      <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md border
          ${toast?.type === 'success' 
            ? 'bg-green-500/95 dark:bg-green-600/95 border-green-400/30 text-white' 
            : 'bg-red-500/95 dark:bg-red-600/95 border-red-400/30 text-white'}`}>
          {toast?.type === 'success' ? <Check size={18} className="shrink-0" /> : <AlertTriangle size={18} className="shrink-0" />}
          <span className="text-sm font-medium flex-1">{toast?.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}>
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-red-200 dark:border-red-900/50 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Delete Account</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action is irreversible.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm.
            </p>
            <input
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 mb-4
                transition-all duration-200"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setDeleteInput(''); }}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-gray-200 dark:border-gray-700
                  text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={onDeleteAccount}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white
                  bg-red-600 hover:bg-red-700 transition-all duration-200 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={deleteInput !== 'DELETE'}>
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-6">

        {/* ── Profile Header Card ── */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">

          {/* Cover */}
          <div className="relative h-36 group cursor-pointer overflow-hidden" onClick={() => coverInputRef.current?.click()}>
            {coverSrc ? (
              <img src={coverSrc} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              </div>
            )}
            {/* Cover hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95
                flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white shadow-lg">
                <ImagePlus size={16} />
                Change Cover
              </div>
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
          </div>

          <div className="px-8 pb-8">
            {/* Avatar + buttons row */}
            <div className="flex items-end justify-between -mt-14 mb-5">

              {/* Avatar */}
              <div className="relative group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                  <div className="relative h-28 w-28 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-105"
                    onClick={() => avatarInputRef.current?.click()}>
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600
                        flex items-center justify-center text-white text-3xl font-bold">
                        {initials}
                      </div>
                    )}
                    {/* Avatar hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300
                      flex items-center justify-center">
                      <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
                    </div>
                  </div>
                  
                  {/* Delete avatar button overlay */}
                  {avatarSrc && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onAvatarDelete(); }}
                      className="absolute -top-1 -right-1 p-1.5 bg-red-500 hover:bg-red-600 rounded-full shadow-lg
                        opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100
                        cursor-pointer ring-2 ring-white dark:ring-gray-900"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                  )}
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              </div>

              {/* Action buttons */}
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-semibold
                    text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                    hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={onCancel}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-semibold
                      text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm transition-all duration-200 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={onSave}
                    className="rounded-xl px-6 py-2 text-sm font-semibold text-white
                      bg-gradient-to-r from-green-600 to-emerald-600
                      hover:from-green-700 hover:to-emerald-700
                      shadow-md hover:shadow-xl hover:-translate-y-0.5
                      transition-all duration-200 cursor-pointer">
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Name & role */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'Member'}</h1>
                {user?.role === 'admin' && (
                  <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">ADMIN</span>
                )}
                {isEditing && (
                  <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">EDITING</span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{roleLabel}</p>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: Leaf,   label: 'EcoCredits', value: ecoCredits ?? 0,          color: 'text-green-600 dark:text-green-400' },
                { icon: Star,   label: 'Trust Score', value: `${trustScore ?? 0}`,     color: 'text-amber-500 dark:text-amber-400' },
                { icon: Shield, label: 'Role',        value: user?.role === 'admin' ? 'Admin' : 'Member', color: 'text-blue-600 dark:text-blue-400' },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-3 text-center hover:shadow-md transition-all duration-200">
                  <s.icon size={18} className={`mx-auto mb-1.5 ${s.color}`} />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Personal Info Card ── */}
        <div className={`rounded-2xl border bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300
          ${isEditing ? 'border-green-400 dark:border-green-600 ring-2 ring-green-400/30' : 'border-gray-200/80 dark:border-gray-800'}`}>
          <div className="px-8 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <User size={16} className="text-green-600 dark:text-green-400" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h2>
          </div>
          <div className="px-8 py-6 space-y-5">
            {[
              { label: 'Full Name', icon: User,  value: name,  set: setName,  type: 'text',  placeholder: 'Your full name' },
              { label: 'Email',     icon: Mail,  value: email, set: setEmail, type: 'email', placeholder: 'your@email.com' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {f.label}
                </label>
                <div className="relative">
                  <f.icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    disabled={!isEditing}
                    placeholder={f.placeholder}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm border transition-all duration-200
                      text-gray-900 dark:text-white
                      ${isEditing
                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 focus:shadow-md cursor-text'
                        : 'border-transparent bg-gray-50/80 dark:bg-gray-800/80 cursor-default'}`}
                  />
                </div>
              </div>
            ))}

            {user?.roles?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Roles</label>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map(r => (
                    <span key={r} className="rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800
                      px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                      {r === 'buyer' ? '🛍 Buyer' : r === 'seller' ? '🏪 Seller' : '🎨 Creator'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Security Card ── */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="px-8 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Lock size={16} className="text-green-600 dark:text-green-400" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Security</h2>
          </div>
          <div className="px-8 py-6 space-y-5">
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your password to keep your account secure.</p>

            {[
              { label: 'Current Password', val: oldPass, set: setOldPass, show: showOld, toggle: () => setShowOld(v => !v) },
              { label: 'New Password',     val: newPass, set: setNewPass, show: showNew, toggle: () => setShowNew(v => !v) },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {f.label}
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={f.show ? 'text' : 'password'}
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 rounded-xl text-sm border
                      border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80
                      text-gray-900 dark:text-white cursor-text
                      focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 focus:shadow-md
                      transition-all duration-200"
                  />
                  <button type="button" onClick={f.toggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                    {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}

            {newPass && (
              <div>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${i <= passStrength ? strengthColor : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 font-medium">{strengthLabel}</p>
              </div>
            )}

            <button onClick={onPasswordSave}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white
                bg-gradient-to-r from-green-600 to-emerald-600
                hover:from-green-700 hover:to-emerald-700
                shadow-md hover:shadow-xl hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer">
              Update Password
            </button>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="px-8 py-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-2">
            <Shield size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          </div>
          <div className="px-8 py-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Permanently remove your account and all data.</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)}
              className="shrink-0 rounded-xl border border-red-200 dark:border-red-800 px-5 py-2
                text-sm font-semibold text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md transition-all duration-200 cursor-pointer
                flex items-center gap-2">
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;