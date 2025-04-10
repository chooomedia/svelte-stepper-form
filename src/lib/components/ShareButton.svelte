<script lang="ts">
	import { scale, fade } from 'svelte/transition';
	import { getShareCapabilities, shareTo } from '$lib/utils/sharing';
	import Icon from './Icon.svelte';
	import { i18n } from '$lib/i18n';

	interface Props {
		url?: string;
		title?: string;
		text?: string;
		hashtags?: string[];
		via?: string;
		onShareSuccess?: (platform: string) => void;
		onShareError?: (platform: string) => void;
	}

	const {
		url = window.location.href,
		title = $i18n.modal.success.shareContent.title,
		text = '',
		hashtags = ['DigitalPusher', 'Marketing', 'Success'],
		via = 'DigitalPusher',
		onShareSuccess = () => {},
		onShareError = () => {}
	} = $props<Props>();

	let isOpen = $state(false);
	const capabilities = getShareCapabilities();

	const allPlatforms = ['email', 'copy', 'whatsapp', 'telegram', 'reddit', 'linkedin', 'facebook'];

	function toggleShare() {
		isOpen = !isOpen;
	}

	function closeShare() {
		isOpen = false;
	}

	async function handleShare(platform: string) {
		try {
			const success = await shareTo(platform, {
				url,
				title,
				text,
				hashtags,
				via
			});

			if (success) {
				onShareSuccess(platform);
			} else {
				onShareError(platform);
			}

			closeShare();
		} catch (error) {
			console.error(`Share error on ${platform}:`, error);
			onShareError(platform);
		}
	}
</script>

<div class="relative flex" aria-haspopup="true" aria-expanded={isOpen}>
	{#if isOpen}
		<div
			class="flex gap-1 rounded-lg border bg-secondary-900 p-2 shadow-custom"
			in:scale={{ duration: 150 }}
			out:fade={{ duration: 100 }}
			role="menu"
		>
			{#each allPlatforms as platform}
				<button
					on:click={() => handleShare(platform)}
					class="gap-2 rounded-sm px-2 py-1 text-white transition-all hover:scale-110 hover:bg-base-200"
					aria-label={`Share via ${platform}`}
				>
					<Icon name={platform} size={22} fill="currentColor" />
				</button>
			{/each}
		</div>
	{:else}
		<button
			on:click={toggleShare}
			class="btn btn-outline flex items-center gap-2 transition-all hover:bg-secondary-900"
			aria-haspopup="true"
			aria-label={$i18n.modal.success.buttons.share}
		>
			<Icon name="share" size={20} />
			<span class="inline">{$i18n.modal.success.buttons.share}</span>
		</button>
	{/if}
</div>
