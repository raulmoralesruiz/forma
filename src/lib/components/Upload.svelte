<script lang="ts">
 import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  CircleAlert,
  CircleCheck,
 } from "lucide-svelte";
 import { parseCSV } from "$lib/csvParser";
 import { formaStore } from "$lib/dataStore.svelte";

 let isDragging = $state(false);
 let status = $state<"idle" | "parsing" | "success" | "error">("idle");
 let errorMessage = $state("");

 async function handleFile(file: File) {
  if (!file.name.endsWith(".csv")) {
   status = "error";
   errorMessage = "Please upload a valid CSV file.";
   return;
  }

  status = "parsing";
  const reader = new FileReader();
  reader.onload = (e) => {
   try {
    const content = e.target?.result as string;
    const data = parseCSV(content);
    if (data.length === 0) {
     throw new Error("No valid data found in CSV.");
    }
    formaStore.setData(data);
    status = "success";
    setTimeout(() => (status = "idle"), 3000);
   } catch (err: any) {
    status = "error";
    errorMessage = err.message || "Failed to parse CSV.";
   }
  };
  reader.readAsText(file);
 }

 function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragging = false;
  const file = e.dataTransfer?.files[0];
  if (file) handleFile(file);
 }

 function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) handleFile(file);
 }
</script>

<div
 class="upload-zone {isDragging ? 'dragging' : ''} {status}"
 role="button"
 tabindex="0"
 onkeydown={(e) => {
  if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
 }}
 ondragover={(e) => {
  e.preventDefault();
  isDragging = true;
 }}
 ondragleave={() => (isDragging = false)}
 ondrop={onDrop}
>
 <input type="file" accept=".csv" onchange={onChange} id="csv-upload" />

 <div class="content">
  {#if status === "idle" || isDragging}
   <Upload size={32} class="icon" />
   <p class="primary">Drop your smart scale CSV here</p>
   <p class="secondary">or click to browse your files</p>
  {:else if status === "parsing"}
   <div class="spinner"></div>
   <p class="primary">Parsing your data...</p>
  {:else if status === "success"}
   <CircleCheck size={32} class="icon success" />
   <p class="primary">Data updated successfully!</p>
   <p class="secondary">Your dashboard is now up to date.</p>
  {:else if status === "error"}
   <CircleAlert size={32} class="icon error" />
   <p class="primary">Oops! Something went wrong</p>
   <p class="secondary">{errorMessage}</p>
   <button onclick={() => (status = "idle")} class="btn-retry">Try Again</button
   >
  {/if}
 </div>
</div>

<style>
 .upload-zone {
  border: 2px dashed var(--card-border);
  border-radius: var(--radius);
  padding: 3rem 2rem;
  text-align: center;
  background: var(--card-bg);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
 }

 .upload-zone:hover,
 .upload-zone.dragging {
  border-color: var(--accent);
  background: var(--accent-soft);
 }

 input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
 }

 .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
 }

 .icon {
  color: var(--accent);
  margin-bottom: 0.5rem;
 }

 .icon.success {
  color: var(--success);
 }
 .icon.error {
  color: var(--danger);
 }

 .primary {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text-primary);
 }

 .secondary {
  color: var(--text-secondary);
  font-size: 0.875rem;
 }

 .btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  pointer-events: auto;
 }

 .spinner {
  width: 32px;
  height: 32px;
  border: 4px solid var(--accent-soft);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
 }

 @keyframes spin {
  to {
   transform: rotate(360deg);
  }
 }
</style>
