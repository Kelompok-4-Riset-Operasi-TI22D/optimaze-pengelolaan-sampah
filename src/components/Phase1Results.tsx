import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Truck, Recycle, Factory, GraduationCap, TrendingUp } from 'lucide-react';
import { Phase1Result, formatRupiah, SectorId } from '@/lib/optimization';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Phase1ResultsProps {
  result: Phase1Result;
}

const SECTOR_ICONS: Record<SectorId, React.ReactNode> = {
  collection: <Truck className="w-4 h-4" />,
  processing: <Recycle className="w-4 h-4" />,
  landfill: <Factory className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
};

const CHART_COLORS = [
  'hsl(173, 58%, 39%)',  // Primary - Teal
  'hsl(38, 92%, 50%)',   // Accent - Amber
  'hsl(199, 89%, 48%)',  // Info - Blue
  'hsl(152, 69%, 31%)',  // Success - Green
];

export function Phase1Results({ result }: Phase1ResultsProps) {
  const chartData = result.allocations.map((a, idx) => ({
    name: a.sectorName,
    value: a.amount,
    percentage: a.percentage,
    color: CHART_COLORS[idx],
  }));

  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="phase-badge phase-badge-1">FASE 1</Badge>
            <div>
              <CardTitle className="text-lg">Optimasi Alokasi Anggaran</CardTitle>
              <CardDescription>
                Hasil alokasi optimal berdasarkan algoritma Two-Phase
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 text-success">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{result.efficiency.toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Total Anggaran</p>
            <p className="text-xl font-bold text-primary">{formatRupiah(result.totalBudget)}</p>
          </div>
          <div className="p-4 bg-success/5 rounded-lg border border-success/20">
            <p className="text-sm text-muted-foreground">Anggaran Terpakai</p>
            <p className="text-xl font-bold text-success">{formatRupiah(result.totalUsed)}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatRupiah(value)}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend 
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sektor</TableHead>
                <TableHead className="text-right">Alokasi</TableHead>
                <TableHead className="text-right">Persentase</TableHead>
                <TableHead className="text-right">Kapasitas (ton)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.allocations.map((allocation, idx) => (
                <TableRow key={allocation.sectorId} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{ backgroundColor: `${CHART_COLORS[idx]}20`, color: CHART_COLORS[idx] }}
                      >
                        {SECTOR_ICONS[allocation.sectorId]}
                      </div>
                      <span className="font-medium text-sm">{allocation.sectorName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatRupiah(allocation.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={allocation.percentage} className="w-16 h-2" />
                      <span className="text-sm text-muted-foreground w-12">
                        {allocation.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {allocation.estimatedCapacity.toLocaleString('id-ID')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
