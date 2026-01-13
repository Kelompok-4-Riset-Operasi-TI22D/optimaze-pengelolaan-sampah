import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { formatRupiah } from '@/lib/optimization';

interface BudgetInputProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
}

export function BudgetInput({ budget, onBudgetChange }: BudgetInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onBudgetChange(value * 1e9); // Convert miliar to actual value
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Total Anggaran</CardTitle>
            <CardDescription>Masukkan total anggaran pengelolaan sampah</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="budget" className="text-sm font-medium">
            Anggaran (dalam Miliar Rupiah)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              Rp
            </span>
            <Input
              id="budget"
              type="number"
              value={budget / 1e9}
              onChange={handleChange}
              className="pl-10 pr-16 text-lg font-semibold"
              min={0}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              Miliar
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{formatRupiah(budget)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
