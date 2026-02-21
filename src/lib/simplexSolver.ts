// ==========================================================
// KONSTANTA SEKTOR
// ==========================================================

export const SECTORS = [
  { id: 'collection', name: 'Pengangkutan & Pengumpulan', icon: 'Truck' },
  { id: 'processing', name: 'Pengolahan & Daur Ulang', icon: 'Recycle' },
  { id: 'landfill', name: 'Operasional TPA', icon: 'Factory' },
  { id: 'education', name: 'Edukasi & Sosialisasi', icon: 'GraduationCap' },
] as const;

export type SectorId = typeof SECTORS[number]['id'];

export interface DatasetRow {
  waste_generated_tons: number;
  collection_cost: number;
  processing_cost: number;
  operational_cost: number;
  population?: number;
}

export interface DatasetSummary {
  totalRows: number;
  totalColumns: number;
  sampleData: DatasetRow[];
  averages: {
    waste_generated_tons: number;
    collection_cost: number;
    processing_cost: number;
    operational_cost: number;
  };
}

export interface Phase1Result {
  allocations: {
    sectorId: SectorId;
    sectorName: string;
    amount: number;
    percentage: number;
    estimatedCapacity: number;
  }[];
  totalUsed: number;
  totalBudget: number;
  efficiency: number;
}

export interface Phase2Result {
  schedules: {
    sectorId: SectorId;
    sectorName: string;
    priority: number;
    frequency: string;
    dailyHours: number;
    weeklyOperations: number;
    efficiency: number;
  }[];
  totalEfficiency: number;
}

// ==========================================================
// NORMALISASI DATASET
// ==========================================================

export function normalizeDataset(data: DatasetRow[], totalBudget: number): DatasetSummary {
  const totalRows = data.length;
  const totalColumns = Object.keys(data[0] || {}).length;

  const averages = {
    waste_generated_tons:
      data.reduce((sum, row) => sum + (row.waste_generated_tons || 0), 0) / totalRows,

    collection_cost:
      data.reduce((sum, row) => sum + (row.collection_cost || 0), 0) / totalRows,

    processing_cost:
      data.reduce((sum, row) => sum + (row.processing_cost || 0), 0) / totalRows,

    operational_cost:
      data.reduce((sum, row) => sum + (row.operational_cost || 0), 0) / totalRows,
  };

  return {
    totalRows,
    totalColumns,
    sampleData: data.slice(0, 5),
    averages,
  };
}

// ==========================================================
// PHASE 1 – TWO PHASE LINEAR PROGRAMMING
// ==========================================================

export function runPhase1Optimization(
  totalBudget: number,
  datasetSummary: DatasetSummary | null
): Phase1Result {

  // ======================================================
  // MODEL MATEMATIKA
  // ======================================================
  //
  // Variabel Keputusan:
  // x1 = anggaran collection
  // x2 = anggaran processing
  // x3 = anggaran landfill
  // x4 = anggaran education
  //
  // Fungsi Tujuan:
  // Max Z = 0.35x1 + 0.30x2 + 0.20x3 + 0.15x4
  //
  // Kendala:
  // x1 + x2 + x3 + x4 = B
  // x1 ≥ 0.25B
  // x2 ≥ 0.20B
  // x3 ≥ 0.15B
  // x4 ≥ 0.10B
  //
  // ---------------------------
  // PHASE 1
  // ---------------------------
  //
  // Hitung total minimum:
  // M = (0.25 + 0.20 + 0.15 + 0.10)B
  // M = 0.70B
  //
  // Sisa anggaran:
  // R = B - 0.70B
  // R = 0.30B
  //
  // Karena solusi feasible langsung ada,
  // maka W = 0 (tidak perlu artificial variable)
  //
  // ---------------------------
  // PHASE 2
  // ---------------------------
  //
  // x1 = 0.25B + (w1 × R)
  // x2 = 0.20B + (w2 × R)
  // x3 = 0.15B + (w3 × R)
  // x4 = 0.10B + (w4 × R)
  //
  // dengan:
  // w1=0.35, w2=0.30, w3=0.20, w4=0.15
  //
  // Z dihitung:
  // Z = Σ(wi × xi)
  //
  // ======================================================

  const effectivenessWeights = {
    collection: 0.35,
    processing: 0.30,
    landfill: 0.20,
    education: 0.15,
  };

  const minimumAllocations = {
    collection: 0.25,
    processing: 0.20,
    landfill: 0.15,
    education: 0.10,
  };

  let adjustedWeights = { ...effectivenessWeights };

  if (datasetSummary) {
    const { averages } = datasetSummary;

    const totalCost =
      averages.collection_cost +
      averages.processing_cost +
      averages.operational_cost;

    if (totalCost > 0) {

      // Rasio biaya:
      // ratio = cost_i / totalCost

      const costRatios = {
        collection: averages.collection_cost / totalCost,
        processing: averages.processing_cost / totalCost,
        landfill: averages.operational_cost / totalCost,
        education: 0.12,
      };

      // Blending:
      // weight_new = (0.6 × weight_awal) + (0.4 × cost_ratio)

      Object.keys(adjustedWeights).forEach((key) => {
        const k = key as SectorId;
        adjustedWeights[k] =
          (effectivenessWeights[k] * 0.6) +
          (costRatios[k] * 0.4);
      });

      // Normalisasi:
      // weight_final = weight / Σweight

      const sum = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);

      Object.keys(adjustedWeights).forEach((key) => {
        adjustedWeights[key as SectorId] /= sum;
      });
    }
  }

  const finalAllocations: Record<SectorId, number> = {} as Record<SectorId, number>;
  let remainingBudget = totalBudget;

  // Alokasi minimum
  Object.keys(minimumAllocations).forEach((key) => {
    const k = key as SectorId;
    const minAmount = totalBudget * minimumAllocations[k];
    finalAllocations[k] = minAmount;
    remainingBudget -= minAmount;
  });

  // Distribusi sisa
  const totalWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);

  Object.keys(adjustedWeights).forEach((key) => {
    const k = key as SectorId;
    const additionalAmount =
      remainingBudget * (adjustedWeights[k] / totalWeight);
    finalAllocations[k] += additionalAmount;
  });

  const capacityFactors = {
    collection: 0.000015,
    processing: 0.000012,
    landfill: 0.00001,
    education: 0.00002,
  };

  const allocations = SECTORS.map((sector) => {
    const amount = finalAllocations[sector.id];

    const capacity = datasetSummary
      ? (amount * capacityFactors[sector.id]) *
        (datasetSummary.averages.waste_generated_tons / 100)
      : amount * capacityFactors[sector.id] * 500;

    return {
      sectorId: sector.id,
      sectorName: sector.name,
      amount,
      percentage: (amount / totalBudget) * 100,
      estimatedCapacity: Math.round(capacity),
    };
  });

  const totalUsed = allocations.reduce((sum, a) => sum + a.amount, 0);

  return {
    allocations,
    totalUsed,
    totalBudget,
    efficiency: (totalUsed / totalBudget) * 100,
  };
}

