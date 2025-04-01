// Definiere den Typen für alle Übersetzungen
export interface Translation {
	common: {
		next: string;
		back: string;
		submit: string;
		loading: string;
		error: string;
		success: string;
	};
	forms: {
		labels: Record<string, string>;
		placeholders: Record<string, string>;
		errors: Record<string, string>;
		descriptions: Record<string, string>;
	};
	schema: {
		steps: Record<
			string,
			{
				title: string;
				description: string;
			}
		>;
		options: Record<
			string,
			Record<
				string,
				{
					label: string;
					description: string;
				}
			>
		>;
		metrics: {
			seo: {
				label: string;
				description: string;
			};
			performance: {
				label: string;
				description: string;
			};
			accessibility: {
				label: string;
				description: string;
			};
			bestPractices: {
				label: string;
				description: string;
			};
			content: {
				label: string;
				description: string;
			};
			security: {
				label: string;
				description: string;
			};
			currentValue: string;
			improvedValue: string;
			average: string;
			optimal: string;
			showImprovement: string;
			hideImprovement: string;
		};
	};
	results: {
		title: string;
		subtitle: string;
		score: {
			title: string;
			low: string;
			medium: string;
			high: string;
			excellent: string;
		};
		sections: {
			analysis: string;
			steps: {
				title: string;
				purchase: string;
				scheduling: string;
				implementation: string;
				handover: string;
			};
			plans: string;
			testimonials: {
				title: string;
				inspiration: string;
				case1: {
					titleLow: string;
					titleHigh: string;
					quote: string;
					author: string;
				};
				case2: {
					title: string;
					quote: string;
					author: string;
				};
			};
			improvement: string;
			cta: {
				title: string;
				subtitle: string;
				button: string;
			};
		};
		strengths: {
			title: string;
			goodBasics: string;
			regularContent: string;
			understanding: string;
			quickImprovement: string;
			growthPotential: string;
			visibilityGain: string;
			socialPresence: string;
			seoUnderstanding: string;
			digitalTransformation: string;
		};
		weaknesses: {
			title: string;
			poorVisibility: string;
			noStrategy: string;
			poorOptimization: string;
			limitedReach: string;
			underdevelopedContent: string;
			poorConversion: string;
			contentDistribution: string;
			competitorAnalysis: string;
			conversionRate: string;
		};
		benefits: {
			title: string;
			visibility: string;
			traffic: string;
			conversion: string;
			searchEngines: string;
			socialMedia: string;
			newClients: string;
			newEmployees: string;
		};
		recommendations: {
			title: string;
			website: string;
			content: string;
			performance: string;
			seo: string;
			accessibility: string;
			contentQuality: string;
			basicSeo: string;
			googleBusiness: string;
			advancedSeo: string;
			localSeo: string;
			contentMarketing: string;
			backlinks: string;
			extendedContent: string;
			competitorAnalysis: string;
		};
		buttons: {
			restart: string;
			getReport: string;
		};
		screenshot: {
			alt: string;
			unsupported: string;
		};
	};
	meta: {
		title: string;
		description: string;
		breadcrumb: string;
	};
	pricing: {
		perDay: string;
		features: {
			websiteOptimization: string;
			basicSeo: string;
			monthlyContent: string;
			performanceReport: string;
			allBasicFeatures: string;
			socialMedia: string;
			weeklyContent: string;
			keywordOptimization: string;
			competitorAnalysis: string;
			allPremiumFeatures: string;
			marketingStrategy: string;
			dailyContent: string;
			sem: string;
			personalManager: string;
			cro: string;
		};
		included: {
			longtermBusiness: string;
			viralContent: string;
			expertFrameworks: string;
			targetedStrategies: string;
		};
		excluded: {
			getRichQuick: string;
			noContracts: string;
			noInvestment: string;
			pyramidSchemes: string;
		};
		includedTitle: string;
		inAllPlans: string;
		excludedTitle: string;
		notWorking: string;
		choosePlan: string;
	};
	footer: {
		copyright: string;
	};
}

