// src/lib/utils/confetti.ts
/**
 * Einfache Confetti-Animation utility
 * Basierend auf canvas-confetti Bibliothek, jedoch mit eigenem Implementierung
 * für Svelte-Optimierung und weniger Abhängigkeiten
 */

export interface ConfettiOptions {
	particleCount?: number;
	spread?: number;
	startVelocity?: number;
	decay?: number;
	gravity?: number;
	drift?: number;
	ticks?: number;
	colors?: string[];
	shapes?: ('square' | 'circle')[];
	scalar?: number;
	origin?: {
		x?: number;
		y?: number;
	};
	zIndex?: number;
}

// Default-Parameter
const defaults: ConfettiOptions = {
	particleCount: 50,
	spread: 70,
	startVelocity: 30,
	decay: 0.9,
	gravity: 1,
	drift: 0,
	ticks: 200,
	colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
	shapes: ['square', 'circle'],
	scalar: 1,
	origin: {
		x: 0.5,
		y: 0.5
	},
	zIndex: 100
};

/**
 * Erzeugt eine Confetti-Animation
 * @param options Konfigurations-Optionen
 * @returns Cleanup-Funktion
 */
export default function confetti(customOptions: ConfettiOptions = {}): () => void {
	// Wenn Browser-Umgebung nicht verfügbar ist, gibt leere Cleanup-Funktion zurück
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return () => {};
	}

	// Options mit Defaults zusammenführen
	const options = { ...defaults, ...customOptions };

	// Canvas erstellen
	const canvas = document.createElement('canvas');
	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.pointerEvents = 'none';
	canvas.style.zIndex = options.zIndex?.toString() || '100';
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// In DOM einfügen
	document.body.appendChild(canvas);

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		document.body.removeChild(canvas);
		return () => {};
	}

	// Partikel generieren
	const particles: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		color: string;
		shape: 'square' | 'circle';
		size: number;
		ticks: number;
		opacity: number;
		angle: number;
		angularVelocity: number;
	}> = [];

	const originX = options.origin?.x !== undefined ? options.origin.x : 0.5;
	const originY = options.origin?.y !== undefined ? options.origin.y : 0.5;

	// Partikel erzeugen
	for (let i = 0; i < (options.particleCount || 50); i++) {
		const color =
			options.colors?.[Math.floor(Math.random() * (options.colors.length || 1))] || '#ffffff';
		const shape =
			options.shapes?.[Math.floor(Math.random() * (options.shapes.length || 1))] || 'square';

		// Startwinkel mit Spread
		const angle = Math.PI / 4 + (Math.random() * options.spread! * Math.PI) / 180;

		particles.push({
			x: originX * canvas.width,
			y: originY * canvas.height,
			vx: Math.cos(angle) * (options.startVelocity || 30) * (Math.random() * 0.4 + 0.8),
			vy: Math.sin(angle) * (options.startVelocity || 30) * (Math.random() * 0.4 + 0.8),
			color,
			shape,
			size: Math.random() * 10 + 5,
			ticks: 0,
			opacity: 1,
			angle: Math.random() * 360,
			angularVelocity: Math.random() * 6 - 3
		});
	}

	// Animation starten
	let animationFrame: number;
	let finished = false;

	function update() {
		if (finished) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let particlesStillAlive = false;

		for (const particle of particles) {
			if (particle.ticks >= (options.ticks || 200)) continue;

			particlesStillAlive = true;

			particle.ticks += 1;
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vy += options.gravity || 1;
			particle.vx += options.drift || 0;
			particle.vx *= options.decay || 0.9;
			particle.vy *= options.decay || 0.9;
			particle.opacity = 1 - particle.ticks / (options.ticks || 200);
			particle.angle += particle.angularVelocity;

			ctx.save();
			ctx.translate(particle.x, particle.y);
			ctx.rotate((particle.angle * Math.PI) / 180);
			ctx.globalAlpha = particle.opacity;
			ctx.fillStyle = particle.color;

			if (particle.shape === 'circle') {
				ctx.beginPath();
				ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
				ctx.fill();
			} else {
				ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
			}

			ctx.restore();
		}

		if (particlesStillAlive) {
			animationFrame = requestAnimationFrame(update);
		} else {
			cleanup();
		}
	}

	// Animation starten
	animationFrame = requestAnimationFrame(update);

	// Cleanup-Funktion
	function cleanup() {
		finished = true;
		cancelAnimationFrame(animationFrame);
		if (canvas.parentNode) {
			canvas.parentNode.removeChild(canvas);
		}
	}

	// Automatischer Cleanup nach maximaler Zeit
	setTimeout(cleanup, (options.ticks || 200) * 20);

	return cleanup;
}
