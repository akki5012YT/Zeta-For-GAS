export interface LorebookItem {
  id: string;
  keywords: string[];
  content: string;
}

export interface DialogueExample {
  id: string;
  user: string;
  character: string;
}

export interface ZetaCharacter {
  id: string;
  name: string;
  role: string;
  gender?: string;
  age?: string;
  appearance: string;
  personality: string;
  speakingStyle: string;
  firstPerson: string;
  secondPerson: string;
  plot: string; // World setting / situation
  intro: string; // First message with scenario & dialogue
  aiInstructions: string; // Narrative rules (e.g. don't write user's actions)
  lorebook: string; // Lorebook or world glossary
  lorebookItems?: LorebookItem[];
  dialogueExamples?: DialogueExample[];
  userRelationship: string;
  tags: string[];
  avatarUrl: string;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
}

export type GasType = 'hybrid_db_api' | 'webapp' | 'spreadsheet_db' | 'line_bot' | 'rest_api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
