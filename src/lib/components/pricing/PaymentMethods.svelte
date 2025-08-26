<script lang="ts">
	import { fade } from 'svelte/transition';

	const paymentMethods = [
		{ name: 'Visa', icon: '/visa.svg', alt: 'Visa' },
		{ name: 'Maestro', icon: '/maestro.svg', alt: 'Maestro' },
		{ name: 'MasterCard', icon: '/mastercard.svg', alt: 'MasterCard' },
		{ name: 'American Express', icon: '/amex.svg', alt: 'American Express' },
		{ name: 'PayPal', icon: '/paypal.svg', alt: 'PayPal' }
	];
</script>

<!-- Payment Methods -->
<div class="mb-8 mt-6 flex flex-wrap justify-center gap-4" in:fade={{ duration: 300, delay: 700 }}>
	{#each paymentMethods as method}
		<img src={method.icon} alt={method.name} class="h-8" title={method.name} />
	{/each}
</div>
