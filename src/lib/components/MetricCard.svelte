<script lang="ts">
  import { TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-svelte";
  import { METRICS } from "../metrics";

  interface Props {
    label: string;
    value: number | string;
    unit: string;
    icon?: any;
    delta?: number;
    inverse?: boolean;
    onSelect?: (key: string) => void;
  }

  let { 
    label, 
    value, 
    unit, 
    icon: Icon, 
    delta = 0, 
    inverse = false,
    onSelect
  }: Props = $props();

  let showSelector = $state(false);

  let deltaType = $derived(
    delta === 0
      ? "neutral"
      : delta > 0
        ? inverse
          ? "bad"
          : "good"
        : inverse
          ? "good"
          : "bad",
  );
</script>

<div class="card animate-in" class:active={showSelector}>
  <div class="card-header">
    <div class="title-group">
      {#if Icon}
        <div class="icon-wrapper">
          <Icon size={18} />
        </div>
      {/if}
      <span class="label">{label}</span>
    </div>
    
    {#if onSelect}
      <div class="selector-wrapper">
        <button 
          class="btn-selector" 
          onclick={() => showSelector = !showSelector}
          onkeydown={(e) => e.key === "Escape" && (showSelector = false)}
          title="Change Metric"
        >
          <ChevronDown size={14} />
        </button>

        {#if showSelector}
          <div class="dropdown-menu">
            <div class="dropdown-header">Select Metric</div>
            {#each METRICS as metric}
              <button 
                class="dropdown-item" 
                onclick={() => {
                  onSelect!(metric.key);
                  showSelector = false;
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
            onclick={() => showSelector = false}
            onkeydown={(e) => e.key === "Escape" && (showSelector = false)}
            aria-label="Close menu"
          ></button>
        {/if}
      </div>
    {/if}
  </div>

  <div class="card-content">
    <div class="value-row">
      <span class="value">{value}</span>
      <span class="unit">{unit}</span>
    </div>

    {#if delta !== 0}
      <div class="delta {deltaType}">
        {#if delta > 0}
          <TrendingUp size={16} />
        {:else}
          <TrendingDown size={16} />
        {/if}
        <span class="delta-value">{Math.abs(delta).toFixed(1)}</span>
        <span class="delta-unit">{unit}</span>
      </div>
    {:else}
      <div class="delta neutral">
        <Minus size={16} />
        <span>Stable</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    position: relative;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
    border-color: var(--accent);
  }

  .card.active {
    z-index: 50;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon-wrapper {
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

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

  /* Dropdown Styles */
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
    max-height: 300px;
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

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .value {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .unit {
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .delta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
  }

  .delta.good {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .delta.bad {
    background: #fee2e2;
    color: var(--danger);
  }

  .delta.neutral {
    background: #f1f5f9;
    color: var(--text-secondary);
  }

  :global(.dark) .delta.neutral {
    background: #334155;
  }

  .delta-value {
    margin-left: 0.125rem;
  }
</style>
