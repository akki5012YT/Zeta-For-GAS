import React, { useState } from 'react';
import { ZetaCharacter } from '../types/zeta';
import { Save, X, Sparkles, Wand2, HelpCircle, Image, BookOpen, MessageCircle, FileJson } from 'lucide-react';

interface Props {
  character?: ZetaCharacter | null;
  onSave: (char: ZetaCharacter) => void;
  onCancel: () => void;
}

export const CharacterEditor: React.FC<Props> = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ZetaCharacter>(() => {
    if (character) return { ...character };
    return {
      id: 'char_' + Date.now(),
      name: '',
      role: '',
      gender: '女性',
      age: '17歳',
      appearance: '',
      personality: '',
      speakingStyle: '',
      firstPerson: '私',
      secondPerson: 'あなた',
      plot: '',
      intro: '',
      aiInstructions: `【AIナレーター指示ルール】
1. ユーザーのセリフ、行動、感情を勝手に描写しないでください。
2. キャラクターのセリフは「」で囲み、心理描写や行動などのト書きは（）または*で囲んでください。
3. 一人称・二人称および設定された口調を厳密に維持してください。`,
      lorebook: '',
      userRelationship: '',
      tags: ['オリジナル', '日常'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'plot' | 'instructions' | 'json'>('basic');
  const [jsonInput, setJsonInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleApplyTemplate = (type: 'tsundere' | 'senpai' | 'fantasy' | 'maid') => {
    if (type === 'tsundere') {
      setFormData(prev => ({
        ...prev,
        name: '鳴海 凛 (なるみ りん)',
        role: '素直になれない隣の席のツンデレ同級生',
        gender: '女性',
        age: '16歳',
        appearance: '琥珀色の瞳と栗色のツインテール。小柄で制服のカーディガンを着崩している。',
        personality: '負けず嫌いで毒舌。しかし困っているあなたを放っておけない性格。',
        speakingStyle: '「べ、別に…」「バカ！」「勘違いしないでよね」',
        firstPerson: 'アタシ',
        secondPerson: 'アンタ',
        plot: '放課後の図書室。雨が降ってきて傘を持たない二人が足止めされている。',
        intro: '（窓の外を叩く激しい雨音を聞きながら、折りたたみ傘を握りしめてため息をつく）\\n\\n「……はぁ。アンタ、また傘忘れたの？ 本当に世話が焼けるんだから。……何よ、その情けない顔。しょうがないから、駅まで入れてあげてもいいけど……変な気起こしたら許さないからね！」',
        tags: ['学園', 'ツンデレ', '図書室', '日常']
      }));
    } else if (type === 'senpai') {
      setFormData(prev => ({
        ...prev,
        name: '浅葱 栞 (あさぎ しおり)',
        role: 'ミステリアスな文学部部長の先輩',
        gender: '女性',
        age: '18歳（高校3年生）',
        appearance: '黒髪ストレートロング、物憂げな眼差し、文庫本をいつも片手に持っている。',
        personality: '物静かで知的。からかい上手だが、あなたの前でのみ少女のような笑顔を見せる。',
        speakingStyle: '「ふふ、可愛い後輩ね」「〜かしら」「どうしたの？」',
        firstPerson: '私',
        secondPerson: '君',
        plot: '埃っぽい旧校舎の部室。西日が差し込み、古本の香りが漂う空間で二人きり。',
        intro: '（静かに文庫本から視線を上げ、眼鏡のブリッジを指先で押し上げながら小さく微笑む）\\n\\n「おや、来たわね。チャイムが鳴ってから少し遅かったけれど……私のこと、待たせるなんて随分と度胸がついたじゃない？ さあ、私の隣においで。今日はどんな本の話をしようかしら」',
        tags: ['学園', '先輩', '文学少女', 'クーデレ']
      }));
    } else if (type === 'fantasy') {
      setFormData(prev => ({
        ...prev,
        name: 'セレスティア (Celestia)',
        role: 'あなたに救われた元・魔王軍の幹部エルフ',
        gender: '女性',
        age: '外見20歳（エルフとしては150歳）',
        appearance: '銀色の長い髪と尖った耳、高貴な黒と金のローブ、透き通るような青い瞳。',
        personality: '誇り高いが、命の恩人であるあなたには深い敬愛と忠誠を捧げている。',
        speakingStyle: '「貴方様」「〜でございます」「我が命を捧げます」',
        firstPerson: '私',
        secondPerson: '貴方様',
        plot: '荒野の焚き火の前。夜風が吹き抜ける中、二人で旅を続けている。',
        intro: '（焚き火の薪をくべながら、あなたの肩に温かな毛布をそっと掛ける。月光に銀髪が揺れる）\\n\\n「夜風が冷えてまいりました、貴方様。どうか温かくしてお休みください。今夜の警戒は私にお任せを……貴方様の安らかな寝顔をお守りすることこそ、私の至上の喜びなのですから」',
        tags: ['ファンタジー', 'エルフ', '忠誠', '異世界']
      }));
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('キャラクター名を入力してください');
      return;
    }
    onSave({
      ...formData,
      updatedAt: Date.now(),
    });
  };

  const handleLoadJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.name) {
        setFormData({
          ...formData,
          ...parsed,
          id: formData.id || 'char_' + Date.now(),
        });
        setActiveTab('basic');
        alert('JSONを読み込みました！');
      } else {
        alert('無効なキャラクターJSONです（nameプロパティが必要です）');
      }
    } catch (e: any) {
      alert('JSONのパースに失敗しました: ' + e.message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[88vh]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {character ? 'キャラクターを編集' : '新規Zetaキャラクター作成'}
          </h2>
          <p className="text-xs text-slate-400">
            Zeta本家のプロット・イントロ・AI指示ルールに完全互換したキャラクター定義
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Template Pill Buttons */}
      <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> クイック入力:
        </span>
        <button
          type="button"
          onClick={() => handleApplyTemplate('tsundere')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 border border-slate-700 transition shrink-0"
        >
          ツンデレ同級生
        </button>
        <button
          type="button"
          onClick={() => handleApplyTemplate('senpai')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 border border-slate-700 transition shrink-0"
        >
          ミステリアスな先輩
        </button>
        <button
          type="button"
          onClick={() => handleApplyTemplate('fantasy')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 border border-slate-700 transition shrink-0"
        >
          忠誠を誓うエルフ
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('basic')}
          className={`py-3 border-b-2 transition ${
            activeTab === 'basic' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          基本情報・容姿
        </button>
        <button
          onClick={() => setActiveTab('plot')}
          className={`py-3 border-b-2 transition ${
            activeTab === 'plot' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          プロット＆イントロ (重要)
        </button>
        <button
          onClick={() => setActiveTab('instructions')}
          className={`py-3 border-b-2 transition ${
            activeTab === 'instructions' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          AI指示ルール＆ローアブック
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`py-3 border-b-2 transition flex items-center gap-1 ${
            activeTab === 'json' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          JSON入出力
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  キャラクター名 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: 如月 雫 (きさらぎ しずく)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  肩書 / 関係性 (キャッチコピー)
                </label>
                <input
                  type="text"
                  placeholder="例: 素直になれないツンデレ幼馴染"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">年齢</label>
                <input
                  type="text"
                  placeholder="例: 17歳"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">一人称</label>
                <input
                  type="text"
                  placeholder="例: 私、アタシ、僕"
                  value={formData.firstPerson || ''}
                  onChange={(e) => setFormData({ ...formData, firstPerson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">二人称</label>
                <input
                  type="text"
                  placeholder="例: あなた、あんた、お前"
                  value={formData.secondPerson || ''}
                  onChange={(e) => setFormData({ ...formData, secondPerson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">性別</label>
                <input
                  type="text"
                  placeholder="例: 女性 / 男性 / 不明"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                アバター画像URL
              </label>
              <div className="flex gap-3 items-center">
                <img
                  src={formData.avatarUrl || 'https://via.placeholder.com/100'}
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                />
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">外見・服装の特徴</label>
              <textarea
                rows={2}
                placeholder="例: 黒髪のセミロング、赤いリボン、少し小柄。普段は制服をきちっと着ている。"
                value={formData.appearance}
                onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">性格・感情の機微</label>
              <textarea
                rows={2}
                placeholder="例: 強がりでツンツンしているが、本心では一途に想っている。他の女子と話すと嫉妬する。"
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">口調・特徴的なセリフ回し</label>
              <textarea
                rows={2}
                placeholder="例: 「〜よ」「〜じゃない！」「…べ、別に…」強気な語尾が多い。"
                value={formData.speakingStyle}
                onChange={(e) => setFormData({ ...formData, speakingStyle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">検索用タグ</label>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {formData.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 flex items-center gap-1.5"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="タグを追加 (例: 学園, ヤンデレ, ファンタジー)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plot' && (
          <div className="space-y-4">
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-200">
              💡 <strong>Zetaのコア思想</strong>: キャラクターは独立した対話者であると同時に、あなたと物語を紡ぐ「プロット（世界観シナリオ）」そのものです。
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                プロット（世界観・開始時の舞台・シチュエーション設定）
              </label>
              <p className="text-[11px] text-slate-400 mb-1">
                どこで、どんな状況で、二人がどんな関係としてその場にいるのかを具体的に設定します。
              </p>
              <textarea
                rows={5}
                placeholder="例: 放課後の夕暮れの教室。夕陽がオレンジ色に差し込む中、二人きりで居残り勉強をしている。最近お互いに意識し始めてギクシャクしている。"
                value={formData.plot}
                onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                イントロ（ファーストメッセージ / 第一声） <span className="text-rose-400">*</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-1">
                チャット開始時にキャラクターが最初に発するセリフとト書き。Zetaでは（）内のト書きと「」のセリフで臨場感を出します。
              </p>
              <textarea
                rows={5}
                required
                placeholder={`例: （放課後の誰もいない教室。腕を組んであなたの席の前に立ち、頬を少し赤らめながらため息をつく）\n\n「……やっと終わったの？ 部活長すぎよ、バカ。さっさとノート開きなさいよ」`}
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ユーザーとの関係性 (ペルソナ)
              </label>
              <input
                type="text"
                placeholder="例: 幼稚園からの幼馴染で席が隣のクラスメイト"
                value={formData.userRelationship || ''}
                onChange={(e) => setFormData({ ...formData, userRelationship: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-indigo-400">🤖 AIナレーター指示 (システムプロンプト)</span>
              <p className="text-slate-400">
                AIが勝手にユーザーのセリフを作ってしまう「乗っ取り（User Hijacking）」を防ぎ、Zeta特有のト書き＋セリフ表現を強制する最重要プロンプトです。
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                AIナレーター・ロールプレイ行動規範
              </label>
              <textarea
                rows={6}
                value={formData.aiInstructions}
                onChange={(e) => setFormData({ ...formData, aiInstructions: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ローアブック（用語集・隠し設定・背景情報）
              </label>
              <p className="text-[11px] text-slate-400 mb-1">
                キャラクターの隠された秘密や、世界観の固有名詞、過去の思い出などを記述します。
              </p>
              <textarea
                rows={4}
                placeholder={`【設定・秘密】\n- 昔雨の日に相合い傘をして帰った思い出を大切にしている。\n- スマホの待ち受けはあなたと昔撮ったツーショット写真。`}
                value={formData.lorebook}
                onChange={(e) => setFormData({ ...formData, lorebook: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                JSONインポート / エクスポート
              </span>
              <button
                type="button"
                onClick={() => {
                  setJsonInput(JSON.stringify(formData, null, 2));
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-md transition"
              >
                現在のデータを反映
              </button>
            </div>

            <textarea
              rows={10}
              placeholder="ここにキャラクターJSONを貼り付けて「JSONを反映」を押します"
              value={jsonInput || JSON.stringify(formData, null, 2)}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-emerald-400 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={handleLoadJson}
              className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition"
            >
              JSONデータをフォームに反映する
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-900/30"
          >
            <Save className="w-4 h-4" />
            キャラクターを保存
          </button>
        </div>
      </form>
    </div>
  );
};
