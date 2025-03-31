// src/lib/utils/confetti.ts
/**
 * Verbesserte Confetti-Animation mit höherem z-Index und angepassten Farben
 * Angepasst für eine Anzeige vor dem Modal-Overlay
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
	shapes?: ('square' | 'circle' | 'star')[];
	scalar?: number;
	origin?: {
		x?: number;
		y?: number;
	};
	zIndex?: number;
	duration?: number;
	primaryColor?: string;
	secondaryColor?: string;
}

// Default-Parameter
const defaults: ConfettiOptions = {
	particleCount: 100, // Mehr Partikel
	spread: 120, // Breitere Streuung
	startVelocity: 25, // Langsamer Start
	decay: 0.94, // Langsamerer Abfall
	gravity: 0.7, // Angepasste Gravitation
	drift: 0,
	ticks: 500, // Längere Lebensdauer
	colors: [], // Wird dynamisch basierend auf primary/secondary gesetzt
	shapes: ['square', 'circle', 'star'],
	scalar: 1.2, // Größere Partikel
	origin: {
		x: 0.5,
		y: 0.5
	},
	zIndex: 9999, // Extrem hoher z-Index, um vor dem Modal zu sein
	duration: 10000, // Längere Animation
	primaryColor: '#3B82F6', // Default Blau (primary)
	secondaryColor: '#10B981' // Default Grün (secondary)
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

	// Wenn keine Farben übergeben wurden, erstelle eine Palette aus Primary und Secondary
	if (!options.colors || options.colors.length === 0) {
		options.colors = [
			options.primaryColor || '#3B82F6', // Primary blue
			options.secondaryColor || '#10B981', // Secondary green
			options.primaryColor || '#3B82F6', // Wiederhole die Hauptfarbe
			options.secondaryColor || '#10B981', // Wiederhole die Sekundärfarbe
			'#FFFFFF', // Weiß für Kontrast
			'#F1F5F9', // Leichtes Grau
			options.primaryColor + '80', // Primary mit Transparenz
			options.secondaryColor + '80' // Secondary mit Transparenz
		];
	}

	// Canvas erstellen mit sehr hohem z-Index
	const canvas = document.createElement('canvas');
	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.pointerEvents = 'none';
	canvas.style.zIndex = options.zIndex?.toString() || '9999'; // Extrem hoher z-Index
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
		shape: 'square' | 'circle' | 'star';
		size: number;
		ticks: number;
		opacity: number;
		angle: number;
		angularVelocity: number;
	}> = [];

	const originX = options.origin?.x !== undefined ? options.origin.x : 0.5;
	const originY = options.origin?.y !== undefined ? options.origin.y : 0.5;

	// Funktion zum Zeichnen eines Sterns
	function drawStar(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		size: number,
		rot: number
	) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rot);

		ctx.beginPath();
		for (let i = 0; i < 5; i++) {
			const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
			const outerX = Math.cos(angle) * size;
			const outerY = Math.sin(angle) * size;

			if (i === 0) {
				ctx.moveTo(outerX, outerY);
			} else {
				ctx.lineTo(outerX, outerY);
			}

			const innerAngle = angle + Math.PI / 5;
			const innerX = Math.cos(innerAngle) * (size / 2.5);
			const innerY = Math.sin(innerAngle) * (size / 2.5);

			ctx.lineTo(innerX, innerY);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	// Partikel erzeugen
	for (let i = 0; i < (options.particleCount || 100); i++) {
		const color =
			options.colors?.[Math.floor(Math.random() * (options.colors.length || 1))] || '#ffffff';

		// Verbesserte Formauswahl
		const shapes = options.shapes || ['square', 'circle'];
		const shape = shapes[Math.floor(Math.random() * shapes.length)] as 'square' | 'circle' | 'star';

		// Startwinkel mit Spread
		const angle = Math.random() * 2 * Math.PI; // Vollständig zufällige Richtungen

		// Variablere Geschwindigkeit für natürlicheren Effekt
		const velocityFactor = Math.random() * 0.6 + 0.7; // 0.7 - 1.3 Faktor

		particles.push({
			x: originX * canvas.width,
			y: originY * canvas.height,
			vx: Math.cos(angle) * (options.startVelocity || 25) * velocityFactor,
			vy: Math.sin(angle) * (options.startVelocity || 25) * velocityFactor,
			color,
			shape,
			size: Math.random() * 12 + 5, // Größere Partikel
			ticks: 0,
			opacity: 1,
			angle: Math.random() * 360,
			angularVelocity: (Math.random() * 6 - 3) * 0.5 // Korrekte Rotation
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
			if (particle.ticks >= (options.ticks || 500)) continue;

			particlesStillAlive = true;

			particle.ticks += 1;
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vy += options.gravity || 0.7;
			particle.vx += options.drift || 0;
			particle.vx *= options.decay || 0.94;
			particle.vy *= options.decay || 0.94;
			particle.opacity = 1 - particle.ticks / (options.ticks || 500);
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
			} else if (particle.shape === 'star') {
				drawStar(ctx, 0, 0, particle.size, 0);
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
	setTimeout(cleanup, options.duration || 10000);

	return cleanup;
}

// Helfer-Funktion für eine spektakulärere Confetti-Animation
export function celebrationConfetti(primaryColor = '#3B82F6', secondaryColor = '#10B981') {
	// Erste Welle - viele primary und secondary Farben
	confetti({
		particleCount: 180,
		spread: 160,
		origin: { y: 0.6 },
		primaryColor,
		secondaryColor,
		startVelocity: 30,
		decay: 0.94,
		gravity: 0.7,
		shapes: ['square', 'circle'] // Einfachere Formen für die Hauptwelle
	});

	// Zweite Welle nach einer kurzen Verzögerung - von links
	setTimeout(() => {
		confetti({
			particleCount: 120,
			spread: 120,
			origin: { y: 0.7, x: 0.1 },
			primaryColor,
			secondaryColor,
			startVelocity: 25,
			gravity: 0.65,
			scalar: 1.1
		});
	}, 700);

	// Dritte Welle von der anderen Seite - von rechts
	setTimeout(() => {
		confetti({
			particleCount: 120,
			spread: 120,
			origin: { y: 0.7, x: 0.9 },
			primaryColor,
			secondaryColor,
			startVelocity: 25,
			gravity: 0.65,
			scalar: 1.1
		});
	}, 1400);

	// Vierte Welle mit Sternen von oben
	setTimeout(() => {
		confetti({
			particleCount: 80,
			spread: 180,
			origin: { y: 0, x: 0.5 },
			shapes: ['star'],
			colors: [primaryColor, secondaryColor, 'gold', 'silver'],
			startVelocity: 35,
			gravity: 0.3,
			scalar: 1.3,
			ticks: 600
		});
	}, 2100);

	// Große Finale-Welle aus der Mitte
	setTimeout(() => {
		confetti({
			particleCount: 250,
			spread: 360,
			origin: { y: 0.5, x: 0.5 },
			startVelocity: 40,
			gravity: 0.5,
			ticks: 800,
			primaryColor,
			secondaryColor,
			shapes: ['square', 'circle', 'star'],
			scalar: 1.5,
			duration: 12000 // Extra lange Dauer für das Finale
		});
	}, 3000);
}
