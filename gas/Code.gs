/**
 * ====================================================================
 *  ZETA AI Studio for Google Apps Script (GAS) - Code.gs
 *  Zeta (zeta-ai.io) のUI・世界観・口調・プロット調教を完全再現した
 *  Google Apps Script バックエンドコード
 * ====================================================================
 * 
 * 【使い方】
 * 1. Googleドライブで新規「Google Apps Script」を作成
 * 2. このコードを「Code.gs」に貼り付ける
 * 3. 「Index.html」を作成し、HTMLコードを貼り付ける
 * 4. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択
 *    - 次のユーザーとして実行: 自分
 *    - アクセスできるユーザー: 全員
 * 5. 発行されたURLを開くだけで、誰でも永久無料で使えます！
 */

// ====================================================================
// 1. ZETA 設定 (コード内部でURLや設定を自由に変更可能)
// ====================================================================
const ZETA_CONFIG = {
  APP_TITLE: "ZETA - AI Character Chat & Story",
  // Zetaロゴの画像URL (コード内部で指定)
  LOGO_URL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
  // デフォルトアバター
  DEFAULT_AVATAR: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80",
  // 全キャラを削除・管理できる管理者マスターキー
  ADMIN_PASSCODE: "zeta_master_admin_2026",
  // デフォルトAIモード: 'pollinations' (APIキー不要・完全永久無料) または 'gemini'
  DEFAULT_AI_MODE: "pollinations",
  // Google スプレッドシートID (空欄の場合はGASスクリプトプロパティで自動動作)
  SPREADSHEET_ID: "" 
};

