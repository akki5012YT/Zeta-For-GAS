/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ZetaCharacter } from './types/zeta';
import { PRESET_CHARACTERS } from './data/presets';
import { CharacterCard } from './components/CharacterCard';
import { CharacterEditor } from './components/CharacterEditor';
import { GasExportPanel } from './components/GasExportPanel';
import { ChatSimulator } from './components/ChatSimulator';
import { ZetaApiReportModal } from './components/ZetaApiReportModal';
import { GasGuideModal } from './components/GasGuideModal';
import { GoogleAuthModal, GoogleUserProfile } from './components/GoogleAuthModal';
import { FreeAiGuideModal } from './components/FreeAiGuideModal';
import {
  Sparkles,
  Search,
  Plus,
  HelpCircle,
  Globe,
  Code2,
  MessageSquare,
  Users,
  Heart,
  Download,
  Upload,
  RefreshCw,
  Layers,
  BookOpen,
  LogIn,
  CheckCircle,
  Flame,
  ShieldCheck,
} from 'lucide-react';

const STORAGE_KEY = 'zeta_gas_characters_v2';
const USER_STORAGE_KEY = 'zeta_gas_google_user';

export default function App() {
  const [characters, setCharacters] = useState<ZetaCharacter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load characters from localStorage', e);
    }
    return PRESET_CHARACTERS;
  });

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(() => {
    return characters[0]?.id || 'preset-shizuku';
  });

  const [mainView, setMainView] = useState<'cards' | 'chat' | 'gas'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Google OAuth User
  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return null;
  });

  // Modals & Editor
  const [editingCharacter, setEditingCharacter] = useState<ZetaCharacter | null | 'new'>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFreeAiOpen, setIsFreeAiOpen] = useState(false);

  // Sync characters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (e) {
      console.error('Failed to persist characters', e);
    }
  }, [characters]);

  // Sync Google user to localStorage
  const handleGoogleLogin = (user: GoogleUserProfile) => {
    setGoogleUser(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  };

  const handleGoogleLogout = () => {
    setGoogleUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const currentSelectedChar =
    characters.find(c => c.id === selectedCharacterId) || characters[0];

  // Unique tags
  const allTags = Array.from(new Set(characters.flatMap(c => c.tags || [])));

  // Filtered characters
  const filteredCharacters = characters.filter(c => {
    if (showOnlyFavorites && !c.isFavorite) return false;
    if (selectedTag && (!c.tags || !c.tags.includes(selectedTag))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchRole = c.role.toLowerCase().includes(q);
      const matchPlot = (c.plot || '').toLowerCase().includes(q);
      const matchPersonality = (c.personality || '').toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchPlot && !matchPersonality) return false;
    }
    return true;
  });

  const handleSaveCharacter = (char: ZetaCharacter) => {
    setCharacters(prev => {
      const index = prev.findIndex(c => c.id === char.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = char;
        return updated;
      } else {
        return [char, ...prev];
      }
    });
    setSelectedCharacterId(char.id);
    setEditingCharacter(null);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (selectedCharacterId === id) {
      const remaining = characters.filter(c => c.id !== id);
      if (remaining.length > 0) setSelectedCharacterId(remaining[0].id);
    }
  };

  const handleDuplicate = (char: ZetaCharacter) => {
    const duplicated: ZetaCharacter = {
      ...char,
      id: 'char_' + Date.now(),
      name: `${char.name} (コピー)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };
    setCharacters(prev => [duplicated, ...prev]);
    setSelectedCharacterId(duplicated.id);
  };

  const handleToggleFavorite = (id: string) => {
    setCharacters(prev =>
      prev.map(c => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleExportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(characters, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `zeta_characters_${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setCharacters(parsed);
          alert(`${parsed.length}体のキャラクターをインポートしました！`);
        } else if (parsed.name) {
          setCharacters(prev => [parsed, ...prev]);
          alert(`「${parsed.name}」をインポートしました！`);
        }
      } catch (err: any) {
        alert('JSONファイルの読み込みに失敗しました: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetPresets = () => {
    if (confirm('プリセットキャラクターを初期状態に戻しますか？（現在の編集内容は上書きされます）')) {
      setCharacters(PRESET_CHARACTERS);
      setSelectedCharacterId(PRESET_CHARACTERS[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Zeta Header */}
      <header className="sticky top-0 z-40 bg-[#0e0f18]/90 backdrop-blur-md border-b border-[#1f2033]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-950/60 ring-2 ring-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-base tracking-tight">ZETA to GAS Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold uppercase tracking-wider">
                  Engine v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Zeta本家仕様のUI・ストーリープロット完全再現 ＆ Google Apps Script移植
              </p>
            </div>
          </div>

          {/* Action Tools & Google OAuth */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              title="Zeta本家APIの仕様・Googleログイン調査結果"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Zeta本家API調査レポート</span>
              <span className="md:hidden">API調査</span>
            </button>

            <button
              onClick={() => setIsFreeAiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              title="完全無料・永久に使えるAI＆API消費対策"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">無料＆無制限AI</span>
              <span className="md:hidden">無料AI</span>
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171826] hover:bg-[#222438] text-slate-200 text-xs font-medium border border-[#2b2d45] transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">GAS導入手順</span>
            </button>

            {/* Google OAuth Login Button */}
            {googleUser ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171826] hover:bg-[#202235] border border-purple-500/40 transition"
                title="Googleアカウント管理"
              >
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-purple-400"
                />
                <span className="text-xs font-bold text-white max-w-[90px] truncate hidden sm:inline">
                  {googleUser.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition shadow-md shadow-black/40"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span className="hidden sm:inline">Googleログイン</span>
                <span className="sm:hidden">ログイン</span>
              </button>
            )}

            {/* Create Char Button */}
            <button
              onClick={() => setEditingCharacter('new')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">キャラ作成</span>
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-[#171826] bg-[#0c0d15]/60 py-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMainView('cards')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                mainView === 'cards'
                  ? 'bg-[#1b1c2e] text-purple-300 shadow-sm border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151624]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              プロット＆キャラ一覧 ({characters.length})
            </button>
            <button
              onClick={() => setMainView('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                mainView === 'chat'
                  ? 'bg-[#1b1c2e] text-purple-300 shadow-sm border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151624]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              Zetaチャット対話
              {currentSelectedChar && (
                <span className="text-[10px] text-purple-300/80 font-normal hidden sm:inline">
                  ({currentSelectedChar.name})
                </span>
              )}
            </button>
            <button
              onClick={() => setMainView('gas')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                mainView === 'gas'
                  ? 'bg-[#1b1c2e] text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151624]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              GASコード出力
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
            <button
              onClick={handleExportAllJson}
              className="p-1 hover:text-white transition flex items-center gap-1"
              title="全キャラクターをJSONとして保存"
            >
              <Download className="w-3.5 h-3.5" /> 全保存
            </button>
            <label
              className="p-1 hover:text-white transition flex items-center gap-1 cursor-pointer"
              title="JSONファイルからインポート"
            >
              <Upload className="w-3.5 h-3.5" /> 取込
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
            <button
              onClick={handleResetPresets}
              className="p-1 hover:text-amber-400 transition flex items-center gap-1"
              title="初期プリセットに戻す"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 初期化
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col">
        {/* VIEW 1: Characters Grid */}
        {mainView === 'cards' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-[#12131e] border border-[#222438] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="キャラクター名、プロット、属性で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#090a10] border border-[#26283b] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Favorites Toggle */}
                  <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      showOnlyFavorites
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-[#090a10] text-slate-400 border-[#26283b] hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-400' : ''}`} />
                    お気に入り
                  </button>
                </div>
              </div>

              {/* Tag Badges */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition shrink-0 ${
                      selectedTag === null
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                        : 'bg-[#181928] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    すべて ({characters.length})
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition shrink-0 ${
                        selectedTag === tag
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                          : 'bg-[#181928] text-purple-300/80 hover:text-white border border-purple-500/20'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cards Grid */}
            {filteredCharacters.length === 0 ? (
              <div className="bg-[#12131e] border border-[#222438] rounded-2xl p-12 text-center text-slate-400 space-y-3">
                <Search className="w-10 h-10 mx-auto text-slate-600" />
                <h3 className="text-base font-semibold text-slate-200">
                  該当するキャラクターが見つかりませんでした
                </h3>
                <p className="text-xs">
                  検索ワードを変更するか、「新規キャラ作成」から新しく追加してください。
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                    setShowOnlyFavorites(false);
                  }}
                  className="px-4 py-2 bg-[#1b1d2e] hover:bg-[#282a42] text-xs text-white rounded-xl transition"
                >
                  フィルターをクリア
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map(char => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    isSelected={selectedCharacterId === char.id}
                    onSelect={(c) => setSelectedCharacterId(c.id)}
                    onStartChat={(c) => {
                      setSelectedCharacterId(c.id);
                      setMainView('chat');
                    }}
                    onOpenGas={(c) => {
                      setSelectedCharacterId(c.id);
                      setMainView('gas');
                    }}
                    onEdit={(c) => setEditingCharacter(c)}
                    onDuplicate={handleDuplicate}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteCharacter}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Interactive Chat Simulator */}
        {mainView === 'chat' && currentSelectedChar && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Character Mini-Selector */}
            <div className="lg:col-span-1 bg-[#12131e] border border-[#222438] rounded-2xl p-4 flex flex-col gap-2 max-h-[750px] overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                対話キャラクター選択
              </h3>
              {characters.map(char => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacterId(char.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition ${
                    selectedCharacterId === char.id
                      ? 'bg-purple-600/25 border border-purple-500/50 text-white'
                      : 'hover:bg-[#181928] text-slate-300'
                  }`}
                >
                  <img
                    src={char.avatarUrl || 'https://via.placeholder.com/100'}
                    alt={char.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-purple-500/30"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">{char.name}</div>
                    <div className="text-[11px] text-purple-300/80 truncate">{char.role}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Chat UI */}
            <div className="lg:col-span-3">
              <ChatSimulator
                character={currentSelectedChar}
                onOpenGas={(char) => {
                  setSelectedCharacterId(char.id);
                  setMainView('gas');
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: GAS Code Export Panel */}
        {mainView === 'gas' && currentSelectedChar && (
          <div className="h-[750px]">
            <GasExportPanel
              character={currentSelectedChar}
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {editingCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl">
            <CharacterEditor
              character={editingCharacter === 'new' ? null : editingCharacter}
              onSave={handleSaveCharacter}
              onCancel={() => setEditingCharacter(null)}
            />
          </div>
        </div>
      )}

      {/* Zeta API Report Modal */}
      <ZetaApiReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* GAS Setup Guide Modal */}
      <GasGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Google OAuth Modal */}
      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={googleUser}
        onLogin={handleGoogleLogin}
        onLogout={handleGoogleLogout}
      />

      {/* Free AI Guide Modal */}
      <FreeAiGuideModal
        isOpen={isFreeAiOpen}
        onClose={() => setIsFreeAiOpen(false)}
      />
    </div>
  );
}
