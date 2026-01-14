import { useState } from 'react';
import { Header } from '@/components/Header';
import { LocationInput } from '@/components/LocationInput';
import { DatasetUpload } from '@/components/DatasetUpload';
import { ResultsTable } from '@/components/ResultsTable';
import { SimplexTableau } from '@/components/SimplexTableau';
import { DistributionCharts } from '@/components/DistributionCharts';
import { Calculator } from '@/components/Calculator';
import { MethodologyInfo } from '@/components/MethodologyInfo';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { 
  DatasetSummary, 
  runPhase1Optimization, 
  runPhase2Optimization,
  Phase1Result,
  Phase2Result 
} from '@/lib/simplexSolver';

const DEFAULT_BUDGET = 91.5e9; // Rp91,5 Miliar

export default function Index() {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [location, setLocation] = useState('Kota Padang');
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary | null>(null);
  const [phase1Result, setPhase1Result] = useState<Phase1Result | null>(null);
  const [phase2Result, setPhase2Result] = useState<Phase2Result | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const canOptimize = budget > 0;

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Run Phase 1
    const p1Result = runPhase1Optimization(budget, datasetSummary);
    setPhase1Result(p1Result);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Run Phase 2 based on Phase 1 results
    const p2Result = runPhase2Optimization(p1Result);
    setPhase2Result(p2Result);
    
    setIsOptimizing(false);
  };

  const resetOptimization = () => {
    setPhase1Result(null);
    setPhase2Result(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Sistem Pendukung Keputusan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Optimasi Alokasi Anggaran Pengelolaan Sampah {location}
            menggunakan metode <span className="text-primary font-semibold">Two-Phase Optimization</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <LocationInput 
              budget={budget} 
              onBudgetChange={setBudget}
              location={location}
              onLocationChange={setLocation}
            />
            <DatasetUpload 
              onDatasetLoaded={setDatasetSummary} 
              totalBudget={budget}
            />
            <MethodologyInfo />
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={runOptimization} 
                disabled={!canOptimize || isOptimizing}
                className="flex-1 bg-primary hover:bg-primary/90"
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
                    Jalankan Optimasi
                  </>
                )}
              </Button>
              {(phase1Result || phase2Result) && (
                <Button 
                  onClick={resetOptimization} 
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {!phase1Result && !phase2Result ? (
              <div className="h-full flex items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-xl">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Siap Mengoptimasi</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Masukkan anggaran, unggah dataset (opsional), 
                    lalu klik "Jalankan Optimasi" untuk melihat hasil.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {phase1Result && <ResultsTable result={phase1Result} />}
                {phase1Result && <DistributionCharts result={phase1Result} />}
                {phase2Result && <SimplexTableau result={phase2Result} />}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Aplikasi ini dibuat untuk tujuan akademik sebagai demonstrasi penerapan algoritma optimasi Two-Phase.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Sumber Data: Kaggle "Municipal Waste Management Cost Prediction"
          </p>
        </footer>
      </main>
    </div>
  );
}
