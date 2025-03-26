<script>
	export let totalSteps = 11;

	const calculateTime = (steps) => {
		return Math.ceil(steps / 3); // Annahme: 3 Schritte pro Minute
	};
</script>

<div class="mb-6 mt-4 flex flex-row items-center justify-center gap-4 text-center shadow-custom">
	<div class="flex items-center space-x-1 rounded-[4px] bg-white p-2 text-xs font-bold">
		<svg width="17" height="16" fill="none" viewBox="0 0 17 16">
			<path fill="#00B67A" d="M16.5 0H.5v16h16z"></path>
			<path
				fill="#fff"
				d="m8.5 10.666 2.5-.667 1 3.167zm5.667-4H9.834l-1.334-4-1.333 4H2.834l3.5 2.5-1.334 4 3.5-2.5 2.167-1.5z"
			></path>
		</svg>
		<p class="font-bold">4.8</p>
		<span class="font-normal">von 5</span>
		<span class="h-4 border-l border-gray-200"></span>
		<p class="font-bold">129</p>
		<span class="font-normal">Nutzer</span>
	</div>
	<p class="rounded-[4px] bg-white p-2 text-xs font-bold">
		{calculateTime(totalSteps)}-MINUTEN QUIZ
	</p>
</div>
