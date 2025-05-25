
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AppData, AppStep, ShadowverseClass, GameDetail, OverallResult, GameResult as GameResultType } from '@/lib/types';
import { INITIAL_APP_DATA, STEP_TITLES, TOTAL_MAIN_STEPS } from '@/lib/constants';
import { ClassSelectionStep } from '@/components/app/class-selection-step';
import { MatchInfoStep } from '@/components/app/match-info-step';
import { GameDetailsForm } from '@/components/app/game-details-form';
import { ResultsStep } from '@/components/app/results-step';
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Bo3AssistantPage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('CLASS_SELECTION');
  const [appData, setAppData] = useState<AppData>(INITIAL_APP_DATA);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const updateAppData = useCallback((updates: Partial<AppData>) => {
    setAppData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleClassesSelect = (classes: [ShadowverseClass, ShadowverseClass]) => {
    updateAppData({ userClasses: classes });
    setCurrentStep('MATCH_INFO');
  };

  const handleMatchInfoSubmit = () => {
    setCurrentStep('GAME_1_DETAILS');
  };

  const calculateOverallResult = (game1Res: GameResultType | null, game2Res: GameResultType | null, game3Res?: GameResultType | null): OverallResult => {
    if (!game1Res || !game2Res) return '';
    
    let userWins = 0;
    if (game1Res === '勝利') userWins++;
    if (game2Res === '勝利') userWins++;
    if (game3Res === '勝利') userWins++;
  
    if (userWins >= 2) return '勝利';
    
    let userLosses = 0;
    if (game1Res === '敗北') userLosses++;
    if (game2Res === '敗北') userLosses++;
    if (game3Res === '敗北') userLosses++;

    if (userLosses >=2) return '敗北';
    
    return '';
  };

  const handleGame1Submit = (details: GameDetail) => {
    updateAppData({ game1: details });
    setCurrentStep('GAME_2_DETAILS');
  };

  const handleGame2Submit = (details: GameDetail) => {
    const newAppData = { ...appData, game2: details };
    const overallResult = calculateOverallResult(newAppData.game1?.result ?? null, details.result);
    
    if (overallResult === '勝利' || overallResult === '敗北') {
      updateAppData({ game2: details, overallResult });
      setCurrentStep('RESULTS');
    } else {
      // Need Game 3
      updateAppData({ game2: details, overallResult: '' }); // Reset overallResult if it was prematurely set
      setCurrentStep('GAME_3_DETAILS');
    }
  };
  
  const handleGame3Submit = (details: GameDetail) => {
    const overallResult = calculateOverallResult(appData.game1?.result ?? null, appData.game2?.result ?? null, details.result);
    updateAppData({ game3: details, overallResult });
    setCurrentStep('RESULTS');
  };

  const goBack = () => {
    switch (currentStep) {
      case 'MATCH_INFO': setCurrentStep('CLASS_SELECTION'); break;
      case 'GAME_1_DETAILS': setCurrentStep('MATCH_INFO'); break;
      case 'GAME_2_DETAILS': setCurrentStep('GAME_1_DETAILS'); break;
      case 'GAME_3_DETAILS': setCurrentStep('GAME_2_DETAILS'); break;
      case 'RESULTS':
        if (appData.game3) setCurrentStep('GAME_3_DETAILS');
        else setCurrentStep('GAME_2_DETAILS');
        break;
    }
  };

  const handleReset = () => {
    setAppData(INITIAL_APP_DATA);
    setCurrentStep('CLASS_SELECTION');
  };
  
  const userClassForGame1 = appData.userClasses;
  const userClassForGame2 = useMemo(() => {
    if (appData.userClasses.length === 2 && appData.game1?.userPlayedClass) {
      return appData.userClasses.filter(cls => cls !== appData.game1!.userPlayedClass);
    }
    return [];
  }, [appData.userClasses, appData.game1]);

  const classesForGame3 = useMemo(() => {
    let userGame3Class: ShadowverseClass | undefined = undefined;
    let opponentGame3Class: ShadowverseClass | undefined = undefined;

    if (appData.game1 && appData.game2) {
      const g1UserWon = appData.game1.result === '勝利';
      const g2UserWon = appData.game2.result === '勝利';

      if (g1UserWon && !g2UserWon) { // User won G1, lost G2
        userGame3Class = appData.game2.userPlayedClass; // User plays class they lost with
        opponentGame3Class = appData.game1.opponentPlayedClass; // Opponent plays class they lost with
      } else if (!g1UserWon && g2UserWon) { // User lost G1, won G2
        userGame3Class = appData.game1.userPlayedClass;
        opponentGame3Class = appData.game2.opponentPlayedClass;
      }
    }
    return { userGame3Class, opponentGame3Class };
  }, [appData.game1, appData.game2]);


  const progressValue = useMemo(() => {
    switch (currentStep) {
      case 'CLASS_SELECTION': return (1 / (TOTAL_MAIN_STEPS + 2)) * 100;
      case 'MATCH_INFO': return (2 / (TOTAL_MAIN_STEPS + 2)) * 100;
      case 'GAME_1_DETAILS': return (3 / (TOTAL_MAIN_STEPS + 2)) * 100;
      case 'GAME_2_DETAILS': return (4 / (TOTAL_MAIN_STEPS + 2)) * 100;
      case 'GAME_3_DETAILS': return (5 / (TOTAL_MAIN_STEPS + 2)) * 100;
      case 'RESULTS': return 100;
      default: return 0;
    }
  }, [currentStep]);


  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
      <header className="w-full max-w-xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Shadowverse BO3 アシスタント</h1>
        <p className="text-muted-foreground">BO3の試合結果を簡単に入力・出力できます。</p>
      </header>

      <div className="w-full max-w-xl mb-6">
        <div className="flex justify-between items-center mb-1">
           <h2 className="text-xl font-semibold text-foreground">{STEP_TITLES[currentStep]}</h2>
           {currentStep !== 'CLASS_SELECTION' && currentStep !== 'RESULTS' && (
             <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
               <RefreshCw className="h-4 w-4 mr-1" />
               リセット
             </Button>
           )}
        </div>
        <Progress value={progressValue} className="w-full h-2" />
      </div>

      <main className="w-full flex-grow flex justify-center">
        {currentStep === 'CLASS_SELECTION' && (
          <ClassSelectionStep
            selectedClasses={appData.userClasses}
            onClassesSelect={handleClassesSelect}
          />
        )}
        {currentStep === 'MATCH_INFO' && (
          <MatchInfoStep
            roundNumber={appData.roundNumber}
            opponentName={appData.opponentName}
            setRoundNumber={(val) => updateAppData({ roundNumber: val })}
            setOpponentName={(val) => updateAppData({ opponentName: val })}
            onNext={handleMatchInfoSubmit}
            onBack={goBack}
          />
        )}
        {currentStep === 'GAME_1_DETAILS' && appData.userClasses.length === 2 && (
          <GameDetailsForm
            gameNumber={1}
            title={STEP_TITLES.GAME_1_DETAILS}
            initialData={appData.game1 || {}}
            userAvailableClasses={userClassForGame1}
            isUserClassFixed={false}
            isOpponentClassFixed={false}
            onSubmit={handleGame1Submit}
            onBack={goBack}
          />
        )}
        {currentStep === 'GAME_2_DETAILS' && userClassForGame2.length > 0 && (
          <GameDetailsForm
            gameNumber={2}
            title={STEP_TITLES.GAME_2_DETAILS}
            initialData={appData.game2 || { userPlayedClass: userClassForGame2[0] }}
            userAvailableClasses={userClassForGame2}
            isUserClassFixed={true}
            isOpponentClassFixed={false}
            onSubmit={handleGame2Submit}
            onBack={goBack}
          />
        )}
        {currentStep === 'GAME_3_DETAILS' && classesForGame3.userGame3Class && classesForGame3.opponentGame3Class && (
           <GameDetailsForm
            gameNumber={3}
            title={STEP_TITLES.GAME_3_DETAILS}
            initialData={appData.game3 || { userPlayedClass: classesForGame3.userGame3Class, opponentPlayedClass: classesForGame3.opponentGame3Class }}
            userAvailableClasses={classesForGame3.userGame3Class ? [classesForGame3.userGame3Class] : []}
            isUserClassFixed={true}
            isOpponentClassFixed={true}
            onSubmit={handleGame3Submit}
            onBack={goBack}
          />
        )}
        {currentStep === 'RESULTS' && (
          <ResultsStep appData={appData} onBack={goBack} onReset={handleReset} />
        )}
      </main>
      <footer className="text-center py-4 mt-auto text-muted-foreground text-sm">
        {currentYear !== null ? (
          <p>&copy; {currentYear} Shadowverse BO3 Assistant</p>
        ) : (
          <p>Loading year...</p> 
        )}
      </footer>
    </div>
  );
}
