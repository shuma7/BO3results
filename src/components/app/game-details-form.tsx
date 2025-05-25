
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import type { GameDetail, ShadowverseClass, TurnOrder, GameResult, OverallResult } from '@/lib/types';
import { ALL_SHADOWVERSE_CLASSES, TURN_ORDERS, GAME_RESULTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

interface GameDetailsFormProps {
  gameNumber: 1 | 2 | 3;
  initialData: Partial<GameDetail>;
  userAvailableClasses: ShadowverseClass[];
  isUserClassFixed: boolean;
  isOpponentClassFixed: boolean;
  opponentClassesToDisable?: ShadowverseClass[]; // Classes opponent won with in previous games
  onSubmit: (details: GameDetail) => void;
  onBack?: () => void;
  title: string;
  currentOverallResult?: OverallResult; // Added prop
}

export function GameDetailsForm({
  gameNumber,
  initialData,
  userAvailableClasses,
  isUserClassFixed,
  isOpponentClassFixed,
  opponentClassesToDisable = [],
  onSubmit,
  onBack,
  title,
  currentOverallResult, // Destructure new prop
}: GameDetailsFormProps) {
  const [userPlayedClass, setUserPlayedClass] = useState<ShadowverseClass | undefined>(
    initialData.userPlayedClass || (isUserClassFixed && userAvailableClasses.length > 0 ? userAvailableClasses[0] : undefined)
  );
  const [opponentPlayedClass, setOpponentPlayedClass] = useState<ShadowverseClass | undefined>(initialData.opponentPlayedClass);
  const [turnOrder, setTurnOrder] = useState<TurnOrder | undefined>(initialData.turnOrder);
  const [result, setResult] = useState<GameResult | undefined>(initialData.result);
  const [memo, setMemo] = useState<string>(initialData.memo || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUserClassFixed && userAvailableClasses.length > 0 && !userPlayedClass) {
      setUserPlayedClass(userAvailableClasses[0]);
    }
  }, [isUserClassFixed, userAvailableClasses, userPlayedClass]);
  
  useEffect(() => {
    if (isOpponentClassFixed && initialData.opponentPlayedClass && !opponentPlayedClass) {
      setOpponentPlayedClass(initialData.opponentPlayedClass);
    }
  }, [isOpponentClassFixed, initialData.opponentPlayedClass, opponentPlayedClass]);


  const handleSubmit = () => {
    if (!userPlayedClass || !opponentPlayedClass || !turnOrder || !result) {
      setError('全ての必須項目を選択・入力してください。');
      return;
    }
    setError(null);
    onSubmit({
      userPlayedClass,
      opponentPlayedClass,
      turnOrder,
      result,
      memo,
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{gameNumber}試合目の詳細を入力してください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <div>
          <Label className="mb-2 block">自分の使用クラス</Label>
          {isUserClassFixed && userPlayedClass ? (
            <Input value={userPlayedClass} readOnly disabled className="bg-muted" />
          ) : (
            <RadioGroup
              value={userPlayedClass}
              onValueChange={(value) => setUserPlayedClass(value as ShadowverseClass)}
              className="flex flex-wrap gap-2"
            >
              {userAvailableClasses.map(cls => (
                <Label key={cls} htmlFor={`user-class-${cls}-${gameNumber}`}
                  className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer ${userPlayedClass === cls ? 'bg-primary text-primary-foreground ring-2 ring-ring' : 'bg-card'}`}
                >
                  <RadioGroupItem value={cls} id={`user-class-${cls}-${gameNumber}`} className="sr-only" />
                  <span>{cls}</span>
                </Label>
              ))}
            </RadioGroup>
          )}
        </div>

        <div>
          <Label htmlFor={`opponent-class-select-${gameNumber}`} className="mb-2 block">相手の使用クラス</Label>
          {isOpponentClassFixed && opponentPlayedClass ? (
             <Input value={opponentPlayedClass} readOnly disabled className="bg-muted" />
          ) : (
            <Select value={opponentPlayedClass} onValueChange={(value) => setOpponentPlayedClass(value as ShadowverseClass)}>
              <SelectTrigger id={`opponent-class-select-${gameNumber}`}>
                <SelectValue placeholder="相手クラスを選択" />
              </SelectTrigger>
              <SelectContent>
                {ALL_SHADOWVERSE_CLASSES.map(cls => (
                  <SelectItem 
                    key={cls} 
                    value={cls}
                    disabled={opponentClassesToDisable.includes(cls)}
                  >
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label className="mb-2 block">自分の手番</Label>
          <RadioGroup
            value={turnOrder}
            onValueChange={(value) => setTurnOrder(value as TurnOrder)}
            className="flex gap-4"
          >
            {TURN_ORDERS.map(order => (
              <Label key={order} htmlFor={`turn-order-${order}-${gameNumber}`}
                className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer ${turnOrder === order ? 'bg-primary text-primary-foreground ring-2 ring-ring' : 'bg-card'}`}
              >
                <RadioGroupItem value={order} id={`turn-order-${order}-${gameNumber}`} className="sr-only"/>
                <span>{order}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">勝敗</Label>
          <RadioGroup
            value={result}
            onValueChange={(value) => setResult(value as GameResult)}
            className="flex gap-4"
          >
            {GAME_RESULTS.map(res => (
              <Label key={res} htmlFor={`result-${res}-${gameNumber}`}
                className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer ${result === res ? 'bg-primary text-primary-foreground ring-2 ring-ring' : 'bg-card'}`}
              >
                <RadioGroupItem value={res} id={`result-${res}-${gameNumber}`} className="sr-only"/>
                <span>{res}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor={`memo-${gameNumber}`} className="mb-2 block">メモ (任意)</Label>
          <Textarea
            id={`memo-${gameNumber}`}
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="相手デッキのアーキタイプ、進行･分岐、反省など"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className={`flex ${onBack ? 'justify-between' : 'justify-end'}`}>
        {onBack && <Button variant="outline" onClick={onBack}>戻る</Button>}
        <Button onClick={handleSubmit}>
          {gameNumber === 3 || (gameNumber === 2 && result && (currentOverallResult === '勝利' || currentOverallResult === '敗北') ) ? "結果を確認する" : "次の試合へ"}
        </Button>
      </CardFooter>
    </Card>
  );
}
