<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[400px] items-center justify-center p-4">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900">
			{$page.status}: {$page.error?.message || 'Ein Fehler ist aufgetreten'}
		</h1>
		<p class="mb-8 text-gray-600">
			Bitte versuchen Sie es später erneut oder kontaktieren Sie unseren Support.
		</p>
		<a href="/" class="btn btn-primary"> Zurück zur Startseite </a>
	</div>
</div>
