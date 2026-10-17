import React from 'react';
import { ZetaCharacter } from '../types/zeta';
import { MessageSquare, Code2, Heart, Edit3, Copy, Trash2, Tag, BookOpen, MessageCircle } from 'lucide-react';

interface Props {
  character: ZetaCharacter;
  isSelected: boolean;
  onSelect: (char: ZetaCharacter) => void;
  onStartChat: (char: ZetaCharacter) => void;
  onOpenGas: (char: ZetaCharacter) => void;
  onEdit: (char: ZetaCharacter) => void;
  onDuplicate: (char: ZetaCharacter) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CharacterCard: React.FC<Props> = ({
  character,
  isSelected,
  onSelect,
  onStartChat,
  onOpenGas,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onDelete,
}) => {
  // Pseudorandom chat count for Zeta authentic feel based on char ID
  const chatCount = Math.floor(((character.createdAt % 89) + 11) * 320);

  return (
    <div
      onClick={() => onSelect(character)}
      className={`group relative bg-[#12131e] border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 ${
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-2xl shadow-purple-950/60'
          : 'border-[#222438] hover:border-purple-500/50 hover:bg-[#161726] shadow-lg shadow-black/40'
      }`}
    >
      {/* Top Banner / Avatar Header (Zeta Portrait / Aspect Ratio Feel) */}
      <div className="relative h-44 bg-gradient-to-t from-[#12131e] via-[#1a1c2e]/60 to-[#272147] overflow-hidden">
        {character.avatarUrl && (
          <img
            src={character.avatarUrl}
            alt={character.name}
            className="w-full h-full object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12131e] via-[#12131e]/50 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(character.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            character.isFavorite
              ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40'
              : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
          }`}
          title="お気に入り"
        >
          <Heart className={`w-4 h-4 ${character.isFavorite ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Zeta Metric Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-purple-400" />
            {(chatCount / 1000).toFixed(1)}k チャット
          </span>
        </div>

        {/* Avatar Circle */}
        <div className="absolute -bottom-6 left-5 flex items-end">
          <img
            src={character.avatarUrl || 'https://via.placeholder.com/100'}
            alt={character.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#12131e] shadow-xl bg-slate-900 ring-2 ring-purple-500/40"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-8 px-5 pb-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-white text-base truncate group-hover:text-purple-300 transition">
              {character.name}
            </h3>
            {character.age && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1b1d2e] text-purple-300/80 border border-[#2b2d45] shrink-0 font-medium">
                {character.age}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-purple-400 mt-0.5 line-clamp-1">{character.role}</p>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {character.plot || character.personality || 'キャラクター詳細なし'}
          </p>

          {/* First message preview (Zeta Intro) */}
          {character.intro && (
            <div className="mt-3 bg-[#0a0b12] border border-[#202235] rounded-xl p-3 text-[11px] text-purple-200/90 line-clamp-2 italic leading-relaxed">
              {character.intro}
            </div>
          )}

          {/* Tags */}
          {character.tags && character.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {character.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#191a2b] text-purple-300/90 border border-purple-500/20 flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 text-purple-400/60" />
                  {tag}
                </span>
              ))}
              {character.tags.length > 3 && (
                <span className="text-[10px] text-slate-500 self-center">+{character.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-4 border-t border-[#1f2136] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartChat(character);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-purple-950"
              title="Zetaチャットを開始"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              チャット
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenGas(character);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              title="GAS移植スクリプトを表示"
            >
              <Code2 className="w-3.5 h-3.5" />
              GAS出力
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(character);
              }}
              className="p-1.5 hover:text-white hover:bg-[#1f2136] rounded-lg transition"
              title="設定を編集"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(character);
              }}
              className="p-1.5 hover:text-white hover:bg-[#1f2136] rounded-lg transition"
              title="複製"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`「${character.name}」を削除しますか？`)) {
                  onDelete(character.id);
                }
              }}
              className="p-1.5 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
              title="削除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
