import React, { useState, useEffect, useRef } from 'react';
import { ZetaCharacter, ChatMessage } from '../types/zeta';
import {
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Key,
  Code2,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Edit2,
  ArrowRight,
  BookOpen,
  Volume2,
  Share2,
} from 'lucide-react';

interface Props {
  character: ZetaCharacter;
  onOpenGas: (char: ZetaCharacter) => void;
}

export const ChatSimulator: React.FC<Props> = ({ character, onOpenGas }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Zeta signature feature: Smart Replies
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingSmartReplies, setIsLoadingSmartReplies] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with character's intro
  useEffect(() => {
    resetChat();
  }, [character.id]);

  const resetChat = () => {
    setErrorMessage(null);
    setSmartReplies([]);
    setShowSmartReplies(false);
    if (character.intro) {
      setMessages([
        {
          id: 'intro_' + Date.now(),
          role: 'assistant',
          content: character.intro,
          timestamp: Date.now(),
        },
      ]);
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle message send
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setErrorMessage(null);
    setShowSmartReplies(false);

    const newUserMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          userApiKey: customApiKey || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI応答エラーが発生しました');
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'チャット送信に失敗しました');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Zeta signature feature: Fetch Smart Replies (⚡️ 稲妻機能)
  const handleFetchSmartReplies = async () => {
    if (isLoadingSmartReplies) return;
    setIsLoadingSmartReplies(true);
    setShowSmartReplies(true);

    try {
      const response = await fetch('/api/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          userApiKey: customApiKey || undefined,
        }),
      });
      const data = await response.json();
      if (data.replies && Array.isArray(data.replies)) {
        setSmartReplies(data.replies);
      }
    } catch (e) {
      console.error('Smart reply error', e);
      setSmartReplies([
        '「うん、分かった」',
        '（じっと見つめて小さく微笑む）',
        '「本当はどう思ってるの？」'
      ]);
    } finally {
      setIsLoadingSmartReplies(false);
    }
  };

  // Reroll the last AI reply
  const handleReroll = async () => {
    if (isLoading || messages.length < 2) return;
    // Find last user message
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;

    const trimmedHistory = messages.slice(0, lastUserIdx + 1);
    setMessages(trimmedHistory);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
          messages: trimmedHistory.map(m => ({ role: m.role, content: m.content })),
          userApiKey: customApiKey || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages([
        ...trimmedHistory,
        {
          id: 'bot_' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      setErrorMessage(err.message || '再生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleInsertNarration = () => {
    setInputText(prev => prev + '（）');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const pos = inputRef.current.value.length - 1;
        inputRef.current.setSelectionRange(pos, pos);
      }
    }, 50);
  };

  /**
   * High fidelity parser for Zeta roleplay text:
   * Separates stage directions in parentheses with rich cinematic styles
   */
  const renderZetaFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-[14px] leading-relaxed select-text">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

          // Full narration block: （...） or (...) or *...*
          const isFullNarration =
            (trimmed.startsWith('（') && trimmed.endsWith('）')) ||
            (trimmed.startsWith('(') && trimmed.endsWith(')')) ||
            (trimmed.startsWith('*') && trimmed.endsWith('*'));

          if (isFullNarration) {
            return (
              <div
                key={lineIdx}
                className="text-purple-200/80 italic bg-[#1c1d30]/80 px-3.5 py-2 rounded-xl border-l-2 border-purple-500/60 my-1.5 text-[13px] tracking-wide shadow-xs"
              >
                {trimmed}
              </div>
            );
          }

          // Inline mix of stage directions and spoken dialogue
          const parts = line.split(/([（\\(][^）\\)]+[）\\)])/g);
          return (
            <div key={lineIdx} className="text-white/95">
              {parts.map((part, partIdx) => {
                if (
                  (part.startsWith('（') && part.endsWith('）')) ||
                  (part.startsWith('(') && part.endsWith(')'))
                ) {
                  return (
                    <span
                      key={partIdx}
                      className="text-purple-300/85 italic bg-[#212338]/60 px-1.5 py-0.5 rounded text-[13px] mx-1 inline-block border border-purple-500/20"
                    >
                      {part}
                    </span>
                  );
                }
                return <span key={partIdx}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#0e0f18] border border-[#23253b] rounded-2xl shadow-2xl flex flex-col h-[750px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#23253b] bg-[#141523]/95 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={character.avatarUrl || 'https://via.placeholder.com/100'}
              alt={character.name}
              className="w-10 h-10 rounded-xl object-cover border border-purple-500/40 shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#141523] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm tracking-tight">{character.name}</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Zeta Engine
              </span>
            </div>
            <p className="text-xs text-purple-300/80 line-clamp-1">{character.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Smart Reply Button */}
          <button
            onClick={handleFetchSmartReplies}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition shadow-xs"
            title="スマートリプライ（次の返信候補を提案）"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">スマートリプライ</span>
          </button>

          {/* GAS Export Shortcut */}
          <button
            onClick={() => onOpenGas(character)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
            title="GAS移植スクリプトを表示"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GAS出力</span>
          </button>

          {/* Reset */}
          <button
            onClick={resetChat}
            className="p-2 rounded-lg bg-[#1c1d2e] hover:bg-[#282a42] text-slate-300 text-xs transition"
            title="会話履歴をリセット"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Story & Plot Banner (Zeta Signature Component) */}
      {character.plot && (
        <div className="bg-gradient-to-r from-[#171829] via-[#1d1b33] to-[#171829] border-b border-[#262842] px-5 py-2.5 text-xs flex items-center justify-between text-purple-200/90 shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden">
            <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold text-purple-300 shrink-0">プロット:</span>
            <span className="truncate text-slate-300">{character.plot}</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/80 border-b border-rose-800 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[#0a0b12] relative">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          const isLastBot = !isUser && idx === messages.length - 1;

          return (
            <div
              key={m.id}
              className={`group flex items-start gap-3 max-w-[88%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {!isUser && (
                <img
                  src={character.avatarUrl || 'https://via.placeholder.com/100'}
                  alt={character.name}
                  className="w-9 h-9 rounded-xl object-cover border border-purple-500/30 shrink-0 mt-0.5 shadow-md"
                />
              )}

              <div className="flex flex-col gap-1 max-w-full">
                {!isUser && (
                  <span className="text-[11px] font-semibold text-purple-300/80 px-1">
                    {character.name}
                  </span>
                )}

                <div
                  className={`p-4 rounded-2xl shadow-xl transition-all ${
                    isUser
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-tr-xs'
                      : 'bg-[#151624] border border-[#26283d] text-slate-100 rounded-tl-xs hover:border-purple-500/40'
                  }`}
                >
                  {isUser ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    renderZetaFormattedContent(m.content)
                  )}

                  {/* Message Bottom Action Row */}
                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className={isUser ? 'text-indigo-200' : 'text-slate-400'}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="hover:text-white transition p-0.5"
                        title="コピー"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {isLastBot && (
                        <button
                          onClick={handleReroll}
                          disabled={isLoading}
                          className="hover:text-purple-300 transition p-0.5 flex items-center gap-0.5"
                          title="別の返信を再生成（リロール）"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>再生成</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-purple-300 text-xs py-2 px-3.5 bg-[#171829] rounded-2xl w-fit border border-purple-500/30 animate-pulse shadow-lg">
            <img
              src={character.avatarUrl || 'https://via.placeholder.com/100'}
              alt={character.name}
              className="w-5 h-5 rounded-lg object-cover"
            />
            <span>{character.name} が考え中...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Zeta Smart Reply Floating Drawer */}
      {showSmartReplies && (
        <div className="px-5 py-3 bg-[#151627] border-t border-purple-500/30 shadow-xl space-y-2 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              スマートリプライ (タップして即返信)
            </span>
            <button
              onClick={() => setShowSmartReplies(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          {isLoadingSmartReplies ? (
            <div className="text-xs text-slate-400 py-2 animate-pulse">返信候補を生成中...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {smartReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="p-2.5 rounded-xl bg-[#1d1f36] hover:bg-purple-900/40 text-purple-200 hover:text-white border border-purple-500/30 text-xs text-left transition flex items-center justify-between group"
                >
                  <span className="line-clamp-2 leading-relaxed">{reply}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ml-1 text-purple-400 transition" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3.5 border-t border-[#23253b] bg-[#121320] flex flex-col gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Narration helper button */}
          <button
            type="button"
            onClick={handleInsertNarration}
            className="px-2.5 py-2 rounded-xl bg-[#1c1d2e] hover:bg-[#282a42] text-purple-300 text-xs font-semibold border border-purple-500/20 transition shrink-0"
            title="ト書き用の（）を挿入"
          >
            （ト書き）
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="メッセージを入力（行動や心情は（）で記述）..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-[#0a0b12] border border-[#282a42] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition flex items-center gap-1.5 shadow-lg shadow-purple-950 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">送信</span>
          </button>
        </form>
      </div>
    </div>
  );
};
