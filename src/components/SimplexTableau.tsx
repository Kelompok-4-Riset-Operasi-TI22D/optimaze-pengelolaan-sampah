import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Truck, Recycle, Factory, GraduationCap, Clock, AlertCircle } from 'lucide-react';
import { Phase2Result, SectorId } from '@/lib/simplexSolver';

interface SimplexTableauProps {
  result: Phase2Result;
}

const SECTOR_ICONS: Record<SectorId, React.ReactNode> = {
  collection: <Truck className="w-4 h-4" />,
  processing: <Recycle className="w-4 h-4" />,
  landfill: <Factory className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
};

const PRIORITY_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Sangat Tinggi' },
  2: { bg: 'bg-warning/10', text: 'text-warning', label: 'Tinggi' },
  3: { bg: 'bg-info/10', text: 'text-info', label: 'Sedang' },
  4: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Rendah' },
};

export function SimplexTableau({ result }: SimplexTableauProps) {
  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="phase-badge phase-badge-2">FASE 2</Badge>
            <div>
              <CardTitle className="text-lg">Optimasi Penjadwalan Operasional</CardTitle>
              <CardDescription>
                Jadwal optimal berdasarkan hasil alokasi Fase 1
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">{result.totalEfficiency}% Efisiensi</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-accent">Fase 2 bergantung pada Fase 1</p>
            <p className="text-muted-foreground mt-1">
              Penjadwalan operasional dihitung berdasarkan alokasi anggaran yang telah dioptimalkan pada Fase 1.
            </p>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sektor</TableHead>
                <TableHead className="text-center">Prioritas</TableHead>
                <TableHead className="text-center">Frekuensi</TableHead>
                <TableHead className="text-center">Jam/Hari</TableHead>
                <TableHead className="text-center">Operasi/Minggu</TableHead>
                <TableHead className="text-right">Efisiensi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.schedules.map((schedule, idx) => {
                const priorityStyle = PRIORITY_COLORS[schedule.priority];
                return (
                  <TableRow key={schedule.sectorId} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-foreground">
                          {SECTOR_ICONS[schedule.sectorId]}
                        </div>
                        <span className="font-medium text-sm">{schedule.sectorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${priorityStyle.bg} ${priorityStyle.text} text-xs`}>
                        #{schedule.priority} {priorityStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-medium">{schedule.frequency}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">{schedule.dailyHours} jam</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">{schedule.weeklyOperations}x</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress 
                          value={schedule.efficiency} 
                          className="w-16 h-2"
                        />
                        <span className="text-sm font-medium w-10">
                          {schedule.efficiency}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-2xl font-bold">{result.schedules.filter(s => s.frequency === 'Harian').length}</p>
            <p className="text-xs text-muted-foreground">Operasi Harian</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-2xl font-bold">{result.schedules.reduce((sum, s) => sum + s.dailyHours, 0)}</p>
            <p className="text-xs text-muted-foreground">Total Jam/Hari</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-2xl font-bold">{result.totalEfficiency}%</p>
            <p className="text-xs text-muted-foreground">Efisiensi Rata-rata</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
