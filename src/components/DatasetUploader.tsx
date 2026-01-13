import { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileSpreadsheet, Check, X, Database } from 'lucide-react';
import { DatasetRow, DatasetSummary, parseCSV, normalizeDataset } from '@/lib/optimization';

interface DatasetUploaderProps {
  onDatasetLoaded: (summary: DatasetSummary | null) => void;
  totalBudget: number;
}

export function DatasetUploader({ onDatasetLoaded, totalBudget }: DatasetUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    setError(null);
    
    if (!file.name.endsWith('.csv')) {
      setError('Mohon unggah file dengan format CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const data = parseCSV(csvText);
        
        if (data.length === 0) {
          setError('File CSV kosong atau format tidak sesuai');
          return;
        }

        const dataSummary = normalizeDataset(data, totalBudget);
        setFileName(file.name);
        setSummary(dataSummary);
        onDatasetLoaded(dataSummary);
      } catch (err) {
        setError('Gagal memproses file CSV');
      }
    };
    reader.readAsText(file);
  }, [totalBudget, onDatasetLoaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearDataset = () => {
    setFileName(null);
    setSummary(null);
    setError(null);
    onDatasetLoaded(null);
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-info/10 text-info">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Dataset</CardTitle>
            <CardDescription>
              Unggah dataset CSV untuk parameter optimasi
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!summary ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Seret file CSV ke sini atau klik untuk memilih
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                <span>Pilih File CSV</span>
              </Button>
            </label>
            {error && (
              <p className="text-sm text-destructive mt-3 flex items-center justify-center gap-1">
                <X className="w-4 h-4" /> {error}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">{fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <Button variant="ghost" size="sm" onClick={clearDataset}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-2xl font-bold">{summary.totalRows}</p>
                <p className="text-xs text-muted-foreground">Jumlah Baris</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-2xl font-bold">{summary.totalColumns}</p>
                <p className="text-xs text-muted-foreground">Jumlah Kolom</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Contoh Data (5 Baris Pertama)</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Sampah (ton)</TableHead>
                      <TableHead className="text-xs">Biaya Pengumpulan</TableHead>
                      <TableHead className="text-xs">Biaya Pengolahan</TableHead>
                      <TableHead className="text-xs">Biaya Operasional</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.sampleData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs">{row.waste_generated_tons.toFixed(2)}</TableCell>
                        <TableCell className="text-xs">{row.collection_cost.toFixed(2)}</TableCell>
                        <TableCell className="text-xs">{row.processing_cost.toFixed(2)}</TableCell>
                        <TableCell className="text-xs">{row.operational_cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
