import { Recycle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              SPK Pengelolaan Sampah
            </h1>
            <p className="text-xs text-muted-foreground">
              Kota Padang • Tahun Anggaran 2025
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
