
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppData, AiSuggestPostMatchMessageInput, AiMatchResult, AiTurnOrder, AiGameDetail, GameDetail as AppGameDetail } from '@/lib/types';
import { suggestPostMatchMessage } from '@/ai/flows/post-match-message-suggestion';

interface AiMessageSuggesterProps {
  appData: AppData;
}

function mapAppDataToAiInput(appData: AppData): AiSuggestPostMatchMessageInput {
  const gameDetails: AiGameDetail[] = [];
  const allNotes: string[] = [];

  const processGame = (game: AppGameDetail | null) => {
    if (game) {
      gameDetails.push({
        userClass: game.userPlayedClass,
        opponentClass: game.opponentPlayedClass,
        turnOrder: game.turnOrder === '先攻' ? 'first' : 'second',
        gameResult: game.result === '勝利' ? 'win' : 'loss',
      });
      if (game.memo.trim()) {
        allNotes.push(game.memo.trim());
      }
    }
  };

  processGame(appData.game1);
  processGame(appData.game2);
  processGame(appData.game3);
  
  let matchResult: AiMatchResult = 'loss'; // Default, should be determined correctly
  if (appData.overallResult === '勝利') {
    matchResult = 'win';
  } else if (appData.overallResult === '敗北') {
    matchResult = 'loss';
  }
  // If overallResult is empty, this might be an issue. Ensure overallResult is set.

  return {
    matchResult: matchResult,
    opponentName: appData.opponentName || undefined,
    userNotes: allNotes.join('\n'),
    gameDetails,
  };
}


export function AiMessageSuggester({ appData }: AiMessageSuggesterProps) {
  const [suggestedMessage, setSuggestedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSuggestMessage = async () => {
    setIsLoading(true);
    setSuggestedMessage('');
    try {
      const aiInput = mapAppDataToAiInput(appData);
      if (!appData.overallResult) {
          toast({ variant: "destructive", title: "エラー", description: "総合成績が不明なため、メッセージを提案できません。" });
          setIsLoading(false);
          return;
      }
      const result = await suggestPostMatchMessage(aiInput);
      setSuggestedMessage(result.suggestedMessage);
    } catch (error) {
      console.error("AIメッセージ提案エラー:", error);
      toast({ variant: "destructive", title: "エラー", description: "メッセージの提案に失敗しました。" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!suggestedMessage) return;
    navigator.clipboard.writeText(suggestedMessage)
      .then(() => {
        toast({ title: "成功", description: "提案メッセージをコピーしました。" });
      })
      .catch(err => {
        console.error("提案メッセージのコピーに失敗:", err);
        toast({ variant: "destructive", title: "失敗", description: "提案メッセージのコピーに失敗しました。" });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-accent" />
          AIによる投稿メッセージ提案
        </CardTitle>
        <CardDescription>試合結果に基づいて、AIが投稿メッセージを提案します。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleSuggestMessage} disabled={isLoading || !appData.overallResult} className="w-full sm:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          メッセージを提案する
        </Button>
        {suggestedMessage && (
          <Textarea
            value={suggestedMessage}
            onChange={(e) => setSuggestedMessage(e.target.value)}
            rows={4}
            placeholder="AIによる提案メッセージ"
            className="mt-2 bg-muted/30"
          />
        )}
      </CardContent>
      {suggestedMessage && (
        <CardFooter>
          <Button variant="outline" onClick={handleCopyToClipboard} className="w-full sm:w-auto">
            <ClipboardCopy className="mr-2 h-4 w-4" />
            提案メッセージをコピー
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

