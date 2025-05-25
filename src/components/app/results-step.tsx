
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { AppData, GameDetail, TurnOrder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCopy, ArrowLeft } from 'lucide-react';
import { AiMessageSuggester } from './ai-message-suggester';

interface ResultsStepProps {
  appData: AppData;
  onBack: () => void;
  onReset: () => void;
}

function formatGameDetailForOutput(gameNumSymbol: string, game: GameDetail | null): string {
  if (!game) return "";
  const userResultIcon = game.result === '勝利' ? '○' : '✕';
  const opponentResultIcon = game.result === '勝利' ? '✕' : '○';
  const opponentTurnOrder: TurnOrder = game.turnOrder === '先攻' ? '後攻' : '先攻';

  let output = `${gameNumSymbol} ${game.turnOrder}:${game.userPlayedClass} ${userResultIcon}ｰ${opponentResultIcon} ${opponentTurnOrder}:${game.opponentPlayedClass}\n`;
  if (game.memo.trim()) {
    output += `　 ${game.memo.trim()}\n`;
  }
  return output;
}

export function generateFormattedOutput(appData: AppData): string {
  let output = `${appData.roundNumber}回戦`;
  if (appData.opponentName.trim()) {
    output += `　vs${appData.opponentName.trim()}`;
  }
  output += '\n';

  output += formatGameDetailForOutput('①', appData.game1);
  output += formatGameDetailForOutput('②', appData.game2);
  if (appData.game3) {
    output += formatGameDetailForOutput('③', appData.game3);
  }

  if (appData.overallResult) {
    output += `${appData.overallResult}\n`;
  }
  return output.trim();
}


export function ResultsStep({ appData, onBack, onReset }: ResultsStepProps) {
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
          <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />入力に戻る</Button>
          <Button onClick={handleCopyToClipboard}><ClipboardCopy className="mr-2 h-4 w-4" />クリップボードにコピー</Button>
        </CardFooter>
      </Card>
      
      <AiMessageSuggester appData={appData} />

      <div className="text-center mt-8">
        <Button variant="ghost" onClick={onReset}>新しいBO3結果を入力する</Button>
      </div>
    </div>
  );
}
