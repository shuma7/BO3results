
"use client";

import type React from 'react';
import { useState } from 'react';
import type { ShadowverseClass, AppData } from '@/lib/types';
import { ALL_SHADOWVERSE_CLASSES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from 'lucide-react';

interface ClassSelectionStepProps {
  selectedClasses: [ShadowverseClass, ShadowverseClass] | [];
  onClassesSelect: (classes: [ShadowverseClass, ShadowverseClass]) => void;
}

export function ClassSelectionStep({ selectedClasses, onClassesSelect }: ClassSelectionStepProps) {
  const [currentSelection, setCurrentSelection] = useState<ShadowverseClass[]>(selectedClasses);
  const [error, setError] = useState<string | null>(null);

  const handleClassToggle = (svClass: ShadowverseClass) => {
    setError(null);
    setCurrentSelection(prev => {
      if (prev.includes(svClass)) {
        return prev.filter(c => c !== svClass);
      }
      if (prev.length < 2) {
        return [...prev, svClass];
      }
      return prev; // Max 2 classes
    });
  };

  const handleConfirm = () => {
    if (currentSelection.length === 2) {
      onClassesSelect(currentSelection as [ShadowverseClass, ShadowverseClass]);
    } else {
      setError("使用するクラスを2つ選択してください。");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>使用クラス選択</CardTitle>
        <CardDescription>BO3で使用する自分のクラスを2つ選択してください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_SHADOWVERSE_CLASSES.map(svClass => (
            <Button
              key={svClass}
              variant={currentSelection.includes(svClass) ? 'default' : 'outline'}
              onClick={() => handleClassToggle(svClass)}
              className={`p-4 h-auto text-base ${currentSelection.includes(svClass) ? 'ring-2 ring-primary' : ''}`}
              disabled={currentSelection.length >= 2 && !currentSelection.includes(svClass)}
            >
              {svClass}
            </Button>
          ))}
        </div>
         <Alert className="mt-4">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>ヒント</AlertTitle>
            <AlertDescription>
              選択したクラスは、試合結果入力時に使用されます。
            </AlertDescription>
          </Alert>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConfirm} className="w-full" disabled={currentSelection.length !== 2}>
          決定して次へ
        </Button>
      </CardFooter>
    </Card>
  );
}
