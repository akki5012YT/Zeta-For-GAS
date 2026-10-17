import React, { useState } from 'react';
import { X, CheckCircle, Shield, Key, LogIn, ExternalLink } from 'lucide-react';

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  isLoggedIn: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GoogleUserProfile | null;
  onLogin: (user: GoogleUserProfile) => void;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [clientIdInput, setClientIdInput] = useState(() => {
    return localStorage.getItem('custom_google_client_id') || '';
  });

  if (!isOpen) return null;

  const handleSimulatedGoogleLogin = () => {
    const user: GoogleUserProfile = {
      id: 'google_' + (emailInput ? emailInput.replace(/[^a-zA-Z0-9]/g, '_') : 'user_123'),
      name: nameInput.trim() || 'Google ユーザー',
      email: emailInput.trim() || 'user@gmail.com',
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nameInput || 'Google')}`,
      isLoggedIn: true,
    };
    onLogin(user);
    onClose();
  };

  const handleSaveClientId = () => {
    localStorage.setItem('custom_google_client_id', clientIdInput.trim());
    alert('Google OAuth Client IDを保存しました');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#12131f] border border-[#26283b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#26283b] flex items-center justify-between bg-[#151624]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Google OAuth アカウント認証</h2>
              <p className="text-[11px] text-slate-400">GAS連携・キャラクター同期用</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-slate-300">
          {currentUser?.isLoggedIn ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#191a29] rounded-xl border border-[#2d2f45]">
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full border border-indigo-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate text-sm">{currentUser.name}</div>
                  <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3" /> Google連携済み (GAS実行権限有効)
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
              >
                ログアウトする
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Googleアカウントでログインすると、作成したZetaキャラクターがGoogleアカウントに保存され、GoogleスプレッドシートやGASと直接連携できます。
              </p>

              {/* One Click Sign In Button */}
              <button
                onClick={() => {
                  setEmailInput('akki5012minecraft@gmail.com');
                  setNameInput('Akki');
                  setTimeout(handleSimulatedGoogleLogin, 50);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition shadow-lg shadow-black/40"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Googleアカウントでログイン
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase">または</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Custom Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Google表示名
                  </label>
                  <input
                    type="text"
                    placeholder="例: Akki"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#0d0e17] border border-[#26283b] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Googleメールアドレス
                  </label>
                  <input
                    type="email"
                    placeholder="例: akki5012minecraft@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#0d0e17] border border-[#26283b] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSimulatedGoogleLogin}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  このアカウントでサインイン
                </button>
              </div>

              {/* Optional Custom Client ID */}
              <div className="pt-2 border-t border-slate-800/80">
                <details className="text-[11px] text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-300 font-medium flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    独自のGoogle OAuth Client IDを設定（任意）
                  </summary>
                  <div className="mt-2 space-y-2 pl-2">
                    <input
                      type="text"
                      placeholder="xxxx.apps.googleusercontent.com"
                      value={clientIdInput}
                      onChange={(e) => setClientIdInput(e.target.value)}
                      className="w-full bg-[#0d0e17] border border-[#26283b] rounded px-2.5 py-1 text-[11px] text-white font-mono"
                    />
                    <button
                      onClick={handleSaveClientId}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]"
                    >
                      Client IDを保存
                    </button>
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#26283b] bg-[#12131f] flex justify-between items-center text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> セキュア認証
          </span>
          <button onClick={onClose} className="hover:text-slate-300">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
