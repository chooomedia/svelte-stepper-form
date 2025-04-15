// Email Template Generator für N8N
function formatValue(key, value) {
	const mappings = {
		visibility: {
			social_media: 'Social Media',
			search_engines: 'Suchmaschinen',
			local_visibility: 'Lokale Sichtbarkeit'
		},
		advertising_frequency: {
			monthly: 'Monatlich',
			weekly: 'Wöchentlich',
			daily: 'Täglich'
		},
		goals: {
			more_online: 'Mehr Online-Umsatz',
			more_local: 'Mehr lokale Kunden',
			brand_awareness: 'Markenbekanntheit'
		},
		campaign_management: {
			self: 'Eigenständig',
			agency: 'Agentur'
		},
		online_reviews: {
			positive: 'Überwiegend positiv',
			negative: 'Verbesserungsbedarf',
			neutral: 'Neutral'
		}
	};

	return mappings[key] && mappings[key][value] ? mappings[key][value] : value;
}

function getScoreDescription(score) {
	if (score < 30) {
		return 'Ihre digitale Sichtbarkeit hat <strong>erhebliches Verbesserungspotenzial</strong>. Lassen Sie uns gemeinsam Ihre Online-Präsenz auf das nächste Level bringen!';
	} else if (score < 70) {
		return 'Ihre digitale Sichtbarkeit ist <strong>auf einem guten Weg</strong>. Mit unseren gezielten Maßnahmen können wir Ihre Online-Performance signifikant steigern.';
	} else {
		return 'Ihre digitale Sichtbarkeit ist bereits <strong>sehr solide</strong>. Lassen Sie uns gemeinsam die letzten Optimierungen umsetzen, um Ihre Konkurrenz endgültig hinter sich zu lassen!';
	}
}

function getDynamicMetric(type, value) {
	const metrics = {
		visibility: {
			social_media: '+64%',
			search_engines: '+72%',
			default: '+58%'
		},
		goals: {
			more_online: '3x',
			more_local: '2.5x',
			default: '2x'
		},
		implementation_time: {
			immediate: '21',
			default: '45'
		}
	};

	return metrics[type] && metrics[type][value] ? metrics[type][value] : metrics[type].default;
}

function getRecommendations(visibility) {
	if (visibility === 'social_media') {
		return `
        <div class="checklist-item">Optimierung Ihrer Social Media Strategie für maximale Reichweite</div>
        <div class="checklist-item">Content-Plan mit viralen Potenzial für Ihre Zielgruppe</div>
        <div class="checklist-item">Gezielte Ads-Kampagnen mit präzisem Targeting</div>
      `;
	} else if (visibility === 'search_engines') {
		return `
        <div class="checklist-item">SEO-Optimierung für Top-Rankings bei relevanten Keywords</div>
        <div class="checklist-item">Technische Website-Optimierung für bessere Performance</div>
        <div class="checklist-item">Content-Strategie für organisches Wachstum</div>
      `;
	} else {
		return `
        <div class="checklist-item">Ganzheitliche Strategie für maximale digitale Präsenz</div>
        <div class="checklist-item">Kanalübergreifende Content-Planung</div>
        <div class="checklist-item">Performance-basierte Kampagnen-Optimierung</div>
      `;
	}
}

function calcCircleOffset(score) {
	return Math.round(533.8 - (score / 100) * 533.8);
}

function safeGet(obj, path, defaultValue = '') {
	if (!obj) return defaultValue;
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (current[key] === undefined || current[key] === null) {
			return defaultValue;
		}
		current = current[key];
	}

	return current;
}

// Hauptfunktion: Verarbeite die Eingabedaten
try {
	// Die Eingabedaten aus dem Webhook extrahieren
	const inputData = items[0].json.body || {};

	// Stelle sicher, dass alle erforderlichen Daten vorhanden sind (Fehlerbehandlung)
	const templateData = {
		salutation: safeGet(inputData, 'salutation', 'Sehr geehrte/r'),
		last_name: safeGet(inputData, 'last_name', 'Interessent/in'),
		company_name: safeGet(inputData, 'company_name', 'Ihr Unternehmen'),
		company_url: safeGet(inputData, 'company_url', 'Ihre Website'),
		visibility: safeGet(inputData, 'visibility', 'social_media'),
		advertising_frequency: safeGet(inputData, 'advertising_frequency', 'monthly'),
		goals: safeGet(inputData, 'goals', 'more_online'),
		campaign_management: safeGet(inputData, 'campaign_management', 'self'),
		online_reviews: safeGet(inputData, 'online_reviews', 'positive'),
		business_phase: safeGet(inputData, 'business_phase', 'planning'),
		implementation_time: safeGet(inputData, 'implementation_time', 'immediate'),
		visibility_score: parseInt(safeGet(inputData, 'visibility_score', 50)),
		email: safeGet(inputData, 'email', '')
	};

	// Formattierte Daten für den HTML-Node vorbereiten
	const formattedData = {
		// Persönliche Infos
		salutation: templateData.salutation,
		last_name: templateData.last_name,
		company_name: templateData.company_name,
		company_url: templateData.company_url,
		email: templateData.email,

		// Scores und Metriken
		visibility_score: templateData.visibility_score,
		visibility_score_description: getScoreDescription(templateData.visibility_score),
		circle_offset: calcCircleOffset(templateData.visibility_score),

		// Dynamische Metriken für das Dashboard
		visibility_growth: getDynamicMetric('visibility', templateData.visibility),
		roi_metric: getDynamicMetric('goals', templateData.goals),
		time_to_results: getDynamicMetric('implementation_time', templateData.implementation_time),

		// Formatierte Ausgangssituation
		visibility_formatted: formatValue('visibility', templateData.visibility),
		advertising_frequency_formatted: formatValue(
			'advertising_frequency',
			templateData.advertising_frequency
		),
		goals_formatted: formatValue('goals', templateData.goals),
		campaign_management_formatted: formatValue(
			'campaign_management',
			templateData.campaign_management
		),
		online_reviews_formatted: formatValue('online_reviews', templateData.online_reviews),

		// Phasen und Tags
		business_phase: templateData.business_phase,
		implementation_time: templateData.implementation_time,

		// Spezifische Empfehlungen
		recommendations_html: getRecommendations(templateData.visibility)
	};

	// Füge die formatierten Daten zum Item hinzu (für den HTML-Node)
	items[0].json.templateData = formattedData;

	// Füge die Ursprungsdaten ebenfalls bei (falls benötigt)
	items[0].json.originalData = inputData;

	return items;
} catch (error) {
	// Fehlerbehandlung
	console.error('Fehler bei der Verarbeitung der Daten:', error);

	// Stelle sicher, dass immer ein gültiges Item zurückgegeben wird
	if (!items || !items.length) {
		return [{ json: { error: error.message } }];
	}

	items[0].json.error = error.message;
	return items;
}
