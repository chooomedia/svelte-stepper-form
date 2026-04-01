import type { Translation } from '../types';
import { getCommonTranslation } from './common';

const de: Translation = {
	start: {
		title: 'Marketing Check Quiz',
		text: 'Jetzt <strong>Onlinesichtbarkeit berechnen</strong> lassen, <strong>Reichweite erhöhen</strong> sowie <strong>Ressourcen sparen</strong> und <strong>Umsätze steigern</strong>.',
		meta: {
			rating: {
				user: 'Nutzer',
				from: 'von',
				quiztime: 'Minuten Quiz'
			}
		}
	},
	common: getCommonTranslation('de'),
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
		imageOption: {
			continueIn: 'weiter in',
			second: 'Sekunde',
			seconds: 'Sekunden',
			selectUpTo: 'Du kannst bis zu {max} Optionen auswählen',
			selectAllApplicable: 'Wähle alle passenden Optionen'
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
			currentValue: 'Aktuell',
			improvedValue: 'Nach Optimierung',
			average: 'Durchschnitt',
			optimal: 'Optimal'
		},
		validation: {
			// Allgemeine Validierungsfehler
			required: 'Dieses Feld ist erforderlich',
			// Felder-spezifische Validierungsfehler
			visibility: {
				required: 'Bitte wähle aus, wo Dein Unternehmen zu finden ist',
				minSelection: 'Bitte wähle mindestens eine Option aus'
			},
			advertising_frequency: {
				required: 'Bitte wähle die Werbefrequenz aus',
				minSelection: 'Bitte wähle mindestens eine Werbefrequenz aus'
			},
			goals: {
				required: 'Bitte wähle Dein Hauptziel aus',
				minSelection: 'Bitte wähle mindestens ein Ziel aus'
			},
			campaign_management: {
				required: 'Bitte wähle aus, wer die Werbung betreuen soll',
				minSelection: 'Bitte wähle mindestens eine Option aus'
			},
			online_reviews: {
				required: 'Bitte angeben wie durchschnittlich Deine Online-Bewertungen sind',
				minSelection: 'Bitte wähle mindestens eine Option aus'
			},
			previous_campaigns: {
				required: 'Bitte angeben, ob bereits Onlinewerbung geschaltet wurde',
				minSelection: 'Bitte wähle mindestens eine Option aus'
			},
			business_phase: {
				required: 'Bitte wählen Deine Unternehmensphase aus',
				minSelection: 'Bitte wähle mindestens eine Phase aus'
			},
			implementation_time: {
				required: 'Bitte wähle den gewünschten Implementierungszeitraum',
				minSelection: 'Bitte wähle mindestens einen Zeitraum aus'
			},
			company_name: {
				required: 'Unternehmensname wird benötigt',
				minLength: 'Name muss mindestens 2 Zeichen lang sein'
			},
			company_url: {
				required: 'Website-URL wird benötigt',
				url: 'Bitte gültige URL angeben'
			},
			first_name: {
				required: 'Vorname wird benötigt',
				minLength: 'Vorname muss mindestens 2 Zeichen lang sein'
			},
			last_name: {
				required: 'Nachname wird benötigt',
				minLength: 'Nachname muss mindestens 2 Zeichen lang sein'
			},
			email: {
				required: 'E-Mail-Adresse wird benötigt',
				email: 'Bitte eine gültige E-Mail-Adresse angeben'
			},
			phone: {
				required: 'Telefonnummer wird benötigt',
				pattern: 'Ungültiges Telefonformat'
			},
			privacy_agreement: {
				required: 'Bitte akzeptiere die Datenschutzerklärung'
			}
		}
	},
	results: {
		title: 'Handlungsbedarf: Deine Website-Analyse',
		description: 'Hier ist Dein individueller Analysebericht',
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
				title: 'Deine nächsten Schritte zum Erfolg',
				scheduling: {
					title: 'Persönliches Gespräch',
					description: '30min mit unserem Experten – konkrete Strategien für dein Wachstum',
					icon: 'calendar'
				},
				implementation: {
					title: 'Schnelle Umsetzung',
					description: 'Wir setzen um, was funktioniert – professionell und zielgerichtet',
					icon: 'code'
				},
				handover: {
					title: 'Dein System läuft',
					description: 'Fertig eingerichtet – arbeitet für dich und bringt automatisch Anfragen',
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
						title: 'Website-Optimierung',
						description:
							'Verbesserung von Ladezeiten, Mobil-Kompatibilität und Benutzerfreundlichkeit.',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO & Keywords',
						description:
							'Auf Ihre Branche abgestimmte Suchmaschinen-Optimierung für bessere Rankings.',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Grundlegende Web-Präsenz',
						description: 'Aufbau einer soliden Online-Präsenz mit allen notwendigen Grundlagen.',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Lokales SEO',
						description:
							'Optimierung für lokale Suchanfragen, damit Kunden in Ihrer Nähe Sie finden.',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Content-Strategie',
						description:
							'Entwicklung einer Inhaltstrategie, die Ihr Publikum anspricht und überzeugt.',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Social Media Integration',
						description: 'Verbindung Ihrer Website mit sozialen Medien für größere Reichweite.',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Conversion-Optimierung',
						description: 'Gezielte Verbesserungen, um mehr Besucher in Kunden umzuwandeln.',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'Content-Marketing',
						description: 'Hochwertige Inhalte, die Deine Expertise zeigen und Kunden überzeugen.',
						icon: 'edit',
						underScore: 80
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
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Digital Marketing Expert',
			bio: 'Mit über 10 Jahren Erfahrung in der digitalen Welt hilft Christopher Unternehmen, ihre Online-Präsenz zu optimieren und messbare Erfolge zu erzielen. Als zertifizierter Google Partner und Social Media Spezialist kennt er alle relevanten Strategien für nachhaltige Sichtbarkeit.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'Christopher Matt - Digital Marketing Expert',
			badges: {
				googlePartner: {
					label: 'Google Partner',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'Kunden',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Jahre Erfahrung',
					value: '10+',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Quiz und Analyse neu starten',
			getReport: 'Analysebericht per E-Mail erhalten',
			emailError: 'Bitte gib im Formular eine E-Mail-Adresse an, um die Ergebnisse zu erhalten.'
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
		breadcrumb: 'Marketing Assessment',
		language: 'de'
	},
	pricing: {
		perDay: 'Täglich',
		features: {
			websiteOptimization: 'Website-Optimierung',
			basicSeo: 'Grundlegende SEO-Maßnahmen',
			monthlyContent: '1 × Content-Erstellung pro Monat',
			performanceReport: 'Monatlicher Performance-Bericht',
			allBasicFeatures: 'Alle Features des 1-Monats Plans',
			socialMedia: 'Social Media Management',
			weeklyContent: 'Wöchentliche Content-Erstellung',
			keywordOptimization: 'Keyword-Optimierung',
			competitorAnalysis: 'Detaillierte Konkurrenzanalyse',
			allPremiumFeatures: 'Alle Features des 3-Monats Plans',
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
		choosePlan: 'Passenden Plan auswählen',
		header: {
			title: 'Wähle den perfekten Plan für Deine digitale Transformation',
			subtitle:
				'Basierend auf Deinem Score von {score} empfehlen wir Dir einen maßgeschneiderten Ansatz'
		},
		countdown: {
			title: 'Sonderangebot!',
			subtitle: 'Rabatt läuft ab in:'
		},
		bonusBox: {
			tag: 'EXKLUSIV-BONUS',
			title: 'Hochwertiger Blogartikel GRATIS',
			description:
				'Bei Buchung innerhalb der Aktionszeit erhältst Du einen maßgeschneiderten, SEO-optimierten Blogartikel für Dein Unternehmen – perfekt angepasst, um Deine Reichweite längerfristig zu steigern!',
			benefits: [
				'Individuell auf Dein Unternehmen zugeschnitten',
				'SEO-optimiert für mehr Sichtbarkeit',
				'Sofortige Steigerung Deiner Online-Präsenz'
			],
			value: 'Wert: 99€',
			limited: 'Nur für begrenzte Zeit'
		},
		paymentOptions: {
			title: 'Wähle Deine Zahlungsoption:',
			monthly: 'Monatlich',
			oneTime: 'Einmalig (-8%)',
			longTime: 'Enterprise (-20%)', // Geändert von 'Longtime'
			hotLabel: 'HOT'
		},
		planLabels: {
			oneTime: 'EINMALIG',
			oneMonth: '1-MONATS PLAN',
			threeMonth: '3-MONATS PLAN',
			sixMonth: '6-MONATS PLAN',
			popular: '★ AM BELIEBTESTEN',
			longTimeSuffix: {
				oneMonth: 'ENTERPRISE BASIS',
				threeMonth: 'ENTERPRISE PREMIUM',
				business: 'ENTERPRISE BUSINESS'
			}
		},
		additionalBenefits: {
			oneTime: ['8% Rabatt auf Gesamtpreis', 'Keine monatlichen Gebühren'],
			longTime: ['Jahr Zugang', 'Massiver 20% Rabatt', 'Alle zukünftigen Updates'], // Geändert von 'Jahre Zugang'
			savings: 'Spare',
			savingsOption: 'mit dieser Option!'
		},
		ctaButton: {
			monthly: 'PLAN ABONNIEREN',
			oneTime: 'JETZT KAUFEN',
			longTime: 'ENTERPRISE ZUGANG SICHERN', // Geändert von 'LONGTIME ZUGANG SICHERN'
			selectPlan: 'Plan auswählen'
		},
		savings: 'Du sparst',
		trustBadges: ['Sicher & geschützt bezahlen', '30 Tage Geld-zurück-Garantie'],
		consultationText: 'Oder möchtest Du auf "Nummer sicher" gehen?',
		consultationLink: 'Kostenloses Beratungsgespräch buchen',
		discountBanner: {
			title: 'Enterprise-Zugang mit', // Geändert von 'Longtime-Zugang'
			discount: ' mit 20% Rabatt!',
			description:
				'Sichere Dir <span class="font-bold">JETZT</span> Deinen 1 Jahr langen Zugang zu allen Features und Updates! Statt monatlicher Zahlungen - einmalig investieren und dauerhaft profitieren.', // Geändert von '5 Jahre'
			buttonText: 'Jetzt sichern!'
		},
		terms: {
			monthly: {
				main: 'Um Unterbrechungen zu vermeiden, erklärst Du dich damit einverstanden, dass der von Dir gewählte Plan {selectedPlan} automatisch zum vollen Preis für aufeinanderfolgende Verlängerungszeiträume verlängert wird und Dir {totalPrice.toFixed(2)} monatlich in Rechnung gestellt werden. Du kannst Dein Abonnement jederzeit kündigen, indem Du unser Serviceteam per E-Mail an abo@digitalpusher.de kontaktierst falls du mehr als einen Abo Monat ausgewählt hast.',
				reminder:
					'Ansonsten erhälst du 5 Werktage vor dem Ablauf des Abos eine E-Mail mit der Möglichkeit das Abo zu kündigen.'
			},
			oneTime:
				'Der Gesamtbetrag von {totalPrice.toFixed(2)}€ wird einmalig abgebucht. Es entstehen keine weiteren Kosten oder automatischen Verlängerungen. Dein Enterprise-Zugang gilt für 1 Jahr.',
			acceptance:
				'Indem auf „{paymentType === $i18n.pricing.paymentOptions.monthly ? $i18n.pricing.ctaButton.monthly : $i18n.pricing.ctaButton.oneTime}" geklickt wird, werden die Allgemeinen Geschäftsbedingungen und die Datenschutzrichtlinie akzeptiert.'
		}
	},
	footer: {
		copyright: 'Alle Rechte vorbehalten.'
	},
	modal: {
		common: {
			close: 'Schließen',
			cancel: 'Abbrechen',
			confirm: 'Bestätigen',
			back: 'Zurück'
		},
		payment: {
			title: 'Bezahlung abschließen',
			subtitle: 'Wähle Deine Zahlungsmethode',
			testButton: 'Testzahlung',
			testDescription: 'Testzahlung mit Sandbox-Account',
			summary: {
				title: 'Zusammenfassung',
				monthly: 'Monatliche Zahlung',
				oneTime: 'Einmalzahlung',
				longtime: 'Enterprise-Zugang',
				discount: 'Rabatt',
				donation: 'inkl. Spende',
				tax: 'inkl. MwSt'
			},
			securityBadges: {
				secure: 'SSL Gesichert',
				protection: 'Käuferschutz',
				instant: 'Sofortiger Zugang'
			},
			donationBox: {
				title: '3% Spende hinzufügen',
				description:
					'Mit Deiner Spende unterstützt Du direkt Umweltschutzprojekte. 93% Deiner Spende fließt unmittelbar in nachhaltige Projekte - nachweislich und transparent!'
			},
			errors: {
				general: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
				validation: 'Bitte überprüfe deine Zahlungsdaten',
				server:
					'Der PayPal-Service ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.',
				timeout:
					'Die Anfrage hat zu lange gedauert. Bitte überprüfe deine Internetverbindung und versuche es erneut.'
			}
		},
		success: {
			title: 'Zahlung erfolgreich!',
			subtitle: 'Vielen Dank für Deinen Kauf',
			modalInfo: 'Bitte schließe dieses Fenster nicht, um den Vorgang abzuschließen.',
			paymentDetails: {
				plan: 'Service',
				id: 'Zahlungs-ID',
				date: 'Datum',
				status: 'Status',
				paid: 'Bezahlt'
			},
			shareContent: {
				title: 'Mein Erfolg mit Digital Pusher',
				text: 'Ich habe gerade meinen Onlinemarketing-Plan bei Digital Pusher aktiviert und bin auf dem Weg zu mehr Sichtbarkeit und Erfolg! 🚀 #DigitalMarketing'
			},
			donation: {
				title: 'Impact bereit!',
				description:
					'Deine großzügige Spende von {amount}€ unterstützt wichtige Umweltprojekte. Zusammen bewirken wir Großes!',
				impact: {
					direct: 'Direkte Hilfe',
					projects: 'Projekte',
					transparency: 'Transparenz'
				}
			},
			nextSteps: {
				title: 'Deine nächsten Schritte:',
				steps: [
					'Überprüfe deine E-Mail für die Zahlungsbestätigung',
					'Wähle einen Termin für die persönliche Beratung',
					'Lade ein Teammitglied ein für bessere Ergebnisse'
				]
			},
			upgradeOffer: {
				exclusive: 'Exklusiv',
				title: 'Erweitere dein Paket und spare 30%',
				subtitle:
					'Nur für Neukunden: Füge jetzt Premium-Features hinzu und hebe dein Ergebnis auf das nächste Level!',
				countdown: 'Angebot endet in',
				button: 'Upgrade sichern'
			},
			support: {
				confirmation: 'Eine Bestätigung mit allen Details wurde an deine E-Mail-Adresse gesendet.',
				contact: 'Fragen? Kontaktiere unseren Kundensupport'
			},
			buttons: {
				dashboard: 'Zum Dashboard',
				share: 'Teilen'
			}
		},
		error: {
			title: 'Zahlungsfehler',
			defaultMessage: 'Ein Fehler ist aufgetreten',
			details: 'Technische Details anzeigen',
			support: 'Bei weiteren Problemen wende Dich bitte an unseren Kundensupport.',
			retry: 'Erneut versuchen'
		},
		confirm: {
			cancelPurchase: 'Möchtest du den Kaufvorgang wirklich abbrechen?',
			confirmButton: 'Ja, abbrechen',
			cancelButton: 'Zurück zum Kaufvorgang'
		},
		booking: {
			title: 'Kostenloses Beratungsgespräch buchen',
			subtitle:
				'Wähle einen Termin für Dein 30-minütiges kostenloses Beratungsgespräch. Wir besprechen Deine individuellen Bedürfnisse und zeigen Dir, wie Du Deine Online-Sichtbarkeit optimieren kannst.',
			expert: {
				title: 'Kostenlose Strategieberatung',
				description:
					'Dein direkter Draht zum Experten. In 30 Minuten analysieren wir deine aktuelle Situation und zeigen dir konkrete Wachstumschancen.'
			},
			trustElements: {
				free: {
					title: '100% Kostenlos',
					subtitle: 'Keine versteckten Kosten'
				},
				duration: {
					title: '30 Minuten',
					subtitle: 'Persönliche Beratung'
				},
				projects: {
					title: '500+ Projekte',
					subtitle: 'Erfolgreich umgesetzt'
				}
			},
			calendar: {
				title: 'Wähle deinen Wunschtermin',
				description: '30 Minuten • Videocall',
				addToCalendar: 'Termin zu deinem Kalender hinzufügen:',
				download: 'Apple / Outlook',
				selectDate: 'Datum wählen',
				selectTime: 'Zeit wählen',
				noSlotsAvailable: 'Keine Termine verfügbar',
				loadingSlots: 'Lade verfügbare Zeiten...',
				months: [
					'Januar',
					'Februar',
					'März',
					'April',
					'Mai',
					'Juni',
					'Juli',
					'August',
					'September',
					'Oktober',
					'November',
					'Dezember'
				],
				days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
			},
			form: {
				title: 'Deine Kontaktdaten',
				firstName: 'Vorname',
				lastName: 'Nachname',
				email: 'E-Mail',
				phone: 'Telefon (optional)',
				privacy: 'Deine Daten sind bei uns sicher und werden vertraulich behandelt',
				submit: 'Jetzt Termin buchen',
				submitting: 'Wird gebucht...'
			},
			success: {
				title: '🎉 Perfekt! Dein Termin steht!',
				message: 'Wir freuen uns auf das Gespräch!',
				socialProof: '500+ Projekte erfolgreich umgesetzt',
				bonusTitle: 'Dein Bonus wartet!',
				bonusValue: 'Wert: 299€ • Exklusiv für dich',
				bonusDescription:
					'Als Dankeschön erhältst du unsere 7 Geheimtipps für deinen Online-Marketing-Erfolg – bewährte Strategien, die deine Konkurrenz noch nicht kennt.',
				bonusEmail: 'Die Tipps senden wir dir direkt per E-Mail zu!',
				bonusUrgency: 'Wird automatisch in 2 Minuten versendet',
				meetingLink: 'Meeting-Link öffnen'
			},
			error: {
				generic: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
				dateRequired: 'Bitte wähle ein Datum',
				timeRequired: 'Bitte wähle eine Uhrzeit',
				allFieldsRequired: 'Bitte fülle alle Pflichtfelder aus'
			}
		}
	},
	waitingScreen: {
		title: 'Deine Angaben werden analysiert - Bitte habe einen Moment Geduld.',
		redirect: 'Dein Ergebniss in {remainingTime}'
	},
	email: {
		subject: 'Ihre Website-Analyse Ergebnisse für {company_url}',
		greeting: 'Hallo {firstName} {lastName}',
		title: 'Action Required: Your Website Analysis',
		subtitle: 'Here is your individual analysis report',
		companyName: 'Unternehmen',
		website: 'Website',
		results: {
			title: 'Website-Analyse Ergebnisse',
			description:
				'Hier sind Ihre <strong>Website-Analyse Ergebnisse</strong> für <strong>{company_url}</strong> vom {currentDate}.',
			visibilityScore: 'Ihr Visibility Score: {score}/100',
			scoreDescription: 'Basierend auf Ihrer aktuellen Online-Präsenz und Marketing-Strategie'
		},
		score: {
			title: 'Your Marketing Score',
			low: {
				title: 'Critical! Your business is barely visible.',
				suggestion: 'We show you how to reach more customers immediately.'
			},
			medium: {
				title: 'Your visibility can be improved.',
				suggestion: 'Increase your reach through smart online marketing strategies.'
			},
			high: {
				title: 'Good! But there is still potential.',
				suggestion: 'With targeted optimization you can gain even more visibility.'
			},
			excellent: {
				title: 'Excellent! Your digital presence is outstanding.',
				suggestion: 'Use advanced strategies to further expand your dominance!'
			}
		},
		recommendations: {
			title: 'Our Recommendations',
			website: 'Website optimization for better user experience',
			content: 'Content strategy to increase visibility',
			performance: 'Improve website loading speed through optimization of images and scripts',
			seo: 'SEO optimization through improved meta tags and structured data',
			accessibility: 'Improve accessibility for better access',
			contentQuality: 'Optimize content quality through better structuring and keywords',
			basicSeo: 'Basic SEO optimization of your website',
			googleBusiness: 'Create a Google Business Profile',
			advancedSeo: 'Advanced SEO measures for more organic traffic',
			localSeo: 'Local SEO optimization for regional visibility',
			contentMarketing: 'Content marketing strategy to strengthen your market position',
			backlinks: 'Backlink building to increase domain authority',
			extendedContent: 'Extended content strategy for maximum visibility',
			competitorAnalysis: 'Competitor analysis to identify growth opportunities'
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
				'Sichern Sie sich <span class="secrets-highlight">5 kostenlose Geheimtipps</span> für mehr Online-Sichtbarkeit in einem persönlichen Beratungsgespräch.',
			highlight: '5 kostenlose Geheimtipps',
			urgency: '⚡ Nur für begrenzte Zeit verfügbar!',
			button: '🎁 5 Geheimtipps kostenlos erhalten',
			downloadLink: 'https://digitalpusher.de/download/5-geheimtipps-pdf'
		},
		secrets: {
			title: '🔒 Geheimtipps für Ihren Online-Erfolg',
			subtitle:
				'Entdecken Sie die Strategien, mit denen unsere Kunden ihre Sichtbarkeit in nur 30 Tagen verdoppeln'
		},
		sharing: {
			positive:
				'🎉 Klienten berichten von besseren Leads nach unseren Optimierungen. Teile das Ergebnis mit einem Kollegen — meist entsteht so der beste Wachstumsschub.',
			negative:
				'💡 Nutze diese Tipps als Ausgangspunkt — wir helfen gern bei der Umsetzung. Teile Deine Ergebnisse und inspiriere andere Unternehmer!'
		},
		links: {
			shareEmail: 'Per E-Mail teilen',
			shareWhatsApp: 'Share',
			bookCalendar: 'Buchen & Kalender'
		},
		footer: {
			copyright: '© 2025 Digitalpusher - Alle Rechte vorbehalten',
			unsubscribe: 'Vom Newsletter abmelden',
			privacy: 'Datenschutz',
			imprint: 'Impressum',
			disclaimer:
				'Diese E-Mail wurde gesendet an {email}. Bitte nicht direkt auf diese Nachricht antworten.'
		}
	}
};

export default de;
