
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { AppData, GameDetail, TurnOrder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCopy, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface ResultsStepProps {
  appData: AppData;
  onBack: () => void;
  onReset: () => void;
  onNextMatchSameClasses: () => void;
}

function formatGameDetailForOutput(gameNumSymbol: string, game: GameDetail | null): string {
  if (!game) return "";
  const userResultIcon = game.result === '勝利' ? '○' : '✕';
  const opponentResultIcon = game.result === '勝利' ? '✕' : '○';
  
  // Ensure turn orders are correctly mapped if they were '先攻'/'後攻' before
  const displayTurnOrder = game.turnOrder === '先' ? '先' : '後';
  const displayOpponentTurnOrder: TurnOrder = displayTurnOrder === '先' ? '後' : '先';

  let output = `${gameNumSymbol} ${displayTurnOrder}:${game.userPlayedClass} ${userResultIcon}ｰ${opponentResultIcon} ${displayOpponentTurnOrder}:${game.opponentPlayedClass}\n`;
  if (game.memo.trim()) {
    output += `${game.memo.trim()}\n`; // Removed indentation here
  }
  return output;
}

export function generateFormattedOutput(appData: AppData): string {
  let output = `${appData.roundNumber}`;
  if (appData.opponentName.trim()) {
    output += `　vs:${appData.opponentName.trim()}`;
  }
  output += '\n';

  output += formatGameDetailForOutput('Ⅰ', appData.game1);
  output += formatGameDetailForOutput('Ⅱ', appData.game2);
  if (appData.game3) {
    output += formatGameDetailForOutput('Ⅲ', appData.game3);
  }

  if (appData.overallResult) {
    output += `${appData.overallResult}\n`;
  }
  return output.trim();
}


export function ResultsStep({ appData, onBack, onReset, onNextMatchSameClasses }: ResultsStepProps) {
  const { toast } = useToast();
  const formattedOutput = generateFormattedOutput(appData);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput)
      .then(() => {
        toast({ title: "成功", description: "結果をクリップボードにコピーしました。" });
      })
      .catch(err => {
        console.error("クリップボードへのコピーに失敗しました:", err);
        toast({ variant: "destructive", title: "失敗", description: "クリップボードへのコピーに失敗しました。" });
      });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>試合結果まとめ</CardTitle>
          <CardDescription>生成された試合結果テキストです。コピーして使用できます。</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formattedOutput}
            readOnly
            rows={Math.max(5, formattedOutput.split('\n').length + 2)}
            className="text-sm bg-muted/50 whitespace-pre-wrap"
          />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            入力に戻る
          </Button>
          <Button onClick={handleCopyToClipboard} className="w-full sm:w-auto">
            <ClipboardCopy className="mr-2 h-4 w-4" />
            クリップボードにコピー
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center mt-6 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:gap-4">
        <Button variant="outline" onClick={onNextMatchSameClasses} className="w-full sm:w-auto">
          <ArrowRight className="mr-2 h-4 w-4" />
          次のマッチへ (クラス維持)
        </Button>
        <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          新しいBO3結果を入力 (全てリセット)
        </Button>
      </div>
    </div>
  );
}

