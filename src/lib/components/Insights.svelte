<script lang="ts">
 import { Lightbulb, Info } from "lucide-svelte";
 import { generateInsights } from "$lib/analytics";
 import { formaStore } from "$lib/dataStore.svelte";

 let insights = $derived(generateInsights(formaStore.data, formaStore.goals));
</script>

<div class="insights-container animate-in">
 <div class="header">
  <Lightbulb size={20} color="var(--warning)" />
  <h3>Health Insights</h3>
 </div>

 <div class="insights-list">
  {#each insights as insight}
   <div class="insight-item">
    <div class="icon-box">
     <Info size={18} />
    </div>
    <p>{insight}</p>
   </div>
  {/each}
 </div>
</div>

<style>
 .insights-container {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  height: 100%;
  box-shadow: var(--shadow-sm);
 }

 .header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
 }

 .header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
 }

 .insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
 }

 .insight-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  transition: var(--transition);
 }

 .insight-item:hover {
  border-color: var(--accent);
  background: var(--card-bg);
 }

 .icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--accent);
  margin-top: 2px;
 }

 .insight-item p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
 }
</style>
