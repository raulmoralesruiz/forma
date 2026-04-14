<script lang="ts">
 import { TrendingUp, TrendingDown, Minus } from "lucide-svelte";

 interface Props {
  label: string;
  value: number | string;
  unit: string;
  delta?: number;
  inverse?: boolean; // If true, lower is better (like body fat)
 }

 let { label, value, unit, delta = 0, inverse = false }: Props = $props();

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

<div class="card animate-in">
 <div class="card-content">
  <span class="label">{label}</span>
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
  overflow: hidden;
 }

 .card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  border-color: var(--accent);
 }

 .label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
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
