<script lang="ts">
	import { ArrowRight, TrendingUp, TrendingDown, Minus, ChevronDown, Activity, Calendar } from 'lucide-svelte';
	import { formaStore } from '$lib/dataStore.svelte';
	import { getMonthlyHistory } from '$lib/analytics';
	import { METRIC_MAP, METRICS } from '$lib/metrics';
	import type { BodyMetrics } from '$lib/csvParser';

	let history = $derived(getMonthlyHistory(formaStore.data));
	
	let startId = $state('');
	let endId = $state('');
	let activeSelectorIndex = $state<number | null>(null);
	let showStartSelector = $state(false);
	let showEndSelector = $state(false);

	// Initialize selections when history changes
	$effect(() => {
		if (history.length >= 2) {
			if (!startId) startId = history[0].id;
			if (!endId) endId = history[history.length - 1].id;
		}
	});

	let startRecord = $derived(history.find(h => h.id === startId)?.record);
	let endRecord = $derived(history.find(h => h.id === endId)?.record);
	let startLabel = $derived(history.find(h => h.id === startId)?.label ?? 'Start');
	let endLabel = $derived(history.find(h => h.id === endId)?.label ?? 'End');

	function calculateDiff(key: keyof BodyMetrics) {
		if (!startRecord || !endRecord) return { val: 0, percent: 0 };
		const base = startRecord[key] as number;
		const current = endRecord[key] as number;
		const diff = current - base;
		const percent = base !== 0 ? (diff / base) * 100 : 0;
		return { val: diff, percent };
	}
</script>

