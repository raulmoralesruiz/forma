<script lang="ts">
 import { onMount } from "svelte";
 import { browser } from "$app/environment";
 import { formaStore } from "$lib/dataStore.svelte";

 interface Props {
  title: string;
  type?:
   | "line"
   | "area"
   | "bar"
   | "pie"
   | "donut"
   | "radialBar"
   | "scatter"
   | "bubble"
   | "heatmap"
   | "candlestick"
   | "boxPlot"
   | "radar"
   | "polarArea"
   | "rangeBar"
   | "rangeArea"
   | "treemap";
  series: any[];
  options?: any;
  height?: number | string;
 }

 let {
  title,
  type = "line",
  series,
  options = {},
  height = 350,
 }: Props = $props();

 let chartElement = $state<HTMLElement | null>(null);
 let chartAction = $state<any>(null);
 let chartInstance = $state<any>(null);

 onMount(async () => {
  if (browser) {
   const module = await import("svelte-apexcharts");
   chartAction = module.chart;
  }
 });

 let defaultOptions = $derived({
  ...options,
  chart: {
   type,
   height,
   fontFamily: "Inter, sans-serif",
   toolbar: {
    show: true,
    tools: {
     download: true,
     selection: true,
     zoom: true,
     zoomin: true,
     zoomout: true,
     pan: true,
    },
   },
   background: "transparent",
   foreColor: "var(--text-secondary)",
   ...options.chart,
  },
  series,
  stroke: {
   curve: "smooth",
   width: 3,
   ...options.stroke,
  },
  theme: {
   mode: formaStore.isDark ? "dark" : "light",
   palette: "palette1",
   ...options.theme,
  },
  grid: {
   borderColor: "var(--card-border)",
   strokeDashArray: 4,
   ...options.grid,
  },
  xaxis: {
   type: "datetime",
   labels: {
    style: {
     colors: "var(--text-secondary)",
    },
   },
   ...options.xaxis,
  },
  yaxis: {
   labels: {
    style: {
     colors: "var(--text-secondary)",
    },
   },
   ...options.yaxis,
  },
  colors: options.colors || ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
 });

 // Handle chart lifecycle and reactivity manually since it's an action
 $effect(() => {
  if (browser && chartElement && chartAction) {
   if (!chartInstance) {
    // Initialize the chart
    chartInstance = chartAction(chartElement, defaultOptions);
   } else {
    // Update the chart when options or series change
    chartInstance.update(defaultOptions);
   }
  }
 });
</script>

<div class="chart-wrapper card animate-in">
 <div class="chart-header">
  <h3>{title}</h3>
 </div>
 <div class="chart-content">
  <div bind:this={chartElement} class="chart-container">
   {#if !chartAction}
    <div class="loader" style="height: {height}px">
     <p>Loading chart...</p>
    </div>
   {/if}
  </div>
 </div>
</div>

<style>
 .chart-wrapper {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
 }

 .chart-header {
  margin-bottom: 1.5rem;
 }

 .chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
 }

 .chart-container {
  width: 100%;
  min-height: 100px;
 }

 .loader {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
 }
</style>
