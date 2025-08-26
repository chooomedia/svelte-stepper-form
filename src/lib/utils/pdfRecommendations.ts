// src/lib/utils/pdfRecommendations.ts

export function getRecommendations(visibility: any, goals: any): string {
	let recommendations: string[] = [];

	// Based on visibility
	if (
		visibility === 'social_media' ||
		(Array.isArray(visibility) && visibility.includes('social_media'))
	) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Optimierung Ihrer Social Media Strategie für maximale Reichweite</div>
      </div>
    `);
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Content-Plan mit viralem Potenzial für Ihre Zielgruppe</div>
      </div>
    `);
	}

	if (
		visibility === 'search_engines' ||
		(Array.isArray(visibility) && visibility.includes('search_engines'))
	) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>SEO-Optimierung für Top-Rankings bei relevanten Keywords</div>
      </div>
    `);
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Technische Website-Optimierung für bessere Performance und höhere Konversionsraten</div>
      </div>
    `);
	}

	// Based on goals
	if (goals === 'new_clients' || (Array.isArray(goals) && goals.includes('new_clients'))) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Gezielte Kundenakquise-Strategie mit messbaren Ergebnissen</div>
      </div>
    `);
	}

	if (goals === 'new_employees' || (Array.isArray(goals) && goals.includes('new_employees'))) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Employer Branding für attraktive Arbeitgebermarke</div>
      </div>
    `);
	}

	if (goals === 'more_online' || (Array.isArray(goals) && goals.includes('more_online'))) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Digitale Transformation für mehr Online-Präsenz</div>
      </div>
    `);
	}

	if (goals === 'all' || (Array.isArray(goals) && goals.includes('all'))) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Umfassende Digitalstrategie für alle Bereiche</div>
      </div>
    `);
	}

	// Default recommendations if no specific ones match
	if (recommendations.length === 0) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Professionelle Beratung für Ihre individuellen Bedürfnisse</div>
      </div>
    `);
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Strategische Planung für nachhaltigen Erfolg</div>
      </div>
    `);
	}

	return recommendations.join('');
}
