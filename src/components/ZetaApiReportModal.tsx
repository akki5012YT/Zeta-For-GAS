import React from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink, Key, Database, Globe, CheckCircle2, Lock, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ZetaApiReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Zeta本家API・Googleログイン調査レポート</h2>
              <p className="text-xs text-slate-400">Scatter Lab社「zeta」の仕様調査とGAS移植の技術検証結果</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Section 1: Zeta API */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">1. Zeta本家（zeta-ai.io）のAPI提供状況について</h3>
                <p className="text-slate-300 leading-relaxed">
                  Zeta（韓国Scatter Lab社が開発・運営）は、独自の社内LLM「<strong className="text-indigo-400">Spotwrite-1</strong>」を採用したコンシューマー向けサービスであり、<strong className="text-amber-300">一般・開発者向けの公式パブリックAPIは一切公開されていません</strong>。
                </p>
                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div>・内部エンドポイント（<code>api.zeta-ai.io</code>）は強固なセッショントークン・Cloudflare等で保護されています。</div>
                  <div>・外部スクリプトからの不正リバースエンジニアリングやスクレイピングは利用規約上禁止されており、アカウントBANリスクがあります。</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Google Login */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">2. 「ZetaのGoogleログイン」連携について</h3>
                <p className="text-slate-300 leading-relaxed">
                  ZetaアプリにGoogleログインが存在しますが、これは「Zetaサービスへの認証用」であり、外部のアプリやGASがZetaのGoogleアカウントと連携してデータを取り出すための<strong className="text-blue-300">OAuth Identity Provider（ログイン連携API）としては開放されていません</strong>。
                </p>
                <p className="text-xs text-slate-400">
                  したがって、外部からZeta本家のサーバーにGoogleログインして直接キャラデータを同期する仕組みは公式には作ることができません。
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Recommended Solution */}
          <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border border-indigo-500/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">3. 推奨解決策：なぜ「GAS移植」が最強の選択肢なのか？</h3>
                <p className="text-slate-200 leading-relaxed">
                  本ツール「Zeta to GAS Studio」では、Zetaのキャラクター設計思想（プロット、イントロ、AIナレーター指示、ローアブック、口調）を完全再現し、<strong className="text-emerald-400">Google Apps Script（GAS）＋無料のGemini API</strong>に完全移植します。
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                    <div className="font-semibold text-white text-xs flex items-center gap-1.5 mb-1">
                      <Key className="w-4 h-4 text-emerald-400" /> Googleアカウントで安全管理
                    </div>
                    <p className="text-xs text-slate-400">
                      GASのWebアプリは自分のGoogleアカウント権限で実行可能。スプレッドシートにキャラDBを蓄積できます。
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                    <div className="font-semibold text-white text-xs flex items-center gap-1.5 mb-1">
                      <Database className="w-4 h-4 text-indigo-400" /> 無料で無制限の自前Zeta
                    </div>
                    <p className="text-xs text-slate-400">
                      Google AI StudioのGemini 2.5 Flash（無料枠）を使えば、会話制限や課金なしでキャラクターと対話可能。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
