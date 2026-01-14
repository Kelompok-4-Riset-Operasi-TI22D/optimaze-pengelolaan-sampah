import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator as CalcIcon, Play, RotateCcw, Target, ArrowRight } from 'lucide-react';
import { 
  DatasetSummary, 
  runPhase1Optimization, 
  runPhase2Optimization,
  Phase1Result,
  Phase2Result 
} from '@/lib/simplexSolver';

interface CalculatorProps {
  budget: number;
  datasetSummary: DatasetSummary | null;
  onPhase1Complete: (result: Phase1Result) => void;
  onPhase2Complete: (result: Phase2Result) => void;
  phase1Result: Phase1Result | null;
  phase2Result: Phase2Result | null;
}

export function Calculator({ 
  budget, 
  datasetSummary, 
  onPhase1Complete, 
  onPhase2Complete,
  phase1Result,
  phase2Result
}: CalculatorProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activePhase, setActivePhase] = useState<'phase1' | 'phase2'>('phase1');

  const canOptimize = budget > 0;

  const runPhase1 = async () => {
    setIsOptimizing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = runPhase1Optimization(budget, datasetSummary);
    onPhase1Complete(result);
    
    setIsOptimizing(false);
    setActivePhase('phase2');
  };

  const runPhase2 = async () => {
    if (!phase1Result) return;
    
    setIsOptimizing(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = runPhase2Optimization(phase1Result);
    onPhase2Complete(result);
    
    setIsOptimizing(false);
  };

  const runFullOptimization = async () => {
    setIsOptimizing(true);
    
    // Run Phase 1
    await new Promise(resolve => setTimeout(resolve, 800));
    const p1Result = runPhase1Optimization(budget, datasetSummary);
    onPhase1Complete(p1Result);
    
    // Run Phase 2
    await new Promise(resolve => setTimeout(resolve, 500));
    const p2Result = runPhase2Optimization(p1Result);
    onPhase2Complete(p2Result);
    
    setIsOptimizing(false);
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent">
            <CalcIcon className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Kalkulator Optimasi</CardTitle>
            <CardDescription>
              Jalankan algoritma Two-Phase Optimization
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activePhase} onValueChange={(v) => setActivePhase(v as 'phase1' | 'phase2')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phase1" className="flex items-center gap-2">
              <Target className="w-3 h-3" />
              Fase 1
            </TabsTrigger>
            <TabsTrigger value="phase2" className="flex items-center gap-2" disabled={!phase1Result}>
              <ArrowRight className="w-3 h-3" />
              Fase 2
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="phase1" className="mt-4 space-y-3">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">Optimasi Alokasi Anggaran</p>
              <p className="text-xs text-muted-foreground mt-1">
                Memaksimalkan efektivitas pengelolaan sampah dengan mengalokasikan 
                anggaran ke 4 sektor utama.
              </p>
            </div>
            
            <Button 
              onClick={runPhase1}
              disabled={!canOptimize || isOptimizing}
              className="w-full"
            >
              {isOptimizing ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Mengoptimasi...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Jalankan Fase 1
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="phase2" className="mt-4 space-y-3">
            <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
              <p className="text-sm font-medium text-accent">Optimasi Penjadwalan</p>
              <p className="text-xs text-muted-foreground mt-1">
                Meminimalkan keterlambatan operasional berdasarkan 
                hasil alokasi Fase 1.
              </p>
            </div>
            
            <Button 
              onClick={runPhase2}
              disabled={!phase1Result || isOptimizing}
              className="w-full"
              variant="secondary"
            >
              {isOptimizing ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Mengoptimasi...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Jalankan Fase 2
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="pt-3 border-t border-border">
          <Button 
            onClick={runFullOptimization}
            disabled={!canOptimize || isOptimizing}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                Mengoptimasi...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Jalankan Semua Fase
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
