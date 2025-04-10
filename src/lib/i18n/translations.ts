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
		skip: string;
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
		imageOption: {
			continueIn: string;
			second: string;
			seconds: string;
			selectUpTo: string;
			selectAllApplicable: string;
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
					icon: string;
					underScore: number;
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
		expertProfile: {
			name: string;
			role: string;
			bio: string;
			imageUrl: string;
			imageAlt: string;
			badges: {
				googlePartner: {
					label: string;
					value: string;
					icon: string;
				};
				customers: {
					label: string;
					value: string;
					icon: string;
				};
				experience: {
					label: string;
					value: string;
					icon: string;
				};
			};
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

		header: {
			title: string;
			subtitle: string;
		};
		countdown: {
			title: string;
			subtitle: string;
		};
		bonusBox: {
			tag: string;
			title: string;
			description: string;
			benefits: string[];
			value: string;
			limited: string;
		};
		paymentOptions: {
			title: string;
			monthly: string;
			oneTime: string;
			longTime: string;
			hotLabel: string;
		};
		planLabels: {
			oneTime: string;
			oneMonth: string;
			threeMonth: string;
			sixMonth: string;
			popular: string;
			longTimeSuffix: {
				'1-MONATS PLAN': string;
				'3-MONATS PLAN': string;
				BUSINESS: string;
			};
		};
		additionalBenefits: {
			oneTime: string[];
			longTime: string[];
			savings: string;
			savingsOption: string;
		};
		ctaButton: {
			monthly: string;
			oneTime: string;
			longTime: string;
			selectPlan: string;
		};
		savings: string;
		trustBadges: string[];
		discountBanner: {
			title: string;
			discount: string;
			description: string;
			buttonText: string;
		};
		terms: {
			monthly: {
				main: string;
				reminder: string;
			};
			oneTime: string;
			acceptance: string;
		};
	};
	footer: {
		copyright: string;
	};
	modal: {
		common: {
			close: string;
			cancel: string;
			confirm: string;
			back: string;
		};
		payment: {
			title: string;
			subtitle: string;
			testButton: string;
			testDescription: string;
			summary: {
				title: string;
				monthly: string;
				oneTime: string;
				longtime: string;
				discount: string;
				donation: string;
				tax: string;
			};
			securityBadges: {
				secure: string;
				protection: string;
				instant: string;
			};
			donationBox: {
				title: string;
				description: string;
			};
			errors: {
				general: string;
				validation: string;
				server: string;
				timeout: string;
			};
		};
		success: {
			title: string;
			subtitle: string;
			modalInfo: string;
			paymentDetails: {
				plan: string;
				id: string;
				date: string;
				status: string;
				paid: string;
			};
			shareContent: {
				title: string;
				text: string;
			};
			donation: {
				title: string;
				description: string;
				impact: {
					direct: string;
					projects: string;
					transparency: string;
				};
			};
			nextSteps: {
				title: string;
				steps: string[];
			};
			upgradeOffer: {
				exclusive: string;
				title: string;
				subtitle: string;
				countdown: string;
				button: string;
			};
			support: {
				confirmation: string;
				contact: string;
			};
			buttons: {
				dashboard: string;
				share: string;
			};
		};
		error: {
			title: string;
			defaultMessage: string;
			details: string;
			support: string;
			retry: string;
		};
		confirm: {
			cancelPurchase: string;
			confirmButton: string;
			cancelButton: string;
		};
	};
	waitingScreen: {
		title: string;
		redirect: string;
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
		skip: 'Überspringen',
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
					icon: 'star'
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
			longTime: 'Longtime (-20%)',
			hotLabel: 'HOT'
		},
		planLabels: {
			oneTime: 'EINMALIG',
			oneMonth: '1-MONATS PLAN',
			threeMonth: '3-MONATS PLAN',
			sixMonth: '6-MONATS PLAN',
			popular: '★ AM BELIEBTESTEN',
			longTimeSuffix: {
				'1-MONATS PLAN': 'BASIS LONGTIME',
				'3-MONATS PLAN': 'PREMIUM LONGTIME',
				BUSINESS: 'BUSINESS LONGTIME'
			}
		},
		additionalBenefits: {
			oneTime: ['8% Rabatt auf Gesamtpreis', 'Keine monatlichen Gebühren'],
			longTime: ['Jahre Zugang', 'Massiver 20% Rabatt', 'Alle zukünftigen Updates'],
			savings: 'Spare',
			savingsOption: 'mit dieser Option!'
		},
		ctaButton: {
			monthly: 'PLAN ABONNIEREN',
			oneTime: 'JETZT KAUFEN',
			longTime: 'LONGTIME ZUGANG SICHERN',
			selectPlan: 'Plan auswählen'
		},
		savings: 'Du sparst',
		trustBadges: ['Sicher & geschützt bezahlen', '30 Tage Geld-zurück-Garantie'],
		discountBanner: {
			title: 'Longtime-Zugang mit',
			discount: ' mit 20% Rabatt!',
			description:
				'Sichere Dir <span class="font-bold">JETZT</span> Deinen 5 Jahre langen Zugang zu allen Features und Updates! Statt monatlicher Zahlungen - einmalig investieren und dauerhaft profitieren.',
			buttonText: 'Jetzt sichern!'
		},
		terms: {
			monthly: {
				main: 'Um Unterbrechungen zu vermeiden, erklärst Du dich damit einverstanden, dass der von Dir gewählte Plan {selectedPlan} automatisch zum vollen Preis für aufeinanderfolgende Verlängerungszeiträume verlängert wird und Dir {totalPrice.toFixed(2)} monatlich in Rechnung gestellt werden. Du kannst Dein Abonnement jederzeit kündigen, indem Du unser Serviceteam per E-Mail an abo@digitalpusher.de kontaktierst falls du mehr als einen Abo Monat ausgewählt hast.',
				reminder:
					'Ansonsten erhälst du 5 Werktage vor dem Ablauf des Abos eine E-Mail mit der Möglichkeit das Abo zu kündigen.'
			},
			oneTime:
				'Der Gesamtbetrag von {totalPrice.toFixed(2)}€ wird einmalig abgebucht. Es entstehen keine weiteren Kosten oder automatischen Verlängerungen. Dein longtime-Zugang gilt für 5 Jahre.',
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
				longtime: 'Longtime-Zugang',
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
		}
	},
	waitingScreen: {
		title: 'Deine Angaben werden analysiert - Bitte habe einen Moment Geduld.',
		redirect: 'Dein Ergebniss in {remainingTime}'
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
		skip: 'Skip',
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
		imageOption: {
			continueIn: 'continue in',
			second: 'second',
			seconds: 'seconds',
			selectUpTo: 'You can select up to {max} options',
			selectAllApplicable: 'Select all applicable options'
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
			currentValue: 'Current',
			improvedValue: 'After Optimization',
			average: 'Average',
			optimal: 'Optimal'
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
			improvement: {
				title: 'How We Improve Your Results',
				steps: [
					{
						title: 'Website Optimization',
						description: 'Improving loading times, mobile compatibility, and user experience.',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO & Keywords',
						description:
							'Search engine optimization tailored to your industry for better rankings.',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Basic Web Presence',
						description: 'Building a solid online presence with all essential foundations.',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Local SEO',
						description: 'Optimizing for local searches so customers in your area can find you.',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Content Strategy',
						description: 'Developing a content strategy that engages and convinces your audience.',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Social Media Integration',
						description: 'Connecting your website with social media for greater reach.',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Conversion Optimization',
						description: 'Targeted improvements to turn more visitors into customers.',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'Content Marketing',
						description:
							'High-quality content that showcases your expertise and convinces customers.',
						icon: 'edit',
						underScore: 80
					}
				]
			},
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
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Digital Marketing Expert',
			bio: 'With over 10 years of experience in the digital world, Christopher helps companies optimize their online presence and achieve measurable success. As a certified Google Partner and social media specialist, he knows all the relevant strategies for sustainable visibility.',
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
					label: 'Customers',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Years of Experience',
					value: '10+',
					icon: 'experience'
				}
			}
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
		perDay: 'Daily',
		features: {
			websiteOptimization: 'Website Optimization',
			basicSeo: 'Essential SEO Strategies',
			monthlyContent: '1 × Content Creation per month',
			performanceReport: 'Monthly Performance Report',
			allBasicFeatures: 'All Features from 1-Month Plan',
			socialMedia: 'Social Media Management',
			weeklyContent: 'Weekly Content Creation',
			keywordOptimization: 'Advanced Keyword Optimization',
			competitorAnalysis: 'Comprehensive Competitor Analysis',
			allPremiumFeatures: 'All Features from 3-Month Plan',
			marketingStrategy: 'Holistic Marketing Strategy',
			dailyContent: 'Daily Content Updates',
			sem: 'Search Engine Marketing (SEM)',
			personalManager: 'Dedicated Marketing Manager',
			cro: 'Conversion Rate Optimization'
		},
		included: {
			longtermBusiness: 'Proven Method for Building a Sustainable Online Business',
			viralContent: 'Exclusive Strategies for Creating Viral Content',
			expertFrameworks: 'Proven Expert Frameworks for Rapid and Efficient Scaling',
			targetedStrategies: 'Data-Driven Strategies Tailored to Your Target Audience'
		},
		excluded: {
			getRichQuick: 'No Get-Rich-Quick Schemes or Overnight Success Fantasies',
			noContracts: 'No Long-Term Commitments or Binding Contracts',
			noInvestment: 'No Empty Promises or Unrealistic Investment Claims',
			pyramidSchemes: 'Avoiding MLM, Dropshipping, or Pyramid Scheme Traps'
		},
		includedTitle: 'Included',
		inAllPlans: 'in all our packages',
		excludedTitle: 'We Do Not',
		notWorking: 'work with',
		choosePlan: 'Select Your Perfect Plan',

		// Detailed pricing options
		header: {
			title: 'Unlock Your Digital Transformation Potential',
			subtitle:
				"Based on your score of {score}, we've crafted a precision-targeted strategy just for you"
		},
		countdown: {
			title: 'Limited Time Offer!',
			subtitle: 'Discount Ends In:'
		},
		bonusBox: {
			tag: 'EXCLUSIVE BONUS',
			title: 'FREE High-Impact Blog Article',
			description:
				'Book within our promotional window and receive a custom, SEO-optimized blog post designed to dramatically boost your online visibility and reach for longer time!',
			benefits: [
				'Tailored exclusively to your business DNA',
				'SEO-engineered for maximum visibility',
				'Instant rocket fuel for your online presence'
			],
			value: 'Value: €99',
			limited: 'Strictly Limited Time Offer'
		},
		paymentOptions: {
			title: 'Choose Your Power Plan:',
			monthly: 'Monthly',
			oneTime: 'One-Time (-8%)',
			longTime: 'Longtime (-20%)',
			hotLabel: 'HOT'
		},
		planLabels: {
			oneTime: 'ONE-TIME',
			oneMonth: '1-MONTH PLAN',
			threeMonth: '3-MONTHS PLAN',
			sixMonth: '6-MONTHS PLAN',
			popular: '★ MOST POPULAR',
			longTimeSuffix: {
				'1-MONATS PLAN': 'BASIS LONGTIME',
				'3-MONATS PLAN': 'PREMIUM LONGTIME',
				BUSINESS: 'BUSINESS LONGTIME'
			}
		},
		additionalBenefits: {
			oneTime: ['8% Discount on Total Price', 'Zero Monthly Recurring Fees'],
			longTime: [
				'Years of Unlimited Access',
				'Massive 20% Lifetime Discount',
				'All Future Updates Included'
			],
			savings: 'Save',
			savingsOption: 'with this option!'
		},
		ctaButton: {
			monthly: 'SUBSCRIBE NOW',
			oneTime: 'SECURE MY PLAN',
			longTime: 'LOCK IN LONGTIME ACCESS',
			selectPlan: 'Choose Plan auswählen'
		},
		savings: 'You save',
		trustBadges: ['Secure & Protected Payment', '30-Day Money-Back Guarantee'],
		discountBanner: {
			title: 'Longtime Access with 20% Mega Discount!',
			discount: ' 20% Discount!',
			description:
				'Secure your 5-year growth accelerator NOW! One strategic investment, endless business potential. Skip monthly payments and future-proof your success!',
			buttonText: 'Claim My Advantage!'
		},
		terms: {
			monthly: {
				main: "To ensure uninterrupted service, your selected plan {selectedPlan} will automatically renew at the full price for consecutive periods, billing you {monthlyPrice} monthly. You can cancel anytime by contacting our service team via email at abo@digitalpusher.de if you've selected more than one subscription month.",
				reminder:
					"We'll send a friendly reminder email 5 working days before your subscription expires, giving you the option to continue or pause."
			},
			oneTime:
				'A one-time charge of {totalPrice}€ grants you complete access. No hidden fees, no automatic renewals. Your longtime access is locked in for 5 full years of digital empowerment.',
			acceptance:
				'By clicking "{ctaText}", you confirm acceptance of our Terms of Service and Privacy Policy.'
		}
	},
	footer: {
		copyright: 'All rights reserved.'
	},
	modal: {
		common: {
			close: 'Close',
			cancel: 'Cancel',
			confirm: 'Confirm',
			back: 'Back'
		},
		payment: {
			title: 'Complete Payment',
			subtitle: 'Choose your payment method',
			testButton: 'Test Payment',
			testDescription: 'Test payment with Sandbox account',
			summary: {
				title: 'Summary',
				monthly: 'Monthly Payment',
				oneTime: 'One-time Payment',
				longtime: 'Longtime Access',
				discount: 'Discount',
				donation: 'incl. Donation',
				tax: 'incl. VAT'
			},
			securityBadges: {
				secure: 'SSL Secured',
				protection: 'Buyer Protection',
				instant: 'Instant Access'
			},
			donationBox: {
				title: 'Add 3% Donation',
				description:
					'With your donation, you directly support environmental projects. 93% of your donation goes directly to sustainable projects - verifiable and transparent!'
			},
			errors: {
				general: 'An error occurred. Please try again later.',
				validation: 'Please check your payment information',
				server: 'The PayPal service is temporarily unavailable. Please try again later.',
				timeout: 'The request took too long. Please check your internet connection and try again.'
			}
		},
		success: {
			title: 'Payment Successful!',
			subtitle: 'Thank you for your purchase',
			modalInfo: 'Please do not close this window, it will show you the next steps.',
			paymentDetails: {
				plan: 'Service',
				id: 'Payment ID',
				date: 'Date',
				status: 'Status',
				paid: 'Paid'
			},
			shareContent: {
				title: 'My success with Digital Pusher',
				text: 'I just activated my onlinemarketing-plan at Digital Pusher and Im on my way to more visibility and success! 🚀 #DigitalMarketing'
			},
			donation: {
				title: 'Impact Ready!',
				description:
					'Your generous donation of {amount}€ supports important environmental projects. Together we make a big difference!',
				impact: {
					direct: 'Direct Help',
					projects: 'Projects',
					transparency: 'Transparency'
				}
			},
			nextSteps: {
				title: 'Your next steps:',
				steps: [
					'Check your email for payment confirmation',
					'Schedule a personal consultation appointment',
					'Explore useful resources in your dashboard'
				]
			},
			upgradeOffer: {
				exclusive: 'Exclusive',
				title: 'Expand your package and save 30%',
				subtitle:
					'For new customers only: Add premium features now and take your results to the next level!',
				countdown: 'Offer ends in',
				button: 'Secure Upgrade'
			},
			support: {
				confirmation: 'A confirmation with all details has been sent to your email address.',
				contact: 'Questions? Contact our customer support'
			},
			buttons: {
				dashboard: 'To Dashboard',
				share: 'Share'
			}
		},
		error: {
			title: 'Payment Error',
			defaultMessage: 'An error occurred',
			details: 'Show technical details',
			support: 'If you continue to have problems, please contact our customer support.',
			retry: 'Try again'
		},
		confirm: {
			cancelPurchase: 'Do you really want to cancel the purchase process?',
			confirmButton: 'Yes, cancel',
			cancelButton: 'Back to checkout'
		}
	},
	waitingScreen: {
		title: 'Your details are being analysed - please be patient for a moment.',
		redirect: 'Your result in {remainingTime}'
	}
};

// Exportiere alle Übersetzungen
export const translations = {
	de,
	en
};
