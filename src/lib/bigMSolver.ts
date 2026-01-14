// Big M Method Solver untuk Linear Programming
// Digunakan untuk masalah optimasi dengan kendala campuran (≤, ≥, =)

export interface Variable {
  name: string;
  coefficient: number;
}

export interface Constraint {
  variables: Variable[];
  type: '<=' | '>=' | '=';
  rhs: number;
}

export interface BigMProblem {
  objective: 'maximize' | 'minimize';
  objectiveFunction: Variable[];
  constraints: Constraint[];
}

export interface BigMSolution {
  optimal: boolean;
  objectiveValue: number;
  variables: Record<string, number>;
  iterations: number;
  tableau: number[][];
}

// Konstanta M yang sangat besar untuk penalti
const BIG_M = 1e10;

/**
 * Menyelesaikan masalah Linear Programming menggunakan Big M Method
 */
export function solveBigM(problem: BigMProblem): BigMSolution {
  const { objective, objectiveFunction, constraints } = problem;
  
  // Konversi ke bentuk standar dan tambahkan variabel artificial
  const numOriginalVars = objectiveFunction.length;
  const numConstraints = constraints.length;
  
  // Hitung jumlah variabel slack, surplus, dan artificial
  let numSlack = 0;
  let numSurplus = 0;
  let numArtificial = 0;
  
  constraints.forEach(c => {
    if (c.type === '<=') numSlack++;
    else if (c.type === '>=') {
      numSurplus++;
      numArtificial++;
    } else if (c.type === '=') {
      numArtificial++;
    }
  });
  
  const totalVars = numOriginalVars + numSlack + numSurplus + numArtificial;
  
  // Inisialisasi tableau
  // Baris: [constraints, objective function]
  // Kolom: [original vars, slack, surplus, artificial, RHS]
  const tableau: number[][] = [];
  
  let slackIdx = numOriginalVars;
  let surplusIdx = numOriginalVars + numSlack;
  let artificialIdx = numOriginalVars + numSlack + numSurplus;
  const artificialVars: number[] = [];
  
  // Bangun baris constraint
  constraints.forEach((constraint, rowIdx) => {
    const row = new Array(totalVars + 1).fill(0);
    
    // Koefisien variabel original
    constraint.variables.forEach(v => {
      const varIdx = objectiveFunction.findIndex(of => of.name === v.name);
      if (varIdx !== -1) {
        row[varIdx] = v.coefficient;
      }
    });
    
    // Tambahkan variabel slack, surplus, artificial
    if (constraint.type === '<=') {
      row[slackIdx++] = 1;
    } else if (constraint.type === '>=') {
      row[surplusIdx++] = -1;
      row[artificialIdx] = 1;
      artificialVars.push(artificialIdx);
      artificialIdx++;
    } else if (constraint.type === '=') {
      row[artificialIdx] = 1;
      artificialVars.push(artificialIdx);
      artificialIdx++;
    }
    
    // RHS
    row[totalVars] = constraint.rhs;
    
    tableau.push(row);
  });
  
  // Bangun baris objective function dengan penalti Big M
  const objRow = new Array(totalVars + 1).fill(0);
  
  // Koefisien fungsi objektif
  objectiveFunction.forEach((v, idx) => {
    objRow[idx] = objective === 'maximize' ? -v.coefficient : v.coefficient;
  });
  
  // Tambahkan penalti Big M untuk variabel artificial
  artificialVars.forEach(idx => {
    objRow[idx] = objective === 'maximize' ? BIG_M : -BIG_M;
  });
  
  tableau.push(objRow);
  
  // Jalankan algoritma simplex
  let iterations = 0;
  const maxIterations = 100;
  
  while (iterations < maxIterations) {
    iterations++;
    
    // Cari kolom pivot (variabel masuk)
    const objRowIdx = tableau.length - 1;
    let pivotCol = -1;
    let minValue = 0;
    
    for (let j = 0; j < totalVars; j++) {
      if (tableau[objRowIdx][j] < minValue) {
        minValue = tableau[objRowIdx][j];
        pivotCol = j;
      }
    }
    
    // Jika tidak ada nilai negatif, solusi optimal
    if (pivotCol === -1) break;
    
    // Cari baris pivot (variabel keluar) menggunakan ratio test
    let pivotRow = -1;
    let minRatio = Infinity;
    
    for (let i = 0; i < numConstraints; i++) {
      if (tableau[i][pivotCol] > 0) {
        const ratio = tableau[i][totalVars] / tableau[i][pivotCol];
        if (ratio >= 0 && ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }
    
    // Jika tidak ada baris pivot valid, masalah tidak terbatas
    if (pivotRow === -1) {
      return {
        optimal: false,
        objectiveValue: objective === 'maximize' ? Infinity : -Infinity,
        variables: {},
        iterations,
        tableau,
      };
    }
    
    // Lakukan operasi pivot
    const pivotElement = tableau[pivotRow][pivotCol];
    
    // Normalisasi baris pivot
    for (let j = 0; j <= totalVars; j++) {
      tableau[pivotRow][j] /= pivotElement;
    }
    
    // Eliminasi kolom pivot di baris lain
    for (let i = 0; i <= objRowIdx; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j <= totalVars; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }
  }
  
  // Ekstrak solusi
  const solution: Record<string, number> = {};
  
  objectiveFunction.forEach((v, varIdx) => {
    // Cek apakah variabel adalah basic
    let isBasic = false;
    let basicRow = -1;
    
    for (let i = 0; i < numConstraints; i++) {
      if (Math.abs(tableau[i][varIdx] - 1) < 1e-6) {
        let isUnitColumn = true;
        for (let j = 0; j < numConstraints; j++) {
          if (i !== j && Math.abs(tableau[j][varIdx]) > 1e-6) {
            isUnitColumn = false;
            break;
          }
        }
        if (isUnitColumn) {
          isBasic = true;
          basicRow = i;
          break;
        }
      }
    }
    
    solution[v.name] = isBasic ? tableau[basicRow][totalVars] : 0;
  });
  
  const objectiveValue = -tableau[tableau.length - 1][totalVars];
  
  return {
    optimal: true,
    objectiveValue: objective === 'maximize' ? objectiveValue : -objectiveValue,
    variables: solution,
    iterations,
    tableau,
  };
}

/**
 * Format hasil Big M untuk display
 */
export function formatBigMResult(solution: BigMSolution): string {
  if (!solution.optimal) {
    return 'Solusi tidak ditemukan (masalah tidak terbatas atau tidak layak)';
  }
  
  let result = `Solusi Optimal ditemukan dalam ${solution.iterations} iterasi\n`;
  result += `Nilai Objektif: ${solution.objectiveValue.toFixed(4)}\n\n`;
  result += 'Nilai Variabel:\n';
  
  Object.entries(solution.variables).forEach(([name, value]) => {
    result += `  ${name} = ${value.toFixed(4)}\n`;
  });
  
  return result;
}
