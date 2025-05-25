
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROUND_OPTIONS } from '@/lib/constants';

interface MatchInfoStepProps {
  roundNumber: string;
  opponentName: string;
  setRoundNumber: (value: string) => void;
  setOpponentName: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MatchInfoStep({
  roundNumber,
  opponentName,
  setRoundNumber,
  setOpponentName,
  onNext,
  onBack,
}: MatchInfoStepProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>対戦情報入力</CardTitle>
        <CardDescription>対戦の回戦と相手の名前を入力してください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="roundNumber">何回戦</Label>
          <Select value={roundNumber} onValueChange={setRoundNumber}>
            <SelectTrigger id="roundNumber">
              <SelectValue placeholder="回戦を選択" />
            </SelectTrigger>
            <SelectContent>
              {ROUND_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="opponentName">相手の名前 (スキップ可)</Label>
          <Input
            id="opponentName"
            value={opponentName}
            onChange={e => setOpponentName(e.target.value)}
            placeholder="例: 佐藤太郎"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>戻る</Button>
        <Button onClick={onNext} disabled={!roundNumber.trim()}>次へ</Button>
      </CardFooter>
    </Card>
  );
}
