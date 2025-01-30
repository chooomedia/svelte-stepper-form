<script lang="ts">
    import { onMount } from "svelte";
    export let steps: any[] = []; // Liste aller Schritte
    export let currentStep: number = 0; // Der aktuelle Schritt
    export let showLabels: boolean = true; // Labels anzeigen oder nicht
    export let groupSize: number = 4; // Anzahl der Schritte pro Gruppe
    export let progressBarStyle: string = "bg-green-500"; // Farbe des Fortschrittsbalkens
    export let stepStyle: string = "bg-blue-500"; // Farbe der großen Steps
    export let dotStyle: string = "bg-gray-400"; // Farbe der kleinen Punkte
    export let onStepClick: (stepIndex: number) => void = () => {}; // Zurückspringen ermöglichen
  
    // 📌 Schritte in Gruppen einteilen
    $: stepGroups = steps.length > 0
      ? Array.from({ length: Math.ceil(steps.length / groupSize) }, (_, i) =>
          steps.slice(i * groupSize, (i + 1) * groupSize))
      : [];
  
    const stepSize = 40; // Breite der großen Schritte
    let viewportWidth = 0; // Breite des Viewports (wird nach `onMount` gesetzt)
  
    // 🔍 Aktuelle Gruppe bestimmen
    $: currentGroupIndex = Math.floor(currentStep / groupSize);
    $: currentGroup = stepGroups[currentGroupIndex] ?? [];
  
    // 🟢 Fortschrittsberechnung
    $: progressStart = viewportWidth ? (stepSize / 1.9 / viewportWidth) * 100 : 0; // Start in %
    $: progressEnd = 100 - progressStart; // Ende in %
    $: progressWidth =
      viewportWidth && steps.length > 1
        ? ((currentStep / (steps.length - 1)) * (progressEnd - progressStart)) +
          progressStart
        : 0;
  
    // 🖥️ Viewport-Breite nachladen
    onMount(() => {
      viewportWidth = window.innerWidth;
    });
</script>
  
<div class="w-full flex flex-col items-center relative">
    <!-- Fortschrittsbalken (hinter den Steps) -->
    <div
      class="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gray-300 rounded-full"
      style="left: {progressStart}%; right: {progressStart}%;"
    >
      <div
        class={`h-full rounded-full transition-all duration-500 ${progressBarStyle}`}
        style="width: {progressWidth}%;"
      ></div>
    </div>
  
    <!-- Schritte: Große Schritte und Zwischenpunkte -->
    <div class="relative w-full flex justify-between items-center px-0">
        {#each steps as step, index}
            <div class="flex flex-col items-center">
            <!-- ✅ Große Schritte -->
            {#if index % groupSize === 0 || index === steps.length - 1}
                <button
                class={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white 
                transition-all duration-300 focus:outline-none 
                ${index === currentStep ? "scale-125 shadow-md bg-blue-600" : ""} 
                ${index < currentStep ? "bg-green-500" : stepStyle}`}
                on:click={() => index <= currentStep && onStepClick(index)}
                >
                <!-- Icon für große Schritte -->
                {#if index < currentStep}
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                    </svg>
                {:else}
                    {@html step.icon ?? '<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="stone_een" d="M14.197,2.113C7.871,2.903,2.796,8.062,2.09,14.398c-0.387,3.47,0.502,6.716,2.248,9.342l-2.059,4.632 c-0.168,0.378-0.086,0.821,0.207,1.113l0.029,0.029c0.293,0.293,0.735,0.375,1.113,0.207l4.632-2.059 c2.626,1.747,5.872,2.635,9.342,2.248c6.336-0.706,11.495-5.782,12.285-12.108C31.029,8.658,23.342,0.971,14.197,2.113z M15,21.5 L15,21.5c0-0.277,0.224-0.5,0.5-0.5H15.5c0.276,0,0.5,0.224,0.5,0.5V21.5c0,0.276-0.224,0.5-0.5,0.5H15.5 C15.224,22,15,21.776,15,21.5z M15,19.5v-2.603c0-0.22,0.178-0.398,0.398-0.398h0.001c1.882,0,3.504-1.443,3.597-3.323 C19.095,11.167,17.488,9.5,15.5,9.5c-1.624,0-2.994,1.113-3.387,2.616c-0.058,0.224-0.254,0.384-0.485,0.384h0 c-0.328,0-0.567-0.311-0.485-0.628c0.52-2.005,2.39-3.471,4.577-3.366c2.119,0.102,3.916,1.725,4.229,3.823 c0.358,2.401-1.247,4.612-3.55,5.081L16,17.491V19.5c0,0.276-0.224,0.5-0.5,0.5H15.5C15.224,20,15,19.776,15,19.5z"/></svg>'}
                {/if}
                </button>
            {:else}
                <!-- 🔵 Kleine Punkte -->
                <div
                class={`w-3 h-3 rounded-full transition-all duration-300 
                ${index <= currentStep ? "bg-green-500 scale-110" : dotStyle}`}
                ></div>
            {/if}
    
            <!-- Labels für große Schritte -->
            {#if showLabels && (index % groupSize === 0 || index === steps.length - 1)}
                <span class="text-xs text-gray-500 mt-1 text-center w-24">{step.title}</span>
            {/if}
            </div>
        {/each}
    </div>
</div>  