<div class="comparison-card card animate-in">
	<div class="header">
		<div class="title-group">
			<Activity size={20} color="var(--accent)" />
			<h3>Period Comparison</h3>
		</div>
		
		{#if history.length >= 2}
			<div class="period-selectors">
				<div class="selector-container">
					<button 
						class="date-selector-btn" 
						onclick={() => showStartSelector = !showStartSelector}
					>
						<Calendar size={14} />
						<span>{startLabel}</span>
						<ChevronDown size={14} />
					</button>

					{#if showStartSelector}
						<div class="dropdown-menu date-dropdown">
							<div class="dropdown-header">Start Period</div>
							{#each history as month}
								<button 
									class="dropdown-item" 
									class:disabled={month.id >= endId}
									disabled={month.id >= endId}
									onclick={() => {
										startId = month.id;
										showStartSelector = false;
									}}
								>
									<span>{month.label}</span>
								</button>
							{/each}
						</div>
						<button class="dropdown-overlay" onclick={() => showStartSelector = false}></button>
					{/if}
				</div>
				
				<ArrowRight size={16} class="arrow" />
				
				<div class="selector-container">
					<button 
						class="date-selector-btn" 
						onclick={() => showEndSelector = !showEndSelector}
					>
						<Calendar size={14} />
						<span>{endLabel}</span>
						<ChevronDown size={14} />
					</button>

					{#if showEndSelector}
						<div class="dropdown-menu date-dropdown">
							<div class="dropdown-header">End Period</div>
							{#each history as month}
								<button 
									class="dropdown-item" 
									class:disabled={month.id <= startId}
									disabled={month.id <= startId}
									onclick={() => {
										endId = month.id;
										showEndSelector = false;
									}}
								>
									<span>{month.label}</span>
								</button>
							{/each}
						</div>
						<button class="dropdown-overlay" onclick={() => showEndSelector = false}></button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if history.length < 2}
		<div class="empty-state">
			<p>Upload data from at least two different months to enable comparison.</p>
		</div>
	{:else if startRecord && endRecord}
		<div class="grid">
			{#each formaStore.comparisonMetrics as metricKey, i}
				{@const config = METRIC_MAP[metricKey]}
				{#if config}
					{@const diff = calculateDiff(config.key)}
					{@const isGood = config.inverse ? diff.val < 0 : diff.val > 0}
					{@const isNeutral = Math.abs(diff.val) < 0.01}
					
					<div class="metric-item" class:active={activeSelectorIndex === i}>
						<div class="metric-header">
							<div class="metric-info">
								<config.icon size={18} color="var(--accent)" />
								<span class="label">{config.label}</span>
							</div>

							<div class="selector-wrapper">
								<button 
									class="btn-selector" 
									onclick={() => activeSelectorIndex = activeSelectorIndex === i ? null : i}
									onkeydown={(e) => e.key === "Escape" && (activeSelectorIndex = null)}
									title="Change Metric"
								>
									<ChevronDown size={14} />
								</button>

								{#if activeSelectorIndex === i}
									<div class="dropdown-menu">
										<div class="dropdown-header">Select Metric</div>
										{#each METRICS as metric}
											<button 
												class="dropdown-item" 
												onclick={() => {
													formaStore.setComparisonMetric(i, metric.key);
													activeSelectorIndex = null;
												}}
											>
												<metric.icon size={14} />
												<span>{metric.label}</span>
											</button>
										{/each}
									</div>
									<button 
										type="button"
										class="dropdown-overlay" 
										onclick={() => activeSelectorIndex = null}
										onkeydown={(e) => e.key === "Escape" && (activeSelectorIndex = null)}
										aria-label="Close menu"
									></button>
								{/if}
							</div>
						</div>
						
						<div class="comparison-row">
							<div class="val-box">
								<span class="val">{config.format(startRecord[config.key] as number)}</span>
								<span class="u">{config.unit}</span>
							</div>
							
							<ArrowRight size={14} color="var(--card-border)" />
							
							<div class="val-box">
								<span class="valHighlight">{config.format(endRecord[config.key] as number)}</span>
								<span class="u">{config.unit}</span>
							</div>
						</div>

						<div class="delta-box" class:good={isGood && !isNeutral} class:bad={!isGood && !isNeutral} class:neutral={isNeutral}>
							{#if isNeutral}
								<Minus size={14} />
								<span>Stable</span>
							{:else}
								{#if diff.val > 0}
									<TrendingUp size={14} />
								{:else}
									<TrendingDown size={14} />
								{/if}
								<span>{Math.abs(diff.val).toFixed(1)}{config.unit} ({Math.abs(diff.percent).toFixed(1)}%)</span>
							{/if}
						</div>
					</div>
				{/if}
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

	.period-selectors {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--bg);
		padding: 0.4rem 0.75rem;
		border-radius: 12px;
		border: 1px solid var(--card-border);
	}

	.selector-container {
		position: relative;
	}

	.date-selector-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		transition: var(--transition);
	}

	.date-selector-btn:hover {
		background: var(--card-border);
	}

	.date-dropdown {
		top: calc(100% + 0.5rem);
		left: 0;
		right: auto;
		min-width: 180px;
		width: max-content;
	}

	.dropdown-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: transparent !important;
		color: var(--text-secondary);
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
		padding: 1.25rem;
		background: var(--bg);
		border-radius: 12px;
		border: 1px solid var(--card-border);
		transition: var(--transition);
		position: relative;
	}

	.metric-item:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
	}

	.metric-item.active {
		z-index: 50;
	}

	.metric-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.metric-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	/* Selector Styles (Synced with MetricCard) */
	.btn-selector {
		background: transparent;
		border: none;
		color: var(--text-secondary);
		padding: 0.25rem;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		transition: var(--transition);
	}

	.btn-selector:hover {
		background: var(--card-border);
		color: var(--text-primary);
	}

	.selector-wrapper {
		position: relative;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.5rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 8px;
		box-shadow: var(--shadow-lg);
		z-index: 100;
		min-width: 160px;
		max-height: 250px;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.dropdown-header {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		padding: 0.5rem 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.dropdown-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.75rem;
		border: none;
		background: transparent;
		color: var(--text-primary);
		font-size: 0.875rem;
		border-radius: 4px;
		cursor: pointer;
		text-align: left;
		transition: var(--transition);
		white-space: nowrap;
	}

	.dropdown-item:hover {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.dropdown-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 90;
		background: transparent;
		border: none;
		cursor: default;
		width: 100%;
		height: 100%;
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
		.period-selectors {
			width: 100%;
			justify-content: space-between;
		}
	}
</style>
