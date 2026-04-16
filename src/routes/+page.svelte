<script lang="ts">
 import MetricCard from "$lib/components/MetricCard.svelte";
 import ChartContainer from "$lib/components/ChartContainer.svelte";
 import Upload from "$lib/components/Upload.svelte";
 import Insights from "$lib/components/Insights.svelte";
 import Goals from "$lib/components/Goals.svelte";
 import Comparison from "$lib/components/Comparison.svelte";
 import { formaStore } from "$lib/dataStore.svelte";
 import { METRIC_MAP, METRICS } from "$lib/metrics";
 import { Trash } from "lucide-svelte";

 let latest = $derived(formaStore.latest);
 let previous = $derived(formaStore.previous);

 // Multi-metric charts data
 let weightSeries = $derived([
  {
   name: "Weight",
   data: formaStore.data.map((d) => ({ x: d.date, y: d.weight })),
  },
 ]);

 let compositionSeries = $derived([
  {
   name: "Water Mass",
   data: formaStore.data.map((d) => ({ x: d.date, y: d.waterMass })),
  },
  {
   name: "Muscle Mass",
   data: formaStore.data.map((d) => ({ x: d.date, y: d.muscleMass })),
  },
  {
   name: "Fat Mass",
   data: formaStore.data.map((d) => ({ x: d.date, y: d.fatMass })),
  },
  {
   name: "Fat Free Mass",
   data: formaStore.data.map((d) => ({ x: d.date, y: d.fatFreeMass })),
  },
 ]);

 let activeSecondaryMetrics = $state(["bmi", "visceralFat"]);
 let secondarySeries = $derived(
  activeSecondaryMetrics.map((key) => {
   const config = METRIC_MAP[key];
   return {
    name: config.label,
    data: formaStore.data.map((d: any) => ({ x: d.date, y: d[key] })),
   };
  }),
 );

 function toggleMetric(key: string) {
  if (activeSecondaryMetrics.includes(key)) {
   activeSecondaryMetrics = activeSecondaryMetrics.filter((k) => k !== key);
  } else {
   activeSecondaryMetrics = [...activeSecondaryMetrics, key];
  }
 }

 function resetData() {
  if (
   confirm("Are you sure you want to reset all data? This cannot be undone.")
  ) {
   formaStore.reset();
  }
 }
</script>

<svelte:head>
 <title>Forma | Body Analytics</title>
</svelte:head>

<div class="dashboard">
 {#if formaStore.data.length === 0}
  <div class="empty-state">
   <div class="welcome">
    <h1>Welcome to Forma</h1>
    <p>
     Your personal body composition dashboard. Upload your smart scale data to
     get started.
    </p>
   </div>
   <div class="upload-wrapper">
    <Upload />
   </div>
  </div>
 {:else}
  <div class="dashboard-grid">
   <!-- Header -->
   <div class="dashboard-header">
    <div>
     <h1>Body Overview</h1>
     <p class="subtitle">
      Latest data from {new Date(latest!.date).toLocaleDateString()}
     </p>
    </div>
    <button class="btn-reset" onclick={resetData} title="Reset Data">
     <Trash size={18} />
    </button>
   </div>

   <!-- Summary Cards -->
   <div class="summary-cards">
    {#each formaStore.summaryMetrics as metricKey, i}
     {@const config = METRIC_MAP[metricKey]}
     {#if config && latest}
      <MetricCard
       label={config.label}
       value={config.format(latest[config.key])}
       unit={config.unit}
       icon={config.icon}
       inverse={config.inverse}
       delta={latest[config.key] -
        (previous?.[config.key] ?? latest[config.key])}
       onSelect={(newKey: string) => formaStore.setSummaryMetric(i, newKey)}
      />
     {/if}
    {/each}
   </div>

   <!-- Comparison Analysis -->
   <Comparison />

   <!-- Charts -->
   <div class="main-charts">
    <div class="chart-col">
     <ChartContainer
      title="Weight Tracking"
      series={weightSeries}
      options={{
       colors: ["#3b82f6"],
       stroke: { curve: "smooth" },
      }}
     />
    </div>
    <div class="chart-col">
     <ChartContainer
      title="Body Composition (Stacked)"
      type="area"
      series={compositionSeries}
     />
    </div>
   </div>

   <!-- Secondary Row -->
   <div class="secondary-grid">
    <div class="side-col">
     <Insights />
     <div class="goals-wrapper">
      <Goals />
     </div>
    </div>
     <div class="unified-chart-wrapper">
      <ChartContainer
       title="Body Metrics Deep Dive"
       series={secondarySeries}
       height={400}
       options={{
        stroke: { curve: "smooth", width: 2 },
        yaxis: { decimalsInFloat: 1 },
       }}
      />

      <div class="metric-selector card">
       <div class="selector-header">
        <h4>Visualized Metrics</h4>
        <p>Toggle any of the 19 body metrics to compare trends</p>
       </div>
       <div class="chip-container">
        {#each METRICS as metric}
         {@const isActive = activeSecondaryMetrics.includes(metric.key)}
         <button
          class="metric-chip"
          class:active={isActive}
          onclick={() => toggleMetric(metric.key)}
         >
          <metric.icon size={14} />
          <span>{metric.label}</span>
         </button>
        {/each}
       </div>
      </div>
     </div>
   </div>

   <!-- Quick Upload Footer -->
   <div class="footer-actions">
    <div class="add-data">
     <h3>Update Data</h3>
     <Upload />
    </div>
   </div>
  </div>
 {/if}
</div>

<style>
 .dashboard {
  padding-bottom: 4rem;
 }

 .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  gap: 2rem;
  text-align: center;
 }

 .welcome h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
 }

 .welcome p {
  color: var(--text-secondary);
  max-width: 500px;
 }

 .upload-wrapper {
  width: 100%;
  max-width: 600px;
 }

 .dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
 }

 .dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
 }

 .subtitle {
  color: var(--text-secondary);
 }

 .btn-reset {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--card-border);
  padding: 0.625rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
 }

 .btn-reset:hover {
  color: var(--danger);
  border-color: var(--danger);
  background: #fee2e2;
 }

 .summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
 }

 .main-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
 }

 @media (max-width: 1024px) {
  .main-charts {
   grid-template-columns: 1fr;
  }
 }

 .secondary-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
 }

 .side-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }

 .goals-wrapper {
  margin-top: 0;
 }

 @media (max-width: 900px) {
  .secondary-grid {
   grid-template-columns: 1fr;
  }
 }

  .unified-chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }

 .metric-selector {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 1.5rem;
 }

 .selector-header {
  margin-bottom: 1.25rem;
 }

 .selector-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
 }

 .selector-header p {
  font-size: 0.875rem;
  color: var(--text-secondary);
 }

 .chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
 }

 .metric-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 9999px;
  border: 1px solid var(--card-border);
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
 }

 .metric-chip:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  transform: translateY(-1px);
 }

 .metric-chip.active {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
 }

 :global(.dark) .metric-chip.active {
  background: var(--accent-soft);
 }

 .footer-actions {
  border-top: 1px solid var(--card-border);
  padding-top: 3rem;
  margin-top: 2rem;
 }

 .add-data h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
 }
</style>
