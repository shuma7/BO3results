
import type { ShadowverseClass, TurnOrder, GameResult, AppData, AppStep } from './types';

export const ALL_SHADOWVERSE_CLASSES: ShadowverseClass[] = [
  'エルフ',
  'ロイヤル',
  'ドラゴン',
  'ウィッチ',
  'ナイトメア',
  'ビショップ',
  'ネメシス',
];

export const TURN_ORDERS: TurnOrder[] = ['先', '後'];
export const GAME_RESULTS: GameResult[] = ['勝利', '敗北'];

export const ROUND_OPTIONS: string[] = [
  '1回戦', '2回戦', '3回戦', '4回戦', '5回戦', 
  '6回戦', '7回戦', '8回戦', '9回戦',
  '準々決勝', '準決勝', '決勝', 'その他'
];

export const INITIAL_APP_DATA: AppData = {
  userClasses: [],
  roundNumber: ROUND_OPTIONS[0], // Default to the first option
  opponentName: '',
  game1: null,
  game2: null,
  game3: null,
  overallResult: '',
};

export const STEP_TITLES: Record<AppStep, string> = {
  CLASS_SELECTION: "自分の使用クラス選択",
  MATCH_INFO: "対戦情報入力",
  GAME_1_DETAILS: "1試合目 結果入力",
  GAME_2_DETAILS: "2試合目 結果入力",
  GAME_3_DETAILS: "3試合目 結果入力",
  RESULTS: "結果確認・出力",
};

export const TOTAL_MAIN_STEPS = 4; // Class Selection, Match Info, Game 1, Game 2. Results is the end. Game 3 is conditional.
                                // This helps with progress bar logic for the main flow.
                                // Actual progress mapping will be more nuanced.

