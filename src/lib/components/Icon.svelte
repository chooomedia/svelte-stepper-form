<script lang="ts">
	// Erweiterte Icon-Komponente mit Unterstützung für komplexe SVGs

	export let name: string; // Icon name
	export let size: number = 24; // Icon size in pixels
	export let color: string = 'currentColor'; // Icon color
	export let secondaryColor: string = ''; // Optional secondary color for multi-color icons
	export let className: string = ''; // Additional CSS classes

	// Interface für komplexe SVG-Icons mit mehreren Pfaden oder Elementen
	interface ComplexIcon {
		viewBox?: string; // Optional custom viewBox
		content:
			| string
			| Array<{
					type: 'path' | 'circle' | 'rect' | 'line' | 'polyline' | 'polygon' | 'g';
					attrs: Record<string, string | number>; // Element attributes
					children?: Array<{
						type: string;
						attrs: Record<string, string | number>;
					}>;
			  }>;
	}

	// Einfache Pfad-Icons
	const pathIcons: Record<string, string> = {
		heart:
			'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
		lock: 'M9.5 0C12.4823 0 14.9 2.41766 14.9 5.4V8.4011C16.1271 8.40732 16.8163 8.44893 17.362 8.72698C17.9265 9.0146 18.3854 9.47354 18.673 10.038C19 10.6798 19 11.5198 19 13.2V16.6C19 18.2802 19 19.1202 18.673 19.762C18.3854 20.3265 17.9265 20.7854 17.362 21.073C16.7202 21.4 15.8802 21.4 14.2 21.4H4.8C3.11984 21.4 2.27976 21.4 1.63803 21.073C1.07354 20.7854 0.614601 20.3265 0.32698 19.762C0 19.1202 0 18.2802 0 16.6V13.2C0 11.5198 0 10.6798 0.32698 10.038C0.614601 9.47354 1.07354 9.0146 1.63803 8.72698C2.27976 8.4 3.11984 8.4 4.8 8.4H13.1V5.4C13.1 3.41178 11.4882 1.8 9.5 1.8C7.51178 1.8 5.9 3.41178 5.9 5.4V5.5C5.9 5.99706 5.49706 6.4 5 6.4C4.50294 6.4 4.1 5.99706 4.1 5.5V5.4C4.1 2.41766 6.51766 0 9.5 0ZM10.5 15.6324C11.0978 15.2866 11.5 14.6403 11.5 13.9C11.5 12.7954 10.6046 11.9 9.5 11.9C8.39543 11.9 7.5 12.7954 7.5 13.9C7.5 14.6403 7.9022 15.2866 8.5 15.6324V17.4C8.5 17.9523 8.94771 18.4 9.5 18.4C10.0523 18.4 10.5 17.9523 10.5 17.4V15.6324Z',
		shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
		info: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z',
		clock: 'M16 7L12.5 11M8 12L13.25 17L22 7M2 12L7.25 17C7.25 17 8.66939 15.3778 9.875 14',
		alertCircle:
			'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z',
		checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M16 17l-5-5 1.41-1.41L16 14.17l6.59-6.59L24 9'
	};

	// Komplexe Icons mit mehreren Elementen
	const complexIcons: Record<string, ComplexIcon> = {
		// Fragezeichen-Icon mit mehreren Elementen
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

	// Hilfsfunktion zum Rendern von komplexen Icons
	function renderComplexIcon(icon: ComplexIcon) {
		if (typeof icon.content === 'string') {
			// String-basiertes komplexes Icon (für vorab gerenderte SVGs)
			return icon.content;
		} else {
			// Array von Elementen für komplexes Icon
			return icon.content
				.map((element, index) => {
					const { type, attrs, children } = element;

					// Für jedes Element den entsprechenden SVG-Tag generieren
					const Tag = type;
					const props = { ...attrs };

					// Standardattribute hinzufügen, falls nicht definiert
					if (type === 'path' && !props.stroke && !props.fill) {
						props.stroke = color;
					}

					if (children && children.length > 0) {
						return `<${Tag} ${Object.entries(props)
							.map(([key, value]) => `${key}="${value}"`)
							.join(' ')}>
						${children
							.map(
								(child) =>
									`<${child.type} ${Object.entries(child.attrs)
										.map(([key, value]) => `${key}="${value}"`)
										.join(' ')} />`
							)
							.join('')}
					</${Tag}>`;
					} else {
						return `<${Tag} ${Object.entries(props)
							.map(([key, value]) => `${key}="${value}"`)
							.join(' ')} />`;
					}
				})
				.join('');
		}
	}

	// Bestimme das zu verwendende ViewBox
	function getViewBox(iconName: string): string {
		if (complexIcons[iconName]?.viewBox) {
			return complexIcons[iconName].viewBox;
		}
		return '0 0 24 24'; // Standard-ViewBox
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox={getViewBox(name)}
	fill="none"
	stroke={color}
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden="true"
>
	{#if pathIcons[name]}
		<!-- Einfaches Icon mit einem Pfad -->
		<path d={pathIcons[name]} />
	{:else if complexIcons[name]}
		<!-- Komplexes Icon mit mehreren Elementen -->
		{#if typeof complexIcons[name].content === 'string'}
			{@html complexIcons[name].content}
		{:else}
			{#each complexIcons[name].content as element}
				{#if element.type === 'path'}
					<path
						{...element.attrs}
						stroke={element.attrs.stroke || element.attrs.fill ? undefined : color}
					/>
				{:else if element.type === 'circle'}
					<circle
						{...element.attrs}
						stroke={element.attrs.stroke || element.attrs.fill ? undefined : color}
					/>
				{:else if element.type === 'rect'}
					<rect
						{...element.attrs}
						stroke={element.attrs.stroke || element.attrs.fill ? undefined : color}
					/>
				{:else if element.type === 'line'}
					<line {...element.attrs} stroke={element.attrs.stroke || color} />
				{:else if element.type === 'polyline'}
					<polyline {...element.attrs} stroke={element.attrs.stroke || color} />
				{:else if element.type === 'polygon'}
					<polygon
						{...element.attrs}
						stroke={element.attrs.stroke || element.attrs.fill ? undefined : color}
					/>
				{:else if element.type === 'g'}
					<g {...element.attrs}>
						{#if element.children}
							{#each element.children as child}
								{#if child.type === 'path'}
									<path {...child.attrs} />
								{:else if child.type === 'circle'}
									<circle {...child.attrs} />
								{:else if child.type === 'rect'}
									<rect {...child.attrs} />
								{:else if child.type === 'line'}
									<line {...child.attrs} />
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
