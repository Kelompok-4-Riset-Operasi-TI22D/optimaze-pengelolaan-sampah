import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Wallet } from 'lucide-react';
import { formatRupiah } from '@/lib/simplexSolver';

interface LocationInputProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
}

export function LocationInput({ budget, onBudgetChange, location = 'Kota Padang', onLocationChange }: LocationInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onBudgetChange(value * 1e9); // Convert miliar to actual value
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Data Lokasi</CardTitle>
            <CardDescription>Masukkan data lokasi dan anggaran</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Input */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Lokasi
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => onLocationChange?.(e.target.value)}
              className="pl-10"
              placeholder="Masukkan nama kota/daerah"
            />
          </div>
        </div>

        {/* Budget Input */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm font-medium">
            Anggaran (dalam Miliar Rupiah)
          </Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