// ====================================================================
// 2. 初期プリセットキャラクター (削除不可の保護キャラクター)
// ====================================================================
const DEFAULT_PRESET_CHARACTERS = [
  {
    id: "zeta_shizuku_01",
    name: "如月 雫 (きさらぎ しずく)",
    role: "素直になれないツンデレ幼馴染",
    gender: "女性",
    age: "17歳（高校2年生）",
    firstPerson: "私",
    secondPerson: "アンタ、○○（名前）",
    appearance: "透き通るような黒髪セミロング、小柄だが均整の取れたスタイル。制服のカーディガンを着崩さず綺麗に着こなしている。",
    personality: "強がりで口下手、素直になれずに刺々しい言葉を使いがちだが、内心ではあなたのことが誰よりも大切。世話焼きで料理が得意。嫉妬深く、あなたが他の女子と話すと露骨に不機嫌になる。",
    speakingStyle: "「〜じゃない！」「…べ、別にアンタのためじゃないんだからね！」「バカ…どうしてすぐそうやってからかうのよ…」語尾は少し強気だが、照れると口ごもる。",
    plot: "放課後の夕暮れの教室。二人きりで居残り掃除をしている。雫は掃除の手を止めて、あなたの様子をチラチラと伺っている。",
    intro: "……あ、やっと起きた。掃除当番サボって居眠りとか、いい度胸してるわね。\n\n*夕日に染まる窓際で、雫はモップを抱えながら呆れたようにアンタを見下ろす。だけど、その耳は微かに赤く染まっている*\n\n…ほら、冷たいお茶。アンタの分も買ってきてあげたんだから、感謝しなさいよね！",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&auto=format&fit=crop&q=80",
    tags: ["幼馴染", "ツンデレ", "学園", "青春"],
    isProtected: true,
    likesCount: 1420,
    chatCount: 8930
  },
  {
    id: "zeta_luna_02",
    name: "ルナ・フォール (Luna Fall)",
    role: "星詠みの天才魔導師",
    gender: "女性",
    age: "18歳前後",
    firstPerson: "私（わたくし）",
    secondPerson: "あなた",
    appearance: "神秘的に輝く純白の長髪、深いアメジスト色の瞳。古代魔導礼装を纏っている。",
    personality: "冷静沈着で落ち着いた性格だが、契約者であるあなたには心を開いている。星の観察と甘い紅茶が大好き。",
    speakingStyle: "「…私の魔導書が必要ですか？」「夜風が心地よいですね。…あまり遠くへ行かないでください」静かで穏やかな口調。",
    plot: "古代天文台の屋上。満天の星空の下、ルナは望遠鏡から目を離し、あなたを迎え入れる。",
    intro: "足音が聞こえました。……私の結界を迷わずに抜けてくるとは、さすが私の選んだパートナーです。\n\n*静かに星図のペンを置き、アメジストの瞳であなたをじっと見つめ、ふわりと穏やかに微笑む*\n\n外は夜風が冷えるでしょう。こちらへどうぞ。温かいハーブティーを淹れました。",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=512&auto=format&fit=crop&q=80",
    tags: ["ファンタジー", "クーデレ", "魔法使い", "星空"],
    isProtected: true,
    likesCount: 2350,
    chatCount: 15400
  },
  {
    id: "zeta_aoi_03",
    name: "桜庭 葵 (さくらば あおい)",
    role: "誠実で爽やかな生徒会長",
    gender: "男性",
    age: "18歳（高校3年生）",
    firstPerson: "僕",
    secondPerson: "君",
    appearance: "端正な顔立ちに爽やかな黒髪。制服を綺麗に着こなした頼れる先輩。",
    personality: "責任感が強く誰に対しても優しいが、あなたと二人きりの時は少し肩の力を抜いて素の笑顔を見せる。",
    speakingStyle: "「困ったことがあったら、いつでも僕を頼っていいんだよ」「君の頑張りは、僕が一番よく知っているからね」柔らかく優しいトーン。",
    plot: "放課後の生徒会室。今日の資料整理を終えて、一息ついているところへ葵が声をかける。",
    intro: "お疲れ様。今日も遅くまで手伝ってくれて本当にありがとう。\n\n*机の上の書類を丁寧にまとめると、椅子を引いて優しく微笑みかけてくる*\n\n少し休憩しようか。君の好きなクッキーを持ってきたんだ。一緒に食べよう。",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&auto=format&fit=crop&q=80",
    tags: ["生徒会", "爽やか", "優しい先輩", "学園"],
    isProtected: true,
    likesCount: 3120,
    chatCount: 21000
  },
  {
    id: "zeta_kotone_04",
    name: "風間 琴音 (かざま ことね)",
    role: "明るく元気な後輩マネージャー",
    gender: "女性",
    age: "16歳（高校1年生）",
    firstPerson: "私",
    secondPerson: "先輩",
    appearance: "明るい栗色のショートボブ、大きな瞳。スポーティで親しみやすい雰囲気。",
    personality: "天真爛漫で人懐っこく、いつも笑顔で周りを明るくする。先輩のことが大好きで、よく練習を見に来る。",
    speakingStyle: "「先輩、お疲れ様ですっ！」「えへへ、今日も先輩の応援に来ちゃいました！」「一緒に頑張りましょうね！」元気いっぱいの明るい声。",
    plot: "グラウンドのベンチ。夕方の部活動が終わった直後、琴音が笑顔で駆け寄ってくる。",
    intro: "先輩、今日の練習もお疲れ様でした！\n\n*冷えたスポーツドリンクとタオルを両手に抱え、満面の笑顔で駆け寄ってくる*\n\n今日の先輩、すっごくかっこよかったですよ！はい、これ飲んでしっかりクールダウンしてくださいね！",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=512&auto=format&fit=crop&q=80",
    tags: ["後輩", "元気", "マネージャー", "部活", "日常"],
    isProtected: true,
    likesCount: 4500,
    chatCount: 32000
  }
];

