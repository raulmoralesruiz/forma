import type { BodyMetrics } from './csvParser';

export function calculateMovingAverage(data: BodyMetrics[], key: keyof BodyMetrics, windowSize: number) {
	const result = [];
	for (let i = 0; i < data.length; i++) {
		const start = Math.max(0, i - windowSize + 1);
		const end = i + 1;
		const subset = data.slice(start, end);
		const sum = subset.reduce((acc, curr) => acc + (curr[key] as number), 0);
		result.push({
			date: data[i].date,
			value: sum / subset.length
		});
	}
	return result;
}

export function detectPlateau(data: BodyMetrics[], key: keyof BodyMetrics, threshold = 0.5, windowSize = 3) {
	if (data.length < windowSize) return false;
	const lastEntries = data.slice(-windowSize);
	const values = lastEntries.map(e => e[key] as number);
	const max = Math.max(...values);
	const min = Math.min(...values);
	return (max - min) < threshold;
}

export function generateInsights(data: BodyMetrics[], goals: { targetWeight: number; targetBodyFat: number }) {
	const insights: string[] = [];
	if (data.length < 2) return ["Upload more data to see insights."];

	const latest = data[data.length - 1];
	const previous = data[data.length - 2];
	const first = data[0];

	// Weight Trend
	if (latest.weight < previous.weight) {
		insights.push("You are on a downward weight trend. Good job!");
	} else if (latest.weight > previous.weight) {
		insights.push("Weight increased slightly since the last check-in.");
	}

	// Muscle vs Fat
	if (latest.weight < previous.weight && latest.muscleMass < previous.muscleMass) {
		insights.push("Warning: You are losing weight, but also some muscle mass. Consider increasing protein intake.");
	}
	
	if (latest.bodyFat < previous.bodyFat) {
		insights.push("Your body fat percentage is decreasing.");
	}

	// Goals
	if (latest.weight <= goals.targetWeight) {
		insights.push("🎉 You've reached your target weight!");
	} else {
		const diff = latest.weight - goals.targetWeight;
		insights.push(`You are ${diff.toFixed(1)}kg away from your target weight.`);
	}

	// Visceral Fat
	if (latest.visceralFat < previous.visceralFat) {
		insights.push("Visceral fat levels have improved.");
	}

	return insights;
}

export function getMonthlyHistory(data: BodyMetrics[]) {
	if (data.length === 0) return [];

	// Group by Year-Month
	const monthlyMap = new Map<string, BodyMetrics>();

	data.forEach(metric => {
		const date = new Date(metric.date);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		// Keep the latest record of each month as the representative
		monthlyMap.set(key, metric);
	});

	return Array.from(monthlyMap.entries())
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([key, record]) => {
			const [year, month] = key.split('-').map(Number);
			const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1));
			return {
				id: key,
				label: label.charAt(0).toUpperCase() + label.slice(1),
				record
			};
		});
}
