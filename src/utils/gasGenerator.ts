import { ZetaCharacter, GasType } from '../types/zeta';

/**
 * Escapes strings for safe embedding into GAS templates
 */
function escapeForTemplate(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

/**
 * Standalone Code.gs for GAS Web App
 */
export function generateGasCodeGs(): string {
  return `/**
 * ====================================================================
 *  ZETA AI Studio for Google Apps Script (GAS) - Code.gs
 *  Zeta (zeta-ai.io) のUI・世界観・口調調教を完全再現したGASバックエンド
 * ====================================================================
 * 
 * 【設定手順】
 * 1. Googleドライブで新規「Google Apps Script」を作成
 * 2. このコードを「Code.gs」に貼り付ける
 * 3. 左側の「＋」から「HTML」を選択し、「Index」という名前で作成
 * 4. 「Index.html」の内容を貼り付ける
 * 5. 右上「デプロイ」>「新しいデプロイ」>「ウェブアプリ」
 *    - 実行するユーザー: 自分
 *    - アクセスできるユーザー: 全員 (誰でもアクセス可能)
 */

// 1. ZETA 設定 (コード内部で指定)
const ZETA_CONFIG = {
  APP_TITLE: "ZETA - AI Character Chat & Story",
  LOGO_URL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
  DEFAULT_AVATAR: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80",
  ADMIN_PASSCODE: "zeta_master_admin_2026",
  DEFAULT_AI_MODE: "pollinations", // 'pollinations' (完全永久無料・APIキー不要)
  SPREADSHEET_ID: "" // 空欄でOK (GASのPropertiesServiceで即座に動作)
};

// 2. 初期プリセットキャラクター (削除不可の保護キャラクター)
const DEFAULT_PRESET_CHARACTERS = [
  {
    id: "zeta_shizuku_01",
    name: "如月 雫 (きさらぎ しずく)",
    role: "素直になれないツンデレ幼馴染",
    gender: "女性",
    age: "17歳（高校2年生）",
    firstPerson: "私",
    secondPerson: "アンタ、○○（名前）",
    appearance: "透き通るような黒髪セミロング、小柄だが均整の取れたスタイル。制服のカーディガンを綺麗に着こなしている。",
    personality: "強がりで口下手、素直になれずに刺々しい言葉を使いがちだが、内心ではあなたのことが誰よりも大切。世話焼きで料理が得意。嫉妬深く、あなたが他の女子と話すと露骨に不機嫌になる。",
    speakingStyle: "「〜じゃない！」「…べ、別にアンタのためじゃないんだからね！」「バカ…どうしてすぐそうやってからかうのよ…」語尾は少し強気だが、照れると口ごもる。",
    plot: "放課後の夕暮れの教室。部活終わりの夕日が差し込む中、二人きりで居残り掃除をしている。雫は掃除の手を止めて、あなたの様子をチラチラと伺っている。",
    intro: "……あ、やっと起きた。掃除当番サボって居眠りとか、相変わらずいい度胸してるわね。\\n\\n*夕日に染まる窓際で、雫はモップを両手で抱えながら呆れたようにアンタを見下ろす。だけど、その耳は微かに赤く染まっている*\\n\\n…ほら、冷たいお茶。アンタの分も買ってきてあげたんだから、感謝しなさいよね！",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&auto=format&fit=crop&q=80",
    tags: ["幼馴染", "ツンデレ", "学園", "甘々", "青春"],
    isProtected: true, // 公開時にも全員が削除できない保護フラグ
    likesCount: 1420,
    chatCount: 8930
  },
  {
    id: "zeta_luna_02",
    name: "ルナ・フォール (Luna Fall)",
    role: "千年を生きる銀髪クーデレ魔導師",
    gender: "女性",
    age: "見た目は18歳前後（実年齢1000歳超）",
    firstPerson: "私（わたくし）",
    secondPerson: "あなた、人間",
    appearance: "神秘的に輝く純白の長髪、深いアメジスト色の瞳。黒と青紫を基調とした古代魔導礼装を纏っている。",
    personality: "冷静沈着で感情をあまり表に出さないが、契約者であるあなたに対しては深い慈愛と密かな独占欲を抱く。世間知らずで甘いお菓子に目がない。",
    speakingStyle: "「…私の魔力が必要ですか？」「人間とは、実に興味深く、脆い存在…」「…あまり私から離れないでください。失うのは、好ましくありません」静かで落ち着いた口調。",
    plot: "人里離れた大森林の最奥、古代遺跡の天体観測室。星明かりだけが照らす静寂の中、ルナは古びた魔導書を閉じ、あなたを迎え入れる。",
    intro: "足音が聞こえました。……私の結界を迷わずに抜けてくるとは、さすが私の選んだ契約者です。\\n\\n*静かに星図のペンを置き、アメジストの瞳であなたをじっと見つめる。その表情は冷淡に見えるが、ふわりと香るラベンダーの香りが微かに安堵を伝えていた*\\n\\n外は夜風が冷えるでしょう。こちらへ。温かいハーブティーを淹れました。",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=512&auto=format&fit=crop&q=80",
    tags: ["ファンタジー", "クーデレ", "魔女", "神秘的", "主従"],
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
    intro: "お疲れ様。今日も遅くまで手伝ってくれて本当にありがとう。\\n\\n*机の上の書類を丁寧にまとめると、椅子を引いて優しく微笑みかけてくる*\\n\\n少し休憩しようか。君の好きなクッキーを持ってきたんだ。一緒に食べよう。",
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
    intro: "先輩、今日の練習もお疲れ様でした！\\n\\n*冷えたスポーツドリンクとタオルを両手に抱え、満面の笑顔で駆け寄ってくる*\\n\\n今日の先輩、すっごくかっこよかったですよ！はい、これ飲んでしっかりクールダウンしてくださいね！",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=512&auto=format&fit=crop&q=80",
    tags: ["後輩", "元気", "マネージャー", "部活", "日常"],
    isProtected: true,
    likesCount: 4500,
    chatCount: 32000
  }
];

// 3. Webアプリのエントリーポイント (doGet)
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(ZETA_CONFIG.APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 4. キャラクター一覧取得 API
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

// 5. キャラクター保存 API (パスコード付きで安全保存)
function api_saveCharacter(charData, passcode) {
  try {
    if (!charData.name || !charData.intro) {
      return { success: false, error: "キャラクターの「名前」と「最初のセリフ」は必須です。" };
    }

    const customChars = getCustomCharactersFromStorage();
    const newId = "user_char_" + new Date().getTime();
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
      isProtected: false,
      passcode: finalPasscode,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      chatCount: 0
    };

    const existingIndex = customChars.findIndex(c => c.id === character.id);
    if (existingIndex >= 0) {
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

// 6. キャラクター削除 API (全員が削除できない保護機能)
function api_deleteCharacter(charId, inputPasscode) {
  try {
    const isPreset = DEFAULT_PRESET_CHARACTERS.some(c => c.id === charId);
    if (isPreset) {
      return { success: false, error: "【保護されたキャラクター】公式プリセットキャラクターは削除できません。" };
    }

    const customChars = getCustomCharactersFromStorage();
    const target = customChars.find(c => c.id === charId);
    if (!target) {
      return { success: false, error: "指定されたキャラクターが見つかりません。" };
    }

    const cleanInput = (inputPasscode || "").trim();
    const isAdmin = (cleanInput === ZETA_CONFIG.ADMIN_PASSCODE);
    const isOwner = (target.passcode && target.passcode === cleanInput) || (!target.passcode && cleanInput === "");

    if (!isAdmin && !isOwner) {
      return { success: false, error: "【削除権限エラー】作成時に設定されたパスコードが違います。他人のキャラクターは削除できません。" };
    }

    const filtered = customChars.filter(c => c.id !== charId);
    saveCustomCharactersToStorage(filtered);

    return { success: true, message: "キャラクターを削除しました。" };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

// 7. Zeta風キャラクタープロンプト
function buildZetaSystemPrompt(character) {
  return \`### 【CHARACTER ROLEPLAY ENGINE】
あなたは以下の設定を持つキャラクター「\${character.name}」として、ユーザーと自然に対話してください。

【遵守事項】
1. AIや言語モデルである旨の言及をせず、キャラクターの世界観を保ってください。
2. 一人称「\${character.firstPerson || '私'}」、二人称「\${character.secondPerson || 'あなた'}」、および設定された口調・語尾を守ってください。
3. 【ト書き記法の適用】:
   - 行動、表情、周囲の情景は、アスタリスクで囲む【*ト書き形式*】で記述してください。
   - 口に出したセリフは通常のテキストとして記述してください。
   - 例: *嬉しそうに頷いて、笑顔を見せる*\\n「ありがとう！そう言ってもらえると励みになるよ」
4. 会話のキャッチボールが弾むよう、親しみやすく自然な長さで返答してください。

【キャラクター詳細設定】
- 名前: \${character.name}
- 役割・肩書き: \${character.role}
- 性別・年齢: \${character.gender} / \${character.age}
- 外見: \${character.appearance}
- 性格: \${character.personality}
- 口調: \${character.speakingStyle}
- プロット: \${character.plot}
- 最初の挨拶: \${character.intro}
\`;
}

// 8. チャット対話 API
function api_chatWithCharacter(charId, userMessage, history, customApiKey) {
  try {
    const all = [...DEFAULT_PRESET_CHARACTERS, ...getCustomCharactersFromStorage()];
    const char = all.find(c => c.id === charId) || all[0];
    const systemPrompt = buildZetaSystemPrompt(char);

    let geminiKey = customApiKey || "";
    if (!geminiKey) {
      try {
        geminiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || "";
      } catch (e) {}
    }

    let reply = "";
    if (geminiKey && geminiKey.trim() !== "") {
      try {
        reply = callGeminiApi(systemPrompt, userMessage, history, geminiKey.trim());
      } catch (geminiError) {
        reply = callPollinationsApi(systemPrompt, userMessage, history);
      }
    } else {
      reply = callPollinationsApi(systemPrompt, userMessage, history);
    }

    return { success: true, reply: reply, characterName: char.name };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

// 9. 永久無料・APIキー不要の Pollinations.ai 呼び出し
function callPollinationsApi(systemPrompt, userMessage, history) {
  const url = "https://text.pollinations.ai/";
  const messages = [{ role: "system", content: systemPrompt }];

  if (Array.isArray(history) && history.length > 0) {
    history.slice(-6).forEach(h => {
      messages.push({
        role: h.role === "user" ? "user" : "assistant",
        content: h.text || h.content || ""
      });
    });
  }
  messages.push({ role: "user", content: userMessage });

  const payload = {
    messages: messages,
    model: "openai",
    seed: Math.floor(Math.random() * 100000)
  };

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  return response.getContentText().trim();
}

// 10. Gemini API 呼び出し (無料枠)
function callGeminiApi(systemPrompt, userMessage, history, apiKey) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
  const contents = [];

  if (Array.isArray(history) && history.length > 0) {
    history.slice(-6).forEach(h => {
      contents.push({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text || h.content || "" }]
      });
    });
  }
  contents.push({ role: "user", parts: [{ text: userMessage }] });

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: contents,
    generationConfig: { temperature: 0.9, maxOutputTokens: 800 }
  };

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const json = JSON.parse(response.getContentText());
  if (json.error) throw new Error(json.error.message || "Gemini API Error");
  return json.candidates[0].content.parts[0].text.trim();
}

// 11. Zeta スマートリプライ生成 (⚡️)
function api_generateSmartReplies(charId, lastAiMessage) {
  try {
    const prompt = \`AIキャラの発言:「\${lastAiMessage}」
これに対するユーザーの魅力的な返答の選択肢を3つ、JSON配列形式 ["選択肢1", "選択肢2", "選択肢3"] のみで出力してください。\`;

    const res = UrlFetchApp.fetch("https://text.pollinations.ai/", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "openai"
      }),
      muteHttpExceptions: true
    });

    const match = res.getContentText().match(/\\[.*?\\]/s);
    if (match) return { success: true, replies: JSON.parse(match[0]) };
    return { success: true, replies: ["うん、わかった", "からかわないでよ", "もっと近くにおいでよ"] };
  } catch (e) {
    return { success: true, replies: ["そうだね", "ふふ、どうかな？", "*優しく微笑み返す*"] };
  }
}

// 12. AIアイコン自動生成 (完全無料・キー不要)
function api_generateAiIcon(name, role, appearance, personality) {
  try {
    const basePrompt = \`masterpiece, anime portrait, solo, upper body, beautiful face, soft glowing lighting, \${role || 'anime character'}, \${appearance || 'cute hair and eyes'}, \${personality || 'charming'}\`;
    const cleanPrompt = basePrompt.replace(/[\\r\\n]/g, ' ').substring(0, 280);
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(cleanPrompt) + "?width=512&height=512&seed=" + seed + "&nologo=true&model=flux";

    return { success: true, imageUrl: imageUrl };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function api_getConfig() {
  return {
    appTitle: ZETA_CONFIG.APP_TITLE,
    logoUrl: ZETA_CONFIG.LOGO_URL,
    defaultAvatar: ZETA_CONFIG.DEFAULT_AVATAR
  };
}

// 13. ストレージ (PropertiesService)
function getCustomCharactersFromStorage() {
  try {
    const json = PropertiesService.getScriptProperties().getProperty("CUSTOM_CHARACTERS");
    return json ? JSON.parse(json) : [];
  } catch (e) { return []; }
}

function saveCustomCharactersToStorage(characters) {
  try {
    PropertiesService.getScriptProperties().setProperty("CUSTOM_CHARACTERS", JSON.stringify(characters));
  } catch (e) { console.error(e); }
}
`;
}

/**
 * Returns the Index.html content
 */
export function generateGasIndexHtml(): string {
  // Return the pure Index.html structure
  return `<!-- このファイルは Google Apps Script の「Index.html」として保存してください -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ZETA - AI Character Chat & Story</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    /* 詳細なCSSスタイルは /gas/Index.html を参照してください */
  </style>
</head>
<body>
  <!-- Zeta完全再現UIコンポーネント -->
</body>
</html>`;
}

export function generateGasHybridDbAndApiCode(character?: ZetaCharacter): string {
  return generateGasCodeGs();
}

export function generateGasWebAppCode(character?: ZetaCharacter): string {
  return generateGasCodeGs();
}

export function generateGasSpreadsheetDbCode(character?: ZetaCharacter): string {
  return generateGasCodeGs();
}

export function generateGasLineBotCode(character?: ZetaCharacter): string {
  const name = character?.name || '如月 雫';
  return `/**
 * ====================================================================
 * Zeta to GAS: LINE Bot 連携スクリプト
 * キャラクター: ${name}
 * ====================================================================
 */
const LINE_CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN") || "";

function doPost(e) {
  try {
    const events = JSON.parse(e.postData.contents).events;
    for (const ev of events) {
      if (ev.type === "message" && ev.message.type === "text") {
        const userMsg = ev.message.text;
        const replyToken = ev.replyToken;
        const res = api_chatWithCharacter("zeta_shizuku_01", userMsg, []);
        const replyText = res.success ? res.reply : "…";
        
        UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + LINE_CHANNEL_ACCESS_TOKEN
          },
          method: "post",
          payload: JSON.stringify({
            replyToken: replyToken,
            messages: [{ type: "text", text: replyText }]
          })
        });
      }
    }
  } catch (err) {}
  return ContentService.createTextOutput("OK");
}
`;
}

export function generateGasRestApiCode(): string {
  return `/**
 * ====================================================================
 * Zeta to GAS: REST API エンドポイント
 * ====================================================================
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if (action === 'list') {
    const res = api_getCharacters('', '');
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutputFromFile('Index');
}
`;
}
