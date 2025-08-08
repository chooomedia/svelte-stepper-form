<script lang="ts">
	import { page } from '$app/stores';
	import { i18n } from '$lib/i18n';
</script>

<div class="flex min-h-[400px] items-center justify-center p-4">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900">
			{$page.status}: {$page.error?.message || $i18n.common.error}
		</h1>
		<p class="mb-8 text-gray-600">
			{$i18n.common.tryAgainLater}
		</p>
		<a href="/" class="btn btn-primary">{$i18n.common.backToHome}</a>
	</div>
</div>
