// src/lib/utils/scoring.ts
import { writable, derived } from 'svelte/store';
import type { FormData } from '$lib/schema';
import { formOptions } from '$lib/schema';
import { env } from '$lib/config/env';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AnalysisData {
	websiteScore: number;
	formScore: number;
	finalScore: number;
	rawData: any | null;
	auditData: any | null;
	isComplete: boolean;
	error: string | null;
	screenshot: string | null;
	metrics: {
		performance: number;
		seo: number;
		accessibility: number;
		bestPractices: number;
		content: number;
		security: number;
	};
}

interface ScoringConfig {
	websiteWeight: number;
	formWeight: number;
	marketWeight: number;
	performanceThresholds: {
		excellent: number;
		good: number;
		average: number;
		poor: number;
	};
	industryMultipliers: Record<string, number>;
	businessPhaseMultipliers: Record<string, number>;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const SCORING_CONFIG: ScoringConfig = {
	websiteWeight: 0.4, // 40% - Technische Qualität
	formWeight: 0.35, // 35% - Geschäftliche Relevanz
	marketWeight: 0.25, // 25% - Marktpositionierung

	performanceThresholds: {
		excellent: 90,
		good: 70,
		average: 50,
		poor: 30
	},

	industryMultipliers: {
		'e-commerce': 1.2,
		services: 1.1,
		manufacturing: 0.9,
		healthcare: 1.0,
		education: 1.1,
		'real-estate': 1.0,
		finance: 1.2,
		technology: 1.3
	},

	businessPhaseMultipliers: {
		planning: 0.8,
		less_than_6_months: 0.9,
		more_than_6_months: 1.0,
		family_business: 1.1
	}
};

// ============================================================================
// SCORING CALCULATIONS
// ============================================================================

/**
 * Berechnet Score basierend auf Icon-Inputs der vorherigen Steps
 */
export function calculateIconBasedScore(formData: Partial<FormData>): number {
	if (!formData) return 0;

	const scoringSteps = [
		{ field: 'visibility', weight: 25, calculator: calculateVisibilityScoreFromArray },
		{ field: 'advertising_frequency', weight: 20, calculator: calculateFrequencyScore },
		{ field: 'goals', weight: 15, calculator: calculateGoalsScore },
		{ field: 'campaign_management', weight: 15, calculator: calculateManagementScore },
		{ field: 'online_reviews', weight: 10, calculator: calculateReviewsScore },
		{ field: 'previous_campaigns', weight: 10, calculator: calculateCampaignsScore },
		{ field: 'business_phase', weight: 5, calculator: calculatePhaseScore }
	];

	let totalScore = 0;
	let totalWeight = 0;

	for (const step of scoringSteps) {
		const value = formData[step.field as keyof FormData];
		if (value) {
			const score = step.calculator(value);
			totalScore += score * step.weight;
			totalWeight += step.weight;
		}
	}

	return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Berechnet Visibility Score basierend auf Marktforschung
 */
function calculateVisibilityScoreFromArray(visibility: string | string[]): number {
	if (!visibility) return 0;

	const visibilityArray = Array.isArray(visibility) ? visibility : [visibility];
	const visibilityWeights: Record<string, number> = {
		search_engines: 40,
		social_media: 30,
		print: 15,
		store: 10,
		other: 5
	};

	let score = 0;
	let totalWeight = 0;

	visibilityArray.forEach((option) => {
		const weight = visibilityWeights[option] || 0;
		score += weight;
		totalWeight += weight;
	});

	return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}

function calculateFrequencyScore(frequency: string | string[]): number {
	const frequencyValue = Array.isArray(frequency) ? frequency[0] : frequency;
	const frequencyScores: Record<string, number> = {
		weekly: 90,
		monthly: 70,
		yearly: 40,
		never: 10
	};

	return frequencyScores[frequencyValue || ''] || 0;
}

function calculateGoalsScore(goals: string | string[]): number {
	const goalsValue = Array.isArray(goals) ? goals[0] : goals;
	const goalsScores: Record<string, number> = {
		more_online: 85,
		new_clients: 80,
		new_employees: 75,
		all: 70
	};

	return goalsScores[goalsValue || ''] || 0;
}

function calculateManagementScore(management: string | string[]): number {
	const managementValue = Array.isArray(management) ? management[0] : management;
	const managementScores: Record<string, number> = {
		digitalpusher: 95,
		employee: 70,
		self: 50,
		other: 60
	};

	return managementScores[managementValue || ''] || 0;
}

function calculateReviewsScore(reviews: string | string[]): number {
	const reviewsValue = Array.isArray(reviews) ? reviews[0] : reviews;
	const reviewsScores: Record<string, number> = {
		positive: 85,
		negative: 30,
		none: 50,
		mixed: 60
	};

	return reviewsScores[reviewsValue || ''] || 0;
}

function calculateCampaignsScore(campaigns: string | string[]): number {
	const campaignsValue = Array.isArray(campaigns) ? campaigns[0] : campaigns;
	const campaignsScores: Record<string, number> = {
		yes: 80,
		no: 40,
		planning: 60
	};

	return campaignsScores[campaignsValue || ''] || 0;
}

function calculatePhaseScore(phase: string | string[]): number {
	const phaseValue = Array.isArray(phase) ? phase[0] : phase;
	const phaseScores: Record<string, number> = {
		planning: 60,
		less_than_6_months: 70,
		more_than_6_months: 80,
		family_business: 85
	};

	return phaseScores[phaseValue || ''] || 0;
}

/**
 * Erweiterte Scoring-Funktion basierend auf Marktforschung
 */
export function calculateAdvancedScore(websiteData: any, formData: Partial<FormData>): number {
	const websiteScore = calculateWebsitePerformanceScore(websiteData);
	const iconBasedScore = calculateIconBasedScore(formData);
	const marketScore = calculateMarketPositioningScore(formData, websiteData);

	const finalScore = Math.round(
		websiteScore * SCORING_CONFIG.websiteWeight +
			iconBasedScore * SCORING_CONFIG.formWeight +
			marketScore * SCORING_CONFIG.marketWeight
	);

	return Math.max(0, Math.min(100, finalScore));
}

/**
 * Berechnet Website-Performance Score basierend auf technischen Metriken
 */
function calculateWebsitePerformanceScore(websiteData: any): number {
	if (!websiteData) return 0;

	const metrics = extractDetailedMetrics(websiteData);
	const weights = {
		performance: 0.25,
		seo: 0.3,
		accessibility: 0.15,
		bestPractices: 0.2,
		content: 0.1
	};

	let totalScore = 0;
	let totalWeight = 0;

	for (const [metric, weight] of Object.entries(weights)) {
		const score = metrics[metric] || 0;
		totalScore += score * weight;
		totalWeight += weight;
	}

	return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Berechnet Marktpositionierungs-Score basierend auf Wettbewerbsanalyse
 */
function calculateMarketPositioningScore(formData: Partial<FormData>, websiteData: any): number {
	let score = 50; // Basis-Score

	// Branchenanalyse
	const industryMultiplier = detectIndustryMultiplier(websiteData);
	score *= industryMultiplier;

	// Geschäftsphasen-Bewertung
	const phaseMultiplier =
		SCORING_CONFIG.businessPhaseMultipliers[
			formData?.business_phase as keyof typeof SCORING_CONFIG.businessPhaseMultipliers
		] || 1.0;
	score *= phaseMultiplier;

	// Online-Präsenz-Bewertung
	if (formData?.visibility === 'search_engines') {
		score += 15;
	} else if (formData?.visibility === 'social_media') {
		score += 10;
	}

	// Implementierungszeit-Bewertung
	if (formData?.implementation_time === 'immediate') {
		score += 5;
	} else if (formData?.implementation_time === 'long_term') {
		score -= 5;
	}

	// Erfahrungs-Bewertung
	if (formData?.previous_campaigns === 'yes') {
		score += 10;
	} else if (formData?.previous_campaigns === 'no') {
		score -= 5;
	}

	return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Erkennt Branchen-Multiplikator basierend auf Website-Daten
 */
function detectIndustryMultiplier(websiteData: any): number {
	if (!websiteData) return 1.0;

	const content = JSON.stringify(websiteData).toLowerCase();

	if (content.includes('shop') || content.includes('cart') || content.includes('payment')) {
		return SCORING_CONFIG.industryMultipliers['e-commerce'];
	}

	if (content.includes('software') || content.includes('app') || content.includes('digital')) {
		return SCORING_CONFIG.industryMultipliers['technology'];
	}

	if (content.includes('bank') || content.includes('finance') || content.includes('investment')) {
		return SCORING_CONFIG.industryMultipliers['finance'];
	}

	return 1.0;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extrahiert detaillierte Metriken aus API-Response
 */
export function extractDetailedMetrics(data: any): any {
	const metrics = {
		performance: 0,
		seo: 0,
		accessibility: 0,
		bestPractices: 0,
		content: 0,
		security: 0
	};

	try {
		if (data?.lighthouseResult?.categories) {
			const categories = data.lighthouseResult.categories;
			metrics.performance = Math.round((categories.performance?.score || 0) * 100);
			metrics.seo = Math.round((categories.seo?.score || 0) * 100);
			metrics.accessibility = Math.round((categories.accessibility?.score || 0) * 100);
			metrics.bestPractices = Math.round((categories['best-practices']?.score || 0) * 100);
		}

		if (data?.detailed_scores) {
			const scores = data.detailed_scores;
			const contentFactors = [
				scores.meta_description || 0,
				scores.h1 || 0,
				scores.alt_attributes || 0
			];
			metrics.content = Math.round(
				contentFactors.reduce((sum, score) => sum + score, 0) / contentFactors.length
			);
			metrics.security = scores.canonical ? 100 : 50;
		}

		return metrics;
	} catch (error) {
		console.error('Error extracting metrics:', error);
		return metrics;
	}
}

/**
 * Extrahiert Score aus API-Response
 */
export function extractScoreFromResponse(data: any): number {
	if (!data) return 0;

	if (Array.isArray(data) && data.length > 0) {
		const scoreObject = data.find((item) => 'overall_score' in item);
		if (scoreObject && typeof scoreObject.overall_score === 'number') {
			return scoreObject.overall_score;
		}
	}

	if (data.score && typeof data.score === 'number') {
		return data.score;
	}

	return 0;
}

/**
 * Extrahiert Screenshot aus API-Response
 */
export function extractScreenshot(data: any): string | null {
	if (!data) return null;

	try {
		// Verschiedene Screenshot-Pfade versuchen
		const screenshotPaths = [
			'lighthouseResult.audits.final-screenshot.details.data',
			'lighthouse_report.audits.final-screenshot.details.data',
			'info.screenshot',
			'screenshot'
		];

		for (const path of screenshotPaths) {
			const value = path.split('.').reduce((obj, key) => obj?.[key], data);
			if (value && typeof value === 'string') {
				return value;
			}
		}

		// Array-Response durchsuchen
		if (Array.isArray(data)) {
			for (const item of data) {
				const screenshot = extractScreenshot(item);
				if (screenshot) return screenshot;
			}
		}
	} catch (error) {
		console.warn('Could not extract screenshot from data:', error);
	}

	return null;
}

/**
 * Generiert Fallback-Audit-Daten
 * @param score - Der Score-Wert
 * @param url - Optionale URL. Wenn nicht angegeben, wird ein generischer Platzhalter verwendet
 */
export function getFallbackAuditData(score: number, url?: string) {
	const performanceScore = Math.min(0.9, Math.max(0.4, score / 100));

	// Verwende die übergebene URL oder einen generischen Platzhalter
	let displayUrl = 'N/A';
	if (url && url.trim() !== '') {
		// Entferne Protokoll und trailing slash für saubere Darstellung
		displayUrl = url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
		if (displayUrl.startsWith('www.')) {
			displayUrl = displayUrl.substring(4);
		}
	}

	return {
		url: displayUrl,
		score: score,
		lighthouse_report: {
			categories: {
				performance: { score: performanceScore },
				seo: { score: score >= 70 ? 0.85 : score >= 50 ? 0.65 : 0.45 },
				accessibility: { score: score >= 70 ? 0.75 : score >= 50 ? 0.55 : 0.35 },
				'best-practices': { score: score >= 70 ? 0.8 : score >= 50 ? 0.6 : 0.4 }
			},
			audits: {
				'first-contentful-paint': { score: performanceScore * 0.9 },
				'largest-contentful-paint': { score: performanceScore * 0.85 },
				'speed-index': { score: performanceScore * 0.95 },
				'total-blocking-time': { score: performanceScore * 0.8 },
				'cumulative-layout-shift': { score: performanceScore * 1.1 },
				'final-screenshot': { details: { data: null } }
			}
		},
		detailed_scores: {
			title: score >= 70 ? 90 : 50,
			meta_description: score >= 60 ? 95 : 70,
			h1: score >= 65 ? 100 : 60,
			alt_attributes: score >= 50 ? 80 : 40,
			canonical: score >= 80 ? 100 : 90,
			links: score >= 75 ? 90 : 60
		},
		security_headers: {
			grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
		}
	};
}

// ============================================================================
// STORE MANAGEMENT
// ============================================================================

const createScoreStore = () => {
	const initialState: AnalysisData = {
		websiteScore: 0,
		formScore: 0,
		finalScore: 0,
		rawData: null,
		auditData: null,
		isComplete: false,
		error: null,
		screenshot: null,
		metrics: {
			performance: 0,
			seo: 0,
			accessibility: 0,
			bestPractices: 0,
			content: 0,
			security: 0
		}
	};

	const { subscribe, set, update } = writable<AnalysisData>(initialState);

	return {
		subscribe,
		setWebsiteAnalysis: (data: any, formData: Partial<FormData>) => {
			update((state) => {
				const screenshot = extractScreenshot(data);
				const metrics = extractDetailedMetrics(data);
				const finalScore = calculateAdvancedScore(data, formData);
				const websiteScore = calculateWebsitePerformanceScore(data);
				const businessScore = calculateIconBasedScore(formData);
				const marketScore = calculateMarketPositioningScore(formData, data);
				// Verwende die URL aus formData, falls verfügbar
				const url = formData?.company_url || data?.url || undefined;
				const auditData = data || getFallbackAuditData(finalScore, url);

				console.log('🔍 Erweiterte Scoring-Analyse:', {
					websiteScore,
					businessScore,
					marketScore,
					finalScore
				});

				return {
					...state,
					websiteScore,
					formScore: businessScore,
					finalScore,
					metrics,
					rawData: data,
					auditData,
					isComplete: true,
					error: null,
					screenshot
				};
			});
		},
		updateFormScore: (formData: Partial<FormData>) => {
			update((state) => {
				const businessScore = calculateIconBasedScore(formData);
				const finalScore =
					state.websiteScore > 0 ? calculateAdvancedScore(state.rawData, formData) : businessScore;
				// Verwende die URL aus formData oder aus vorhandenen auditData
				const url = formData?.company_url || state.auditData?.url || undefined;
				const auditData = state.auditData || getFallbackAuditData(finalScore, url);

				return {
					...state,
					formScore: businessScore,
					finalScore,
					auditData,
					isComplete: true
				};
			});
		},
		getState: () => {
			let currentState: AnalysisData | null = null;
			subscribe((state) => {
				currentState = state;
			})();
			return currentState;
		}
	};
};

export const scoreStore = createScoreStore();
export const visibilityScore = derived(scoreStore, ($scoreStore) => $scoreStore.finalScore);
export const websiteScreenshot = derived(scoreStore, ($scoreStore) => $scoreStore.screenshot);

/**
 * Helper function to update form and store simultaneously
 */
export function updateVisibilityScore(formData: Partial<FormData>, form: any) {
	const score = calculateIconBasedScore(formData);

	if (form && typeof form.update === 'function') {
		form.update((data) => ({
			...data,
			data: {
				...data.data,
				visibility_score: score
			}
		}));
	}

	scoreStore.updateFormScore(formData);
	return score;
}

/**
 * @deprecated Debug-Funktion für API-Antwort-Struktur-Analyse
 */
export function analyzeResponseStructure(data: any): void {
	if (!data) {
		console.log('Keine Daten vorhanden');
		return;
	}

	console.group('API-Antwort Struktur-Analyse');

	// Bestimme den Typ der Daten
	if (Array.isArray(data)) {
		console.log(`Antwort ist ein Array mit ${data.length} Elementen`);

		// Analysiere das erste Element
		if (data.length > 0) {
			console.log('Struktur des ersten Elements:');
			logObjectKeys(data[0], 1);
		}
	} else if (typeof data === 'object') {
		console.log('Antwort ist ein Objekt');
		logObjectKeys(data, 1);
	} else {
		console.log(`Antwort ist ein primitiver Typ: ${typeof data}`);
	}

	// Suche nach Screenshot-relevanten Pfaden
	const screenshotPaths = findPaths(data, 'screenshot');
	const auditPaths = findPaths(data, 'audit');
	const imagePaths = findPaths(data, 'image');

	console.log('Mögliche Screenshot-Pfade:', screenshotPaths);
	console.log('Pfade mit "audit":', auditPaths);
	console.log('Pfade mit "image":', imagePaths);

	console.groupEnd();
}

/**
 * Hilfsfunktion zum Ausgeben von Objektschlüsseln
 */
function logObjectKeys(obj: any, depth: number, maxDepth: number = 2) {
	if (depth > maxDepth || !obj || typeof obj !== 'object') return;

	Object.keys(obj).forEach((key) => {
		const value = obj[key];
		const valueType = Array.isArray(value) ? `Array(${value.length})` : typeof value;
		console.log(`${'  '.repeat(depth)}${key}: ${valueType}`);

		if (typeof value === 'object' && value !== null) {
			logObjectKeys(value, depth + 1, maxDepth);
		}
	});
}

/**
 * Hilfsfunktion zum Finden von Pfaden, die einen bestimmten String enthalten
 */
function findPaths(obj: any, searchTerm: string, currentPath: string = ''): string[] {
	let results: string[] = [];

	if (!obj || typeof obj !== 'object') return results;

	Object.keys(obj).forEach((key) => {
		const newPath = currentPath ? `${currentPath}.${key}` : key;

		if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
			results.push(newPath);
		}

		if (typeof obj[key] === 'object' && obj[key] !== null) {
			results = [...results, ...findPaths(obj[key], searchTerm, newPath)];
		}
	});

	return results;
}
