<script lang="ts">
	export let name: string;
	export let size: number = 24;
	export let color: string = 'currentColor';
	export let secondaryColor: string = '';
	export let className: string = '';
	export let viewbox: string = '';
	export let fill: string = '';
	export let stroke: string = '';

	interface ComplexIcon {
		viewBox?: string;
		content:
			| string
			| Array<{
					type: 'path' | 'circle' | 'rect' | 'line' | 'polyline' | 'polygon' | 'g';
					attrs: Record<string, string | number>;
					children?: Array<{
						type: string;
						attrs: Record<string, string | number>;
					}>;
			  }>;
	}

	// Einfache Pfad-Icons
	const pathIcons: Record<string, string> = {
		default: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
		heart:
			'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
		lock: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z',
		shield:
			'M9 12L11 14L15 9.99999M20 12C20 16.4611 14.54 19.6937 12.6414 20.683C12.4361 20.79 12.3334 20.8435 12.191 20.8712C12.08 20.8928 11.92 20.8928 11.809 20.8712C11.6666 20.8435 11.5639 20.79 11.3586 20.683C9.45996 19.6937 4 16.4611 4 12V8.21759C4 7.41808 4 7.01833 4.13076 6.6747C4.24627 6.37113 4.43398 6.10027 4.67766 5.88552C4.9535 5.64243 5.3278 5.50207 6.0764 5.22134L11.4382 3.21067C11.6461 3.13271 11.75 3.09373 11.857 3.07827C11.9518 3.06457 12.0482 3.06457 12.143 3.07827C12.25 3.09373 12.3539 3.13271 12.5618 3.21067L17.9236 5.22134C18.6722 5.50207 19.0465 5.64243 19.3223 5.88552C19.566 6.10027 19.7537 6.37113 19.8692 6.6747C20 7.01833 20 7.41808 20 8.21759V12Z',
		info: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z',
		clock: ['M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'M12 8v4l3 3'],
		doubleCheck: 'M16 7L12.5 11M8 12L13.25 17L22 7M2 12L7.25 17C7.25 17 8.66939 15.3778 9.875 14',
		closeX: 'M6 18L18 6M6 6l12 12',
		alertCircle:
			'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z',
		checkCircle:
			'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
		check: 'M5 13l4 4L19 7',
		share:
			'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
		cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
		calendar:
			'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
		code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
		round: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		deviceDesktop:
			'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
		mapPin: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
		fileText:
			'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
		trendingUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
		edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
		award:
			'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		barChart2:
			'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
		repeat:
			'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
		zap: 'M13 10V3L4 14h7v7l9-11h-7z',
		plusCircle:
			'M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z',
		document:
			'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
		thunder: 'M13 10V3L4 14h7v7l9-11h-7z',
		defconRight: 'M9 5l7 7-7 7',
		arrowRight:
			'M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z',
		users:
			'M16 17.25c2.17 0 3.96 1.57 4.42 3.62a.75.75 0 0 1-.73.88H4.31a.75.75 0 0 1-.73-.88c.46-2.05 2.25-3.62 4.42-3.62h8zM12 2a5.25 5.25 0 1 1 0 10.5A5.25 5.25 0 0 1 12 2z',
		experience:
			'M12 3L1 9l11 6 9-4.9V17h2V9l-11-6zm0 12.5L4.24 9.74 2 11l10 5.5L22 11l-2.24-1.26L12 15.5zm6 2.5l-6 3-6-3v2.5l6 3 6-3V18z',
		alertTriangle:
			'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
		star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
	};

	// Komplexe Icons mit mehreren Elementen
	const complexIcons: Record<string, ComplexIcon> = {
		question: {
			content: [
				{
					type: 'circle',
					attrs: { cx: '12', cy: '12', r: '10', fill: 'none' }
				},
				{
					type: 'path',
					attrs: {
						d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
						strokeLinecap: 'round'
					}
				},
				{
					type: 'line',
					attrs: { x1: '12', y1: '17', x2: '12.01', y2: '17', strokeLinecap: 'round' }
				}
			]
		},
		// Beispiel eines Icons mit einer Gruppe und verschachtelten Elementen
		settings: {
			content: [
				{
					type: 'path',
					attrs: {
						d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
						fill: 'none'
					}
				},
				{
					type: 'circle',
					attrs: { cx: '12', cy: '12', r: '3', fill: 'none' }
				}
			]
		},
		// PayPal icon mit komplexer Darstellung
		paypalComplex: {
			viewBox: '0 0 24 24',
			content: [
				{
					type: 'path',
					attrs: {
						d: 'M6.908 4.786A8.277 8.277 0 0 0 6.25 6.25c-1.389 3.472-1.333 10.5 9.25 10.5v3.75L21 15l-5.5-5.5v3.75c-5.806 0-7.139-3.083-6.167-6.167.306-.972 1.094-2.486 1.094-2.486 0 .195-1.75.195-3.519.189z',
						fill: secondaryColor || '#002F87'
					}
				},
				{
					type: 'path',
					attrs: {
						d: 'M20.452 7.5h-3.866c-.34 0-.5.16-.63.3-.13.17-.24.44-.27.8L14.5 12.5h2.141l.31-1.89c.017-.09.077-.1.143-.1h1.456c.626 0 1.11-.63 1.11-1.28l.009-.21c.062-1.106-.532-1.52-1.217-1.52M17.337 9.75h-1.0l.037-.2c.027-.1.097-.1.157-.1h.7c.044 0 .23 0 .23.15 0 .15-.124.15-.124.15',
						fill: secondaryColor || '#009BE0'
					}
				},
				{
					type: 'path',
					attrs: {
						d: 'M3.5 7.5v9h2v-4h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-4zm2.5 3h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1v2z',
						fill: color
					}
				}
			]
		},
		// Visa-Logo als komplexes Icon
		visaComplex: {
			viewBox: '0 0 24 24',
			content: [
				{
					type: 'path',
					attrs: {
						d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
						fill: 'none'
					}
				},
				{
					type: 'path',
					attrs: {
						d: 'M9 13.5l2-7h2l-2 7h-2zm7 0l2-7h2l-2 7h-2zm-10 0l-2-7h2l2 7h-2z',
						fill: secondaryColor || '#1434CB'
					}
				},
				{
					type: 'path',
					attrs: {
						d: 'M18.5 9.5h-1l-.5 2h2l-.5-2z',
						fill: secondaryColor || '#1434CB'
					}
				}
			]
		}
	};

	// Bestimme das zu verwendende ViewBox
	function getViewBox(iconName: string): string {
		if (complexIcons[iconName]?.viewBox) {
			return complexIcons[iconName].viewBox;
		}
		return '0 0 24 24'; // Standard-ViewBox
	}

	const shouldUseFill = fill !== '' || name === 'info' || name === 'lock';
	const effectiveFill = fill || (shouldUseFill ? color : 'none');
	const effectiveStroke = stroke || (shouldUseFill ? 'none' : color);
	const iconContent = pathIcons[name] || pathIcons.default;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox={getViewBox(name)}
	fill={effectiveFill || fill || color}
	stroke={effectiveStroke}
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden="true"
>
	{#if pathIcons[name]}
		{#if Array.isArray(pathIcons[name])}
			{#each pathIcons[name] as pathData}
				<path d={pathData} />
			{/each}
		{:else}
			<path fill-rule="evenodd" d={pathIcons[name]} />
		{/if}
	{:else if complexIcons[name]}
		<!-- Komplexes Icon mit mehreren Elementen -->
		{#if typeof complexIcons[name].content === 'string'}
			{@html complexIcons[name].content}
		{:else}
			{#each complexIcons[name].content as element}
				{#if element.type === 'path'}
					<path
						{...element.attrs}
						stroke={element.attrs.stroke || (element.attrs.fill ? undefined : effectiveStroke)}
						fill={element.attrs.fill || (element.attrs.stroke ? 'none' : effectiveFill)}
					/>
				{:else if element.type === 'circle'}
					<circle
						{...element.attrs}
						stroke={element.attrs.stroke || (element.attrs.fill ? undefined : effectiveStroke)}
						fill={element.attrs.fill || (element.attrs.stroke ? 'none' : effectiveFill)}
					/>
				{:else if element.type === 'rect'}
					<rect
						{...element.attrs}
						stroke={element.attrs.stroke || (element.attrs.fill ? undefined : effectiveStroke)}
						fill={element.attrs.fill || (element.attrs.stroke ? 'none' : effectiveFill)}
					/>
				{:else if element.type === 'line'}
					<line {...element.attrs} stroke={element.attrs.stroke || effectiveStroke} />
				{:else if element.type === 'polyline'}
					<polyline {...element.attrs} stroke={element.attrs.stroke || effectiveStroke} />
				{:else if element.type === 'polygon'}
					<polygon
						{...element.attrs}
						stroke={element.attrs.stroke || (element.attrs.fill ? undefined : effectiveStroke)}
						fill={element.attrs.fill || (element.attrs.stroke ? 'none' : effectiveFill)}
					/>
				{:else if element.type === 'g'}
					<g {...element.attrs}>
						{#if element.children}
							{#each element.children as child}
								{#if child.type === 'path'}
									<path
										{...child.attrs}
										stroke={child.attrs.stroke || (child.attrs.fill ? undefined : effectiveStroke)}
										fill={child.attrs.fill || (child.attrs.stroke ? 'none' : effectiveFill)}
									/>
								{:else if child.type === 'circle'}
									<circle
										{...child.attrs}
										stroke={child.attrs.stroke || (child.attrs.fill ? undefined : effectiveStroke)}
										fill={child.attrs.fill || (child.attrs.stroke ? 'none' : effectiveFill)}
									/>
								{:else if child.type === 'rect'}
									<rect
										{...child.attrs}
										stroke={child.attrs.stroke || (child.attrs.fill ? undefined : effectiveStroke)}
										fill={child.attrs.fill || (child.attrs.stroke ? 'none' : effectiveFill)}
									/>
								{:else if child.type === 'line'}
									<line {...child.attrs} stroke={child.attrs.stroke || effectiveStroke} />
								{/if}
							{/each}
						{/if}
					</g>
				{/if}
			{/each}
		{/if}
	{:else}
		<!-- Fallback Icon, wenn keine Übereinstimmung gefunden wurde -->
		<circle cx="12" cy="12" r="10" />
		<line x1="12" y1="8" x2="12" y2="16" />
		<line x1="8" y1="12" x2="16" y2="12" />
	{/if}
</svg>
