import React from 'react';
import { X, CheckCircle, ExternalLink, Key, Code, Rocket, ShieldCheck, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GasGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Google Apps Script (GAS) 移植手順ガイド</h2>
              <p className="text-xs text-slate-400">わずか3分で自分専用のZetaサーバーを完全無料で構築</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-semibold text-white">
                Googleスプレッドシート（またはApps Script）を新規作成
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Google Driveを開き、新規のスプレッドシートを作成します。上部メニューの 
                <strong className="text-indigo-400"> [拡張機能] → [Apps Script] </strong> 
                をクリックしてエディタを開きます。
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">
                  Gemini APIキーを無料取得
                </h3>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  Google AI Studioを開く <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Google AI Studioで [Get API key] をクリックし、無料のAPIキーを発行してコピーします（クレジットカード不要）。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-semibold text-white">
                Apps Scriptの [スクリプト プロパティ] にキーを登録
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Apps Script画面の左サイドバーにある <strong>[プロジェクトの設定] (歯車アイコン)</strong> を開き、
                画面下部の <strong>[スクリプト プロパティ] → [スクリプト プロパティを追加]</strong> をクリックします。
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
                <div className="text-indigo-400 font-semibold mb-1">登録内容:</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">プロパティ:</span>
                  <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">GEMINI_API_KEY</code>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400">値:</span>
                  <span className="text-slate-500">（ステップ2で取得したキーを貼り付け）</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              4
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-semibold text-white">
                Zeta to GAS Studioで生成したコードを貼り付け
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                本ツールの [GAS出力] タブで生成したコードをコピーし、Apps Scriptの <strong>「コード.gs」</strong> に元からあるコードを消して丸ごと貼り付け、Ctrl+S (Cmd+S) で保存します。
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
              5
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-semibold text-emerald-400">
                デプロイして完了！
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                画面右上の <strong>[デプロイ] → [新しいデプロイ]</strong> をクリック:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 ml-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <li><strong>種類の選択:</strong> 「ウェブアプリ」</li>
                <li><strong>次のユーザーとして実行:</strong> 「自分」</li>
                <li><strong>アクセスできるユーザー:</strong> 「全員」または「自分のみ」</li>
              </ul>
              <p className="text-slate-400 text-xs pt-1">
                発行されたWebアプリURLを開くと、Zeta風のチャット画面がブラウザで開いて会話できます！
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            完全サーバーレス・費用0円で動作
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
