<script lang="ts">
  import MetricCard from "$lib/components/MetricCard.svelte";
  import ChartContainer from "$lib/components/ChartContainer.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import Insights from "$lib/components/Insights.svelte";
  import Goals from "$lib/components/Goals.svelte";
  import Comparison from "$lib/components/Comparison.svelte";
  import { formaStore } from "$lib/dataStore.svelte";
  import { METRIC_MAP } from "$lib/metrics";
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
      name: "Fat Mass",
      data: formaStore.data.map((d) => ({ x: d.date, y: d.fatMass })),
    },
    {
      name: "Muscle Mass",
      data: formaStore.data.map((d) => ({ x: d.date, y: d.muscleMass })),
    },
    {
      name: "Water Mass",
      data: formaStore.data.map((d) => ({ x: d.date, y: d.waterMass })),
    },
  ]);

  let bodyFatSeries = $derived([
    {
      name: "Body Fat %",
      data: formaStore.data.map((d) => ({ x: d.date, y: d.bodyFat })),
    },
  ]);

  let heartRateSeries = $derived([
    {
      name: "Heart Rate",
      data: formaStore.data.map((d) => ({ x: d.date, y: d.heartRate })),
    },
  ]);

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
          Your personal body composition dashboard. Upload your smart scale data to get started.
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
              delta={latest[config.key] - (previous?.[config.key] ?? latest[config.key])}
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
        <div class="mini-charts">
          <ChartContainer
            title="Body Fat %"
            height={200}
            series={bodyFatSeries}
            options={{ colors: ["#ef4444"] }}
          />
          <ChartContainer
            title="Heart Rate"
            height={200}
            series={heartRateSeries}
            options={{ colors: ["#ec4899"] }}
          />
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

  .mini-charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    .mini-charts {
      grid-template-columns: 1fr;
    }
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
