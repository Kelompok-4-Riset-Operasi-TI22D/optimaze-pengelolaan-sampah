import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Phase1Result, formatRupiah } from '@/lib/simplexSolver';

interface DistributionChartsProps {
  result: Phase1Result;
}

const CHART_COLORS = [
  'hsl(173, 58%, 39%)',  // Primary - Teal
  'hsl(38, 92%, 50%)',   // Accent - Amber
  'hsl(199, 89%, 48%)',  // Info - Blue
  'hsl(152, 69%, 31%)',  // Success - Green
];

export function DistributionCharts({ result }: DistributionChartsProps) {
  const pieData = result.allocations.map((a, idx) => ({
    name: a.sectorName,
    value: a.amount,
    percentage: a.percentage,
    color: CHART_COLORS[idx],
  }));

  const barData = result.allocations.map((a, idx) => ({
    name: a.sectorName.split(' ')[0], // Short name for bar chart
    fullName: a.sectorName,
    alokasi: a.amount / 1e9, // Convert to miliar
    kapasitas: a.estimatedCapacity,
    fill: CHART_COLORS[idx],
  }));

  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-info/10 text-info">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Visualisasi Distribusi</CardTitle>
            <CardDescription>
              Grafik alokasi anggaran dan kapasitas per sektor
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Proporsi Alokasi Anggaran</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
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
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Perbandingan Alokasi (Miliar Rupiah)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => `${value.toFixed(1)}M`}
                  fontSize={12}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  fontSize={11}
                />
                <Tooltip 
                  formatter={(value: number) => [`Rp${value.toFixed(2)} Miliar`, 'Alokasi']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar 
                  dataKey="alokasi" 
                  radius={[0, 4, 4, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Total Anggaran</p>
            <p className="text-xl font-bold text-primary">{formatRupiah(result.totalBudget)}</p>
          </div>
          <div className="p-4 bg-success/5 rounded-lg border border-success/20">
            <p className="text-sm text-muted-foreground">Efisiensi Alokasi</p>
            <p className="text-xl font-bold text-success">{result.efficiency.toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
