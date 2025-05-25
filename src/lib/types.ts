
export type ShadowverseClass = 'エルフ' | 'ロイヤル' | 'ドラゴン' | 'ウィッチ' | 'ナイトメア' | 'ビショップ' | 'ネメシス';
export type TurnOrder = '先攻' | '後攻';
export type GameResult = '勝利' | '敗北';
export type OverallResult = '勝利' | '敗北' | '';

export interface GameDetail {
  userPlayedClass: ShadowverseClass;
  opponentPlayedClass: ShadowverseClass;
  turnOrder: TurnOrder;
  result: GameResult;
  memo: string;
}

export interface AppData {
  userClasses: [ShadowverseClass, ShadowverseClass] | [];
  roundNumber: string;
  opponentName: string;
  game1: GameDetail | null;
  game2: GameDetail | null;
  game3: GameDetail | null; // Only if needed
  overallResult: OverallResult;
}

export type AppStep =
  | 'CLASS_SELECTION'
  | 'MATCH_INFO'
  | 'GAME_1_DETAILS'
  | 'GAME_2_DETAILS'
  | 'GAME_3_DETAILS' // Conditionally shown
  | 'RESULTS';
