// src/lib/utils/pdfTranslations.ts

export function getPdfTranslations(language: string) {
	const de = {
		results: {
			page: {
				title: 'Ihre Website-Analyse Ergebnisse',
				description: 'Ergebnisse vom'
			},
			score: {
				title: 'Ihr Visibility Score',
				description: 'Basierend auf Ihrer aktuellen Online-Präsenz und Marketing-Strategie'
			},
			situation: {
				title: '📊 Ihre aktuelle Situation',
				visibility: 'Sichtbarkeit:',
				advertisingFrequency: 'Werbefrequenz:',
				goals: 'Ziele:',
				campaignManagement: 'Kampagnenbetreuung:',
				businessPhase: 'Unternehmensphase:',
				implementationTime: 'Umsetzungszeitraum:'
			},
			cta: {
				title: '🎯 Exklusives Angebot für Sie',
				description:
					'Sichern Sie sich <strong>5 kostenlose Geheimtipps</strong> für mehr Online-Sichtbarkeit in einem persönlichen Beratungsgespräch.',
				urgency: 'Nur für begrenzte Zeit verfügbar!',
				button: '5 Geheimtipps kostenlos erhalten'
			}
		},
		email: {
			footer: {
				copyright: '© 2025 Digitalpusher - Alle Rechte vorbehalten',
				disclaimer:
					'Sie erhalten diesen Bericht, weil Sie eine Website-Analyse auf unserer Plattform durchgeführt haben.',
				privacy: 'Datenschutz',
				imprint: 'Impressum'
			}
		}
	};

	const en = {
		results: {
			page: {
				title: 'Your Website Analysis Results',
				description: 'Results from'
			},
			score: {
				title: 'Your Visibility Score',
				description: 'Based on your current online presence and marketing strategy'
			},
			situation: {
				title: '📊 Your Current Situation',
				visibility: 'Visibility:',
				advertisingFrequency: 'Advertising Frequency:',
				goals: 'Goals:',
				campaignManagement: 'Campaign Management:',
				businessPhase: 'Business Phase:',
				implementationTime: 'Implementation Time:'
			},
			cta: {
				title: '🎯 Exclusive Offer for You',
				description:
					'Secure <strong>5 free insider tips</strong> for more online visibility in a personal consultation.',
				urgency: 'Limited time only!',
				button: 'Get 5 Free Insider Tips'
			}
		},
		email: {
			footer: {
				copyright: '© 2025 Digitalpusher - All rights reserved',
				disclaimer:
					'You are receiving this report because you completed a website analysis on our platform.',
				privacy: 'Privacy Policy',
				imprint: 'Imprint'
			}
		}
	};

	return language === 'de' ? de : en;
}
