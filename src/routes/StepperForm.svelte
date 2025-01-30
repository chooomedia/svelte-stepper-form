<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { formSchema } from '$lib/schema';
	import Button from '$lib/components/Button.svelte';

	export let form;

	export let className: string = '';
	export { className as class };

	const sprFrm = superForm(form, {
		dataType: 'json',
		validators: zodClient(formSchema),
		async onSubmit({ formData, jsonData }) {
			const testValue = formData.get('test')?.toString() || '';
			const taintedData = {
				test: testValue,
				extraData: 'extra'
			};
			jsonData(taintedData);
		}
	});

	const { form: formData, enhance } = sprFrm;
</script>

<form method="POST" use:enhance>
	<input type="text" name="test" bind:value={$formData.test} />
	<Button type="submit" label="Submit" />
</form>

<div class="mt-5 max-h-48 overflow-y-auto text-xs">
	<SuperDebug data={$formData} />
</div>