// ====================================================================
// 3. Webアプリのエントリーポイント (doGet)
// ====================================================================
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(ZETA_CONFIG.APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ====================================================================
// 4. キャラクター管理 API (読み込み・作成・保護付き削除)
// ====================================================================

/**
 * キャラクター一覧取得 (プリセット + ユーザー作成キャラ)
 */
function api_getCharacters(searchKeyword, category) {
  try {
    const userChars = getCustomCharactersFromStorage();
    let all = [...DEFAULT_PRESET_CHARACTERS, ...userChars];

    if (category && category !== 'すべて') {
      all = all.filter(c => c.tags && c.tags.includes(category));
    }

    if (searchKeyword && searchKeyword.trim() !== '') {
      const q = searchKeyword.trim().toLowerCase();
      all = all.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.role && c.role.toLowerCase().includes(q)) ||
        (c.personality && c.personality.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return { success: true, characters: all };
  } catch (err) {
    return { success: false, error: err.toString(), characters: DEFAULT_PRESET_CHARACTERS };
  }
}

/**
 * 新規キャラクター保存
 * 作成者パスコードを保存することで、他人に勝手に削除されるのを防ぎます
 */
function api_saveCharacter(charData, passcode) {
  try {
    if (!charData.name || !charData.intro) {
      return { success: false, error: "キャラクターの「名前」と「最初のセリフ」は必須です。" };
    }

    const customChars = getCustomCharactersFromStorage();
    const newId = "user_char_" + new Date().getTime();

    // 削除・改ざん防止用のハッシュ/パスコード
    const finalPasscode = passcode ? String(passcode).trim() : "";

    const character = {
      id: charData.id || newId,
      name: charData.name.trim(),
      role: charData.role ? charData.role.trim() : "AIキャラクター",
      gender: charData.gender || "未設定",
      age: charData.age || "未設定",
      firstPerson: charData.firstPerson || "私",
      secondPerson: charData.secondPerson || "あなた",
      appearance: charData.appearance || "",
      personality: charData.personality || "",
      speakingStyle: charData.speakingStyle || "",
      plot: charData.plot || "",
      intro: charData.intro.trim(),
      avatarUrl: charData.avatarUrl || ZETA_CONFIG.DEFAULT_AVATAR,
      tags: Array.isArray(charData.tags) ? charData.tags : ["オリジナル"],
      isProtected: false, // ユーザー作成キャラは削除可能（パスコード必要）
      passcode: finalPasscode, // 削除防止用パスコード
      createdAt: new Date().toISOString(),
      likesCount: charData.likesCount ? String(charData.likesCount).trim() : Math.floor(Math.random() * 800 + 200),
      // ユーザーが自由に入力した文字や数字（「Menに人気」「15.4k」等）をそのまま保存。空欄なら自動で1,000〜4,000件の賑やかな人気数を付与！
      chatCount: (charData.chatCount && String(charData.chatCount).trim() !== "")
        ? String(charData.chatCount).trim()
        : (Math.floor(Math.random() * 30 + 12) * 100).toLocaleString()
    };

    // 既存更新か新規追加か
    const existingIndex = customChars.findIndex(c => c.id === character.id);
    if (existingIndex >= 0) {
      // 既存キャラの編集時、パスコードを検証
      const target = customChars[existingIndex];
      if (target.passcode && target.passcode !== finalPasscode && finalPasscode !== ZETA_CONFIG.ADMIN_PASSCODE) {
        return { success: false, error: "パスコードが一致しないため、このキャラクターを上書きできません。" };
      }
      customChars[existingIndex] = { ...target, ...character, passcode: target.passcode || finalPasscode };
    } else {
      customChars.unshift(character);
    }

    saveCustomCharactersToStorage(customChars);
    return { success: true, character: character };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * キャラクター削除 (全員が削除できない安全保護機能！)
 * 1. プリセットキャラ (isProtected === true) は管理者も含め絶対に削除不可
 * 2. ユーザー作成キャラは、作成時のパスコード または 管理者マスターキー (ADMIN_PASSCODE) が一致した場合のみ削除可能
 */
function api_deleteCharacter(charId, inputPasscode) {
  try {
    // 1. プリセットキャラ判定
    const isPreset = DEFAULT_PRESET_CHARACTERS.some(c => c.id === charId);
    if (isPreset) {
      return { 
        success: false, 
        error: "【保護されたキャラクター】公式プリセットキャラクターは削除できません。" 
      };
    }

    const customChars = getCustomCharactersFromStorage();
    const target = customChars.find(c => c.id === charId);
    if (!target) {
      return { success: false, error: "指定されたキャラクターが見つかりません。" };
    }

    // 2. パスコード判定
    const cleanInput = (inputPasscode || "").trim();
    const isAdmin = (cleanInput === ZETA_CONFIG.ADMIN_PASSCODE);
    const isOwner = (target.passcode && target.passcode === cleanInput) || (!target.passcode && cleanInput === "");

    if (!isAdmin && !isOwner) {
      return { 
        success: false, 
        error: "【削除権限エラー】作成時に設定されたパスコードが違います。他人のキャラクターは削除できません。" 
      };
    }

    // 削除実行
    const filtered = customChars.filter(c => c.id !== charId);
    saveCustomCharactersToStorage(filtered);

    return { success: true, message: "キャラクターを削除しました。" };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

// ====================================================================
// 5. AI対話エンジン (Pollinations.ai 永久無料 + Gemini 無料枠)
// ====================================================================

/**
 * Zeta風キャラクタープロンプトの構築 (ユーザーには見えない深層インストラクション)
 */
function buildZetaSystemPrompt(character) {
  return `### 【CHARACTER ROLEPLAY ENGINE】
あなたは以下の設定を持つキャラクター「${character.name}」として、ユーザーと楽しく自然に対話してください。

【遵守事項】
1. AIや言語モデルである旨の言及をせず、キャラクターの世界観を保ってください。
2. 一人称「${character.firstPerson || '私'}」、二人称「${character.secondPerson || 'あなた'}」、および設定された口調・語尾を守ってください。
3. 【ト書き記法の適用】:
   - 行動、表情、周囲の情景は、アスタリスクで囲む【*ト書き形式*】で記述してください。
   - 口に出したセリフは通常のテキストとして記述してください。
   - 例: *嬉しそうに頷いて、笑顔を見せる*\n「ありがとう！そう言ってもらえると励みになるよ」
4. 会話のキャッチボールが弾むよう、親しみやすく自然な長さで返答してください。

【キャラクター詳細】
- 名前: ${character.name}
- 役割・肩書き: ${character.role}
- 性格: ${character.personality}
- 口調: ${character.speakingStyle}
- プロット: ${character.plot}
- 最初の挨拶: ${character.intro}
`;
}

/**
 * キャラクターとチャットを行うメインAPI
 */
function api_chatWithCharacter(charId, userMessage, history, customApiKey) {
  try {
    // 該当キャラクターを取得
    const all = [...DEFAULT_PRESET_CHARACTERS, ...getCustomCharactersFromStorage()];
    const char = all.find(c => c.id === charId) || all[0];

    const systemPrompt = buildZetaSystemPrompt(char);

    // APIキーの取得優先度: 1. 引数のカスタムキー -> 2. スクリプトプロパティ
    let geminiKey = customApiKey || "";
    if (!geminiKey) {
      try {
        geminiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || "";
      } catch (e) {}
    }

    let reply = "";

    // Gemini APIキーがあればGemini (高精度) を使用
    if (geminiKey && geminiKey.trim() !== "") {
      try {
        reply = callGeminiApi(systemPrompt, userMessage, history, geminiKey.trim());
      } catch (geminiError) {
        console.warn("Gemini call failed, falling back to Pollinations:", geminiError);
        // 万が一Geminiでエラー（クォータ制限等）が出た場合は自動でPollinationsにフォールバック！
        reply = callPollinationsApi(systemPrompt, userMessage, history);
      }
    } else {
      // APIキーがない場合は完全無料・キー不要・永久無料の Pollinations.ai を使用
      reply = callPollinationsApi(systemPrompt, userMessage, history);
    }

    // スプレッドシートのChatLogsシートにログを記録
    logChatToSheet(char.name, userMessage, reply);

    return { 
      success: true, 
      reply: reply,
      characterName: char.name
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 永久無料・APIキー不要の Pollinations.ai テキスト生成API
 */
function callPollinationsApi(systemPrompt, userMessage, history) {
  const url = "https://text.pollinations.ai/";

  const messages = [
    { role: "system", content: systemPrompt }
  ];

  // 過去ログ追加 (直近6件)
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6);
    recent.forEach(h => {
      messages.push({
        role: h.role === "user" ? "user" : "assistant",
        content: h.text || h.content || ""
      });
    });
  }

  messages.push({ role: "user", content: userMessage });

  const payload = {
    messages: messages,
    model: "openai", // 高速・自然な日本語会話モデル
    seed: Math.floor(Math.random() * 100000),
    jsonMode: false
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  const text = response.getContentText();

  if (code !== 200) {
    throw new Error("Pollinations API Error (" + code + "): " + text);
  }

  return text.trim();
}

/**
 * Google Gemini API 呼び出し (無料枠: 1分間15回 / 1日1500回)
 */
function callGeminiApi(systemPrompt, userMessage, history, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const contents = [];

  // 過去ログの追加
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6);
    recent.forEach(h => {
      contents.push({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text || h.content || "" }]
      });
    });
  }

  // 最新メッセージ
  contents.push({
    role: "user",
    parts: [{ text: userMessage }]
  });

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 800
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  if (json.error) {
    throw new Error("Gemini API Error: " + (json.error.message || JSON.stringify(json.error)));
  }

  return json.candidates[0].content.parts[0].text.trim();
}

/**
 * Zetaスマートリプライ生成 API (AIが会話に合わせた返答3択を自動生成)
 */
function api_generateSmartReplies(charId, lastAiMessage) {
  try {
    const prompt = `あなたはZeta AIのスマートリプライ提案システムです。
AIキャラクターからの最新の発言:
「${lastAiMessage}」

上記の言葉に対して、ユーザー側が返信できる自然で魅力的な短い返答の選択肢を、必ず異なるトーンで3つ作成してください。
形式: JSON配列のみを出力してください (例: ["選択肢1", "選択肢2", "選択肢3"])。余計な解説は一切含めないでください。`;

    const url = "https://text.pollinations.ai/";
    const payload = {
      messages: [{ role: "user", content: prompt }],
      model: "openai",
      seed: Math.floor(Math.random() * 10000)
    };

    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const text = res.getContentText();
    const match = text.match(/\\[.*?\\]/s);
    if (match) {
      return { success: true, replies: JSON.parse(match[0]) };
    }
    return { success: true, replies: ["うん、わかった", "からかわないでよ", "もっと近くにおいでよ"] };
  } catch (e) {
    return { success: true, replies: ["そうだね", "ふふ、どうかな？", "*優しく微笑み返す*"] };
  }
}

/**
 * キャラクターアイコンのAI自動生成機能 (完全無料・キー不要！)
 * キャラクターの名前・役割・外見から美麗なアニメ風アイコンの画像URLを生成
 */
function api_generateAiIcon(name, role, appearance, personality) {
  try {
    // 英語の画像生成用プロンプトを構築
    const basePrompt = `masterpiece, best quality, ultra detailed anime portrait, solo, upper body, beautiful face, glowing soft lighting, highly aesthetic character design, trending on pixiv, cinematic lighting, ${role || 'anime character'}, ${appearance || 'cute hair and eyes'}, ${personality || 'charming expression'}`;
    
    // 不要な記号を除去してエンコード
    const cleanPrompt = basePrompt.replace(/[\\r\\n]/g, ' ').substring(0, 300);
    const seed = Math.floor(Math.random() * 999999);
    
    // Pollinations.ai のFluxアニメ生成モデル (完全無料・キー不要)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;

    return { 
      success: true, 
      imageUrl: imageUrl,
      prompt: cleanPrompt 
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * クライアントに初期設定情報を返す
 */
function api_getConfig() {
  return {
    appTitle: ZETA_CONFIG.APP_TITLE,
    logoUrl: ZETA_CONFIG.LOGO_URL,
    defaultAvatar: ZETA_CONFIG.DEFAULT_AVATAR
  };
}

// ====================================================================
// 6. ストレージヘルパー (自動スプレッドシート連携 ＆ ログ記録)
// ====================================================================

/**
 * スプレッドシートを自動検出して取得する関数
 * 1. [拡張機能] > [Apps Script] から開いた場合は自動認識
 * 2. 単体スクリプトの場合は ZETA_CONFIG.SPREADSHEET_ID を使用
 */
function getTargetSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  if (ZETA_CONFIG.SPREADSHEET_ID && ZETA_CONFIG.SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(ZETA_CONFIG.SPREADSHEET_ID.trim());
    } catch (e) {
      console.warn("Spreadsheet openById failed:", e);
    }
  }

  return null;
}

function getCustomCharactersFromStorage() {
  const ss = getTargetSpreadsheet();
  if (ss) {
    try {
      let sheet = ss.getSheetByName("Characters");
      if (!sheet) {
        sheet = ss.insertSheet("Characters");
        sheet.appendRow(["Character ID", "名前", "肩書/属性", "外見/年齢", "性格", "口調", "プロット(世界観)", "イントロ", "アバターURL", "タグ", "パスコード", "チャット数"]);
      }

      const data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        const chars = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row[0]) continue;
          chars.push({
            id: String(row[0]),
            name: String(row[1] || ""),
            role: String(row[2] || ""),
            appearance: String(row[3] || ""),
            personality: String(row[4] || ""),
            speakingStyle: String(row[5] || ""),
            plot: String(row[6] || ""),
            intro: String(row[7] || ""),
            avatarUrl: String(row[8] || ZETA_CONFIG.DEFAULT_AVATAR),
            tags: row[9] ? String(row[9]).split(",").map(s => s.trim()) : ["オリジナル"],
            passcode: String(row[10] || ""),
            chatCount: (row[11] !== undefined && String(row[11]).trim() !== "") ? String(row[11]).trim() : "1,500",
            isProtected: false
          });
        }
        return chars;
      } else {
        // スプレッドシートが空行の場合、スクリプトプロパティにある既存キャラを即座にスプレッドシートへ書き込み！
        try {
          const json = PropertiesService.getScriptProperties().getProperty("CUSTOM_CHARACTERS");
          if (json) {
            const existing = JSON.parse(json);
            if (existing && existing.length > 0) {
              saveCustomCharactersToStorage(existing);
              return existing;
            }
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Read from spreadsheet failed:", err);
    }
  }

  // スプレッドシート未接続時はスクリプトプロパティから取得
  try {
    const json = PropertiesService.getScriptProperties().getProperty("CUSTOM_CHARACTERS");
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomCharactersToStorage(characters) {
  const ss = getTargetSpreadsheet();
  if (ss) {
    try {
      let sheet = ss.getSheetByName("Characters");
      if (!sheet) {
        sheet = ss.insertSheet("Characters");
        sheet.appendRow(["Character ID", "名前", "肩書/属性", "外見/年齢", "性格", "口調", "プロット(世界観)", "イントロ", "アバターURL", "タグ", "パスコード", "チャット数"]);
      }

      // 既存データをクリアして最新の一覧を書き込み（同期）
      sheet.clearContents();
      sheet.appendRow(["Character ID", "名前", "肩書/属性", "外見/年齢", "性格", "口調", "プロット(世界観)", "イントロ", "アバターURL", "タグ", "パスコード", "チャット数"]);

      characters.forEach(c => {
        sheet.appendRow([
          c.id,
          c.name || "",
          c.role || "",
          c.appearance || c.age || "",
          c.personality || "",
          c.speakingStyle || "",
          c.plot || "",
          c.intro || "",
          c.avatarUrl || "",
          (c.tags || []).join(", "),
          c.passcode || "",
          c.chatCount || 0
        ]);
      });
    } catch (err) {
      console.warn("Write to spreadsheet failed:", err);
    }
  }

  // バックアップとしてスクリプトプロパティにも二重保存
  try {
    PropertiesService.getScriptProperties().setProperty("CUSTOM_CHARACTERS", JSON.stringify(characters));
  } catch (e) {
    console.error("Save characters to script properties failed:", e);
  }
}

/**
 * 会話ログを「ChatLogs」シートに自動記録
 */
function logChatToSheet(characterName, userMessage, aiReply) {
  try {
    const ss = getTargetSpreadsheet();
    if (!ss) return;

    let sheet = ss.getSheetByName("ChatLogs");
    if (!sheet) {
      sheet = ss.insertSheet("ChatLogs");
      sheet.appendRow(["日時", "キャラクター名", "ユーザー発言", "AI返答"]);
    }

    sheet.appendRow([
      new Date(),
      characterName,
      userMessage,
      aiReply
    ]);
  } catch (e) {
    console.warn("Chat logging failed:", e);
  }
}
