// Definiere den Typen für alle Übersetzungen
export interface Translation {
	start: {
		title: string;
		text: string;
		meta: {
			rating: {
				user: string;
				from: string;
				quiztime: string;
			};
		};
	};
	common: {
		next: string;
		back: string;
		submit: string;
		loading: string;
		error: string;
		success: string;
		analyze: string;
	};
	forms: {
		labels: Record<string, string>;
		salutation: {
			select: string;
			male: string;
			female: string;
			diverse: string;
		};
		placeholders: Record<string, string>;
		errors: Record<string, string>;
		descriptions: Record<string, string> & { analyze: string };
		checkpoints: {
			performance: string;
			seo: string;
			accessibility: string;
			security: string;
		};
		seotips: {
			headline: string;
			title: string;
			default: string[];
		};
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
			low: {
				title: string;
				suggestion: string;
			};
			medium: {
				title: string;
				suggestion: string;
			};
			high: {
				title: string;
				suggestion: string;
			};
			excellent: {
				title: string;
				suggestion: string;
			};
		};
		sections: {
			analysis: string;
			steps: {
				title: string;
				purchase: {
					title: string;
					description: string;
					icon: string;
				};
				scheduling: {
					title: string;
					description: string;
					icon: string;
				};
				implementation: {
					title: string;
					description: string;
					icon: string;
				};
				handover: {
					title: string;
					description: string;
					icon: string;
				};
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
			improvement: {
				title: string;
				steps: Array<{
					title: string;
					description: string;
				}>;
			};
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

// Deutsche (de)
const de: Translation = {
	start: {
		title: 'Marketing Check Quiz',
		text: 'Jetzt <strong>Onlinesichtbarkeit berechnen</strong> lassen, <strong>Reichweite erhöhen</strong> sowie <strong>Ressourcen sparen</strong> und <strong>Umsätze steigern</strong>.',
		meta: {
			rating: {
				user: 'Nutzer',
				from: 'von',
				quiztime: '-Minuten Quiz'
			}
		}
	},
	common: {
		next: 'Weiter',
		back: 'Zurück',
		submit: 'Absenden',
		loading: 'Wird geladen...',
		error: 'Ein Fehler ist aufgetreten',
		success: 'Erfolgreich!',
		analyze: 'Analysieren'
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
		salutation: {
			select: 'Bitte Anrede auswählen',
			male: 'Herr',
			female: 'Frau',
			diverse: 'Divers'
		},
		placeholders: {
			select: 'Bitte wählen',
			salutation: 'Bitte wähle Deine Anrede',
			first_name: 'Bitte gib Deinen Vornamen ein',
			last_name: 'Bitte gib Deinen Nachnamen ein',
			email: 'Bitte gib Deine E-Mail-Adresse ein',
			phone: 'Telefonnummer (optional)',
			privacy_agreement: 'Datenschutzerklärung akzeptieren',
			privacy_policy: 'Datenschutzerklärung',
			newsletter_terms: 'Newsletter-Bestimmungen',
			company_url: 'https://www.meinewebsite.de'
		},
		errors: {
			required: 'Dieses Feld ist erforderlich',
			url: 'Bitte eine gültige URL eingeben',
			email: 'Bitte eine gültige E-Mail-Adresse angeben'
		},
		descriptions: {
			company_url:
				"Gib die URL Deiner Website ein und klicke auf 'Analysieren', um einen umfassenden Bericht zu erhalten.",
			analyze: 'Klicke auf "Analysieren", um Deine Website zu überprüfen',
			privacy_agreement: 'Ich stimme der',
			marketing_consent: 'Ich möchte den Newsletter erhalten und akzeptiere die'
		},
		checkpoints: {
			performance: 'Performance-Check',
			seo: 'SEO-Analyse',
			accessibility: 'Zugänglichkeitstest',
			security: 'Sicherheitscheck'
		},
		seotips: {
			headline: 'Analyse Deiner Website',
			title: 'SEO-Tipp während der Analyse:',
			default: [
				'Verwende präzise Seitentitel (Title-Tags) für bessere Klickraten in Suchergebnissen.',
				'Erstelle einzigartige Meta-Beschreibungen für jede Seite (150-160 Zeichen).',
				'Verwende eine H1-Überschrift pro Seite, die das Hauptthema klar kommuniziert.',
				'Optimiere Bilder mit Alt-Texten und komprimiere sie für schnellere Ladezeiten.',
				'Erstelle eine klare Website-Struktur mit logischen URLs.',
				'Optimiere Deine Website für Mobilgeräte mit responsivem Design.',
				'Verbessere die Ladegeschwindigkeit - jede Sekunde zählt für SEO und Conversion.',
				'Nutze interne Verlinkungen, um Besuchern und Suchmaschinen zu helfen, Deinen Content zu finden.',
				'Erstelle regelmäßig hochwertigen, relevanten Content für Deine Zielgruppe.',
				'Implementiere Schema.org Markup für bessere Darstellung in Suchergebnissen.',
				'Erstelle eine XML-Sitemap und reiche sie bei Google Search Console ein.',
				'Nutze eine sichere HTTPS-Verbindung für Deine gesamte Website.',
				'Überprüfe und repariere defekte Links regelmäßig.',
				'Optimiere Open Graph Tags für bessere Darstellung in sozialen Medien.'
			]
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
			},
			campaign_management: {
				self: {
					label: 'Ich selber',
					description: 'Eigenständige Verwaltung'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Professionelle Betreuung'
				},
				employee: {
					label: 'Mitarbeiter',
					description: 'Interne Verwaltung'
				}
			},
			online_reviews: {
				positive: {
					label: 'Eher positiv',
					description: 'Gute Bewertungen'
				},
				negative: {
					label: 'Eher negativ',
					description: 'Verbesserungspotential'
				},
				none: {
					label: 'Gibt keine',
					description: 'Keine Bewertungen'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Ja',
					description: 'Erfahrung vorhanden'
				},
				no: {
					label: 'Nein',
					description: 'Keine Erfahrung'
				},
				would_like: {
					label: 'Würde ich gerne',
					description: 'Interesse vorhanden'
				}
			},
			business_phase: {
				planning: {
					label: 'Gründung ist geplant',
					description: 'In der Planungsphase'
				},
				less_than_6_months: {
					label: 'Jünger als 6 Monate',
					description: 'Junges Unternehmen'
				},
				more_than_6_months: {
					label: 'Älter als 6 Monate',
					description: 'Etabliertes Unternehmen'
				},
				family_business: {
					label: 'Familienbetrieb',
					description: 'Familienunternehmen'
				}
			},
			implementation_time: {
				immediate: {
					label: 'In Rekordzeit',
					description: 'Blitzschnelle Umsetzung'
				},
				medium: {
					label: 'In 2-6 Monaten',
					description: 'Mittelfristige Planung'
				},
				long_term: {
					label: 'Mehr als 6 Monate',
					description: 'Langfristige Strategie'
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
			low: {
				title: 'Kritisch! Dein Unternehmen ist kaum sichtbar.',
				suggestion: 'Wir zeigen Dir, wie Du sofort mehr Kunden erreichst.'
			},
			medium: {
				title: 'Deine Sichtbarkeit ist ausbaufähig.',
				suggestion: 'Erhöhe Deine Reichweite durch smarte Online-Marketing-Strategien.'
			},
			high: {
				title: 'Gut! Aber es gibt noch Potenzial.',
				suggestion: 'Mit gezieltem Optimieren kannst Du noch mehr Sichtbarkeit gewinnen.'
			},
			excellent: {
				title: 'Hervorragend! Deine digitale Präsenz ist exzellent.',
				suggestion: 'Nutze fortschrittliche Strategien, um Deine Dominanz weiter auszubauen!'
			}
		},
		sections: {
			analysis: 'Deine Analyse-Ergebnisse',
			steps: {
				title: 'Wie geht es nach dem Kauf weiter?',
				purchase: {
					title: 'Kaufabschluss',
					description: 'Auswahl des passenden Plans und unkomplizierter Kaufabschluss',
					icon: 'cart'
				},
				scheduling: {
					title: 'Terminvereinbarung',
					description: 'Persönliche Terminvereinbarung mit unserem Digital-Experten',
					icon: 'calendar'
				},
				implementation: {
					title: 'Umsetzung',
					description: 'Professionelle Umsetzung aller vereinbarten Maßnahmen',
					icon: 'code'
				},
				handover: {
					title: 'Übergabe',
					description: 'Übergabe und Einweisung in Dein optimiertes digitales System',
					icon: 'check'
				}
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
			improvement: {
				title: 'So verbessern wir Deine Ergebnisse',
				steps: [
					{
						title: 'Schritt 1',
						description: 'Beschreibung des ersten Schrittes'
					},
					{
						title: 'Schritt 2',
						description: 'Beschreibung des zweiten Schrittes'
					},
					{
						title: 'Schritt 3',
						description: 'Beschreibung des dritten Schrittes'
					},
					{
						title: 'Schritt 4',
						description: 'Beschreibung des vierten Schrittes'
					}
				]
			},
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

// Englisch (en)
const en: Translation = {
	start: {
		title: 'Marketing Check Quiz',
		text: 'Calculate your <strong>online visibility</strong>, <strong>increase reach</strong>, <strong>save resources</strong>, and <strong>boost revenue</strong> now.',
		meta: {
			rating: {
				user: 'Customers',
				from: 'of',
				quiztime: '-minute quiz'
			}
		}
	},
	common: {
		next: 'Next',
		back: 'Back',
		submit: 'Submit',
		loading: 'Loading...',
		error: 'An error occurred',
		success: 'Success!',
		analyze: 'Analyse'
	},
	forms: {
		labels: {
			company_name: 'Company Name',
			company_url: 'Website URL',
			salutation: 'Salutation',
			first_name: 'First Name',
			last_name: 'Last Name',
			email: 'Email',
			phone: 'Phone',
			privacy_agreement: 'Privacy Policy',
			marketing_consent: 'Newsletter'
		},
		salutation: {
			select: 'Please select a salutation',
			male: 'Mr.',
			female: 'Ms.',
			diverse: 'Diverse'
		},
		placeholders: {
			select: 'Please select',
			salutation: 'Please select your salutation',
			first_name: 'Please enter your first name',
			last_name: 'Please enter your last name',
			email: 'Please enter your email address',
			phone: 'Phone number (optional)',
			privacy_agreement: 'Accept privacy policy',
			privacy_policy: 'Privacy policy',
			newsletter_terms: 'Newsletter terms',
			company_url: 'https://www.mywebsite.com',
			aria: 'Enter your Website Url'
		},
		errors: {
			required: 'This field is required',
			url: 'Please enter a valid URL',
			email: 'Please enter a valid email address'
		},
		descriptions: {
			company_url: 'Enter your website URL and click "Analyse" to receive a comprehensive report.',
			analyze: 'Click on "Analyse" to check your website',
			privacy_agreement: 'I agree to the',
			marketing_consent: 'I would like to receive the newsletter and accept the'
		},
		checkpoints: {
			performance: 'Performance check',
			seo: 'SEO analysis',
			accessibility: 'Accessibility test',
			security: 'Security check'
		},
		seotips: {
			headline: 'Analysis of Your Website',
			title: 'SEO tip during analysis:',
			default: [
				'Use precise page titles (title tags) for better click-through rates in search results.',
				'Create unique meta descriptions for each page (150-160 characters).',
				'Use one H1 heading per page that clearly communicates the main topic.',
				'Optimize images with alt texts and compress them for faster loading times.',
				'Create a clear website structure with logical URLs.',
				'Optimize your website for mobile devices with responsive design.',
				'Improve loading speed – every second counts for SEO and conversion.',
				'Use internal linking to help visitors and search engines find your content.',
				'Regularly create high-quality, relevant content for your target audience.',
				'Implement Schema.org markup for better search result presentation.',
				'Create an XML sitemap and submit it to Google Search Console.',
				'Use a secure HTTPS connection for your entire website.',
				'Regularly check and fix broken links.',
				'Optimize Open Graph tags for better social media display.'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'visibility',
				description: 'Where can your business be found?'
			},
			company_url: {
				title: 'company_url',
				description: 'Ready for your website analysis?'
			},
			advertising_frequency: {
				title: 'advertising_frequency',
				description: 'How often do you run ads?'
			},
			goals: {
				title: 'goals',
				description: 'What do you want to achieve for your business?'
			},
			campaign_management: {
				title: 'campaign_management',
				description: 'Who should manage your advertising?'
			},
			online_reviews: {
				title: 'online_reviews',
				description: 'How do your customers rate you?'
			},
			previous_campaigns: {
				title: 'previous_campaigns',
				description: 'Your experience with online advertising'
			},
			business_phase: {
				title: 'business_phase',
				description: 'In which phase is your company?'
			},
			implementation_time: {
				title: 'implementation_time',
				description: 'Your desired implementation timeframe'
			},
			company_info: {
				title: 'company_info',
				description: 'Information about your company'
			},
			waitingscreen: {
				title: 'waitingscreen',
				description: 'Your request is being processed'
			},
			result: {
				title: 'result',
				description: 'Action Required: Your Website Analysis'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Search Engines',
					description: 'Presence on Google & Co.'
				},
				social_media: {
					label: 'Social Media',
					description: 'Presence on Facebook & Co.'
				},
				print: {
					label: 'Print',
					description: 'Classic print advertising'
				},
				store: {
					label: 'Store',
					description: 'Physical presence'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Weekly',
					description: 'Weekly updates'
				},
				monthly: {
					label: 'Monthly',
					description: 'Monthly campaigns'
				},
				yearly: {
					label: 'Yearly',
					description: 'Annual major campaigns'
				}
			},
			goals: {
				new_clients: {
					label: 'New Customer Acquisition',
					description: 'Acquire new customers'
				},
				new_employees: {
					label: 'Employee Recruitment',
					description: 'Find new employees'
				},
				more_online: {
					label: 'More Online Presence',
					description: 'Become more visible online'
				},
				all: {
					label: 'Everything Together',
					description: 'All-in-one solution'
				}
			},
			campaign_management: {
				self: {
					label: 'By myself',
					description: 'Managed company owner'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Managed Professional'
				},
				employee: {
					label: 'Employee',
					description: 'Managed internal'
				}
			},
			online_reviews: {
				positive: {
					label: 'Positive Reviews',
					description: 'Mostly positive feedback from customers'
				},
				negative: {
					label: 'Negative Reviews',
					description: 'Mostly negative feedback from customers'
				},
				none: {
					label: 'No Reviews',
					description: 'I didnt received reviews yet'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Successful',
					description: 'Previous campaigns were successful'
				},
				no: {
					label: 'No Ads',
					description: 'No online advertising to date'
				},
				would_like: {
					label: 'I would like to',
					description: 'I like to advertise in the future'
				}
			},
			business_phase: {
				planning: {
					label: 'In Planning',
					description: 'I am planning to start a business'
				},
				less_than_6_months: {
					label: 'Start-Up',
					description: 'The company is still unknown'
				},
				more_than_6_months: {
					label: 'Stable Business',
					description: 'Business is established'
				},
				family_business: {
					label: 'Family Business',
					description: 'Established company'
				}
			},
			implementation_time: {
				immediate: {
					label: 'In record time',
					description: 'Implement within a few days'
				},
				medium: {
					label: 'Vital Growth',
					description: 'Implement within a few months'
				},
				long_term: {
					label: 'Long Term',
					description: 'Implement over a longer period of time'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Search Engine Optimization'
			},
			performance: {
				label: 'Performance',
				description: 'Loading speed and responsiveness'
			},
			accessibility: {
				label: 'Accessibility',
				description: 'Website accessibility'
			},
			bestPractices: {
				label: 'Best Practices',
				description: 'Compliance with web standards'
			},
			content: {
				label: 'Content',
				description: 'Quality and relevance of content'
			},
			security: {
				label: 'Security',
				description: 'Protection against threats'
			},
			currentValue: 'Current Value',
			improvedValue: 'After Optimization',
			average: 'Average',
			optimal: 'Optimal Value',
			showImprovement: 'Show Improvements',
			hideImprovement: 'Hide Improvements'
		}
	},
	results: {
		title: 'Action Required: Your Website Analysis',
		subtitle: 'Here is your personalized analysis report',
		score: {
			title: 'Your Marketing Score',
			low: {
				title: 'Critical! Your business is barely visible.',
				suggestion: 'We’ll show you how to reach more customers immediately.'
			},
			medium: {
				title: 'Your visibility could be improved.',
				suggestion: 'Increase your reach with smart online marketing strategies.'
			},
			high: {
				title: 'Good! But there’s still potential.',
				suggestion: 'With targeted optimization, you can gain even more visibility.'
			},
			excellent: {
				title: 'Outstanding! Your digital presence is excellent.',
				suggestion: 'Use advanced strategies to further expand your dominance!'
			}
		},
		sections: {
			analysis: 'Your Analysis Results',
			steps: {
				title: 'What happens after purchase?',
				purchase: {
					title: 'Purchase',
					description: 'Selection of the appropriate plan and seamless purchase completion',
					icon: 'cart'
				},
				scheduling: {
					title: 'Appointment',
					description: 'Personal appointment scheduling with our digital expert',
					icon: 'calendar'
				},
				implementation: {
					title: 'Implementation',
					description: 'Professional implementation of all agreed-upon measures',
					icon: 'code'
				},
				handover: {
					title: 'Handover',
					description: 'Handover and training on your optimized digital system',
					icon: 'check'
				}
			},
			plans: 'Choose Your Plan',
			testimonials: {
				title: 'Success stories that will motivate you',
				inspiration: 'INSPIRATIONS',
				case1: {
					titleLow: 'From 0 to 100: At least 3 deals daily through maximized online presence',
					titleHigh: 'Breakthrough: Over 43% more inquiries thanks to strategic marketing',
					quote:
						'We received comprehensive advice and decided to have a targeted long-term social media campaign planned and implemented in addition to the web app and new website. We are very satisfied with the conversions after two years.',
					author: '- Dr. P. Ullrich, CEO'
				},
				case2: {
					title: 'Efficient Implementation: Landing page, SEO and full channel ads campaign',
					quote:
						'The landing page and SEO were quickly implemented based on analyzed data for our e-commerce network using Shopware, and the campaign was a complete success thanks to targeted audience selection and conversion tracking. Highly recommended.',
					author: '- M. Keller, Senior Brand Manager'
				}
			},
			improvement: 'How We Improve Your Results',
			cta: {
				title: 'Ready to revolutionize your digital presence?',
				subtitle: 'Choose your plan now and start your journey to more visibility and success.',
				button: 'Select Plan Now'
			}
		},
		strengths: {
			title: 'Your Strengths',
			goodBasics: 'Good basics in digital presence',
			regularContent: 'Regular content creation',
			understanding: 'Basic understanding of digital marketing',
			quickImprovement: 'Potential for quick improvements',
			growthPotential: 'High growth potential',
			visibilityGain: 'Opportunity for rapid visibility increase',
			socialPresence: 'Existing social media presence',
			seoUnderstanding: 'Understanding of search engine optimization',
			digitalTransformation: 'Willingness for digital transformation'
		},
		weaknesses: {
			title: 'Improvement Potential',
			poorVisibility: 'Low digital visibility',
			noStrategy: 'Lacking online marketing strategy',
			poorOptimization: 'Insufficient website optimization',
			limitedReach: 'Limited search engine reach',
			underdevelopedContent: 'Underdeveloped content strategy',
			poorConversion: 'Insufficient conversion optimization',
			contentDistribution: 'Gaps in content distribution',
			competitorAnalysis: 'Limited competitor analysis',
			conversionRate: 'Optimization potential in conversion rate'
		},
		benefits: {
			title: 'Your Benefits',
			visibility: 'Higher visibility on Google & Co.',
			traffic: 'More qualified visitors to your website',
			conversion: 'Better conversion rates through optimized content',
			searchEngines: 'Optimized search engine rankings for relevant keywords',
			socialMedia: 'Improved social media presence and engagement',
			newClients: 'Targeted strategies for new customer acquisition',
			newEmployees: 'Optimized career page for employee recruitment'
		},
		recommendations: {
			title: 'Our Recommendations',
			website: 'Website optimization for better user experience',
			content: 'Content strategy to increase visibility',
			performance: 'Improve website loading speed by optimizing images and scripts',
			seo: 'SEO optimization through improved meta tags and structured data',
			accessibility: 'Improve accessibility for better reach',
			contentQuality: 'Optimize content quality through better structuring and keywords',
			basicSeo: 'Basic SEO optimization of your website',
			googleBusiness: 'Create a Google Business Profile',
			advancedSeo: 'Advanced SEO measures for more organic traffic',
			localSeo: 'Local SEO optimization for regional visibility',
			contentMarketing: 'Content marketing strategy to strengthen market position',
			backlinks: 'Backlink building to increase domain authority',
			extendedContent: 'Extended content strategy for maximum visibility',
			competitorAnalysis: 'Competitor analysis to identify growth opportunities'
		},
		buttons: {
			restart: 'Restart Quiz and Analysis',
			getReport: 'Receive Analysis Report by Email'
		},
		screenshot: {
			alt: 'Website Screenshot',
			unsupported: 'Screenshot data available but format not supported'
		}
	},
	meta: {
		title: 'Digital Marketing Assessment',
		description:
			'Analyze your digital presence with our free marketing assessment. Get personalized recommendations for more online success.',
		breadcrumb: 'Marketing Assessment'
	},
	pricing: {
		perDay: 'per day',
		features: {
			websiteOptimization: 'Website Optimization',
			basicSeo: 'Basic SEO Measures',
			monthlyContent: 'Content Creation (1× per month)',
			performanceReport: 'Monthly Performance Report',
			allBasicFeatures: 'All features from 1-month plan',
			socialMedia: 'Social Media Management',
			weeklyContent: 'Weekly Content Creation',
			keywordOptimization: 'Keyword Optimization',
			competitorAnalysis: 'Detailed Competitor Analysis',
			allPremiumFeatures: 'All features from 3-month plan',
			marketingStrategy: 'Comprehensive Marketing Strategy',
			dailyContent: 'Daily Content Updates',
			sem: 'Search Engine Marketing (SEM)',
			personalManager: 'Personal Marketing Manager',
			cro: 'Conversion Rate Optimization'
		},
		included: {
			longtermBusiness: 'Method to create a genuine long-term online business',
			viralContent: 'Exclusive concepts for creating viral content',
			expertFrameworks: 'Proven expert frameworks for quick and efficient scaling',
			targetedStrategies: 'Fact-based strategies based on your target group needs'
		},
		excluded: {
			getRichQuick: 'Get-rich-quick schemes: Becoming rich overnight',
			noContracts: 'No long-term commitments or contracts',
			noInvestment: 'An investment-free approach that never delivers',
			pyramidSchemes: 'MLM, dropshipping or reselling pyramid schemes'
		},
		includedTitle: 'Included',
		inAllPlans: 'in all our plans',
		excludedTitle: "We don't work with",
		notWorking: 'the following',
		choosePlan: 'Choose Suitable Plan'
	},
	footer: {
		copyright: 'All rights reserved.'
	}
};

// Exportiere alle Übersetzungen
export const translations = {
	de,
	en
};