// Deutsche Übersetzungen
const de: Translation = {
	common: {
		next: 'Weiter',
		back: 'Zurück',
		submit: 'Absenden',
		loading: 'Wird geladen...',
		error: 'Ein Fehler ist aufgetreten',
		success: 'Erfolgreich!'
	},
	forms: {
		labels: {
			company_name: 'Unternehmensname',
			company_url: 'Website-URL',
			salutation: 'Anrede',
			first_name: 'Vorname',
			last_name: 'Nachname',
			email: 'E-Mail',
			phone: 'Telefon',
			privacy_agreement: 'Datenschutzerklärung',
			marketing_consent: 'Newsletter'
		},
		placeholders: {
			company_url: 'https://www.meinewebsite.de',
			email: 'max.mustermann@example.de'
		},
		errors: {
			required: 'Dieses Feld ist erforderlich',
			url: 'Bitte eine gültige URL eingeben',
			email: 'Bitte eine gültige E-Mail-Adresse angeben'
		},
		descriptions: {
			company_url:
				"Gib die URL Deiner Website ein und klicke auf 'Analysieren', um einen umfassenden Bericht zu erhalten."
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'visibility',
				description: 'Wo ist Dein Unternehmen zu finden?'
			},
			company_url: {
				title: 'company_url',
				description: 'Bereit für Deine Website-Analyse?'
			},
			advertising_frequency: {
				title: 'advertising_frequency',
				description: 'Wie oft schaltest Du Werbung?'
			},
			goals: {
				title: 'goals',
				description: 'Was möchtest Du unternehmerisch erreichen?'
			},
			campaign_management: {
				title: 'campaign_management',
				description: 'Wer soll Deine Werbung betreuen?'
			},
			online_reviews: {
				title: 'online_reviews',
				description: 'Wie bewerten Deine Kunden Dich?'
			},
			previous_campaigns: {
				title: 'previous_campaigns',
				description: 'Deine Erfahrung mit Online-Werbung'
			},
			business_phase: {
				title: 'business_phase',
				description: 'In welcher Phase befindet sich Dein Unternehmen?'
			},
			implementation_time: {
				title: 'implementation_time',
				description: 'Dein gewünschter Implementierungszeitraum'
			},
			company_info: {
				title: 'company_info',
				description: 'Informationen zu Deinem Unternehmen'
			},
			waitingscreen: {
				title: 'waitingscreen',
				description: 'Deine Anfrage wird bearbeitet'
			},
			result: {
				title: 'result',
				description: 'Handlungsbedarf: Deine Website-Analyse'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Suchmaschinen',
					description: 'Präsenz in Google & Co.'
				},
				social_media: {
					label: 'Social Media',
					description: 'Präsenz Facebook & Co.'
				},
				print: {
					label: 'Print',
					description: 'Klassische Printwerbung'
				},
				store: {
					label: 'Ladengeschäft',
					description: 'Physische Präsenz'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Wöchentlich',
					description: 'Wöchentliche Updates'
				},
				monthly: {
					label: 'Monatlich',
					description: 'Monatliche Kampagnen'
				},
				yearly: {
					label: 'Jährlich',
					description: 'Jährliche Großkampagnen'
				}
			},
			goals: {
				new_clients: {
					label: 'Neukundengewinnung',
					description: 'Neue Kunden gewinnen'
				},
				new_employees: {
					label: 'Mitarbeitergewinnung',
					description: 'Neue Mitarbeiter finden'
				},
				more_online: {
					label: 'Mehr Onlinepräsenz',
					description: 'Online sichtbarer werden'
				},
				all: {
					label: 'Alles zusammen',
					description: 'All-in-One Lösung'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Suchmaschinenoptimierung'
			},
			performance: {
				label: 'Performance',
				description: 'Ladegeschwindigkeit und Reaktionsfähigkeit'
			},
			accessibility: {
				label: 'Zugänglichkeit',
				description: 'Barrierefreiheit der Website'
			},
			bestPractices: {
				label: 'Best Practices',
				description: 'Einhaltung von Webstandards'
			},
			content: {
				label: 'Content',
				description: 'Qualität und Relevanz der Inhalte'
			},
			security: {
				label: 'Sicherheit',
				description: 'Schutz vor Bedrohungen'
			},
			currentValue: 'Aktueller Wert',
			improvedValue: 'Nach Optimierung',
			average: 'Durchschnitt',
			optimal: 'Optimalwert',
			showImprovement: 'Verbesserungen anzeigen',
			hideImprovement: 'Verbesserungen ausblenden'
		}
	},
	results: {
		title: 'Handlungsbedarf: Deine Website-Analyse',
		subtitle: 'Hier ist Dein individueller Analysebericht',
		score: {
			title: 'Dein Marketing Score',
			low: 'Kritisch! Dein Unternehmen ist kaum sichtbar.',
			medium: 'Deine Sichtbarkeit ist ausbaufähig.',
			high: 'Gut! Aber es gibt noch Potenzial.',
			excellent: 'Hervorragend! Deine digitale Präsenz ist exzellent.'
		},
		sections: {
			analysis: 'Deine Analyse-Ergebnisse',
			steps: {
				title: 'Wie geht es nach dem Kauf weiter?',
				purchase: '1. Auswahl des passenden Plans und unkomplizierter Kaufabschluss',
				scheduling: '2. Persönliche Terminvereinbarung mit unserem Digital-Experten',
				implementation: '3. Professionelle Umsetzung aller vereinbarten Maßnahmen',
				handover: '4. Übergabe und Einweisung in Ihr optimiertes digitales System'
			},
			plans: 'Wähle Deinen Plan',
			testimonials: {
				title: 'Erfolgsgeschichten, die Dich motivieren werden',
				inspiration: 'INSPIRATIONEN',
				case1: {
					titleLow:
						'Von 0 auf 100: Mindestens 3 Abschlüsse täglich durch maximierte Online-Präsenz',
					titleHigh: 'Durchbruch: mehr als 43% mehr Anfragen dank durchdachter Marketing-Strategie',
					quote:
						'Wir wurden im vollen Umfang bestens beraten und entschieden uns neben der Webapp und der neuen Webseite uns vom Dienstleister eine zielstrebige und langfristige Kampagne auf Social Media planen und realisieren zu lassen. Wir sind mit den Conversions nach zwei Jahren sehr zufrieden.',
					author: '- Dr. P. Ullrich, Geschäftsführer'
				},
				case2: {
					title: 'Effiziente Umsetzung: Landingpage, SEO und full Channel Ads Kampagne',
					quote:
						'Die Landingpage und SEO wurde auf Grundlage der analysierten Daten für unser E-Commerce Netzwerk basierend auf Shopware schnell umgesetzt und die Kampagne war dank gezielter Zielgruppenauswahl und Conversion Tracking ein voller Erfolg. Auf jeden Fall empfehlenswert.',
					author: '- M. Keller, Senior Brand Manager'
				}
			},
			improvement: 'So verbessern wir Deine Ergebnisse',
			cta: {
				title: 'Bereit, Deine digitale Präsenz zu revolutionieren?',
				subtitle: 'Wähle jetzt Deinen Plan und starte Deine Reise zu mehr Sichtbarkeit und Erfolg.',
				button: 'Jetzt Plan auswählen'
			}
		},
		strengths: {
			title: 'Deine Stärken',
			goodBasics: 'Gute Grundlagen in digitaler Präsenz',
			regularContent: 'Regelmäßige Content-Erstellung',
			understanding: 'Grundverständnis für digitales Marketing',
			quickImprovement: 'Potenzial für schnelle Verbesserungen',
			growthPotential: 'Großes Wachstumspotenzial',
			visibilityGain: 'Möglichkeit für schnelle Sichtbarkeitssteigerung',
			socialPresence: 'Bestehende Social-Media-Präsenz',
			seoUnderstanding: 'Verständnis für Suchmaschinenoptimierung',
			digitalTransformation: 'Bereitschaft für digitale Transformation'
		},
		weaknesses: {
			title: 'Verbesserungspotenzial',
			poorVisibility: 'Geringe digitale Sichtbarkeit',
			noStrategy: 'Fehlende Online-Marketingstrategie',
			poorOptimization: 'Unzureichende Website-Optimierung',
			limitedReach: 'Begrenzte Reichweite in Suchmaschinen',
			underdevelopedContent: 'Unterentwickelte Content-Strategie',
			poorConversion: 'Mangelnde Conversion-Optimierung',
			contentDistribution: 'Lücken in der Content-Distribution',
			competitorAnalysis: 'Begrenzte Konkurrenzanalyse',
			conversionRate: 'Optimierungspotenzial in der Conversion Rate'
		},
		benefits: {
			title: 'Deine Vorteile',
			visibility: 'Höhere Sichtbarkeit in Google & Co.',
			traffic: 'Mehr qualifizierte Besucher auf Deiner Website',
			conversion: 'Bessere Konversionsraten durch optimierte Inhalte',
			searchEngines: 'Optimierte Suchmaschinenplatzierungen für relevante Keywords',
			socialMedia: 'Verbesserte Social-Media-Präsenz und Engagement',
			newClients: 'Zielgerichtete Strategien zur Neukundengewinnung',
			newEmployees: 'Optimierte Karriereseite zur Mitarbeitergewinnung'
		},
		recommendations: {
			title: 'Unsere Empfehlungen',
			website: 'Website-Optimierung für bessere Nutzererfahrung',
			content: 'Content-Strategie zur Steigerung der Sichtbarkeit',
			performance:
				'Verbesserung der Website-Ladegeschwindigkeit durch Optimierung von Bildern und Skripten',
			seo: 'SEO-Optimierung durch verbesserte Meta-Tags und strukturierte Daten',
			accessibility: 'Barrierefreiheit verbessern für mehr Zugänglichkeit',
			contentQuality: 'Content-Qualität durch bessere Strukturierung und Keywords optimieren',
			basicSeo: 'Grundlegende SEO-Optimierung Deiner Website',
			googleBusiness: 'Erstellung eines Google Business Profils',
			advancedSeo: 'Erweiterte SEO-Maßnahmen für mehr organischen Traffic',
			localSeo: 'Lokale SEO-Optimierung für regionale Sichtbarkeit',
			contentMarketing: 'Content-Marketing-Strategie zur Stärkung Deiner Marktposition',
			backlinks: 'Backlinkaufbau zur Steigerung der Domain-Autorität',
			extendedContent: 'Erweiterte Content-Strategie für maximale Sichtbarkeit',
			competitorAnalysis: 'Wettbewerbsanalyse zur Identifizierung von Wachstumschancen'
		},
		buttons: {
			restart: 'Quiz und Analyse neu starten',
			getReport: 'Analysebericht per E-Mail erhalten'
		},
		screenshot: {
			alt: 'Website Screenshot',
			unsupported: 'Screenshot-Daten vorhanden, aber Format nicht unterstützt'
		}
	},
	meta: {
		title: 'Digital Marketing Assessment',
		description:
			'Analysiere Deine digitale Präsenz mit unserem kostenlosen Marketing-Assessment. Erhalte personalisierte Empfehlungen für mehr Online-Erfolg.',
		breadcrumb: 'Marketing Assessment'
	},
	pricing: {
		perDay: 'pro Tag',
		features: {
			websiteOptimization: 'Website-Optimierung',
			basicSeo: 'Grundlegende SEO-Maßnahmen',
			monthlyContent: 'Content-Erstellung (1× pro Monat)',
			performanceReport: 'Monatlicher Performance-Bericht',
			allBasicFeatures: 'Alle Features des 1-Monats-Plans',
			socialMedia: 'Social Media Management',
			weeklyContent: 'Wöchentliche Content-Erstellung',
			keywordOptimization: 'Keyword-Optimierung',
			competitorAnalysis: 'Detaillierte Konkurrenzanalyse',
			allPremiumFeatures: 'Alle Features des 3-Monats-Plans',
			marketingStrategy: 'Umfassende Marketingstrategie',
			dailyContent: 'Tägliche Content-Updates',
			sem: 'Suchmaschinenmarketing (SEM)',
			personalManager: 'Persönlicher Marketing-Manager',
			cro: 'Conversion-Rate-Optimierung'
		},
		included: {
			longtermBusiness: 'Methode zur Schaffung eines echten, langfristigen Online-Geschäfts',
			viralContent: 'Exklusive Konzepte für die Erstellung viraler Inhalte',
			expertFrameworks: 'Bewährte Experten-Frameworks um schnell und effizient zu skalieren',
			targetedStrategies: 'Faktenbasierte Strategien anhand der Bedürfnisse Deiner Zielgruppe'
		},
		excluded: {
			getRichQuick: 'Schnell-reich-werden-Schemata: über Nacht reich werden',
			noContracts: 'Keine langfristigen Verpflichtungen oder Verträge',
			noInvestment: 'Eine investitionsfreie Möglichkeit, die nie hält, was sie verspricht',
			pyramidSchemes: 'MLM, Dropshipping oder Wiederverkauf von Pyramidensystemen'
		},
		includedTitle: 'Inklusive',
		inAllPlans: 'in all unseren Paketen',
		excludedTitle: 'Wir arbeiten',
		notWorking: 'nicht mit',
		choosePlan: 'Passenden Plan auswählen'
	},
	footer: {
		copyright: 'Alle Rechte vorbehalten.'
	}
};

// Exportiere alle Übersetzungen
export const translations = {
	de
};
