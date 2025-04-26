// src/lib/utils/pdfGenerator.ts
import type { FormData } from '$lib/schema';

/**
 * Creates HTML template for PDF generation
 * This follows email client best practices for maximum compatibility
 *
 * @param formData The form data to include in the PDF
 * @returns HTML string ready for PDF rendering
 */
export function createPdfTemplate(formData: Partial<FormData>): string {
	// Ensure we have a valid score
	const score = Math.min(Math.max(formData.visibility_score || 50, 0), 100);

	// Get a color based on the score
	const scoreColor = getScoreColor(score);

	// Format the company name or use a fallback
	const companyName = formData.company_name || 'Ihr Unternehmen';

	// Format the company URL
	const companyUrl = formatUrl(formData.company_url || '');

	// Format the date
	const date = new Date().toLocaleDateString('de-DE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	// Build the HTML template with inline CSS for maximum compatibility
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Website-Analyse für ${companyName}</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background-color: #6BD0D9;
      padding: 20px;
      text-align: center;
      color: #002B2F;
    }
    
    .content {
      padding: 20px;
    }
    
    h1, h2, h3 {
      color: #002B2F;
    }
    
    .score-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .score-circle {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      border-radius: 50%;
      border: 15px solid ${scoreColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      color: ${scoreColor};
    }
    
    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .metric {
      flex: 1;
      text-align: center;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      margin: 0 10px;
    }
    
    .metric h3 {
      margin: 0 0 5px 0;
      font-size: 16px;
    }
    
    .metric .value {
      font-size: 24px;
      font-weight: bold;
      color: #6BD0D9;
      margin: 5px 0;
    }
    
    .recommendations {
      margin: 20px 0;
    }
    
    .recommendation-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .recommendation-icon {
      width: 24px;
      height: 24px;
      background-color: #6BD0D9;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      font-weight: bold;
    }
    
    .current-situation {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .situation-item {
      margin-bottom: 8px;
    }
    
    .situation-label {
      font-weight: bold;
      color: #002B2F;
    }
    
    .footer {
      background-color: #f3f4f6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }
    
    .cta-container {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background-color: #f3f4f6;
      border-radius: 8px;
    }
    
    .cta-button {
      display: inline-block;
      background-color: #6BD0D9;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Website-Analyse für ${companyName}</h1>
      <p>Ergebnisse vom ${date}</p>
    </div>
    
    <div class="content">
      <div class="score-container">
        <h2>Ihr Visibility Score: ${score}/100</h2>
        <div class="score-circle">
          ${score}
        </div>
        <p>${getScoreDescription(score)}</p>
      </div>
      
      <h2>Ihre Potenzial-Metriken:</h2>
      <div class="metric-row">
        <div class="metric">
          <h3>Sichtbarkeit</h3>
          <div class="value">${getDynamicMetric('visibility', formData.visibility)}</div>
          <div class="description">Potenzielle Steigerung</div>
        </div>
        
        <div class="metric">
          <h3>ROI</h3>
          <div class="value">${getDynamicMetric('goals', formData.goals)}</div>
          <div class="description">Return on Investment</div>
        </div>
        
        <div class="metric">
          <h3>Ergebnisse in</h3>
          <div class="value">${getDynamicMetric('implementation_time', formData.implementation_time)} Tagen</div>
          <div class="description">Erste Verbesserungen</div>
        </div>
      </div>
      
      <div class="current-situation">
        <h3>Ihre aktuelle Situation:</h3>
        
        <div class="situation-item">
          <span class="situation-label">Sichtbarkeit:</span> ${formatValue('visibility', formData.visibility)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Werbefrequenz:</span> ${formatValue('advertising_frequency', formData.advertising_frequency)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Ziele:</span> ${formatValue('goals', formData.goals)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Kampagnenbetreuung:</span> ${formatValue('campaign_management', formData.campaign_management)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Online-Bewertungen:</span> ${formatValue('online_reviews', formData.online_reviews)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Bisherige Kampagnen:</span> ${formatValue('previous_campaigns', formData.previous_campaigns)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Unternehmensphase:</span> ${formatValue('business_phase', formData.business_phase)}
        </div>
        
        <div class="situation-item">
          <span class="situation-label">Gewünschter Umsetzungszeitraum:</span> ${formatValue('implementation_time', formData.implementation_time)}
        </div>
      </div>
      
      <h2>Unsere Empfehlungen für Sie:</h2>
      <div class="recommendations">
        ${getRecommendations(formData.visibility, formData.goals)}
      </div>
      
      <div class="cta-container">
        <h2 style="color: #6BD0D9;">Exklusives Angebot für Sie</h2>
        <p>Sichern Sie sich <strong>5 kostenlose Geheimtipps</strong> für mehr Online-Sichtbarkeit in einem persönlichen Beratungsgespräch.</p>
        <p><strong>Nur für begrenzte Zeit verfügbar!</strong></p>
        <a href="https://calendly.com/digitalpusher/beratung" class="cta-button">5 Geheimtipps kostenlos erhalten</a>
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Digitalpusher - Alle Rechte vorbehalten</p>
      <p>Sie erhalten diesen Bericht, weil Sie eine Website-Analyse auf unserer Plattform durchgeführt haben.</p>
      <p>
        <a href="https://digitalpusher.de/datenschutz">Datenschutz</a> •
        <a href="https://digitalpusher.de/impressum">Impressum</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Formats a value from the schema into a readable text
 */
function formatValue(category: string, value: any): string {
	// Mapping of values to human-readable text
	const mappings: Record<string, Record<string, string>> = {
		visibility: {
			search_engines: 'Suchmaschinen',
			social_media: 'Social Media',
			print: 'Print-Medien',
			store: 'Ladengeschäft'
		},
		advertising_frequency: {
			weekly: 'Wöchentlich',
			monthly: 'Monatlich',
			yearly: 'Jährlich'
		},
		goals: {
			new_clients: 'Neukundengewinnung',
			new_employees: 'Mitarbeitergewinnung',
			more_online: 'Mehr Onlinepräsenz',
			all: 'Alle Bereiche'
		},
		campaign_management: {
			self: 'Eigenständig',
			digitalpusher: 'Digital Pusher',
			employee: 'Mitarbeiter'
		},
		online_reviews: {
			positive: 'Überwiegend positiv',
			negative: 'Verbesserungsbedarf',
			none: 'Keine Bewertungen'
		},
		previous_campaigns: {
			yes: 'Bereits durchgeführt',
			no: 'Noch keine',
			would_like: 'Würde gerne'
		},
		business_phase: {
			planning: 'In Planung',
			less_than_6_months: 'Jünger als 6 Monate',
			more_than_6_months: 'Älter als 6 Monate',
			family_business: 'Familienbetrieb'
		},
		implementation_time: {
			immediate: 'Sofortige Umsetzung',
			medium: 'In 2-6 Monaten',
			long_term: 'Mehr als 6 Monate'
		}
	};

	// Handle array values
	if (Array.isArray(value)) {
		return value
			.map((val) => mappings[category]?.[val] || val)
			.filter(Boolean)
			.join(', ');
	}

	// Handle single values
	return mappings[category]?.[value] || value || 'Nicht angegeben';
}

/**
 * Formats a URL for display
 */
function formatUrl(url: string): string {
	if (!url) return '';

	// Remove protocol and www
	return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/+$/, '');
}

/**
 * Returns a color based on the score
 */
function getScoreColor(score: number): string {
	if (score < 40) return '#dc2626'; // red-600
	if (score < 60) return '#f97316'; // orange-500
	if (score < 80) return '#eab308'; // yellow-500
	return '#16a34a'; // green-600
}

/**
 * Returns a description based on the score
 */
function getScoreDescription(score: number): string {
	if (score < 40) {
		return 'Ihre digitale Sichtbarkeit hat <strong>erhebliches Verbesserungspotenzial</strong>. Gemeinsam können wir Ihre Online-Präsenz deutlich verbessern und Ihr Geschäft auf das nächste Level bringen.';
	} else if (score < 60) {
		return 'Ihre digitale Sichtbarkeit ist <strong>auf einem guten Weg</strong>. Mit gezielten Maßnahmen steigern wir Ihre Performance weiter und erschließen neue Kundengruppen für Sie.';
	} else if (score < 80) {
		return 'Ihre digitale Sichtbarkeit ist bereits <strong>sehr gut</strong>. Mit einigen strategischen Anpassungen können wir Ihre Marktposition weiter ausbauen und Ihre Konkurrenz hinter sich lassen.';
	} else {
		return 'Ihre digitale Sichtbarkeit ist <strong>exzellent</strong>! Lassen Sie uns gemeinsam Ihre Vorreiterrolle weiter ausbauen und Ihre digitale Dominanz langfristig sichern.';
	}
}

/**
 * Returns dynamic metrics based on user input
 */
function getDynamicMetric(type: string, value: any): string {
	const metrics: Record<string, Record<string, string>> = {
		visibility: {
			social_media: '+64%',
			search_engines: '+72%',
			print: '+45%',
			store: '+38%',
			default: '+58%'
		},
		goals: {
			new_clients: '3.2x',
			new_employees: '2.8x',
			more_online: '4.1x',
			all: '3.5x',
			default: '3x'
		},
		implementation_time: {
			immediate: '14',
			medium: '30',
			long_term: '60',
			default: '21'
		}
	};

	// Handle array values
	if (Array.isArray(value)) {
		// Get highest metric
		let highestMetric = metrics[type].default;
		value.forEach((val) => {
			const metric = metrics[type][val];
			if (metric && parseFloat(metric) > parseFloat(highestMetric)) {
				highestMetric = metric;
			}
		});
		return highestMetric;
	}

	// Return the metric or default value
	return metrics[type]?.[value] || metrics[type].default;
}

/**
 * Returns HTML for recommendations
 */
function getRecommendations(visibility: any, goals: any): string {
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
        <div>Employer Branding und Recruiting-Optimierung für qualifizierte Bewerber</div>
      </div>
    `);
	}

	// General recommendations if needed
	if (recommendations.length < 3) {
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Ganzheitliche Digital-Strategie für nachhaltiges Online-Wachstum</div>
      </div>
    `);
		recommendations.push(`
      <div class="recommendation-item">
        <div class="recommendation-icon">✓</div>
        <div>Performance-basierte Kampagnen-Optimierung mit kontinuierlichem Monitoring</div>
      </div>
    `);
	}

	// Ensure max 4 recommendations
	return recommendations.slice(0, 4).join('');
}
