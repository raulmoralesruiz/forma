<script lang="ts">
	import { Target, Save } from 'lucide-svelte';
	import { formaStore } from '$lib/dataStore.svelte';

	let targetWeight = $state(formaStore.goals.targetWeight);
	let targetBodyFat = $state(formaStore.goals.targetBodyFat);
	let isSaving = $state(false);

	function saveGoals() {
		isSaving = true;
		formaStore.setGoals({ targetWeight, targetBodyFat });
		setTimeout(() => isSaving = false, 1000);
	}
</script>

<div class="goals-card card animate-in">
	<div class="header">
		<Target size={20} color="var(--accent)" />
		<h3>Personal Goals</h3>
	</div>
	
	<div class="goals-form">
		<div class="input-group">
			<label for="target-weight">Target Weight (kg)</label>
			<input 
				type="number" 
				id="target-weight" 
				bind:value={targetWeight} 
				step="0.1"
			/>
		</div>
		
		<div class="input-group">
			<label for="target-fat">Target Body Fat (%)</label>
			<input 
				type="number" 
				id="target-fat" 
				bind:value={targetBodyFat} 
				step="0.1"
			/>
		</div>
		
		<button class="btn-save" onclick={saveGoals} disabled={isSaving}>
			{#if isSaving}
				<span>Saved!</span>
			{:else}
				<Save size={16} />
				<span>Update Goals</span>
			{/if}
		</button>
	</div>
</div>

<style>
	.goals-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	.header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.header h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.goals-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	input {
		background: var(--bg);
		border: 1px solid var(--card-border);
		border-radius: 8px;
		padding: 0.75rem;
		color: var(--text-primary);
		font-size: 1rem;
		transition: var(--transition);
	}

	input:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 2px var(--accent-soft);
	}

	.btn-save {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition);
	}

	.btn-save:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	.btn-save:disabled {
		background: var(--success);
		cursor: default;
	}
</style>
