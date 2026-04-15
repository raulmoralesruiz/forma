import { browser } from '$app/environment';
import type { BodyMetrics } from './csvParser';

export class FormaStore {
	data = $state<BodyMetrics[]>([]);
	goals = $state({
		targetWeight: 70,
		targetBodyFat: 20
	});
	summaryMetrics = $state<string[]>(['weight', 'bodyFat', 'muscleMass', 'bmi']);
	isDark = $state(false);

	constructor() {
		if (browser) {
			const savedData = localStorage.getItem('forma_data');
			const savedGoals = localStorage.getItem('forma_goals');
			const savedMetrics = localStorage.getItem('forma_summary_metrics');
			
			if (savedData) this.data = JSON.parse(savedData);
			if (savedGoals) this.goals = JSON.parse(savedGoals);
			if (savedMetrics) this.summaryMetrics = JSON.parse(savedMetrics);
		}
	}

	init() {
		if (!browser) return;

		const savedTheme = localStorage.getItem('forma_theme');
		if (savedTheme !== null) {
			this.isDark = JSON.parse(savedTheme);
		} else {
			this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		
		this.applyTheme();
	}

	private applyTheme() {
		if (!browser) return;
		if (this.isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	setData(newData: BodyMetrics[]) {
		this.data = newData;
		this.save();
	}

	setGoals(newGoals: { targetWeight: number; targetBodyFat: number }) {
		this.goals = newGoals;
		this.save();
	}

	setSummaryMetric(index: number, key: string) {
		this.summaryMetrics[index] = key;
		this.save();
	}

	toggleTheme() {
		this.isDark = !this.isDark;
		this.applyTheme();
		if (browser) {
			localStorage.setItem('forma_theme', JSON.stringify(this.isDark));
		}
	}

	reset() {
		this.data = [];
		this.save();
	}

	private save() {
		if (browser) {
			localStorage.setItem('forma_data', JSON.stringify(this.data));
			localStorage.setItem('forma_goals', JSON.stringify(this.goals));
			localStorage.setItem('forma_summary_metrics', JSON.stringify(this.summaryMetrics));
		}
	}

	// Derived metrics
	get latest() {
		return this.data.length > 0 ? this.data[this.data.length - 1] : null;
	}

	get previous() {
		return this.data.length > 1 ? this.data[this.data.length - 2] : null;
	}

	get stats() {
		if (this.data.length < 2) return null;
		const latest = this.latest!;
		const first = this.data[0];
		
		return {
			totalWeightLoss: latest.weight - first.weight,
			totalFatLoss: latest.bodyFat - first.bodyFat,
			weightDelta: latest.weight - this.previous!.weight,
			fatDelta: latest.bodyFat - this.previous!.bodyFat
		};
	}
}

export const formaStore = new FormaStore();
