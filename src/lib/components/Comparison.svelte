<script lang="ts">
	import { Scale, Flame, Dumbbell, Activity, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
	import { formaStore } from '$lib/dataStore.svelte';
	import { getMonthlyHistory } from '$lib/analytics';
	import type { BodyMetrics } from '$lib/csvParser';

	let history = $derived(getMonthlyHistory(formaStore.data));
	
	let startId = $state('');
	let endId = $state('');

	// Initialize selections when history changes
	$effect(() => {
		if (history.length >= 2) {
			if (!startId) startId = history[0].id;
			if (!endId) endId = history[history.length - 1].id;
		}
	});

	let startRecord = $derived(history.find(h => h.id === startId)?.record);
	let endRecord = $derived(history.find(h => h.id === endId)?.record);

	function calculateDiff(key: keyof BodyMetrics) {
		if (!startRecord || !endRecord) return { val: 0, percent: 0 };
		const base = startRecord[key] as number;
		const current = endRecord[key] as number;
		const diff = current - base;
		const percent = base !== 0 ? (diff / base) * 100 : 0;
		return { val: diff, percent };
	}

	const metrics = [
		{ label: 'Weight', key: 'weight', unit: 'kg', icon: Scale, inverse: true },
		{ label: 'Body Fat', key: 'bodyFat', unit: '%', icon: Flame, inverse: true },
		{ label: 'Muscle Mass', key: 'muscleMass', unit: 'kg', icon: Dumbbell, inverse: false },
		{ label: 'Visceral Fat', key: 'visceralFat', unit: '', icon: Activity, inverse: true }
	];
</script>

<div class="comparison-card card animate-in">
	<div class="header">
		<div class="title-group">
			<Activity size={20} color="var(--accent)" />
			<h3>Period Comparison</h3>
		</div>
		
		{#if history.length >= 2}
			<div class="selectors">
				<select bind:value={startId} aria-label="Start Period">
					{#each history as month}
						<option value={month.id} disabled={month.id >= endId}>
							{month.label}
						</option>
					{/each}
				</select>
				
				<ArrowRight size={16} class="arrow" />
				
				<select bind:value={endId} aria-label="End Period">
					{#each history as month}
						<option value={month.id} disabled={month.id <= startId}>
							{month.label}
						</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	{#if history.length < 2}
		<div class="empty-state">
			<p>Upload data from at least two different months to enable comparison.</p>
		</div>
	{:else if startRecord && endRecord}
		<div class="grid">
			{#each metrics as metric}
				{@const diff = calculateDiff(metric.key as keyof BodyMetrics)}
				{@const isGood = metric.inverse ? diff.val < 0 : diff.val > 0}
				{@const isNeutral = Math.abs(diff.val) < 0.01}
				
				<div class="metric-item">
					<div class="metric-info">
						<metric.icon size={18} color="var(--text-secondary)" />
						<span class="label">{metric.label}</span>
					</div>
					
					<div class="comparison-row">
						<div class="val-box">
							<span class="val">{(startRecord[metric.key as keyof BodyMetrics] as number).toFixed(1)}</span>
							<span class="u">{metric.unit}</span>
						</div>
						
						<ArrowRight size={14} color="var(--card-border)" />
						
						<div class="val-box">
							<span class="valHighlight">{(endRecord[metric.key as keyof BodyMetrics] as number).toFixed(1)}</span>
							<span class="u">{metric.unit}</span>
						</div>
					</div>

					<div class="delta-box" class:good={isGood && !isNeutral} class:bad={!isGood && !isNeutral} class:neutral={isNeutral}>
						{#if isNeutral}
							<Minus size={14} />
							<span>No change</span>
						{:else}
							{#if diff.val > 0}
								<TrendingUp size={14} />
							{:else}
								<TrendingDown size={14} />
							{/if}
							<span>{Math.abs(diff.val).toFixed(1)}{metric.unit} ({Math.abs(diff.percent).toFixed(1)}%)</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.comparison-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius);
		padding: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: var(--shadow-sm);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.title-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.title-group h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.selectors {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--bg);
		padding: 0.4rem 0.75rem;
		border-radius: 12px;
		border: 1px solid var(--card-border);
	}

	select {
		background: transparent;
		border: none;
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		outline: none;
		padding: 0.25rem;
		appearance: none;
		-webkit-appearance: none;
	}

	option {
		background: var(--card-bg);
		color: var(--text-primary);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.metric-item {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg);
		border-radius: 12px;
		border: 1px solid var(--card-border);
	}

	.metric-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.comparison-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0;
	}

	.val-box {
		display: flex;
		flex-direction: column;
	}

	.val {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.valHighlight {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.u {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.delta-box {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.375rem 0.75rem;
		border-radius: 8px;
		margin-top: 0.25rem;
	}

	.delta-box.good {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.delta-box.bad {
		background: #fee2e2;
		color: var(--danger);
	}

	.delta-box.neutral {
		background: #f1f5f9;
		color: var(--text-secondary);
	}

	:global(.dark) .delta-box.neutral {
		background: #334155;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
		background: var(--bg);
		border-radius: 12px;
		border: 1px dashed var(--card-border);
	}

	@media (max-width: 640px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
		}
		.selectors {
			width: 100%;
			justify-content: space-between;
		}
	}
</style>
