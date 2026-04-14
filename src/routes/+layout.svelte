<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { formaStore } from '$lib/dataStore.svelte';

	let { children } = $props();

	// Simple theme management
	function toggleTheme() {
		formaStore.toggleTheme();
	}

	let isDark = $derived(formaStore.isDark);

	onMount(() => {
		formaStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-shell">
	<header class="container">
		<nav class="top-nav">
			<div class="logo">
				<span class="logo-text">Forma</span>
			</div>
			<div class="actions">
				<button onclick={toggleTheme} class="btn-icon" aria-label="Toggle theme">
					{#if isDark}
						<!-- Sun icon (manual SVG for now to avoid overhead before lucide setup) -->
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
					{:else}
						<!-- Moon icon -->
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
					{/if}
				</button>
			</div>
		</nav>
	</header>

	<main class="container">
		{@render children()}
	</main>
</div>

<style>
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-bottom: 1px solid var(--card-border);
		margin-bottom: 2rem;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--accent), #8b5cf6);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.btn-icon {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		color: var(--text-primary);
		padding: 0.5rem;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: var(--transition);
	}

	.btn-icon:hover {
		background: var(--accent-soft);
		border-color: var(--accent);
	}
</style>
