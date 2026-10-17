import React from 'react';
import { X, Sparkles, Zap, ShieldCheck, Gift, Users, ExternalLink, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeAiGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#121320] border border-[#272942] w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#272942] flex items-center justify-between bg-[#151627]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">課金ゼロで永久に使えるAI ＆ API消費対策ガイド</h2>
              <p className="text-xs text-slate-400">みんなに使ってもらっても開発者が1円も払わない完全無料アーキテクチャ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Section 1: The Problem */}
          <div className="bg-[#18192a] border border-[#2b2d45] rounded-xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              なぜAIチャットはAPI消費が「えぐい」のか？
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ZetaのようなロールプレイAIは、キャラ設定・世界観・過去の会話ログを<strong>毎回のメッセージ送信時にまとめてAIに送る</strong>ため、会話が続くほどトークン消費が何倍にも膨れ上がります。開発者の1つのAPIキーを全員で共有すると、あっという間に上限到達や高額請求になってしまいます。
            </p>
          </div>

          {/* Section 2: Top Free AIs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              完全無料で永久に使える神AIサービス TOP 3
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option 1: Gemini */}
              <div className="bg-[#161729] border border-purple-500/40 rounded-xl p-4 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Google Gemini</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">1位 推奨</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-1">1日 1,500回 完全無料</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Google AI Studioでクレジットカード不要・即時発行。日本語のト書き・セリフの演技力が世界最高峰。
                  </p>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold pt-2"
                >
                  キー無料発行 <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Option 2: Groq */}
              <div className="bg-[#161729] border border-[#2b2d45] rounded-xl p-4 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Groq (LPU)</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">超爆速</span>
                  </div>
                  <div className="text-xs text-amber-400 font-semibold mt-1">1日 14,400回 無料</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Llama 3.3 70B等の高性能オープンモデルが毎秒数百トークンの超超高速・完全無料で使える。
                  </p>
                </div>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold pt-2"
                >
                  Groq無料登録 <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Option 3: Cloudflare Workers AI */}
              <div className="bg-[#161729] border border-[#2b2d45] rounded-xl p-4 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Cloudflare AI</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">サーバーレス</span>
                  </div>
                  <div className="text-xs text-blue-400 font-semibold mt-1">毎日 10,000枠 無料</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    エッジサーバー上でLlamaやMistralをAPIとして月額0円で呼び出し可能。
                  </p>
                </div>
                <a
                  href="https://workers.cloudflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold pt-2"
                >
                  Cloudflare <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: The Ultimate Architecture */}
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Users className="w-5 h-5 text-purple-400" />
              【最重要】開発者コスト永久0円の「BYOK分散方式」
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              大勢のユーザーに配る場合、<strong>「ユーザー各自の無料Google AI Studioキーを使ってもらう（BYOK: Bring Your Own Key）」</strong>方式が最強の解決策です。
            </p>
            <div className="bg-[#0b0c14] p-3.5 rounded-lg border border-purple-500/20 text-xs text-slate-300 space-y-1.5">
              <div>・Googleアカウントさえあれば、誰でも30秒・クレカ不要・無料でGemini APIキーを発行できます。</div>
              <div>・ユーザーが100人いれば、<strong>合計で1日150,000回（100人 × 1,500回）</strong>の無料枠が自動で分散されます。</div>
              <div>・開発者はサーバー代もAPI代も<strong>永久に1円も払わずに無限にスケール可能</strong>です！</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#272942] bg-[#141525] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl font-bold text-xs transition"
          >
            理解した（閉じる）
          </button>
        </div>
      </div>
    </div>
  );
};