// ==========================================================
// PHASE 2 – PENJADWALAN
// ==========================================================

export function runPhase2Optimization(phase1Result: Phase1Result): Phase2Result {

  const basePriorities = {
    collection: 1,
    processing: 2,
    landfill: 3,
    education: 4,
  };

  const operationalFrequency = {
    collection: { freq: 'Harian', weeklyOps: 7, dailyHours: 12 },
    processing: { freq: 'Harian', weeklyOps: 6, dailyHours: 10 },
    landfill: { freq: 'Harian', weeklyOps: 7, dailyHours: 8 },
    education: { freq: 'Mingguan', weeklyOps: 3, dailyHours: 6 },
  };

  const schedules = phase1Result.allocations.map((allocation) => {

    const baseOps = operationalFrequency[allocation.sectorId];

    const budgetRatio = allocation.percentage / 25;

    const efficiency =
      Math.min(100, Math.max(60, budgetRatio * 85));

    const adjustedHours =
      Math.round(baseOps.dailyHours *
        Math.min(1.2, Math.max(0.8, budgetRatio)));

    return {
      sectorId: allocation.sectorId,
      sectorName: allocation.sectorName,
      priority: basePriorities[allocation.sectorId],
      frequency: baseOps.freq,
      dailyHours: adjustedHours,
      weeklyOperations: baseOps.weeklyOps,
      efficiency: Math.round(efficiency),
    };
  });

  schedules.sort((a, b) => a.priority - b.priority);

  const totalEfficiency =
    schedules.reduce((sum, s) => sum + s.efficiency, 0) /
    schedules.length;

  return {
    schedules,
    totalEfficiency: Math.round(totalEfficiency),
  };
}

// ==========================================================
// PARSE CSV
// ==========================================================

export function parseCSV(csvText: string): DatasetRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(',')
    .map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  const data: DatasetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(',')
      .map(v => v.trim().replace(/['"]/g, ''));

    const row: Partial<DatasetRow> = {};

    headers.forEach((header, index) => {
      const value = parseFloat(values[index]) || 0;

      if (header.includes('waste') && header.includes('ton')) {
        row.waste_generated_tons = value;
      } else if (header.includes('collection') && header.includes('cost')) {
        row.collection_cost = value;
      } else if (header.includes('processing') && header.includes('cost')) {
        row.processing_cost = value;
      } else if (header.includes('operational') && header.includes('cost')) {
        row.operational_cost = value;
      } else if (header.includes('population')) {
        row.population = value;
      }
    });

    if (
      row.waste_generated_tons ||
      row.collection_cost ||
      row.processing_cost ||
      row.operational_cost
    ) {
      data.push({
        waste_generated_tons: row.waste_generated_tons || 0,
        collection_cost: row.collection_cost || 0,
        processing_cost: row.processing_cost || 0,
        operational_cost: row.operational_cost || 0,
        population: row.population,
      });
    }
  }

  return data;
}

// ==========================================================
// FORMAT RUPIAH
// ==========================================================

export function formatRupiah(amount: number): string {
  if (amount >= 1e12) {
    return `Rp${(amount / 1e12).toFixed(2)} Triliun`;
  } else if (amount >= 1e9) {
    return `Rp${(amount / 1e9).toFixed(2)} Miliar`;
  } else if (amount >= 1e6) {
    return `Rp${(amount / 1e6).toFixed(2)} Juta`;
  }
  return `Rp${amount.toLocaleString('id-ID')}`;
}