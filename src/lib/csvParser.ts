import Papa from 'papaparse';

export interface BodyMetrics {
	date: string; // ISO format
	weight: number;
	bmi: number;
	bodyFat: number;
	waterMass: number;
	fatMass: number;
	boneMass: number;
	proteinMass: number;
	muscleMass: number;
	musclePercentage: number;
	waterPercentage: number;
	proteinPercentage: number;
	bonePercentage: number;
	skeletalMuscleMass: number;
	visceralFat: number;
	metabolicIndex: number;
	waistHipRatio: number;
	bodyAge: number;
	fatFreeMass: number;
	heartRate: number;
}

const MONTHS_ES: Record<string, number> = {
	'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
	'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
};

function parseDate(dateStr: string): string {
    const cleanDate = dateStr.trim().toLowerCase();
    
    // Check for DD/MM/YYYY
    if (cleanDate.includes('/')) {
        const [d, m, y] = cleanDate.split('/').map(Number);
        return new Date(y, m - 1, d).toISOString();
    }
    
    // Check for Spanish Month Name
    if (MONTHS_ES[cleanDate] !== undefined) {
        const currentYear = 2026; // As per locale time provided
        const year = cleanDate === 'diciembre' ? currentYear - 1 : currentYear;
        return new Date(year, MONTHS_ES[cleanDate], 1).toISOString();
    }
    
    return new Date().toISOString(); // Fallback
}

function parseNumber(val: any): number {
	if (typeof val === 'string') {
		return parseFloat(val.replace(',', '.'));
	}
	return typeof val === 'number' ? val : 0;
}

export function parseCSV(csvContent: string): BodyMetrics[] {
	const results = Papa.parse(csvContent, {
		header: true,
		skipEmptyLines: true
	});

	const data: BodyMetrics[] = [];

	for (const row of results.data as any[]) {
		// Detect if it's a valid data row (must have a date and some weight or similar)
		if (!row['Fecha'] || row['Fecha'] === 'Progreso' || !row['Peso']) continue;

		data.push({
			date: parseDate(row['Fecha']),
			weight: parseNumber(row['Peso']),
			bmi: parseNumber(row['BMI']),
			bodyFat: parseNumber(row['Grasa %']),
			waterMass: parseNumber(row['Masa agua KG']),
			fatMass: parseNumber(row['Grasa KG']),
			boneMass: parseNumber(row['Oseo KG']),
			proteinMass: parseNumber(row['Masa prot. KG']),
			muscleMass: parseNumber(row['Masa musc. KG']),
			musclePercentage: parseNumber(row['Musc. %']),
			waterPercentage: parseNumber(row['Agua %']),
			proteinPercentage: parseNumber(row['Prot. %']),
			bonePercentage: parseNumber(row['Oseo %']),
			skeletalMuscleMass: parseNumber(row['Masa musc. esquel. KG']),
			visceralFat: parseNumber(row['Grasa visceral']),
			metabolicIndex: parseNumber(row['Índice metab.']),
			waistHipRatio: parseNumber(row['cintura-cadera']),
			bodyAge: parseNumber(row['edad']),
			fatFreeMass: parseNumber(row['Peso sin grasa']),
			heartRate: parseNumber(row['Frec. card.'])
		});
	}

	// Sort by date ascending
	return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
