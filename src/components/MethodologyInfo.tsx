import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Target, ArrowRight } from 'lucide-react';

export function MethodologyInfo() {
  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent">
            <BookOpen className="w-4 h-4" />
          </div>
          <CardTitle className="text-lg">Metodologi Two-Phase Optimization</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="overview">
            <AccordionTrigger className="text-sm font-medium">
              Apa itu Two-Phase Optimization?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Two-Phase Optimization (Optimasi Dua Fase) adalah metode Sequential Linear Programming 
                yang memecah masalah kompleks menjadi dua tahap yang saling bergantung.
              </p>
              <p>
                Pendekatan ini memungkinkan optimasi bertahap dimana hasil fase pertama 
                menjadi input untuk fase kedua.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="phase1">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Fase 1: Alokasi Anggaran
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Tujuan:</strong> Memaksimalkan efektivitas pengelolaan sampah</p>
              <p><strong>Kendala:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Total alokasi ≤ Rp91,5 miliar</li>
                <li>Setiap sektor memiliki alokasi minimum</li>
                <li>Parameter dari dataset Municipal Waste</li>
              </ul>
              <p><strong>Output:</strong> Tabel alokasi optimal per sektor</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="phase2">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-accent" />
                Fase 2: Penjadwalan Operasional
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Tujuan:</strong> Meminimalkan keterlambatan dan ketidakefisienan</p>
              <p><strong>Input:</strong> Hasil alokasi dari Fase 1</p>
              <p><strong>Kendala:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Kapasitas operasional per sektor</li>
                <li>Batasan waktu operasional</li>
                <li>Batasan anggaran dari Fase 1</li>
              </ul>
              <p><strong>Output:</strong> Jadwal optimal dengan tingkat prioritas</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
