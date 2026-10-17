import React, { useState } from 'react';
import { ZetaCharacter, GasType } from '../types/zeta';
import {
  generateGasHybridDbAndApiCode,
  generateGasWebAppCode,
  generateGasSpreadsheetDbCode,
  generateGasLineBotCode,
  generateGasRestApiCode,
} from '../utils/gasGenerator';
import {
  Copy,
  Check,
  Download,
  Code2,
  FileCode,
  ExternalLink,
  Table,
  Smartphone,
  Server,
  Layers,
  Sparkles,
  HelpCircle,
  Flame,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  character: ZetaCharacter;
  onOpenGuide: () => void;
}

export const GasExportPanel: React.FC<Props> = ({ character, onOpenGuide }) => {
  const [selectedType, setSelectedType] = useState<GasType>('hybrid_db_api');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (selectedType) {
      case 'hybrid_db_api':
        return generateGasHybridDbAndApiCode(character);
      case 'webapp':
        return generateGasWebAppCode(character);
      case 'spreadsheet_db':
        return generateGasSpreadsheetDbCode(character);
      case 'line_bot':
        return generateGasLineBotCode(character);
      case 'rest_api':
        return generateGasRestApiCode();
    }
  };

  const currentCode = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `Zeta_${character.name.replace(/[^a-zA-Z0-9\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff_-]/g, '_')}_${selectedType}.gs`;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0e0f18] border border-[#23253b] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-5 border-b border-[#23253b] bg-[#141524]/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Google Apps Script (GAS) 移植コード生成</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            キャラクター: <strong className="text-purple-300 font-semibold">{character.name}</strong> 
            （スプレッドシートDB ＆ REST API完全両立）
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b1d2e] hover:bg-[#282a42] text-slate-200 text-xs font-semibold border border-[#2d2f4a] transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            導入手順
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b1d2e] hover:bg-[#282a42] text-slate-200 text-xs font-semibold border border-[#2d2f4a] transition"
            title=".gsファイルをダウンロード"
          >
            <Download className="w-3.5 h-3.5" />
            .gs保存
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'コピー完了！' : 'コードをコピー'}
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="px-5 pt-2.5 bg-[#0a0b12] border-b border-[#23253b] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedType('hybrid_db_api')}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-t-xl text-xs font-bold transition border-t border-x shrink-0 ${
            selectedType === 'hybrid_db_api'
              ? 'bg-[#0e0f18] text-purple-300 border-purple-500/60 border-b-transparent -mb-[1px]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#141524]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          ②＋④ 両立完全版 (DB ＆ REST API)
        </button>

        <button
          onClick={() => setSelectedType('webapp')}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-t-xl text-xs font-semibold transition border-t border-x shrink-0 ${
            selectedType === 'webapp'
              ? 'bg-[#0e0f18] text-purple-300 border-purple-500/60 border-b-transparent -mb-[1px]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#141524]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Webアプリ単体版
        </button>

        <button
          onClick={() => setSelectedType('spreadsheet_db')}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-t-xl text-xs font-semibold transition border-t border-x shrink-0 ${
            selectedType === 'spreadsheet_db'
              ? 'bg-[#0e0f18] text-emerald-300 border-emerald-500/60 border-b-transparent -mb-[1px]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#141524]'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          スプレッドシートDBのみ
        </button>

        <button
          onClick={() => setSelectedType('rest_api')}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-t-xl text-xs font-semibold transition border-t border-x shrink-0 ${
            selectedType === 'rest_api'
              ? 'bg-[#0e0f18] text-blue-300 border-blue-500/60 border-b-transparent -mb-[1px]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#141524]'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          REST APIのみ
        </button>

        <button
          onClick={() => setSelectedType('line_bot')}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-t-xl text-xs font-semibold transition border-t border-x shrink-0 ${
            selectedType === 'line_bot'
              ? 'bg-[#0e0f18] text-emerald-400 border-emerald-500/60 border-b-transparent -mb-[1px]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#141524]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          LINE Bot版
        </button>
      </div>

      {/* Mode Description Bar */}
      <div className="px-5 py-2 bg-[#121320] border-b border-[#23253b] text-xs text-slate-300 flex items-center justify-between">
        <div>
          {selectedType === 'hybrid_db_api' && (
            <span>
              🔥 <strong>②＋④ 両立完全版:</strong> スプレッドシート（DB・サイドバー・会話ログ）と外部用REST API（doGet/doPost）が1つのコードで完全に同居動作します！
            </span>
          )}
          {selectedType === 'webapp' && (
            <span>
              🌐 <strong>Webアプリ版:</strong> GASだけで独立したZetaチャット画面をホスティング。
            </span>
          )}
          {selectedType === 'spreadsheet_db' && (
            <span>
              📊 <strong>スプレッドシートDB版:</strong> シート上でキャラ管理＆サイドバーでチャット。
            </span>
          )}
          {selectedType === 'rest_api' && (
            <span>
              ⚡ <strong>REST API版:</strong> 外部プログラムやスマホから呼び出せるAPI。
            </span>
          )}
          {selectedType === 'line_bot' && (
            <span>
              📱 <strong>LINE Bot版:</strong> LINE Developersと連携してキャラとLINE通話。
            </span>
          )}
        </div>
        <div className="text-[11px] text-purple-300/70 font-mono hidden md:block">
          {currentCode.split('\n').length} 行
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 overflow-auto bg-[#07080e] p-4 font-mono text-xs text-slate-300 leading-relaxed select-all">
        <pre className="whitespace-pre">{currentCode}</pre>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-2.5 bg-[#121320] border-t border-[#23253b] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Google AI StudioのGemini 2.5 Flash無料枠（1日1,500リクエスト無料）に対応
        </span>
        <button
          onClick={handleCopy}
          className="text-purple-400 hover:text-purple-300 font-bold"
        >
          {copied ? 'コピー済み' : 'コードをコピー'}
        </button>
      </div>
    </div>
  );
};
