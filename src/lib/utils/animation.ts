// src/lib/utils/animation.ts
import { cubicOut, elasticOut } from 'svelte/easing';

export interface AnimationOptions {
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
}

// Formatiert die Zeit für den Countdown
export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Standard-Transitions für Modals
export const modalTransitions = {
	fadeIn: { duration: 200, easing: cubicOut },
	fadeOut: { duration: 150, easing: cubicOut },
	scaleIn: { duration: 800, easing: elasticOut },
	flyUp: (delay = 0) => ({ y: 20, duration: 500, delay, easing: cubicOut })
};

// Timer-Management für Animationssequenzen
export class AnimationSequencer {
	private timers: number[] = [];

	add(callback: () => void, delay: number): void {
		const timerId = setTimeout(callback, delay);
		this.timers.push(timerId);
	}

	addInterval(callback: () => boolean, interval: number): void {
		const timerId = setInterval(() => {
			if (callback()) {
				this.clear(timerId);
			}
		}, interval);
		this.timers.push(timerId);
	}

	clear(timerId?: number): void {
		if (timerId) {
			clearTimeout(timerId);
			this.timers = this.timers.filter((id) => id !== timerId);
		} else {
			this.clearAll();
		}
	}

	clearAll(): void {
		this.timers.forEach((timer) => clearTimeout(timer));
		this.timers = [];
	}
}
